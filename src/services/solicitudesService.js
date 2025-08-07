// ===== ARCHIVO: src/services/solicitudesService.js REFACTORIZADO =====
import BaseService from './api/BaseService'

class SolicitudesService extends BaseService {
  constructor() {
    super('/solicitudes')
  }

  // ===== MÉTODOS CRUD HEREDADOS Y PERSONALIZADOS =====

  /**
   * Crear nueva solicitud
   * @param {Object} solicitudData - Datos de la solicitud
   * @param {Array} archivos - Archivos adjuntos
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async create(solicitudData, archivos = []) {
    // Validar datos antes de enviar
    this.validateSolicitudData(solicitudData)

    // Validar archivos
    if (archivos.length > 0) {
      archivos.forEach(file => this.validateFile(file))
    }

    console.log('solicitudData', solicitudData)
    console.log('archivos', archivos)

    return await super.create(solicitudData, archivos)
  }

  /**
   * Obtener todas las solicitudes con filtros y paginación
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} Lista de solicitudes con estructura adaptada
   */
  async getAll(params = {}) {
    const response = await super.getAll(params)
    
    // Adaptar respuesta para mantener compatibilidad con el frontend existente
    return {
      solicitudes: response.data?.data || response.data?.solicitudes || response.data?.results || response.data || [],
      pagination: response.data?.pagination || response.data?.meta || {
        page: response.data?.page || 1,
        pages: response.data?.pages || 1,
        total: response.data?.total || 0,
        limit: response.data?.limit || 10,
      },
      total: response.data?.total || response.data?.count || response.data?.totalItems || 0,
    }
  }

  /**
   * Obtener mis solicitudes (para usuarios solicitantes)
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} Lista de solicitudes del usuario
   */
  async getMySolicitudes(params = {}) {
    const cleanedParams = this.cleanParams(params)
    
    const response = await this.client.get(`${this.baseUrl}/mis-solicitudes`, {
      params: cleanedParams,
    })

    const result = this.formatResponse(response)
    const data = result.data

    // Adaptar estructura para compatibilidad
    return {
      solicitudes: data?.data || data?.solicitudes || data?.results || data || [],
      pagination: data?.pagination || data?.meta || {
        page: data?.page || 1,
        pages: data?.pages || 1,
        total: data?.total || 0,
        limit: data?.limit || 10,
      },
      total: data?.total || data?.count || data?.totalItems || 0,
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
    // Validar archivos si existen
    if (archivos.length > 0) {
      archivos.forEach(file => this.validateFile(file))
    }

    return await super.update(id, solicitudData, archivos)
  }

  // ===== MÉTODOS DE WORKFLOW =====

  /**
   * Aprobar solicitud
   * @param {string|number} id - ID de la solicitud
   * @param {string} comentario - Comentarios de la aprobación
   * @returns {Promise<Object>} Solicitud aprobada
   */
  async approve(id, comentario = '') {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await this.client.patch(`${this.baseUrl}/${id}/aprobar`, {
      comentario,
    })

    return this.formatResponse(response)
  }

  /**
   * Denegar/Cancelar solicitud
   * @param {string|number} id - ID de la solicitud
   * @param {string} motivo_cancelacion - Motivo de la cancelación
   * @returns {Promise<Object>} Solicitud cancelada
   */
  async cancel(id, motivo_cancelacion = '') {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await this.client.patch(`${this.baseUrl}/${id}/cancelar`, {
      motivo_cancelacion,
    })

    return this.formatResponse(response)
  }

  /**
   * Alias para cancel() - para mantener compatibilidad
   */
  async deny(id, comentarios = '') {
    return this.cancel(id, comentarios)
  }

  /**
   * Actualizar solo el estado de una solicitud (MÉTODO GENÉRICO - NO RECOMENDADO)
   * @deprecated Usar métodos específicos como approve() o cancel()
   */
  async updateStatus(id, estatus, comentarios = '') {
    if (!id || !estatus) {
      throw new Error('ID y estatus son requeridos')
    }

    console.warn('updateStatus está deprecated. Usar métodos específicos como approve() o cancel()')

    // Redirigir a métodos específicos
    if (estatus === 'aprobada') {
      return this.approve(id, comentarios)
    }
    if (estatus === 'denegada') {
      return this.cancel(id, comentarios)
    }

    // Para otros estados, usar endpoint genérico
    const response = await this.client.patch(`${this.baseUrl}/${id}/status`, {
      estatus,
      comentarios,
    })

    return this.formatResponse(response)
  }

  /**
   * Eliminar solicitud
   * @param {string|number} id - ID de la solicitud
   * @param {string} motivo - Motivo de eliminación
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async delete(id, motivo = '') {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await this.client.delete(`${this.baseUrl}/${id}`, {
      data: {
        confirmacion: 'ELIMINAR',
        motivo_eliminacion: motivo,
      },
    })

    return this.formatResponse(response)
  }

  // ===== MÉTODOS ADICIONALES =====

  /**
   * Obtener estadísticas del dashboard
   * @param {Object} filtros - Filtros para las estadísticas
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats(filtros = {}) {
    const params = this.cleanParams(filtros)
    const response = await this.client.get(`${this.baseUrl}/estadisticas`, { params })
    return this.formatResponse(response)
  }

  /**
   * Obtener historial de cambios de una solicitud
   * @param {string|number} id - ID de la solicitud
   * @returns {Promise<Array>} Historial de cambios
   */
  async getHistory(id) {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await this.client.get(`${this.baseUrl}/${id}/history`)
    return this.formatResponse(response)
  }

  /**
   * Obtener aprobaciones de una solicitud
   * @param {string|number} id - ID de la solicitud
   * @returns {Promise<Array>} Lista de aprobaciones
   */
  async getAprobaciones(id) {
    if (!id) throw new Error('ID de solicitud requerido')

    const response = await this.client.get(`${this.baseUrl}/${id}/aprobaciones`)
    return this.formatResponse(response)
  }

  /**
   * Exportar solicitudes
   * @param {Object} filtros - Filtros para la exportación
   * @param {string} formato - Formato de exportación ('excel' | 'pdf')
   * @returns {Promise<boolean>} Éxito de la exportación
   */
  async export(filtros = {}, formato = 'excel') {
    const params = { ...this.cleanParams(filtros), formato }
    
    // Generar nombre de archivo con fecha
    const fecha = new Date().toISOString().split('T')[0]
    const extension = formato === 'excel' ? 'xlsx' : 'pdf'
    const filename = `solicitudes_${fecha}.${extension}`

    const url = `${this.baseUrl}/export`
    await this.downloadFile(url + '?' + new URLSearchParams(params), filename)

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

    const response = await this.client.get(
      `${this.baseUrl}/${solicitudId}/documentos/${documentoId}`,
      { responseType: 'blob' }
    )

    // Extraer nombre del archivo del header
    const contentDisposition = response.headers['content-disposition']
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `documento_${documentoId}`

    // Crear blob y descargar
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return true
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  /**
   * Validar datos de solicitud antes de enviar
   * @param {Object} solicitudData - Datos a validar
   * @returns {Object} Datos validados
   */
  validateSolicitudData(solicitudData) {
    if (!solicitudData) throw new Error('Datos de solicitud requeridos')

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
      const response = await this.client.get(`${this.baseUrl}/health`)
      return response.status === 200
    } catch (error) {
      console.warn('Solicitudes health check failed:', error)
      return false
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
    if (
      usuario.rol === 'solicitante' &&
      solicitud.solicitante_id !== usuario.id_usuario
    ) {
      return false
    }

    // Verificar estado
    const estadosCancelables = [
      'pendiente',
      'en_revision',
      'aprobada',
      'en_proceso',
    ]
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
    if (
      usuario.rol === 'solicitante' &&
      solicitud.solicitante_id !== usuario.id_usuario
    ) {
      return false
    }

    // Admin siempre puede editar
    if (['admin_sistema', 'administrativo'].includes(usuario.rol)) return true

    // Verificar estado
    const estadosEditables = ['pendiente', 'en_revision']
    return estadosEditables.includes(solicitud.estatus)
  }

  // ===== MÉTODOS ADICIONALES ÚTILES =====

  /**
   * Obtener configuración del cliente
   * @returns {Object} Configuración actual
   */
  getConfig() {
    return {
      baseURL: this.client.defaults.baseURL,
      timeout: this.client.defaults.timeout,
    }
  }

  /**
   * Buscar solicitudes (usa el método heredado de BaseService)
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} Resultados de búsqueda
   */
  async search(searchTerm, params = {}) {
    const response = await super.search(searchTerm, params)
    
    // Adaptar estructura para compatibilidad
    return {
      solicitudes: response.data?.data || response.data?.solicitudes || response.data || [],
      pagination: response.data?.pagination || response.data?.meta || null,
      total: response.data?.total || response.data?.count || 0,
    }
  }

  /**
   * Obtener solicitudes con filtros específicos del dominio
   * @param {Object} filtros - Filtros específicos
   * @returns {Promise<Object>} Solicitudes filtradas
   */
  async getSolicitudes(filtros = {}) {
    return await this.getAll(filtros)
  }

  /**
   * Contar solicitudes con filtros
   * @param {Object} filtros - Filtros para el conteo
   * @returns {Promise<number>} Número de solicitudes
   */
  async count(filtros = {}) {
    const params = this.cleanParams(filtros)
    const response = await this.client.get(`${this.baseUrl}/count`, { params })
    const result = this.formatResponse(response)
    return result.data?.count || result.data || 0
  }
}

// ===== INSTANCIA SINGLETON =====
const solicitudesService = new SolicitudesService()

// ===== EXPORTACIÓN =====
export default solicitudesService

// Exportar también la clase para testing
export { SolicitudesService }