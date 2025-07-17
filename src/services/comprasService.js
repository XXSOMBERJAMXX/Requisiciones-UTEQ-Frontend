// ===== ARCHIVO: src/services/comprasService.js =====
import apiClient from './interceptors';
import { createFormData, cleanParams, downloadBlob } from './interceptors';

class ComprasService {
  /**
   * Crear nueva compra
   * @param {Object} compraData - Datos de la compra
   * @param {Array} archivos - Archivos adjuntos (facturas)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async create(compraData, archivos = []) {
    const formData = createFormData(compraData, archivos);
    
    const response = await apiClient.post('/compras', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Obtener todas las compras con filtros
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Object>} Lista de compras
   */
  async getAll(params = {}) {
    const cleanedParams = cleanParams(params);
    const response = await apiClient.get('/compras', { params: cleanedParams });
    
    return {
      compras: response.data.data || response.data,
      pagination: response.data.pagination || null,
      total: response.data.total || (response.data.data ? response.data.data.length : 0)
    };
  }

  /**
   * Obtener compra por ID
   * @param {string|number} id - ID de la compra
   * @returns {Promise<Object>} Datos de la compra
   */
  async getById(id) {
    const response = await apiClient.get(`/compras/${id}`);
    return response.data;
  }

  /**
   * Actualizar compra
   * @param {string|number} id - ID de la compra
   * @param {Object} compraData - Datos actualizados
   * @param {Array} archivos - Archivos adjuntos
   * @returns {Promise<Object>} Compra actualizada
   */
  async update(id, compraData, archivos = []) {
    const formData = createFormData(compraData, archivos);
    
    const response = await apiClient.put(`/compras/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Agregar factura a compra
   * @param {string|number} compraId - ID de la compra
   * @param {Object} facturaData - Datos de la factura
   * @param {File} archivo - Archivo de la factura
   * @returns {Promise<Object>} Factura creada
   */
  async addFactura(compraId, facturaData, archivo) {
    const formData = createFormData(facturaData, [archivo]);
    
    const response = await apiClient.post(`/compras/${compraId}/facturas`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Actualizar estado de factura
   * @param {string|number} compraId - ID de la compra
   * @param {string|number} facturaId - ID de la factura
   * @param {string} estatus - Nuevo estado
   * @returns {Promise<Object>} Factura actualizada
   */
  async updateFacturaStatus(compraId, facturaId, estatus) {
    const response = await apiClient.patch(
      `/compras/${compraId}/facturas/${facturaId}/estado`,
      { estatus }
    );

    return response.data;
  }

  /**
   * Descargar factura
   * @param {string|number} compraId - ID de la compra
   * @param {string|number} facturaId - ID de la factura
   * @returns {Promise<void>}
   */
  async downloadFactura(compraId, facturaId) {
    const response = await apiClient.get(
      `/compras/${compraId}/facturas/${facturaId}/descargar`,
      { responseType: 'blob' }
    );

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `factura_${facturaId}.pdf`;

    downloadBlob(response.data, filename);
  }
}

// Instancia singleton
const comprasService = new ComprasService();

export default comprasService;