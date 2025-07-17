// ===== ARCHIVO: src/api/config.js =====
import axios from 'axios'

// ===== CONFIGURACIÓN GLOBAL =====
const API_CONFIG = {
  BASE_URL: 'http://10.13.0.136:3000',
  TIMEOUT: 15000, // 15 segundos
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  STORAGE_KEYS: {
    TOKEN: 'requisiciones-uteq-token',
    USER: 'requisiciones-uteq-user',
  },
}

// ===== INSTANCIA BASE DE AXIOS =====
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== EXPORTACIONES =====
export { apiClient, API_CONFIG }
export default apiClient