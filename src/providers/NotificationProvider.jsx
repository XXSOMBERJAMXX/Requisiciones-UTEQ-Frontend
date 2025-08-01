// ===== ARCHIVO: src/providers/NotificationProvider.jsx =====
import { toast, ToastContainer } from 'react-toastify'
import { NotificationContext, NOTIFICATION_TYPES, NOTIFICATION_CONFIGS } from '../contexts/NotificationContext'
import 'react-toastify/dist/ReactToastify.css'

export const NotificationProvider = ({ children }) => {
  
  /**
   * Mostrar notificación
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación (success, error, warning, info)
   * @param {Object} options - Opciones adicionales para personalizar la notificación
   */
  const showNotification = (message, type = NOTIFICATION_TYPES.INFO, options = {}) => {
    // Configuración base
    const baseOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }

    // Obtener configuración predefinida para el tipo
    const typeConfig = NOTIFICATION_CONFIGS[type] || NOTIFICATION_CONFIGS[NOTIFICATION_TYPES.DEFAULT]
    
    // Combinar todas las opciones
    const toastOptions = {
      ...baseOptions,
      ...typeConfig,
      ...options
    }

    // Mostrar la notificación según el tipo
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(message, toastOptions)
        break
      case NOTIFICATION_TYPES.ERROR:
        toast.error(message, toastOptions)
        break
      case NOTIFICATION_TYPES.WARNING:  
        toast.warn(message, toastOptions)
        break
      case NOTIFICATION_TYPES.INFO:
        toast.info(message, toastOptions)
        break
      default:
        toast(message, toastOptions)
    }
  }

  /**
   * Métodos de conveniencia para diferentes tipos de notificación
   */
  const showSuccess = (message, options = {}) => {
    showNotification(message, NOTIFICATION_TYPES.SUCCESS, options)
  }

  const showError = (message, options = {}) => {
    showNotification(message, NOTIFICATION_TYPES.ERROR, options)
  }

  const showWarning = (message, options = {}) => {
    showNotification(message, NOTIFICATION_TYPES.WARNING, options)
  }

  const showInfo = (message, options = {}) => {
    showNotification(message, NOTIFICATION_TYPES.INFO, options)
  }

  /**
   * Limpiar todas las notificaciones
   */
  const clearAllNotifications = () => {
    toast.dismiss()
  }

  /**
   * Notificaciones específicas del dominio de la aplicación
   */
  const showLoginSuccess = (userName) => {
    showSuccess(`¡Bienvenido ${userName}! Has iniciado sesión correctamente.`)
  }

  const showLogoutSuccess = () => {
    showInfo('Has cerrado sesión correctamente.')
  }

  const showSessionExpired = () => {
    showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
  }

  const showServerError = () => {
    showError('Error del servidor. Por favor, intenta nuevamente.')
  }

  const showNetworkError = () => {
    showError('Error de conexión. Verifica tu conexión a internet.')
  }

  const showSaveSuccess = (itemName = 'elemento') => {
    showSuccess(`${itemName} guardado correctamente.`)
  }

  const showDeleteSuccess = (itemName = 'elemento') => {
    showSuccess(`${itemName} eliminado correctamente.`)
  }

  const showUpdateSuccess = (itemName = 'elemento') => {
    showSuccess(`${itemName} actualizado correctamente.`)
  }

  // Valor del contexto con todos los métodos disponibles
  const value = {
    // Método principal
    showNotification,
    
    // Métodos de conveniencia por tipo
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Utilidades
    clearAllNotifications,
    
    // Notificaciones específicas del dominio
    showLoginSuccess,
    showLogoutSuccess,
    showSessionExpired,
    showServerError,
    showNetworkError,
    showSaveSuccess,
    showDeleteSuccess,
    showUpdateSuccess,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Configuración del contenedor de toasts */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={5} // Máximo 5 notificaciones simultáneas
      />
    </NotificationContext.Provider>
  )
}