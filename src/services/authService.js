// ===== ARCHIVO: src/services/authService.js - VERSIÓN SIMPLE =====
import BaseService from './api/BaseService'
import { API_CONFIG } from './api/config'

class AuthService extends BaseService {
  constructor() {
    super('/auth')
  }

  // ===== MÉTODOS DE AUTENTICACIÓN =====

  /**
   * Iniciar sesión
   */
  async login(correo_institucional, password) {
    if (!correo_institucional || !password) {
      throw new Error('Correo y contraseña son requeridos')
    }

    const response = await this.client.post(`${this.baseUrl}/login`, {
      correo_institucional,
      password,
    })

    const result = this.formatResponse(response)

    if (!result.data?.token || !result.data?.usuario) {
      throw new Error('Respuesta inválida del servidor')
    }

    // Guardar datos
    this.setAuthData(result.data.token, result.data.usuario)

    return result
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      if (this.getToken()) {
        await this.client.post(`${this.baseUrl}/logout`)
      }
    } catch (error) {
      console.error('Error en logout del servidor:', error)
    } finally {
      this.clearAuthData()
    }
  }

  /**
   * Obtener perfil del usuario
   */
  async getMe() {
    const token = this.getToken()
    if (!token) throw new Error('No hay token disponible')

    const response = await this.client.get(`${this.baseUrl}/me`)
    const result = this.formatResponse(response)

    if (result.data?.usuario) {
      this.setAuthData(token, result.data.usuario)
    }

    return result.data.usuario
  }

  /**
   * Actualizar perfil
   */
  async updateProfile(userData) {
    if (!userData) throw new Error('Datos de usuario requeridos')

    const response = await this.client.put(`${this.baseUrl}/profile`, userData)
    const result = this.formatResponse(response)

    if (result.data?.usuario) {
      const currentToken = this.getToken()
      this.setAuthData(currentToken, result.data.usuario)
    }

    return result.data.usuario
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Contraseña actual y nueva son requeridas')
    }

    if (newPassword.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres')
    }

    const response = await this.client.post(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword,
    })

    return this.formatResponse(response)
  }

  /**
   * Solicitar recuperación de contraseña
   */
  async requestPasswordReset(correo_institucional) {
    if (!correo_institucional) {
      throw new Error('Correo institucional requerido')
    }

    const response = await this.client.post(`${this.baseUrl}/forgot-password`, {
      correo_institucional,
    })

    return this.formatResponse(response)
  }

  /**
   * Restablecer contraseña
   */
  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error('Token y nueva contraseña son requeridos')
    }

    if (newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    const response = await this.client.post(`${this.baseUrl}/reset-password`, {
      token,
      newPassword,
    })

    return this.formatResponse(response)
  }

  /**
   * Refrescar token
   */
  async refreshToken() {
    const response = await this.client.post(`${this.baseUrl}/refresh`)
    const result = this.formatResponse(response)

    if (result.data?.token) {
      const currentUser = this.getStoredUser()
      this.setAuthData(result.data.token, currentUser)
    }

    return result
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  /**
   * Verificar si el token está expirado
   */
  isTokenExpired() {
    const token = this.getToken()
    if (!token) return true

    try {
      const parts = token.split('.')
      if (parts.length !== 3) return true

      const payload = JSON.parse(atob(parts[1]))
      if (!payload.exp) return true

      const currentTime = Math.floor(Date.now() / 1000)
      const isExpired = payload.exp < currentTime

      if (isExpired) {
        console.log('⏰ Token expirado:', {
          expira: new Date(payload.exp * 1000),
          ahora: new Date(),
        })
      }

      return isExpired
    } catch (error) {
      console.error('Error verificando expiración del token:', error)
      return true
    }
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    const token = this.getToken()
    const user = this.getStoredUser()
    return !!(token && user && !this.isTokenExpired())
  }

  /**
   * Obtener tiempo restante del token
   */
  getTokenTimeRemaining() {
    const token = this.getToken()
    if (!token) return 0

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (!payload.exp) return 0

      const currentTime = Math.floor(Date.now() / 1000)
      return Math.max(0, payload.exp - currentTime)
    } catch (error) {
      console.log(error)
      return 0
    }
  }

  /**
   * Verificar si el token expirará pronto
   */
  willTokenExpireSoon(minutesThreshold = 15) {
    const timeRemaining = this.getTokenTimeRemaining()
    const thresholdSeconds = minutesThreshold * 60
    return timeRemaining > 0 && timeRemaining <= thresholdSeconds
  }

  // ===== MÉTODOS DE DATOS =====

  /**
   * Obtener token del localStorage
   */
  getToken() {
    try {
      const token = localStorage.getItem('requisiciones-uteq-token') // Usar tu clave exacta
      console.log('🔑 Token obtenido:', token ? 'existe' : 'no existe')
      return token
    } catch (error) {
      console.error('Error obteniendo token:', error)
      return null
    }
  }

  /**
   * Obtener usuario guardado del localStorage
   */
  getStoredUser() {
    try {
      const userStr = localStorage.getItem('requisiciones-uteq-user') // Usar tu clave exacta
      if (!userStr) {
        console.log('👤 No hay usuario guardado')
        return null
      }

      const user = JSON.parse(userStr)
      console.log('👤 Usuario obtenido:', user?.nombre || 'sin nombre')
      return user
    } catch (error) {
      console.error('Error parseando usuario guardado:', error)
      localStorage.removeItem('requisiciones-uteq-user')
      return null
    }
  }

  /**
   * Guardar datos de autenticación
   */
  setAuthData(token, user) {
    try {
      localStorage.setItem('requisiciones-uteq-token', token)
      localStorage.setItem('requisiciones-uteq-user', JSON.stringify(user))
      console.log('💾 Datos guardados:', {
        token: 'guardado',
        user: user?.nombre,
      })
    } catch (error) {
      console.error('Error guardando datos de auth:', error)
    }
  }

  /**
   * Limpiar datos de autenticación
   */
  clearAuthData() {
    try {
      localStorage.removeItem('requisiciones-uteq-token')
      localStorage.removeItem('requisiciones-uteq-user')
      console.log('🧹 Datos de auth limpiados')
    } catch (error) {
      console.error('Error limpiando datos de auth:', error)
    }
  }

  // ===== MÉTODOS DE AUTORIZACIÓN =====

  /**
   * Obtener rol del usuario
   */
  getUserRole() {
    const user = this.getStoredUser()
    return user?.rol || null
  }

  /**
   * Verificar si tiene un rol específico
   */
  hasRole(role) {
    return this.getUserRole() === role
  }

  /**
   * Verificar permisos
   */
  hasPermission(permissions) {
    const user = this.getStoredUser()
    if (!user?.permisos) return false

    const userPermissions = user.permisos || []
    const permissionsArray = Array.isArray(permissions)
      ? permissions
      : [permissions]

    return permissionsArray.every((permission) =>
      userPermissions.includes(permission)
    )
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.getStoredUser()
  }

  /**
   * Obtener headers de autorización
   */
  getAuthHeaders() {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }
}

// Instancia singleton
const authService = new AuthService()

export default authService
export { AuthService }
