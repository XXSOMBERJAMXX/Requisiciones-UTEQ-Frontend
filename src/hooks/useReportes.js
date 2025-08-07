import { useState, useEffect, useCallback, useRef } from 'react'
import reportesService from '../services/reportesService'

export const useReportes = (fetcher, dependencies = [], options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const abortControllerRef = useRef(null)
  const {
    autoFetch = false,
    onSuccess,
    onError,
  } = options

  const fetchData = async (params = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    try {
      setLoading(true)
      setError(null)

      abortControllerRef.current = new AbortController()

      const freshParams = {
        ...params,
        _t: Date.now(),
      }

      const result = await fetcher(freshParams)

      setData(result.data)
      onSuccess?.(result.data)

      return result.data
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Error al cargar el reporte')
        onError?.(err)
      }
      throw err
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const refetch = () => {
    return fetchData()
  }

  const clearData = () => {
    setData(null)
    setError(null)
  }

  useEffect(() => {
    // 🔧 CORREGIDO: Si autoFetch es true, fetchear independientemente de dependencies
    if (autoFetch) {
      // Solo verificar dependencies si no está vacío
      if (dependencies.length === 0 || dependencies.some((dep) => dep !== null && dep !== undefined)) {
        fetchData()
      }
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, dependencies)

  return {
    data,
    loading,
    error,
    fetchData,
    refetch,
    clearData,
  }
}

export const useComprasPorPeriodo = (filters = {}, options = {}) => {
  const { fecha_inicio, fecha_fin, ...otherFilters } = filters

  return useReportes(
    (params) => reportesService.getComprasPorPeriodo({ ...filters, ...params }),
    [fecha_inicio, fecha_fin, JSON.stringify(otherFilters)],
    {
      autoFetch: !!(fecha_inicio && fecha_fin),
      ...options,
    }
  )
}

export const useComprasPorDepartamentos = (filters = {}, options = {}) => {
  const { fecha_inicio, fecha_fin, ...otherFilters } = filters

  return useReportes(
    (params) =>
      reportesService.getComprasPorDepartamentos({ ...filters, ...params }),
    [fecha_inicio, fecha_fin, JSON.stringify(otherFilters)],
    {
      autoFetch: !!(fecha_inicio && fecha_fin),
      ...options,
    }
  )
}

export const useRankingProveedores = (filters = {}, options = {}) => {
  const {
    fecha_inicio,
    fecha_fin,
    criterio = 'volumen',
    limite = 10,
    ...otherFilters
  } = filters

  return useReportes(
    (params) =>
      reportesService.getRankingProveedores({
        fecha_inicio,
        fecha_fin,
        criterio,
        limite,
        ...otherFilters,
        ...params,
      }),
    [fecha_inicio, fecha_fin, criterio, limite, JSON.stringify(otherFilters)],
    {
      autoFetch: !!(fecha_inicio && fecha_fin),
      ...options,
    }
  )
}

export const useCumplimientoEntregas = (filters = {}, options = {}) => {
  const { fecha_inicio, fecha_fin, ...otherFilters } = filters

  return useReportes(
    (params) =>
      reportesService.getCumplimientoEntregas({ ...filters, ...params }),
    [fecha_inicio, fecha_fin, JSON.stringify(otherFilters)],
    {
      autoFetch: !!(fecha_inicio && fecha_fin),
      ...options,
    }
  )
}

export const useSolicitudesPorEstatus = (filters = {}, options = {}) => {
  const {
    fecha_inicio,
    fecha_fin,
    incluir_tiempos = false,
    ...otherFilters
  } = filters

  return useReportes(
    (params) =>
      reportesService.getSolicitudesPorEstatus({
        fecha_inicio,
        fecha_fin,
        incluir_tiempos,
        ...otherFilters,
        ...params,
      }),
    [fecha_inicio, fecha_fin, incluir_tiempos, JSON.stringify(otherFilters)],
    {
      autoFetch: !!(fecha_inicio && fecha_fin),
      ...options,
    }
  )
}

export const useCuellosBottella = (filters = {}, options = {}) => {
  const {
    fecha_inicio,
    fecha_fin,
    nivel_detalle = 'resumen',
    ...otherFilters
  } = filters

  return useReportes(
    (params) =>
      reportesService.getCuellosBottella({
        fecha_inicio,
        fecha_fin,
        nivel_detalle,
        ...otherFilters,
        ...params,
      }),
    [fecha_inicio, fecha_fin, nivel_detalle, JSON.stringify(otherFilters)],
    {
      autoFetch: !!(fecha_inicio && fecha_fin),
      ...options,
    }
  )
}

export const useDashboardEjecutivo = (periodo = 'mes', options = {}) => {
  return useReportes(
    () => reportesService.getDashboardEjecutivo(periodo),
    [periodo],
    {
      autoFetch: true,
      ...options,
    }
  )
}

export const useFiltrosConfigurables = (options = {}) => {
  return useReportes(() => reportesService.getFiltrosConfigurables(), [], {
    autoFetch: true,
    ...options,
  })
}

export const useExportacion = () => {
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [exportSuccess, setExportSuccess] = useState(false)

  const exportarReporte = useCallback(async (config) => {
    try {
      setExporting(true)
      setExportError(null)
      setExportSuccess(false)

      await reportesService.exportarReporte(config)

      setExportSuccess(true)

      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      setExportError(error.message || 'Error al exportar el reporte')
    } finally {
      setExporting(false)
    }
  }, [])

  const exportarBasico = useCallback(async (config) => {
    try {
      setExporting(true)
      setExportError(null)
      setExportSuccess(false)

      await reportesService.exportarBasico(config)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      setExportError(error.message || 'Error al exportar el reporte')
    } finally {
      setExporting(false)
    }
  }, [])

  const clearExportState = useCallback(() => {
    setExportError(null)
    setExportSuccess(false)
  }, [])

  return {
    exporting,
    exportError,
    exportSuccess,
    exportarReporte,
    exportarBasico,
    clearExportState,
  }
}

export const useMultipleReports = (reportConfigs = []) => {
  const [reports, setReports] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAllReports = useCallback(async () => {
    if (reportConfigs.length === 0) return

    try {
      setLoading(true)
      setError(null)

      const promises = reportConfigs.map(async ({ key, fetcher, params }) => {
        try {
          const result = await fetcher(params || {})
          return { key, data: result.data, error: null }
        } catch (err) {
          return { key, data: null, error: err.message }
        }
      })

      const results = await Promise.all(promises)

      const reportsData = {}
      results.forEach(({ key, data, error }) => {
        reportsData[key] = { data, error, loading: false }
      })

      setReports(reportsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(reportConfigs)])

  useEffect(() => {
    if (reportConfigs.length > 0) {
      fetchAllReports()
    }
  }, [fetchAllReports])

  return {
    reports,
    loading,
    error,
    refetch: fetchAllReports,
  }
}

export const useFechasComunes = () => {
  const getUltimoCuatrimestre = useCallback(() => {
    return reportesService.getUltimoCuatrimestre()
  }, [])

  const getMesActual = useCallback(() => {
    return reportesService.getMesActual()
  }, [])

  const getUltimaSemana = useCallback(() => {
    return reportesService.getUltimaSemana()
  }, [])

  const getUltimosTresMeses = useCallback(() => {
    const now = new Date()
    const treeMesesAtras = new Date(now.getFullYear(), now.getMonth() - 3, 1)

    return {
      fecha_inicio: treeMesesAtras.toISOString().slice(0, 10),
      fecha_fin: now.toISOString().slice(0, 10),
    }
  }, [])

  const getRangoPersonalizado = useCallback((dias) => {
    const now = new Date()
    const fechaInicio = new Date(now.getTime() - dias * 24 * 60 * 60 * 1000)

    return {
      fecha_inicio: fechaInicio.toISOString().slice(0, 10),
      fecha_fin: now.toISOString().slice(0, 10),
    }
  }, [])

  const validarRango = useCallback((fechaInicio, fechaFin) => {
    try {
      return reportesService.validarRangoFechas(fechaInicio, fechaFin)
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }, [])

  return {
    getUltimoCuatrimestre,
    getMesActual,
    getUltimaSemana,
    getUltimosTresMeses,
    getRangoPersonalizado,
    validarRango,
    calcularFechasPorPeriodo: reportesService.calcularFechasPorPeriodo,
    rangos: {
      ultimoCuatrimestre: getUltimoCuatrimestre(),
      mesActual: getMesActual(),
      ultimaSemana: getUltimaSemana(),
      ultimosTresMeses: getUltimosTresMeses(),
    },
  }
}

export const useDashboardComplete = (periodo = 'mes') => {
  const fechas = useFechasComunes()
  const fechasPeriodo =
    fechas.calcularFechasPorPeriodo?.(periodo) || fechas.rangos.mesActual

  const dashboard = useDashboardEjecutivo(periodo, {
    autoFetch: false,
    onError: (error) => console.error('Dashboard error:', error),
  })

  const comprasRecientes = useComprasPorPeriodo(fechasPeriodo, {
    autoFetch: false,
  })

  const solicitudesPendientes = useSolicitudesPorEstatus(
    {
      ...fechasPeriodo,
      estatus: 'pendiente',
    },
    { autoFetch: false }
  )

  const refreshAll = async () => {
    dashboard.clearData()
    comprasRecientes.clearData()
    solicitudesPendientes.clearData()

    await Promise.all([
      dashboard.fetchData(),
      comprasRecientes.fetchData(),
      solicitudesPendientes.fetchData(),
    ])
  }

  useEffect(() => {
    refreshAll()
  }, [periodo])

  const loading =
    dashboard.loading ||
    comprasRecientes.loading ||
    solicitudesPendientes.loading
  const error =
    dashboard.error || comprasRecientes.error || solicitudesPendientes.error

  return {
    dashboard: dashboard.data,
    comprasRecientes: comprasRecientes.data,
    solicitudesPendientes: solicitudesPendientes.data,
    loading,
    error,
    refreshAll,
    isDashboardStale: loading,
    debug: {
      periodo,
      fechasPeriodo,
      dashboardLoading: dashboard.loading,
      comprasLoading: comprasRecientes.loading,
      solicitudesLoading: solicitudesPendientes.loading,
    },
  }
}