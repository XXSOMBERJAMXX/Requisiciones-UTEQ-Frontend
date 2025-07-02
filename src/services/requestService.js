// ===== ARCHIVO: src/services/requestService.js =====
import axios from 'axios'

// ===== CONFIGURACIÓN =====
const API_BASE_URL = 'http://localhost:3000/solicitudes'
const REQUEST_TIMEOUT = 15000 // 15 segundos
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

// ===== CONFIGURACIÓN DE AXIOS =====
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== INTERCEPTORES =====
// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Cambiado de 'authToken' a 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log para debugging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
    }
    
    return config
  },
  (error) => {
    console.error('Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// Interceptor para manejo de respuestas y errores
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Response received:', response.status, response.data)
    }
    return response
  },
  (error) => {
    console.error('API Error:', error)
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      // Solo limpiar token, NO redirigir automáticamente
      localStorage.removeItem('token') // Cambiado de 'authToken' a 'token'
      console.warn('Token eliminado por error 401')
      // No hacer redirección automática aquí
    }
    
    return Promise.reject(error)
  }
)

// ===== UTILIDADES =====
const cleanParams = (params) => {
  return Object.fromEntries(
    Object.entries(params || {}).filter(([_, value]) => 
      value !== '' && value !== null && value !== undefined
    )
  )
}

const validateFile = (file) => {
  if (!file) return true
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`El archivo ${file.name} excede el tamaño máximo de 10MB`)
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Tipo de archivo no permitido: ${file.type}`)
  }

  return true
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
        // NO limpiar token aquí, dejar que useAuth lo maneje
        return new Error('Sesión expirada. Por favor inicie sesión nuevamente.')
      case 403:
        return new Error('No tiene permisos para realizar esta acciónnnnnnn.')
      case 404:
        return new Error('Solicitud no encontrada.')
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
    return new Error('Error de conexión al servidor. Verifique que el backend esté funcionando.')
  } else {
    // Error de configuración o desconocido
    return new Error(error.message || 'Error desconocido')
  }
}

// ===== CLASE PRINCIPAL =====
class SolicitudesService {
  
  // ===== MÉTODOS CRUD =====
  
  /**
   * Crear nueva solicitud
   * @param {Object} solicitudData - Datos de la solicitud
   * @param {Array} archivos - Archivos adjuntos
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async create(solicitudData, archivos = []) {
    try {
      // Validar archivos
      archivos.forEach(validateFile)
      
      const formData = new FormData()
      
      // Agregar datos de la solicitud
      Object.entries(solicitudData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'items' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, value)
          }
        }
      })
      
      // Agregar archivos
      archivos.forEach((archivo) => {
        if (archivo) {
          formData.append('archivos', archivo)
        }
      })

      const response = await api.post('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error) {
      throw handleApiError(error, 'crear solicitud')
    }
  }

  /**
   * Obtener todas las solicitudes con filtros y paginación
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} Lista de solicitudes
   */
  async getAll(params = {}) {
    try {
      const cleanedParams = cleanParams(params)
      
      console.log('Fetching solicitudes with params:', cleanedParams)
      
      const response = await api.get('/', { 
        params: cleanedParams 
      })
      
      // Manejar diferentes estructuras de respuesta del backend
      const data = response.data
      
      // Si la respuesta tiene estructura con datos y paginación
      if (data && typeof data === 'object') {
        // Adaptar a la estructura esperada de PostgreSQL
        return {
          solicitudes: data.solicitudes || data.data || data.results || data,
          pagination: data.pagination || data.meta || {
            currentPage: data.currentPage || 1,
            totalPages: data.totalPages || 1,
            totalItems: data.totalItems || data.total || 0,
            limit: data.limit || 20
          },
          total: data.total || data.count || data.totalItems || 0
        }
      }
      
      // Si la respuesta es directamente un array
      if (Array.isArray(data)) {
        return {
          solicitudes: data,
          pagination: null,
          total: data.length
        }
      }
      
      return {
        solicitudes: [],
        pagination: null,
        total: 0
      }
      
    } catch (error) {
      throw handleApiError(error, 'obtener solicitudes')
    }
  }

  /**
   * Obtener solicitud por ID
   * @param {string|number} id - ID de la solicitud
   * @returns {Promise<Object>} Datos de la solicitud
   */
  async getById(id) {
    try {
      if (!id) throw new Error('ID de solicitud requerido')
      
      const response = await api.get(`/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error, 'obtener solicitud')
    }
  }

  /**
   * Actualizar solicitud completa
   * @param {string|number} id - ID de la solicitud
   * @param {Object} solicitudData - Datos actualizados
   * @param {Array} archivos - Nuevos archivos adjuntos
   * @returns {Promise<Object>} Solicitud actualizada
   */
  async update(id, solicitudData, archivos = []) {
    try {
      if (!id) throw new Error('ID de solicitud requerido')
      
      // Validar archivos
      archivos.forEach(validateFile)
      
      const formData = new FormData()
      
      Object.entries(solicitudData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'items' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, value)
          }
        }
      })
      
      archivos.forEach((archivo) => {
        if (archivo) {
          formData.append('archivos', archivo)
        }
      })

      const response = await api.put(`/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error) {
      throw handleApiError(error, 'actualizar solicitud')
    }
  }

  /**
   * Actualizar solo el estado de una solicitud
   * @param {string|number} id - ID de la solicitud
   * @param {string} estatus - Nuevo estado
   * @param {string} comentarios - Comentarios del cambio
   * @returns {Promise<Object>} Solicitud actualizada
   */
  async updateStatus(id, estatus, comentarios = '') {
    try {
      if (!id || !estatus) {
        throw new Error('ID y estatus son requeridos')
      }
      
      const response = await api.patch(`/${id}/status`, {
        estatus,
        comentarios
      })
      
      return response.data
    } catch (error) {
      throw handleApiError(error, 'actualizar estado')
    }
  }

  /**
   * Aprobar solicitud
   * @param {string|number} id - ID de la solicitud
   * @param {string} comentarios - Comentarios de la aprobación
   * @returns {Promise<Object>} Solicitud aprobada
   */
  async approve(id, comentarios = '') {
    return this.updateStatus(id, 'aprobada', comentarios)
  }

  /**
   * Denegar solicitud
   * @param {string|number} id - ID de la solicitud
   * @param {string} comentarios - Comentarios de la denegación
   * @returns {Promise<Object>} Solicitud denegada
   */
  async deny(id, comentarios = '') {
    return this.updateStatus(id, 'denegada', comentarios)
  }

  /**
   * Eliminar solicitud
   * @param {string|number} id - ID de la solicitud
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async delete(id) {
    try {
      if (!id) throw new Error('ID de solicitud requerido')
      
      const response = await api.delete(`/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error, 'eliminar solicitud')
    }
  }

  // ===== MÉTODOS ADICIONALES =====

  /**
   * Obtener estadísticas del dashboard
   * @param {Object} filtros - Filtros para las estadísticas
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats(filtros = {}) {
    try {
      const response = await api.get('/stats', { 
        params: cleanParams(filtros) 
      })
      return response.data
    } catch (error) {
      throw handleApiError(error, 'obtener estadísticas')
    }
  }

  /**
   * Obtener historial de cambios de una solicitud
   * @param {string|number} id - ID de la solicitud
   * @returns {Promise<Array>} Historial de cambios
   */
  async getHistory(id) {
    try {
      if (!id) throw new Error('ID de solicitud requerido')
      
      const response = await api.get(`/${id}/history`)
      return response.data
    } catch (error) {
      throw handleApiError(error, 'obtener historial')
    }
  }

  /**
   * Exportar solicitudes
   * @param {Object} filtros - Filtros para la exportación
   * @param {string} formato - Formato de exportación ('excel' | 'pdf')
   * @returns {Promise<boolean>} Éxito de la exportación
   */
  async export(filtros = {}, formato = 'excel') {
    try {
      const response = await api.get('/export', {
        params: { ...cleanParams(filtros), formato },
        responseType: 'blob'
      })
      
      // Crear descarga automática
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      const fecha = new Date().toISOString().split('T')[0]
      const extension = formato === 'excel' ? 'xlsx' : 'pdf'
      link.setAttribute('download', `solicitudes_${fecha}.${extension}`)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      throw handleApiError(error, 'exportar solicitudes')
    }
  }

  /**
   * Descargar documento adjunto
   * @param {string|number} solicitudId - ID de la solicitud
   * @param {string|number} documentoId - ID del documento
   * @returns {Promise<boolean>} Éxito de la descarga
   */
  async downloadDocument(solicitudId, documentoId) {
    try {
      if (!solicitudId || !documentoId) {
        throw new Error('IDs de solicitud y documento requeridos')
      }
      
      const response = await api.get(`/${solicitudId}/documentos/${documentoId}`, {
        responseType: 'blob'
      })
      
      // Extraer nombre del archivo del header
      const contentDisposition = response.headers['content-disposition']
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `documento_${documentoId}`
      
      // Crear descarga automática
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      throw handleApiError(error, 'descargar documento')
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  /**
   * Validar datos de solicitud antes de enviar
   * @param {Object} solicitudData - Datos a validar
   * @returns {Object} Datos validados
   */
  validateSolicitudData(solicitudData) {
    const required = ['tipo_requisicion', 'descripcion_detallada', 'urgencia']
    const missing = required.filter(field => !solicitudData[field])
    
    if (missing.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`)
    }
    
    // Validaciones adicionales
    if (solicitudData.urgencia && !['baja', 'media', 'alta', 'critica'].includes(solicitudData.urgencia)) {
      throw new Error('Nivel de urgencia inválido')
    }
    
    if (solicitudData.tipo_requisicion && !['productos', 'servicios', 'mantenimiento'].includes(solicitudData.tipo_requisicion)) {
      throw new Error('Tipo de requisición inválido')
    }
    
    return solicitudData
  }

  /**
   * Verificar si el servicio está disponible
   * @returns {Promise<boolean>} Estado del servicio
   */
  async healthCheck() {
    try {
      const response = await api.get('/health')
      return response.status === 200
    } catch (error) {
      console.warn('Health check failed:', error)
      return false
    }
  }

  /**
   * Obtener configuración del cliente
   * @returns {Object} Configuración actual
   */
  getConfig() {
    return {
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      maxFileSize: MAX_FILE_SIZE,
      allowedFileTypes: ALLOWED_FILE_TYPES
    }
  }
}

// ===== INSTANCIA SINGLETON =====
const solicitudesService = new SolicitudesService()

// ===== EXPORTACIÓN =====
export default solicitudesService

// Exportar también la clase para testing
export { SolicitudesService }