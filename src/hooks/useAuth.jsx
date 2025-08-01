// ===== ARCHIVO: src/hooks/useAuth.js =====
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} Objeto con el estado y métodos de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error(
      'useAuth debe ser usado dentro de un AuthProvider. ' +
      'Asegúrate de envolver tu componente con <AuthProvider>.'
    )
  }
  
  return context
}

// Exportación por defecto para compatibilidad
export default useAuth