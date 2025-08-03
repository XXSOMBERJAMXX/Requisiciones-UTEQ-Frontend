import BaseService from './api/BaseService'
import { cleanParams, downloadBlob } from './api/interceptors'

class ReportesService extends BaseService {
  constructor() {
    super('/reportes')
  }

  async getFiltrosConfigurables() {
    const response = await this.client.get(
      `${this.baseUrl}/filtros/configurables`
    )
    return this.formatResponse(response)
  }

  async getComprasPorPeriodo(params) {
    if (!params.fecha_inicio || !params.fecha_fin) {
      throw new Error('Fecha de inicio y fin son requeridas')
    }

    const cleanedParams = cleanParams(params)
    const response = await this.client.get(`${this.baseUrl}/compras/periodo`, {
      params: cleanedParams,
    })
    return this.formatResponse(response)
  }

  async getComprasPorDepartamentos(params) {
    if (!params.fecha_inicio || !params.fecha_fin) {
      throw new Error('Fecha de inicio y fin son requeridas')
    }

    const cleanedParams = cleanParams(params)
    const response = await this.client.get(
      `${this.baseUrl}/compras/departamentos`,
      {
        params: cleanedParams,
      }
    )
    return this.formatResponse(response)
  }

  async getCompras(params) {
    return this.getComprasPorPeriodo(params)
  }

  async getRankingProveedores(params) {
    if (!params.fecha_inicio || !params.fecha_fin) {
      throw new Error('Fecha de inicio y fin son requeridas')
    }

    const defaultParams = {
      criterio: 'volumen',
      limite: 10,
      ...params,
    }

    const cleanedParams = cleanParams(defaultParams)
    const response = await this.client.get(
      `${this.baseUrl}/proveedores/ranking`,
      {
        params: cleanedParams,
      }
    )
    return this.formatResponse(response)
  }

  async getCumplimientoEntregas(params) {
    if (!params.fecha_inicio || !params.fecha_fin) {
      throw new Error('Fecha de inicio y fin son requeridas')
    }

    const cleanedParams = cleanParams(params)
    const response = await this.client.get(
      `${this.baseUrl}/entregas/cumplimiento`,
      {
        params: cleanedParams,
      }
    )
    return this.formatResponse(response)
  }

  async getSolicitudesPorEstatus(params) {
    if (!params.fecha_inicio || !params.fecha_fin) {
      throw new Error('Fecha de inicio y fin son requeridas')
    }

    const cleanedParams = cleanParams(params)
    const response = await this.client.get(
      `${this.baseUrl}/solicitudes/estatus`,
      {
        params: cleanedParams,
      }
    )
    return this.formatResponse(response)
  }

  async getSolicitudes(params) {
    return this.getSolicitudesPorEstatus(params)
  }

  async getCuellosBottella(params) {
    if (!params.fecha_inicio || !params.fecha_fin) {
      throw new Error('Fecha de inicio y fin son requeridas')
    }

    const defaultParams = {
      nivel_detalle: 'resumen',
      ...params,
    }

    const cleanedParams = cleanParams(defaultParams)
    const response = await this.client.get(
      `${this.baseUrl}/solicitudes/cuellos-botella`,
      {
        params: cleanedParams,
      }
    )
    return this.formatResponse(response)
  }

  async getDashboardEjecutivo(periodo = 'mes') {
    const response = await this.client.get(
      `${this.baseUrl}/dashboard/ejecutivo`,
      {
        params: { periodo },
      }
    )
    return this.formatResponse(response)
  }

  async getDashboard(periodo = 'mes') {
    return this.getDashboardEjecutivo(periodo)
  }

  async exportarReporte(config) {
    if (!config.tipo_reporte || !config.formato) {
      throw new Error('Tipo de reporte y formato son requeridos')
    }

    const response = await this.client.post(
      `${this.baseUrl}/exportar`,
      config,
      {
        responseType: 'blob',
      }
    )

    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `${config.tipo_reporte}_${timestamp}.${config.formato}`

    if (response.data) {
      downloadBlob(response.data, filename)
    }

    return response.data
  }

  async exportarBasico(config) {
    const response = await this.client.post(
      `${this.baseUrl}/exportar/basico`,
      config,
      {
        responseType: 'blob',
      }
    )

    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `${config.tipoReporte}_${timestamp}.${config.formato}`

    if (response.data) {
      downloadBlob(response.data, filename)
    }

    return response.data
  }

  getUltimoCuatrimestre() {
    const now = new Date()
    const cuatroMesesAtras = new Date(now.getFullYear(), now.getMonth() - 4, 1)
    
    return {
      fecha_inicio: cuatroMesesAtras.toISOString().slice(0, 10),
      fecha_fin: now.toISOString().slice(0, 10),
    }
  }

  getMesActual() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')

    return {
      fecha_inicio: `${year}-${month}-01`,
      fecha_fin: now.toISOString().slice(0, 10),
    }
  }

  getUltimaSemana() {
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    return {
      fecha_inicio: lastWeek.toISOString().slice(0, 10),
      fecha_fin: now.toISOString().slice(0, 10),
    }
  }

  calcularFechasPorPeriodo(periodo) {
    const now = new Date()
    const today = now.toISOString().slice(0, 10)

    switch (periodo) {
      case 'hoy':
      case 'today':
        return {
          fecha_inicio: today,
          fecha_fin: today,
        }

      case 'semana':
      case 'week':
      case 'ultimos_7_dias':
        return this.getUltimaSemana()

      case 'ultimos_15_dias':
      case '15_dias': {
        const quinceDiasAtras = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        return {
          fecha_inicio: quinceDiasAtras.toISOString().slice(0, 10),
          fecha_fin: today,
        }
      }

      case 'ultimos_30_dias':
      case '30_dias': {
        const treintaDiasAtras = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return {
          fecha_inicio: treintaDiasAtras.toISOString().slice(0, 10),
          fecha_fin: today,
        }
      }

      case 'mes':
      case 'month':
      case 'mes_actual':
        return this.getMesActual()

      case 'ultimo_mes': {
        const primerDiaUltimoMes = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const ultimoDiaUltimoMes = new Date(now.getFullYear(), now.getMonth(), 0)
        return {
          fecha_inicio: primerDiaUltimoMes.toISOString().slice(0, 10),
          fecha_fin: ultimoDiaUltimoMes.toISOString().slice(0, 10),
        }
      }

      case 'ultimos_2_meses':
      case '2_meses': {
        const dosMesesAtras = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        return {
          fecha_inicio: dosMesesAtras.toISOString().slice(0, 10),
          fecha_fin: today,
        }
      }

      case 'ultimos_3_meses':
      case '3_meses':
      case 'trimestre_actual': {
        const tresMesesAtras = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        return {
          fecha_inicio: tresMesesAtras.toISOString().slice(0, 10),
          fecha_fin: today,
        }
      }

      case 'trimestre':
      case 'quarter': {
        const mesActual = now.getMonth()
        let inicioTrimestre
        
        if (mesActual >= 0 && mesActual <= 2) {
          inicioTrimestre = new Date(now.getFullYear(), 0, 1)
        } else if (mesActual >= 3 && mesActual <= 5) {
          inicioTrimestre = new Date(now.getFullYear(), 3, 1)
        } else if (mesActual >= 6 && mesActual <= 8) {
          inicioTrimestre = new Date(now.getFullYear(), 6, 1)
        } else {
          inicioTrimestre = new Date(now.getFullYear(), 9, 1)
        }
        
        return {
          fecha_inicio: inicioTrimestre.toISOString().slice(0, 10),
          fecha_fin: today,
        }
      }

      case 'ultimos_6_meses':
      case '6_meses':
      case 'semestre': {
        const seisMesesAtras = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        return {
          fecha_inicio: seisMesesAtras.toISOString().slice(0, 10),
          fecha_fin: today,
        }
      }

      case 'año':
      case 'year':
      case 'año_actual':
      case 'anio':
      case 'anio_actual':
        return {
          fecha_inicio: `${now.getFullYear()}-01-01`,
          fecha_fin: today,
        }

      case 'ultimo_año':
      case 'ultimo_anio':
      case 'last_year': {
        const añoAnterior = now.getFullYear() - 1
        return {
          fecha_inicio: `${añoAnterior}-01-01`,
          fecha_fin: `${añoAnterior}-12-31`,
        }
      }

      case 'ultimos_12_meses':
      case '12_meses': {
        const doceMesesAtras = new Date(now.getFullYear(), now.getMonth() - 12, 1)
        return {
          fecha_inicio: doceMesesAtras.toISOString().slice(0, 10),
          fecha_fin: today,
        }
      }

      case 'cuatrimestre':
      case 'ultimos_4_meses':
      case '4_meses':
        return this.getUltimoCuatrimestre()

      case 'todo':
      case 'all':
      case 'sin_limite': {
        const dosAñosAtras = new Date(now.getFullYear() - 2, 0, 1)
        return {
          fecha_inicio: dosAñosAtras.toISOString().slice(0, 10),
          fecha_fin: today,
        }
      }

      default:
        return this.getMesActual()
    }
  }

  validarRangoFechas(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) {
      throw new Error('Ambas fechas son requeridas')
    }

    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)

    if (inicio > fin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin')
    }

    const diferenciaDias = (fin - inicio) / (1000 * 60 * 60 * 24)
    if (diferenciaDias > 730) {
      throw new Error('El rango de fechas no puede exceder 2 años')
    }

    return true
  }

  async getVariacionPrecios(params) {
    try {
      const response = await this.client.get(
        `${this.baseUrl}/precios/variacion`,
        {
          params: cleanParams(params),
        }
      )
      return this.formatResponse(response)
    } catch (error) {
      if (error.status === 501) {
        throw new Error(
          'Funcionalidad en desarrollo. Estará disponible próximamente.'
        )
      }
      throw error
    }
  }

  async getSolicitudesPorDepartamentos(params) {
    try {
      const response = await this.client.get(
        `${this.baseUrl}/solicitudes/departamentos`,
        {
          params: cleanParams(params),
        }
      )
      return this.formatResponse(response)
    } catch (error) {
      if (error.status === 501) {
        throw new Error(
          'Funcionalidad en desarrollo. Estará disponible próximamente.'
        )
      }
      throw error
    }
  }

  async getSolicitudesDenegadas(params) {
    try {
      const response = await this.client.get(
        `${this.baseUrl}/solicitudes/denegadas`,
        {
          params: cleanParams(params),
        }
      )
      return this.formatResponse(response)
    } catch (error) {
      if (error.status === 501) {
        throw new Error(
          'Funcionalidad en desarrollo. Estará disponible próximamente.'
        )
      }
      throw error
    }
  }
}

const reportesService = new ReportesService()

export default reportesService
export { ReportesService }