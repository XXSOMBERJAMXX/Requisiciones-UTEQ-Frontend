import { createContext } from 'react'

// Crear el contexto de autenticación
export const AuthContext = createContext()

// Valores por defecto (opcional, para TypeScript o documentación)
export const defaultAuthValue = {
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => false,
  isAuthenticated: false,
}