// ===== ARCHIVO: src/api/BaseService.js - VERSIÓN CORREGIDA =====
import apiClient from './apiClient'
import { API_CONFIG } from './config'

class BaseService {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
    this.client = apiClient
  }

  // ===== MÉTODOS CRUD BÁSICOS =====

  /**
   * Obtener todos los registros
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async getAll(params = {}) {
    const cleanParams = this.cleanParams(params)
    const response = await this.client.get(this.baseUrl, {
      params: cleanParams,
    })
    return this.formatResponse(response)
  }

  /**
   * Obtener un registro por ID
   * @param {string|number} id - ID del registro
   * @returns {Promise<Object>} Registro encontrado
   */
  async getById(id) {
    if (!id) throw new Error('ID es requerido')

    const response = await this.client.get(`${this.baseUrl}/${id}`)
    return this.formatResponse(response)
  }

  /**
   * Crear un nuevo registro
   * @param {Object} data - Datos del registro
   * @param {Array} files - Archivos opcionales
   * @returns {Promise<Object>} Registro creado
   */
  async create(data, files = []) {
    if (!data) throw new Error('Datos son requeridos')

    let payload = data
    let config = {}

    // Si hay archivos, crear FormData
    if (files && files.length > 0) {
      const formData = new FormData()

      // Agregar datos del formulario
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            formData.append(key, JSON.stringify(value))
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, value)
          }
        }
      })

      // Agregar archivos con el nombre correcto que espera el backend
      files.forEach((file) => {
        formData.append('files', file) // Cambio: usar 'files' en lugar de 'archivos'
      })

      payload = formData
      config.headers = { 'Content-Type': 'multipart/form-data' }
    }

    console.log('payload', payload)
    console.log('files', files)

    const response = await this.client.post(this.baseUrl, payload, config)
    return this.formatResponse(response)
  }

  /**
   * Actualizar un registro
   * @param {string|number} id - ID del registro
   * @param {Object} data - Datos a actualizar
   * @param {Array} files - Archivos opcionales (nuevos archivos)
   * @param {Object} options - Opciones adicionales
   * @param {Array} options.filesToDelete - Array de nombres de archivos a eliminar
   * @param {boolean} options.forceFormData - Forzar uso de FormData aunque no haya archivos
   * @returns {Promise<Object>} Registro actualizado
   */
  async update(id, data, files = [], options = {}) {
    if (!id) throw new Error('ID es requerido')
    if (!data) throw new Error('Datos son requeridos')

    const { filesToDelete = [], forceFormData = false } = options

    let payload = data
    let config = {}

    // Usar FormData si:
    // - Hay archivos nuevos
    // - Hay archivos a eliminar
    // - Se fuerza el uso de FormData
    const shouldUseFormData =
      files.length > 0 || filesToDelete.length > 0 || forceFormData

    if (shouldUseFormData) {
      payload = this.createFormDataWithDeletion(data, files, filesToDelete)
      config.headers = { 'Content-Type': 'multipart/form-data' }
    }

    const response = await this.client.put(
      `${this.baseUrl}/${id}`,
      payload,
      config
    )
    return this.formatResponse(response)
  }

  /**
   * Crear FormData para archivos con soporte para eliminación - VERSIÓN MEJORADA
   * @param {Object} data - Datos del formulario
   * @param {Array} files - Archivos nuevos
   * @param {Array} filesToDelete - Array de nombres de archivos a eliminar
   * @returns {FormData} FormData listo
   */
  createFormDataWithDeletion(data, files = [], filesToDelete = []) {
    const formData = new FormData()

    // Agregar datos del formulario
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value)
        }
      }
    })

    // Agregar archivos a eliminar
    if (filesToDelete.length > 0) {
      formData.append('archivos_a_eliminar', JSON.stringify(filesToDelete))
    }

    // Agregar archivos nuevos
    files.forEach((file) => {
      if (file) {
        formData.append('archivos', file) // Usar 'archivos' como espera el backend
      }
    })

    return formData
  }

  /**
   * Eliminar un registro
   * @param {string|number} id - ID del registro
   * @returns {Promise<Object>} Confirmación
   */
  async delete(id) {
    if (!id) throw new Error('ID es requerido')

    const response = await this.client.delete(`${this.baseUrl}/${id}`)
    return this.formatResponse(response)
  }

  // ===== MÉTODOS DE UTILIDAD =====

  /**
   * Buscar registros
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} Resultados de búsqueda
   */
  async search(searchTerm, params = {}) {
    if (!searchTerm) throw new Error('Término de búsqueda es requerido')

    const searchParams = {
      search: searchTerm,
      ...this.cleanParams(params),
    }

    const response = await this.client.get(`${this.baseUrl}/search`, {
      params: searchParams,
    })
    return this.formatResponse(response)
  }

  // ===== MÉTODOS AUXILIARES =====

  /**
   * Limpiar parámetros vacíos
   * @param {Object} params - Parámetros a limpiar
   * @returns {Object} Parámetros limpios
   */
  cleanParams(params) {
    if (!params) return {}

    return Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== '' && value !== null && value !== undefined
      )
    )
  }

  /**
   * Formatear respuesta del servidor
   * @param {Object} response - Respuesta de axios
   * @returns {Object} Datos formateados
   */
  formatResponse(response) {
    // Si tiene estructura estándar con 'data'
    if (response.data && response.data.data !== undefined) {
      return {
        data: response.data.data,
        message: response.data.message,
        meta: response.data.meta || {},
      }
    }

    // Respuesta directa
    return {
      data: response.data,
      message: response.data?.message || 'Operación exitosa',
    }
  }

  /**
   * Validar archivo
   * @param {File} file - Archivo a validar
   * @returns {boolean} True si es válido
   */
  validateFile(file) {
    if (!file) return true

    if (file.size > API_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`El archivo ${file.name} excede el tamaño máximo de 10MB`)
    }

    if (!API_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido: ${file.type}`)
    }

    return true
  }

  /**
   * Descargar archivo
   * @param {string} url - URL del archivo
   * @param {string} filename - Nombre del archivo
   */
  async downloadFile(url, filename) {
    const response = await this.client.get(url, { responseType: 'blob' })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  }
}

export default BaseService
