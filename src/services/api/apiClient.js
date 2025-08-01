// ===== ARCHIVO: src/api/apiClient.js - VERSIÓN SIMPLE =====
import axios from 'axios'
import { API_CONFIG } from './config'

// ===== INSTANCIA BASE DE AXIOS =====
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
})

// ===== UTILIDADES =====
const getToken = () => localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN)

const clearAuthData = () => {
  localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN)
  localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER)
}

const transformError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    const message = data?.message || data?.error || 'Error en el servidor'

    const errorMap = {
      400: `Datos inválidos: ${message}`,
      401: 'Sesión expirada. Por favor inicie sesión nuevamente.',
      403: 'No tiene permisos para realizar esta acción.',
      404: 'Recurso no encontrado.',
      422: `Error de validación: ${message}`,
      429: 'Demasiadas solicitudes. Intente más tarde.',
      500: 'Error interno del servidor. Intente más tarde.',
      503: 'Servicio temporalmente no disponible.'
    }

    const userMessage = errorMap[status] || `Error del servidor (${status}): ${message}`
    
    const customError = new Error(userMessage)
    customError.status = status
    customError.originalData = data
    
    return customError
  } 
  
  if (error.request) {
    if (error.code === 'ECONNABORTED') {
      return new Error('Tiempo de espera agotado. Verifique su conexión.')
    }
    return new Error('Error de conexión. Verifique que el servidor esté disponible.')
  }

  return error
}

// ===== INTERCEPTOR DE REQUEST =====
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token automáticamente si existe
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log simple para debugging
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)

    return config
  },
  (error) => {
    console.error('❌ Error en request:', error)
    return Promise.reject(error)
  }
)

// ===== INTERCEPTOR DE RESPONSE =====
apiClient.interceptors.response.use(
  (response) => {
    // Log simple de respuesta exitosa
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`)
    return response
  },
  (error) => {
    // Log del error
    console.error(
      `❌ ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response?.data?.message || error.message
    )

    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      clearAuthData()
      console.warn('🔑 Sesión expirada - Datos eliminados')
      
      // Emitir evento para que la app maneje el redirect
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    // Transformar error para mejor UX
    const transformedError = transformError(error)
    return Promise.reject(transformedError)
  }
)

export default apiClient