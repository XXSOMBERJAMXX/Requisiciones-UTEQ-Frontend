// ===== ARCHIVO: src/services/comprasService.js REFACTORIZADO =====
import BaseService from './api/BaseService'

class ComprasService extends BaseService {
  constructor() {
    super('/compras')
  }

  // ===== MÉTODOS CRUD HEREDADOS Y PERSONALIZADOS =====

  /**
   * Crear nueva compra
   * @param {Object} compraData - Datos de la compra
   * @param {Array} archivos - Archivos adjuntos (facturas)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async create(compraData, archivos = []) {
    // Validar archivos si existen
    if (archivos.length > 0) {
      archivos.forEach(file => this.validateFile(file))
    }

    return await super.create(compraData, archivos)
  }

  /**
   * Obtener todas las compras con filtros
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Object>} Lista de compras con estructura adaptada
   */
  async getAll(params = {}) {
    const response = await super.getAll(params)
    
    // Adaptar respuesta para mantener compatibilidad con el frontend existente
    return {
      compras: response.data?.data || response.data?.compras || response.data || [],
      pagination: response.data?.pagination || response.data?.meta || null,
      total: response.data?.total || response.data?.count || 
             (response.data?.data ? response.data.data.length : 0),
    }
  }

  /**
   * Actualizar compra
   * @param {string|number} id - ID de la compra
   * @param {Object} compraData - Datos actualizados
   * @param {Array} archivos - Archivos adjuntos
   * @returns {Promise<Object>} Compra actualizada
   */
  async update(id, compraData, archivos = []) {
    // Validar archivos si existen
    if (archivos.length > 0) {
      archivos.forEach(file => this.validateFile(file))
    }

    return await super.update(id, compraData, archivos)
  }

  /**
   * Eliminar compra
   * @param {string|number} id - ID de la compra
   * @param {string} motivo - Motivo de eliminación (opcional)
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async delete(id, motivo = '') {
    if (!id) throw new Error('ID de compra requerido')

    const response = await this.client.delete(`${this.baseUrl}/${id}`, {
      data: {
        confirmacion: 'ELIMINAR',
        motivo_eliminacion: motivo,
      },
    })

    return this.formatResponse(response)
  }

  // ===== MÉTODOS ESPECÍFICOS DE FACTURAS =====

  /**
   * Agregar factura a compra
   * @param {string|number} compraId - ID de la compra
   * @param {Object} facturaData - Datos de la factura
   * @param {File} archivo - Archivo de la factura
   * @returns {Promise<Object>} Factura creada
   */
  async addFactura(compraId, facturaData, archivo) {
    if (!compraId) throw new Error('ID de compra requerido')
    if (!archivo) throw new Error('Archivo de factura requerido')

    // Validar archivo
    this.validateFile(archivo)

    // Crear FormData con el archivo
    const formData = this.createFormData(facturaData, [archivo])

    const response = await this.client.post(
      `${this.baseUrl}/${compraId}/facturas`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return this.formatResponse(response)
  }

  /**
   * Obtener facturas de una compra
   * @param {string|number} compraId - ID de la compra
   * @returns {Promise<Object>} Lista de facturas
   */
  async getFacturas(compraId) {
    if (!compraId) throw new Error('ID de compra requerido')

    const response = await this.client.get(`${this.baseUrl}/${compraId}/facturas`)
    return this.formatResponse(response)
  }

  /**
   * Obtener factura por ID
   * @param {string|number} compraId - ID de la compra
   * @param {string|number} facturaId - ID de la factura
   * @returns {Promise<Object>} Datos de la factura
   */
  async getFacturaById(compraId, facturaId) {
    if (!compraId || !facturaId) {
      throw new Error('ID de compra y factura requeridos')
    }

    const response = await this.client.get(
      `${this.baseUrl}/${compraId}/facturas/${facturaId}`
    )
    return this.formatResponse(response)
  }

  /**
   * Actualizar factura
   * @param {string|number} compraId - ID de la compra
   * @param {string|number} facturaId - ID de la factura
   * @param {Object} facturaData - Datos actualizados
   * @param {File} archivo - Nuevo archivo (opcional)
   * @returns {Promise<Object>} Factura actualizada
   */
  async updateFactura(compraId, facturaId, facturaData, archivo = null) {
    if (!compraId || !facturaId) {
      throw new Error('ID de compra y factura requeridos')
    }

    let payload = facturaData
    let config = {}

    // Si hay archivo nuevo, crear FormData
    if (archivo) {
      this.validateFile(archivo)
      payload = this.createFormData(facturaData, [archivo])
      config.headers = { 'Content-Type': 'multipart/form-data' }
    }

    const response = await this.client.put(
      `${this.baseUrl}/${compraId}/facturas/${facturaId}`,
      payload,
      config
    )

    return this.formatResponse(response)
  }

  /**
   * Actualizar estado de factura
   * @param {string|number} compraId - ID de la compra
   * @param {string|number} facturaId - ID de la factura
   * @param {string} estatus - Nuevo estado
   * @returns {Promise<Object>} Factura actualizada
   */
  async updateFacturaStatus(compraId, facturaId, estatus) {
    if (!compraId || !facturaId || !estatus) {
      throw new Error('ID de compra, factura y estatus requeridos')
    }

    const response = await this.client.patch(
      `${this.baseUrl}/${compraId}/facturas/${facturaId}/estado`,
      { estatus }
    )

    return this.formatResponse(response)
  }

  /**
   * Eliminar factura
   * @param {string|number} compraId - ID de la compra
   * @param {string|number} facturaId - ID de la factura
   * @param {string} motivo - Motivo de eliminación
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async deleteFactura(compraId, facturaId, motivo = '') {
    if (!compraId || !facturaId) {
      throw new Error('ID de compra y factura requeridos')
    }

    const response = await this.client.delete(
      `${this.baseUrl}/${compraId}/facturas/${facturaId}`,
      {
        data: {
          motivo_eliminacion: motivo,
        },
      }
    )

    return this.formatResponse(response)
  }

  /**
   * Descargar factura
   * @param {string|number} compraId - ID de la compra
   * @param {string|number} facturaId - ID de la factura
   * @returns {Promise<void>}
   */
  async downloadFactura(compraId, facturaId) {
    if (!compraId || !facturaId) {
      throw new Error('ID de compra y factura requeridos')
    }

    const response = await this.client.get(
      `${this.baseUrl}/${compraId}/facturas/${facturaId}/descargar`,
      { responseType: 'blob' }
    )

    // Extraer nombre del archivo del header
    const contentDisposition = response.headers['content-disposition']
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `factura_${facturaId}.pdf`

    // Usar el método heredado para descargar
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  // ===== MÉTODOS ADICIONALES DE COMPRAS =====

  /**
   * Obtener compras con filtros específicos del dominio
   * @param {Object} filtros - Filtros específicos
   * @returns {Promise<Object>} Compras filtradas
   */
  async getCompras(filtros = {}) {
    return await this.getAll(filtros)
  }

  /**
   * Buscar compras
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} Resultados de búsqueda
   */
  async search(searchTerm, params = {}) {
    const response = await super.search(searchTerm, params)
    
    // Adaptar estructura para compatibilidad
    return {
      compras: response.data?.data || response.data?.compras || response.data || [],
      pagination: response.data?.pagination || response.data?.meta || null,
      total: response.data?.total || response.data?.count || 0,
    }
  }

  /**
   * Contar compras con filtros
   * @param {Object} filtros - Filtros para el conteo
   * @returns {Promise<number>} Número de compras
   */
  async count(filtros = {}) {
    const params = this.cleanParams(filtros)
    const response = await this.client.get(`${this.baseUrl}/count`, { params })
    const result = this.formatResponse(response)
    return result.data?.count || result.data || 0
  }

  /**
   * Obtener estadísticas de compras
   * @param {Object} filtros - Filtros para las estadísticas
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats(filtros = {}) {
    const params = this.cleanParams(filtros)
    const response = await this.client.get(`${this.baseUrl}/estadisticas`, { params })
    return this.formatResponse(response)
  }

  /**
   * Exportar compras
   * @param {Object} filtros - Filtros para la exportación
   * @param {string} formato - Formato de exportación ('excel' | 'pdf')
   * @returns {Promise<boolean>} Éxito de la exportación
   */
  async export(filtros = {}, formato = 'excel') {
    const params = { ...this.cleanParams(filtros), formato }
    
    // Generar nombre de archivo con fecha
    const fecha = new Date().toISOString().split('T')[0]
    const extension = formato === 'excel' ? 'xlsx' : 'pdf'
    const filename = `compras_${fecha}.${extension}`

    const url = `${this.baseUrl}/export`
    await this.downloadFile(url + '?' + new URLSearchParams(params), filename)

    return true
  }

  // ===== MÉTODOS DE WORKFLOW DE COMPRAS =====

  /**
   * Aprobar compra
   * @param {string|number} id - ID de la compra
   * @param {string} comentario - Comentarios de la aprobación
   * @returns {Promise<Object>} Compra aprobada
   */
  async approve(id, comentario = '') {
    if (!id) throw new Error('ID de compra requerido')

    const response = await this.client.patch(`${this.baseUrl}/${id}/aprobar`, {
      comentario,
    })

    return this.formatResponse(response)
  }

  /**
   * Rechazar compra
   * @param {string|number} id - ID de la compra
   * @param {string} motivo_rechazo - Motivo del rechazo
   * @returns {Promise<Object>} Compra rechazada
   */
  async reject(id, motivo_rechazo = '') {
    if (!id) throw new Error('ID de compra requerido')

    const response = await this.client.patch(`${this.baseUrl}/${id}/rechazar`, {
      motivo_rechazo,
    })

    return this.formatResponse(response)
  }

  /**
   * Completar compra
   * @param {string|number} id - ID de la compra
   * @param {Object} completionData - Datos de finalización
   * @returns {Promise<Object>} Compra completada
   */
  async complete(id, completionData = {}) {
    if (!id) throw new Error('ID de compra requerido')

    const response = await this.client.patch(`${this.baseUrl}/${id}/completar`, {
      fecha_completion: new Date().toISOString(),
      ...completionData
    })

    return this.formatResponse(response)
  }

  /**
   * Cancelar compra
   * @param {string|number} id - ID de la compra
   * @param {string} motivo_cancelacion - Motivo de la cancelación
   * @returns {Promise<Object>} Compra cancelada
   */
  async cancel(id, motivo_cancelacion = '') {
    if (!id) throw new Error('ID de compra requerido')

    const response = await this.client.patch(`${this.baseUrl}/${id}/cancelar`, {
      motivo_cancelacion,
    })

    return this.formatResponse(response)
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  /**
   * Validar datos de compra antes de enviar
   * @param {Object} compraData - Datos a validar
   * @returns {Object} Datos validados
   */
  validateCompraData(compraData) {
    if (!compraData) throw new Error('Datos de compra requeridos')

    // Validaciones básicas según tu dominio
    const required = ['concepto', 'monto']
    const missing = required.filter((field) => !compraData[field])

    if (missing.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`)
    }

    // Validar monto
    if (compraData.monto && compraData.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0')
    }

    return compraData
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
      console.warn('Compras health check failed:', error)
      return false
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

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
   * Obtener proveedores (si está implementado)
   * @param {Object} filtros - Filtros para proveedores
   * @returns {Promise<Array>} Lista de proveedores
   */
  async getProveedores(filtros = {}) {
    const params = this.cleanParams(filtros)
    const response = await this.client.get(`${this.baseUrl}/proveedores`, { params })
    return this.formatResponse(response)
  }

  /**
   * Obtener historial de una compra
   * @param {string|number} id - ID de la compra
   * @returns {Promise<Array>} Historial de cambios
   */
  async getHistory(id) {
    if (!id) throw new Error('ID de compra requerido')

    const response = await this.client.get(`${this.baseUrl}/${id}/history`)
    return this.formatResponse(response)
  }
}

// ===== INSTANCIA SINGLETON =====
const comprasService = new ComprasService()

// ===== EXPORTACIÓN =====
export default comprasService

// Exportar también la clase para testing
export { ComprasService }