// ===== ARCHIVO: src/services/requestService.js =====
import apiClient from './interceptors'
import { 
  createFormData, 
  validateFile, 
  cleanParams, 
  downloadBlob 
} from './interceptors'

// ===== CLASE SOLICITUDESSERVICE =====
class SolicitudesService {
  // ===== MÉTODOS CRUD =====

  /**
   * Crear nueva solicitud
   * @param {Object} solicitudData - Datos de la solicitud
   * @param {Array} archivos - Archivos adjuntos
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async create(solicitudData, archivos = []) {
    // Validar archivos
    archivos.forEach(validateFile)

    // Crear FormData usando la utilidad centralizada
    const formData = createFormData(solicitudData, archivos)

    const response = await apiClient.post('/solicitudes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }

  /**
   * Obtener todas las solicitudes con filtros y paginación
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} Lista de solicitudes
   */
  async getAll(params = {}) {
    const cleanedParams = cleanParams(params)

    console.log('Fetching solicitudes with params:', cleanedParams)

    const response = await apiClient.get('/solicitudes', {
      params: cleanedParams,
    })

    // Manejar diferentes estructuras de respuesta del backend
    const data = response.data

    // Si la respuesta tiene estructura con datos y paginación
    if (data && typeof data === 'object') {
      // Adaptar a la estructura esperada de PostgreSQL
      return {
        solicitudes: data.solicitudes || data.data || data.results || data,
        pagination: data.pagination ||
          data.meta || {
            currentPage: data.currentPage || 1,
            totalPages: data.totalPages || 1,
            totalItems: data.totalItems || data.total || 0,
            limit: data.limit || 20,
          },
        total: data.total || data.count || data.totalItems || 0,
      }
    }

    // Si la respuesta es directamente un array
    if (Array.isArray(data)) {
      return {
        solicitudes: data,
        pagination: null,
        total: data.length,
      }
    }

    return {
      solicitudes: [],
      pagination: null,
      total: 0,
    }
  }

  /**
   * Obtener solicitud por ID
   * @param {string|number} id - ID de la solicitud
   * @returns {Promise<Object>} Datos de la solicitud
   */
  async getById(id) {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await apiClient.get(`/solicitudes/${id}`)
    return response.data
  }

  /**
   * Actualizar solicitud completa
   * @param {string|number} id - ID de la solicitud
   * @param {Object} solicitudData - Datos actualizados
   * @param {Array} archivos - Nuevos archivos adjuntos
   * @returns {Promise<Object>} Solicitud actualizada
   */
  async update(id, solicitudData, archivos = []) {
    if (!id) throw new Error('ID de solicitud requerido')

    // Validar archivos
    archivos.forEach(validateFile)

    // Crear FormData usando la utilidad centralizada
    const formData = createFormData(solicitudData, archivos)

    const response = await apiClient.put(`/solicitudes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }

  /**
   * Actualizar solo el estado de una solicitud
   * @param {string|number} id - ID de la solicitud
   * @param {string} estatus - Nuevo estado
   * @param {string} comentarios - Comentarios del cambio
   * @returns {Promise<Object>} Solicitud actualizada
   */
  async updateStatus(id, estatus, comentarios = '') {
    if (!id || !estatus) {
      throw new Error('ID y estatus son requeridos')
    }

    const response = await apiClient.put(`/solicitudes/${id}`, {
      estatus,
      comentarios,
    })

    return response.data
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
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await apiClient.delete(`/solicitudes/${id}`)
    return response.data
  }

  // ===== MÉTODOS ADICIONALES =====

  /**
   * Obtener estadísticas del dashboard
   * @param {Object} filtros - Filtros para las estadísticas
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats(filtros = {}) {
    const response = await apiClient.get('/solicitudes/stats', {
      params: cleanParams(filtros),
    })
    return response.data
  }

  /**
   * Obtener historial de cambios de una solicitud
   * @param {string|number} id - ID de la solicitud
   * @returns {Promise<Array>} Historial de cambios
   */
  async getHistory(id) {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await apiClient.get(`/solicitudes/${id}/history`)
    return response.data
  }

  /**
   * Exportar solicitudes
   * @param {Object} filtros - Filtros para la exportación
   * @param {string} formato - Formato de exportación ('excel' | 'pdf')
   * @returns {Promise<boolean>} Éxito de la exportación
   */
  async export(filtros = {}, formato = 'excel') {
    const response = await apiClient.get('/solicitudes/export', {
      params: { ...cleanParams(filtros), formato },
      responseType: 'blob',
    })

    // Generar nombre de archivo con fecha
    const fecha = new Date().toISOString().split('T')[0]
    const extension = formato === 'excel' ? 'xlsx' : 'pdf'
    const filename = `solicitudes_${fecha}.${extension}`

    // Usar utilidad centralizada para descarga
    downloadBlob(response.data, filename)

    return true
  }

  /**
   * Descargar documento adjunto
   * @param {string|number} solicitudId - ID de la solicitud
   * @param {string|number} documentoId - ID del documento
   * @returns {Promise<boolean>} Éxito de la descarga
   */
  async downloadDocument(solicitudId, documentoId) {
    if (!solicitudId || !documentoId) {
      throw new Error('IDs de solicitud y documento requeridos')
    }

    const response = await apiClient.get(
      `/solicitudes/${solicitudId}/documentos/${documentoId}`,
      {
        responseType: 'blob',
      }
    )

    // Extraer nombre del archivo del header
    const contentDisposition = response.headers['content-disposition']
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `documento_${documentoId}`

    // Usar utilidad centralizada para descarga
    downloadBlob(response.data, filename)

    return true
  }

  // ===== MÉTODOS DE UTILIDAD =====

  /**
   * Validar datos de solicitud antes de enviar
   * @param {Object} solicitudData - Datos a validar
   * @returns {Object} Datos validados
   */
  validateSolicitudData(solicitudData) {
    const required = ['tipo_requisicion', 'descripcion_detallada', 'urgencia']
    const missing = required.filter((field) => !solicitudData[field])

    if (missing.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`)
    }

    // Validaciones adicionales
    if (
      solicitudData.urgencia &&
      !['baja', 'media', 'alta', 'critica'].includes(solicitudData.urgencia)
    ) {
      throw new Error('Nivel de urgencia inválido')
    }

    if (
      solicitudData.tipo_requisicion &&
      !['productos', 'servicios', 'mantenimiento'].includes(
        solicitudData.tipo_requisicion
      )
    ) {
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
      const response = await apiClient.get('/solicitudes/health')
      return response.status === 200
    } catch (error) {
      console.warn('Solicitudes health check failed:', error)
      return false
    }
  }

  /**
   * Obtener configuración del cliente (delegada a interceptors)
   * @returns {Object} Configuración actual
   */
  getConfig() {
    return {
      baseURL: apiClient.defaults.baseURL,
      timeout: apiClient.defaults.timeout,
    }
  }
}

// ===== INSTANCIA SINGLETON =====
const solicitudesService = new SolicitudesService()

// ===== EXPORTACIÓN =====
export default solicitudesService

// Exportar también la clase para testing
export { SolicitudesService }