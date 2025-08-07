// ===== ARCHIVO: src/providers/AuthProvider.jsx =====
import { useState, useEffect, useCallback } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import authService from '../services/authService'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para verificar si la sesión es válida
  const isSessionValid = useCallback(() => {
    const token = authService.getToken()
    const storedUser = authService.getStoredUser()

    // Debug logging
    // console.log('🔍 Verificando sesión:', {
    //   hasToken: !!token,
    //   hasUser: !!storedUser,
    //   userRole: storedUser?.rol,
    //   tokenExpired: token ? authService.isTokenExpired() : 'no-token',
    // })

    if (!token || !storedUser) {
      // console.log('❌ No hay token o usuario guardado')
      return false
    }

    if (authService.isTokenExpired()) {
      // console.log('❌ Token expirado')
      authService.clearAuthData()
      return false
    }

    // console.log('✅ Sesión válida')
    return true
  }, [])

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    const initAuth = () => {
      // console.log('🚀 Inicializando autenticación...')

      try {
        if (isSessionValid()) {
          const userData = authService.getStoredUser()
          // console.log(
          //   '✅ Restaurando usuario desde localStorage:',
          //   userData?.nombre
          // )
          setUser(userData)
        } else {
          // console.log('❌ No hay sesión válida')
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Error inicializando auth:', error)
        authService.clearAuthData()
        setUser(null)
      } finally {
        setLoading(false)
        // console.log('✅ Inicialización completada')
      }
    }

    // Ejecutar inmediatamente
    initAuth()
  }, [isSessionValid])

  // Escuchar eventos de logout desde interceptores
  useEffect(() => {
    const handleUnauthorized = () => {
      // console.log('🔑 Evento unauthorized recibido - cerrando sesión')
      authService.clearAuthData()
      setUser(null)
      setError('Sesión expirada')
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  const login = async (correo_institucional, password) => {
    try {
      setLoading(true)
      setError(null)

      // console.log('🔐 Intentando login...')
      const response = await authService.login(correo_institucional, password)

      setUser(response.data.usuario)
      // console.log('✅ Login exitoso:', response.data.usuario?.nombre)

      return response
    } catch (error) {
      console.error('❌ Error en login:', error.message)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      // console.log('🚪 Cerrando sesión...')

      await authService.logout()
    } catch (error) {
      console.error('❌ Error en logout:', error)
    } finally {
      setUser(null)
      setError(null)
      setLoading(false)
      // console.log('✅ Logout completado')
    }
  }

  // Función para refrescar el perfil del usuario
  const refreshUser = async () => {
    try {
      if (!isSessionValid()) {
        setUser(null)
        return false
      }

      const userData = await authService.getMe()
      setUser(userData)
      return true
    } catch (error) {
      console.error('❌ Error refrescando usuario:', error)
      authService.clearAuthData()
      setUser(null)
      return false
    }
  }

  // isAuthenticated calculado dinámicamente
  const isAuthenticated = !!user && isSessionValid()

  // Debug: Log del estado actual
  // useEffect(() => {
  //   console.log('📊 Estado de autenticación:', {
  //     hasUser: !!user,
  //     userName: user?.nombre,
  //     isAuthenticated,
  //     loading,
  //   })
  // }, [user, isAuthenticated, loading])

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}