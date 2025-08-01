// ===== ARCHIVO: src/api/interceptors.js =====
import { apiClient, API_CONFIG } from './config'

// ===== UTILIDADES =====
const getStoredToken = () => localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN)

const clearAuthData = () => {
  localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN)
  localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER)
}

const handleApiError = (error, operation = 'operación') => {
  console.error(`Error en ${operation}:`, error)

  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response
    const message = data?.message || data?.error || 'Error en el servidor'

    switch (status) {
      case 400:
        return new Error(`Datos inválidos: ${message}`)
      case 401:
        return new Error('Sesión expirada. Por favor inicie sesión nuevamente.')
      case 403:
        return new Error('No tiene permisos para realizar esta acción.')
      case 404:
        return new Error('Recurso no encontrado.')
      case 422:
        return new Error(`Error de validación: ${message}`)
      case 429:
        return new Error('Demasiadas solicitudes. Intente más tarde.')
      case 500:
        return new Error('Error interno del servidor. Intente más tarde.')
      case 503:
        return new Error('Servicio temporalmente no disponible.')
      default:
        return new Error(`Error del servidor (${status}): ${message}`)
    }
  } else if (error.request) {
    // Error de red o timeout
    if (error.code === 'ECONNABORTED') {
      return new Error('Tiempo de espera agotado. Verifique su conexión.')
    }
    return new Error(
      'Error de conexión al servidor. Verifique que el backend esté funcionando.'
    )
  } else {
    // Error de configuración o desconocido
    return new Error(error.message || 'Error desconocido')
  }
}

// ===== INTERCEPTOR DE REQUEST =====
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación automáticamente
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log para debugging - puedes comentar esta línea en producción
    console.log(
      `🚀 API REQUEST: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      {
        params: config.params,
        data: config.data,
        headers: config.headers,
      }
    )

    return config
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// ===== INTERCEPTOR DE RESPONSE =====
apiClient.interceptors.response.use(
  (response) => {
    // Log para debugging - puedes comentar esta línea en producción
    console.log(
      `✅ API RESPONSE: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    )

    return response
  },
  (error) => {
    // Log del error - puedes comentar esta línea en producción
    console.error(
      `❌ API ERROR: ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response?.data || error.message
    )

    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      clearAuthData()
      console.warn('🔑 Token eliminado por error 401')
      
      // Opcional: Emitir evento para notificar a la aplicación
      window.dispatchEvent(new CustomEvent('auth:unauthorized', {
        detail: { error, redirectToLogin: true }
      }))
    }

    // Manejo de otros errores críticos
    if (error.response?.status >= 500) {
      // Opcional: Mostrar notificación global de error del servidor
      window.dispatchEvent(new CustomEvent('api:serverError', {
        detail: { error, status: error.response.status }
      }))
    }

    // Transformar el error usando nuestro manejador
    const transformedError = handleApiError(error)
    return Promise.reject(transformedError)
  }
)

// ===== FUNCIONES DE UTILIDAD EXPORTADAS =====
export const createFormData = (data, files = []) => {
  const formData = new FormData()

  // Agregar datos
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'items' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
    }
  })

  // Agregar archivos
  files.forEach((file) => {
    if (file) {
      formData.append('archivos', file)
    }
  })

  return formData
}

export const validateFile = (file) => {
  if (!file) return true

  if (file.size > API_CONFIG.MAX_FILE_SIZE) {
    throw new Error(`El archivo ${file.name} excede el tamaño máximo de 10MB`)
  }

  if (!API_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Tipo de archivo no permitido: ${file.type}`)
  }

  return true
}

export const cleanParams = (params) => {
  return Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  )
}

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// ===== FUNCIONES DE AUTENTICACIÓN =====
export const getToken = () => getStoredToken()

export const getStoredUser = () => {
  const userStr = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER)
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error parsing stored user data:', error)
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER)
    return null
  }
}

export const setAuthData = (token, user) => {
  localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, token)
  localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user))
}

export const isAuthenticated = () => {
  const token = getToken()
  const user = getStoredUser()
  return !!(token && user)
}

export const getUserRole = () => {
  const user = getStoredUser()
  return user?.rol || null
}

export const hasRole = (role) => {
  const userRole = getUserRole()
  return userRole === role
}

export const hasPermission = (permissions) => {
  const user = getStoredUser()
  if (!user?.permisos) return false

  const userPermissions = user.permisos || []
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions]

  return permissionsArray.every(permission => 
    userPermissions.includes(permission)
  )
}

// ===== EXPORTACIONES =====
export { clearAuthData, handleApiError }
export default apiClient