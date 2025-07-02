// ===== ARCHIVO: src/hooks/useAuth.js =====
import { useState, useEffect, createContext, useContext } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la app
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error inicializando auth:', error)
        authService.logout() // Limpiar datos corruptos
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (correo_institucional, password) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.login(correo_institucional, password)
      setUser(response.data.usuario)

      return response
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authService.logout()
      setUser(null)
      setError(null)
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
