// ===== ARCHIVO: src/services/authService.js =====
import apiClient from './interceptors'
import { 
  setAuthData, 
  clearAuthData, 
  getToken, 
  getStoredUser, 
  isAuthenticated,
  getUserRole,
  hasRole,
  hasPermission
} from './interceptors'

// ===== CLASE AUTHSERVICE =====
class AuthService {
  /**
   * Iniciar sesión
   * @param {string} correo_institucional - Correo institucional
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario y token
   */
  async login(correo_institucional, password) {
    if (!correo_institucional || !password) {
      throw new Error('Correo y contraseña son requeridos')
    }

    const response = await apiClient.post('/auth/login', {
      correo_institucional,
      password,
    })

    const data = response.data

    if (!data.data?.token || !data.data?.usuario) {
      throw new Error('Respuesta inválida del servidor')
    }

    // Guardar datos de autenticación
    setAuthData(data.data.token, data.data.usuario)

    return data
  }

  /**
   * Cerrar sesión
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      const token = getToken()

      if (token) {
        // Intentar hacer logout en el servidor
        await apiClient.post('/auth/logout')
      }
    } catch (error) {
      console.error('Error en logout del servidor:', error)
      // Continuar con limpieza local incluso si falla el logout del servidor
    } finally {
      // Limpiar datos locales independientemente del resultado
      clearAuthData()
    }
  }

  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<Object>} Datos del usuario
   */
  async getMe() {
    const token = getToken()

    if (!token) {
      throw new Error('No hay token disponible')
    }

    const response = await apiClient.get('/auth/me')
    const data = response.data

    if (!data.data?.usuario) {
      throw new Error('Respuesta inválida del servidor')
    }

    // Actualizar datos del usuario en localStorage
    const currentToken = getToken()
    setAuthData(currentToken, data.data.usuario)

    return data.data.usuario
  }

  /**
   * Actualizar perfil del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateProfile(userData) {
    if (!userData || Object.keys(userData).length === 0) {
      throw new Error('Datos de usuario requeridos')
    }

    const response = await apiClient.put('/auth/profile', userData)
    const data = response.data

    if (data.data?.usuario) {
      // Actualizar datos del usuario en localStorage
      const currentToken = getToken()
      setAuthData(currentToken, data.data.usuario)
    }

    return data.data.usuario
  }

  /**
   * Cambiar contraseña
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Contraseña actual y nueva son requeridas')
    }

    if (newPassword.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres')
    }

    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })

    return response.data
  }

  /**
   * Solicitar recuperación de contraseña
   * @param {string} correo_institucional - Correo institucional
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async requestPasswordReset(correo_institucional) {
    if (!correo_institucional) {
      throw new Error('Correo institucional requerido')
    }

    const response = await apiClient.post('/auth/forgot-password', {
      correo_institucional,
    })

    return response.data
  }

  /**
   * Restablecer contraseña con token
   * @param {string} token - Token de recuperación
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error('Token y nueva contraseña son requeridos')
    }

    if (newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    })

    return response.data
  }

  /**
   * Refrescar token
   * @returns {Promise<Object>} Nuevo token
   */
  async refreshToken() {
    const response = await apiClient.post('/auth/refresh')
    const data = response.data

    if (data.data?.token) {
      const currentUser = getStoredUser()
      setAuthData(data.data.token, currentUser)
    }

    return data
  }

  /**
   * Verificar si el token está expirado (validación básica)
   * @returns {boolean} True si el token parece expirado
   */
  isTokenExpired() {
    const token = getToken()
    if (!token) return true

    try {
      // Decodificar JWT básico (sin verificar firma)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000

      return payload.exp < currentTime
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true
    }
  }

  /**
   * Verificar si el servicio de autenticación está disponible
   * @returns {Promise<boolean>} Estado del servicio
   */
  async healthCheck() {
    try {
      const response = await apiClient.get('/auth/health')
      return response.status === 200
    } catch (error) {
      console.warn('Auth health check failed:', error)
      return false
    }
  }

  // ===== MÉTODOS DE UTILIDAD DELEGADOS =====

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} Estado de autenticación
   */
  isAuthenticated = isAuthenticated

  /**
   * Obtener token del localStorage
   * @returns {string|null} Token de autenticación
   */
  getToken = getToken

  /**
   * Obtener datos del usuario del localStorage
   * @returns {Object|null} Datos del usuario
   */
  getUser = getStoredUser

  /**
   * Obtener rol del usuario actual
   * @returns {string|null} Rol del usuario
   */
  getUserRole = getUserRole

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} True si el usuario tiene el rol
   */
  hasRole = hasRole

  /**
   * Verificar si el usuario tiene permisos específicos
   * @param {string|Array} permissions - Permisos a verificar
   * @returns {boolean} True si el usuario tiene los permisos
   */
  hasPermission = hasPermission

  /**
   * Limpiar datos de autenticación
   */
  clearAuthData = clearAuthData

  /**
   * Obtener headers con autorización
   * @returns {Object} Headers con token
   */
  getAuthHeaders() {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }
}

// ===== INSTANCIA SINGLETON =====
const authService = new AuthService()

// ===== EXPORTACIÓN =====
export default authService

// Exportar también la clase para testing
export { AuthService }