// ===== ARCHIVO: src/hooks/useNotification.js =====
import { useContext } from 'react'
import { NotificationContext } from '../contexts/NotificationContext'

/**
 * Hook personalizado para acceder al contexto de notificaciones
 * @returns {Object} Objeto con los métodos para mostrar notificaciones
 * @throws {Error} Si se usa fuera del NotificationProvider
 */
export const useNotification = () => {
  const context = useContext(NotificationContext)
  
  if (!context) {
    throw new Error(
      'useNotification debe ser usado dentro de un NotificationProvider. ' +
      'Asegúrate de envolver tu componente con <NotificationProvider>.'
    )
  }
  
  return context
}

// Exportación por defecto para compatibilidad
export default useNotification

/**
 * Hook con métodos específicos para casos de uso comunes
 * @returns {Object} Métodos específicos para acciones CRUD
 */
export const useCrudNotifications = () => {
  const { showSaveSuccess, showDeleteSuccess, showUpdateSuccess, showError } = useNotification()
  
  return {
    // Operaciones exitosas
    onSaveSuccess: (itemName) => showSaveSuccess(itemName),
    onDeleteSuccess: (itemName) => showDeleteSuccess(itemName),
    onUpdateSuccess: (itemName) => showUpdateSuccess(itemName),
    
    // Errores comunes
    onSaveError: () => showError('Error al guardar. Intenta nuevamente.'),
    onDeleteError: () => showError('Error al eliminar. Intenta nuevamente.'),
    onUpdateError: () => showError('Error al actualizar. Intenta nuevamente.'),
    onLoadError: () => showError('Error al cargar los datos. Intenta nuevamente.'),
  }
}

/**
 * Hook específico para notificaciones de autenticación
 * @returns {Object} Métodos específicos para autenticación
 */
export const useAuthNotifications = () => {
  const { 
    showLoginSuccess, 
    showLogoutSuccess, 
    showSessionExpired, 
    showError,
    showSuccess  // ✅ Agregado showSuccess
  } = useNotification()
  
  return {
    onLoginSuccess: (userName) => showLoginSuccess(userName),
    onLogoutSuccess: () => showLogoutSuccess(),
    onSessionExpired: () => showSessionExpired(),
    onLoginError: () => showError('Error al iniciar sesión. Verifica tus credenciales.'),
    onRegistrationSuccess: () => showSuccess('Registro exitoso. Ya puedes iniciar sesión.'),
    onPasswordChangeSuccess: () => showSuccess('Contraseña actualizada correctamente.'),
  }
}