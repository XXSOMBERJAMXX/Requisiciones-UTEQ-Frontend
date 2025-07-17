// ===== ARCHIVO: src/services/requestService.js CORREGIDO =====
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
      // Adaptar a la estructura esperada del backend
      return {
        solicitudes: data.data || data.solicitudes || data.results || data,
        pagination: data.pagination ||
          data.meta || {
            page: data.page || 1,
            pages: data.pages || 1,
            total: data.total || 0,
            limit: data.limit || 10,
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
   * Obtener mis solicitudes (para usuarios solicitantes)
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} Lista de solicitudes del usuario
   */
  async getMySolicitudes(params = {}) {
    const cleanedParams = cleanParams(params)

    const response = await apiClient.get('/solicitudes/mis-solicitudes', {
      params: cleanedParams,
    })

    const data = response.data

    if (data && typeof data === 'object') {
      return {
        solicitudes: data.data || data.solicitudes || data.results || data,
        pagination: data.pagination ||
          data.meta || {
            page: data.page || 1,
            pages: data.pages || 1,
            total: data.total || 0,
            limit: data.limit || 10,
          },
        total: data.total || data.count || data.totalItems || 0,
      }
    }

    return {
      solicitudes: Array.isArray(data) ? data : [],
      pagination: null,
      total: Array.isArray(data) ? data.length : 0,
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
   * Actualizar solo el estado de una solicitud (MÉTODO GENÉRICO - NO RECOMENDADO)
   * @param {string|number} id - ID de la solicitud
   * @param {string} estatus - Nuevo estado
   * @param {string} comentarios - Comentarios del cambio
   * @returns {Promise<Object>} Solicitud actualizada
   * @deprecated Usar métodos específicos como approve() o cancel()
   */
  async updateStatus(id, estatus, comentarios = '') {
    if (!id || !estatus) {
      throw new Error('ID y estatus son requeridos')
    }

    console.warn('updateStatus está deprecated. Usar métodos específicos como approve() o cancel()')

    // Para compatibilidad, redirigir a métodos específicos
    if (estatus === 'aprobada') {
      return this.approve(id, comentarios)
    }
    if (estatus === 'denegada') {
      return this.cancel(id, comentarios)
    }

    // Para otros estados, usar endpoint genérico (si existe)
    const response = await apiClient.patch(`/solicitudes/${id}/status`, {
      estatus,
      comentarios,
    })

    return response.data
  }

  /**
   * Aprobar solicitud - CORREGIDO para usar la ruta correcta
   * @param {string|number} id - ID de la solicitud
   * @param {string} comentario - Comentarios de la aprobación
   * @returns {Promise<Object>} Solicitud aprobada
   */
  async approve(id, comentario = '') {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await apiClient.patch(`/solicitudes/${id}/aprobar`, {
      comentario, // Nota: el backend espera 'comentario', no 'comentarios'
    })

    return response.data
  }

  /**
   * Denegar/Cancelar solicitud - CORREGIDO para usar la ruta correcta
   * @param {string|number} id - ID de la solicitud
   * @param {string} motivo_cancelacion - Motivo de la cancelación
   * @returns {Promise<Object>} Solicitud cancelada
   */
  async cancel(id, motivo_cancelacion = '') {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await apiClient.patch(`/solicitudes/${id}/cancelar`, {
      motivo_cancelacion, // El backend espera este campo específico
    })

    return response.data
  }

  /**
   * Alias para cancel() - para mantener compatibilidad
   * @param {string|number} id - ID de la solicitud
   * @param {string} comentarios - Comentarios de la denegación
   * @returns {Promise<Object>} Solicitud denegada
   */
  async deny(id, comentarios = '') {
    return this.cancel(id, comentarios)
  }

  /**
   * Eliminar solicitud (si está implementado en el backend)
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
   * Obtener estadísticas del dashboard - CORREGIDO para usar la ruta correcta
   * @param {Object} filtros - Filtros para las estadísticas
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats(filtros = {}) {
    const response = await apiClient.get('/solicitudes/estadisticas', {
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
   * Obtener aprobaciones de una solicitud
   * @param {string|number} id - ID de la solicitud
   * @returns {Promise<Array>} Lista de aprobaciones
   */
  async getAprobaciones(id) {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await apiClient.get(`/solicitudes/${id}/aprobaciones`)
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

  // ===== MÉTODOS PARA FLUJO DE APROBACIÓN =====

  /**
   * Verificar si una solicitud puede ser aprobada por el usuario actual
   * @param {Object} solicitud - Datos de la solicitud
   * @param {Object} usuario - Datos del usuario actual
   * @returns {boolean} Puede aprobar o no
   */
  canApprove(solicitud, usuario) {
    // Verificar rol
    const rolesPermitidos = ['aprobador', 'administrativo', 'admin_sistema']
    if (!rolesPermitidos.includes(usuario.rol)) return false

    // No puede aprobar su propia solicitud
    if (solicitud.solicitante_id === usuario.id_usuario) return false

    // Verificar estado
    const estadosAprobables = ['pendiente', 'en_revision']
    if (!estadosAprobables.includes(solicitud.estatus)) return false

    return true
  }

  /**
   * Verificar si una solicitud puede ser cancelada por el usuario actual
   * @param {Object} solicitud - Datos de la solicitud
   * @param {Object} usuario - Datos del usuario actual
   * @returns {boolean} Puede cancelar o no
   */
  canCancel(solicitud, usuario) {
    // Roles que pueden cancelar
    const rolesPermitidos = ['solicitante', 'admin_sistema', 'administrativo']
    if (!rolesPermitidos.includes(usuario.rol)) return false

    // Si es solicitante, solo puede cancelar sus propias solicitudes
    if (usuario.rol === 'solicitante' && solicitud.solicitante_id !== usuario.id_usuario) {
      return false
    }

    // Verificar estado
    const estadosCancelables = ['pendiente', 'en_revision', 'aprobada', 'en_proceso']
    if (!estadosCancelables.includes(solicitud.estatus)) return false

    return true
  }

  /**
   * Verificar si una solicitud puede ser editada por el usuario actual
   * @param {Object} solicitud - Datos de la solicitud
   * @param {Object} usuario - Datos del usuario actual
   * @returns {boolean} Puede editar o no
   */
  canEdit(solicitud, usuario) {
    // Solo el solicitante puede editar (o admin)
    if (usuario.rol === 'solicitante' && solicitud.solicitante_id !== usuario.id_usuario) {
      return false
    }

    // Admin siempre puede editar
    if (['admin_sistema', 'administrativo'].includes(usuario.rol)) return true

    // Verificar estado
    const estadosEditables = ['pendiente', 'en_revision']
    return estadosEditables.includes(solicitud.estatus)
  }
}

// ===== INSTANCIA SINGLETON =====
const solicitudesService = new SolicitudesService()

// ===== EXPORTACIÓN =====
export default solicitudesService

// Exportar también la clase para testing
export { SolicitudesService }