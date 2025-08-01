// ===== ARCHIVO: src/contexts/NotificationContext.js =====
import { createContext } from 'react'

// Crear el contexto de notificaciones
export const NotificationContext = createContext()

// Valores por defecto (opcional, para TypeScript o documentación)
export const defaultNotificationValue = {
  showNotification: () => {},
}

// Tipos de notificación disponibles
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEFAULT: 'default'
}

// Configuraciones predefinidas para diferentes tipos de notificación
export const NOTIFICATION_CONFIGS = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    autoClose: 3000,
    theme: 'colored'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    autoClose: 8000,
    theme: 'colored'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    autoClose: 6000,
    theme: 'colored'
  },
  [NOTIFICATION_TYPES.INFO]: {
    autoClose: 5000,
    theme: 'colored'
  },
  [NOTIFICATION_TYPES.DEFAULT]: {
    autoClose: 5000,
    theme: 'light'
  }
}