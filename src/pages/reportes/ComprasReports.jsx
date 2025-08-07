import React, { useState, useEffect, useMemo } from 'react'
import {
  useComprasPorPeriodo,
  useComprasPorDepartamentos,
  useFiltrosConfigurables,
  useExportacion,
} from '../../hooks/useReportes'
import FiltersPanel from '../../components/filters/FiltersPanel'
import DataTable from '../../components/common/DataTable'
import SummaryCards from '../../components/common/SummaryCards'
import TrendChart from '../../components/charts/TrendChart'
import ExportButtons from '../../components/common/ExportButtons'

const ComprasReports = () => {
  const [activeTab, setActiveTab] = useState('periodo')
  const [filters, setFilters] = useState({
    fecha_inicio: '2025-05-01',
    fecha_fin: '2025-07-30',
    departamento_id: null,
    proveedor_id: null,
    estatus: null,
    periodo: 'mensual',
  })

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Hooks para obtener datos
  const comprasPeriodo = useComprasPorPeriodo(filters, {
    autoFetch: !!(filters.fecha_inicio && filters.fecha_fin),
  })
  const comprasDepartamentos = useComprasPorDepartamentos(filters, {
    autoFetch: !!(filters.fecha_inicio && filters.fecha_fin),
  })
  const filtrosConfig = useFiltrosConfigurables()
  const { exportarReporte, exporting, exportSuccess, exportError } = useExportacion()

  // Refrescar datos cuando cambien filtros críticos
  useEffect(() => {
    if (filters.fecha_inicio && filters.fecha_fin) {
      if (activeTab === 'periodo') {
        comprasPeriodo.refetch()
      } else {
        comprasDepartamentos.refetch()
      }
    }
  }, [filters.estatus, filters.departamento_id, filters.proveedor_id, activeTab])

  const currentData = activeTab === 'periodo' ? comprasPeriodo : comprasDepartamentos
  const loading = currentData.loading || filtrosConfig.loading
  
  // Configuración de filtros con fallback
  const filtrosConfigEstaticos = useMemo(() => {
    if (!filtrosConfig.data) {
      return {
        departamentos: [],
        proveedores: [],
        usuarios: [],
        opciones_estatus: {
          compras: ['ordenada', 'en_transito', 'entregada', 'cancelada'],
          solicitudes: ['pendiente', 'en_revision', 'aprobada', 'denegada']
        },
        opciones_urgencia: ['baja', 'media', 'alta', 'critica'],
        opciones_tipo_requisicion: ['productos', 'servicios', 'mantenimiento'],
        opciones_periodo: ['hoy', 'semana', 'mes', 'trimestre', 'año'],
        opciones_criterio_ranking: ['volumen', 'frecuencia', 'calificacion'],
        formatos_exportacion: ['pdf', 'xlsx', 'csv']
      }
    }
    return filtrosConfig.data
  }, [filtrosConfig.data])

  // Filtrar datos por estatus si es necesario
  const getDatosFiltrados = () => {
    if (!currentData.data) return null

    let compras = currentData.data.compras || []
    
    if (filters.estatus && filters.estatus !== 'todos') {
      compras = compras.filter(compra => compra.estatus === filters.estatus)
    }

    return {
      ...currentData.data,
      compras
    }
  }

  const datosFiltrados = getDatosFiltrados()

  // Generar resumen estandarizado
  const getResumenEstandarizado = () => {
    if (!datosFiltrados) return null

    if (activeTab === 'periodo') {
      const compras = datosFiltrados.compras || []
      const totalCompras = compras.reduce((sum, c) => sum + c.monto_total, 0)
      const cantidadCompras = compras.length
      const promedioCompra = cantidadCompras > 0 ? totalCompras / cantidadCompras : 0

      return {
        gasto_total: totalCompras,
        numero_compras: cantidadCompras,
        promedio_compra: promedioCompra,
        variacion_periodo: 0,
      }
    } else {
      const resumenGeneral = datosFiltrados.resumen_general || {}
      return {
        gasto_total: resumenGeneral.monto_total_global || 0,
        numero_compras: resumenGeneral.cantidad_total_compras || 0,
        promedio_compra: 
          resumenGeneral.cantidad_total_compras > 0 
            ? resumenGeneral.monto_total_global / resumenGeneral.cantidad_total_compras 
            : 0,
        departamentos_activos: datosFiltrados.total_departamentos || 0,
      }
    }
  }

  // Generar datos para gráficos
  const getChartData = () => {
    if (!datosFiltrados) return null

    if (activeTab === 'periodo') {
      // Para datos filtrados por estatus, recalcular tendencia
      if (filters.estatus && filters.estatus !== 'todos') {
        const comprasFiltradas = datosFiltrados.compras || []
        const tendenciaPorPeriodo = {}
        
        comprasFiltradas.forEach(compra => {
          const fecha = new Date(compra.fecha_compra)
          const periodo = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
          
          if (!tendenciaPorPeriodo[periodo]) {
            tendenciaPorPeriodo[periodo] = {
              periodo,
              cantidad_compras: 0,
              monto_total: 0
            }
          }
          
          tendenciaPorPeriodo[periodo].cantidad_compras++
          tendenciaPorPeriodo[periodo].monto_total += compra.monto_total
        })

        const tendenciaArray = Object.values(tendenciaPorPeriodo).map(t => ({
          ...t,
          promedio_compra: t.cantidad_compras > 0 ? t.monto_total / t.cantidad_compras : 0
        }))

        return tendenciaArray.length > 0 ? tendenciaArray : datosFiltrados.tendencia_periodo
      }
      
      return datosFiltrados.tendencia_periodo
    } else {
      // Para departamentos, crear datos de gráfico de barras
      return datosFiltrados.compras_por_departamento?.slice(0, 10).map(dept => ({
        periodo: dept.departamento,
        monto_total: dept.monto_total,
        cantidad_compras: dept.cantidad_compras
      }))
    }
  }

  // Generar configuración dinámica de estatus desde backend
  const getStatusConfig = useMemo(() => {
    const statusesFromBackend = filtrosConfigEstaticos?.opciones_estatus?.compras || []
    
    const statusConfig = {}
    const statusLabels = {}
    
    statusesFromBackend.forEach(status => {
      switch (status) {
        case 'entregada':
        case 'completada':
          statusConfig[status] = 'bg-green-800 text-green-100'
          statusLabels[status] = 'Entregada'
          break
        case 'en_transito':
        case 'en_proceso':
          statusConfig[status] = 'bg-yellow-700 text-yellow-100'
          statusLabels[status] = 'En Tránsito'
          break
        case 'ordenada':
        case 'pendiente':
        case 'en_revision':
          statusConfig[status] = 'bg-blue-800 text-blue-100'
          statusLabels[status] = status === 'ordenada' ? 'Ordenada' : 
                                status === 'pendiente' ? 'Pendiente' : 'En Revisión'
          break
        case 'cancelada':
        case 'denegada':
          statusConfig[status] = 'bg-red-800 text-red-100'
          statusLabels[status] = status === 'cancelada' ? 'Cancelada' : 'Denegada'
          break
        case 'aprobada':
          statusConfig[status] = 'bg-emerald-800 text-emerald-100'
          statusLabels[status] = 'Aprobada'
          break
        default:
          statusConfig[status] = 'bg-slate-700 text-slate-100'
          statusLabels[status] = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
      }
    })

    return { statusConfig, statusLabels }
  }, [filtrosConfigEstaticos?.opciones_estatus?.compras])

  // Configuración de columnas para período
  const columnasPeriodo = [
    {
      key: 'numero_orden',
      label: 'Número de Orden',
      render: (value) => value || 'N/A',
    },
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'solicitante', label: 'Solicitante' },
    {
      key: 'fecha_compra',
      label: 'Fecha',
      render: (value) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
    {
      key: 'monto_total',
      label: 'Monto',
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      key: 'estatus',
      label: 'Estatus',
      render: (value) => {
        const { statusConfig, statusLabels } = getStatusConfig

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusConfig[value] || 'bg-slate-700 text-slate-100'
            }`}
          >
            {statusLabels[value] || value || 'N/A'}
          </span>
        )
      },
    },
  ]

  // Configuración de columnas para departamentos
  const columnasDepartamentos = [
    { key: 'departamento', label: 'Departamento' },
    { key: 'codigo', label: 'Código' },
    { 
      key: 'cantidad_compras', 
      label: 'Cantidad Compras',
      render: (value) => parseInt(value || 0).toLocaleString()
    },
    {
      key: 'monto_total',
      label: 'Monto Total',
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      key: 'promedio_compra',
      label: 'Promedio por Compra',
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      key: 'porcentaje_total',
      label: '% del Total',
      render: (value, row) => {
        const resumenGeneral = currentData.data?.resumen_general
        if (!resumenGeneral?.monto_total_global) return '0%'
        const porcentaje = (row.monto_total / resumenGeneral.monto_total_global * 100).toFixed(1)
        return `${porcentaje}%`
      }
    }
  ]

  const handleExport = async (formato) => {
    try {
      await exportarReporte({
        tipo_reporte: activeTab === 'periodo' ? 'compras_periodo' : 'compras_departamentos',
        formato,
        parametros: filters,
        incluir_graficos: formato === 'pdf',
      })
    } catch (error) {
      console.error('Error al exportar:', error)
    }
  }

  const tabs = [
    { id: 'periodo', label: 'Por Período', icon: '📅' },
    { id: 'departamentos', label: 'Por Departamentos', icon: '🏢' },
  ]

  const resumenEstandarizado = getResumenEstandarizado()
  const chartData = getChartData()

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Reportes de Compras</h1>
        <p className="text-slate-400 mt-1">
          Análisis detallado de compras por período y departamentos
        </p>
      </div>

      {/* Navegación por tabs */}
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Panel de filtros */}
      <FiltersPanel
        filters={filters}
        onChange={handleFiltersChange}
        availableFilters={['dateRange', 'department', 'status', 'period']}
        filtrosConfig={filtrosConfigEstaticos}
        loading={filtrosConfig.loading}
        statusOptions={filtrosConfigEstaticos?.opciones_estatus?.compras || []}
        departmentOptions={filtrosConfigEstaticos?.departamentos || []}
      />

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-slate-300">Cargando datos...</span>
        </div>
      )}

      {/* Estado de error */}
      {currentData.error && (
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div className="text-red-200">
            <h3 className="text-sm font-medium">Error al cargar los datos</h3>
            <p className="mt-1 text-sm">{currentData.error}</p>
          </div>
          <button
            onClick={currentData.refetch}
            className="mt-3 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Contenido principal */}
      {!loading && !currentData.error && datosFiltrados && (
        <>
          {/* Tarjetas de resumen */}
          {resumenEstandarizado && (
            <SummaryCards
              data={resumenEstandarizado}
              type="compras"
              activeTab={activeTab}
            />
          )}

          {/* Gráfico */}
          {chartData && chartData.length > 0 && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-100">
                {activeTab === 'periodo' 
                  ? 'Tendencia por Período' 
                  : 'Distribución por Departamento (Top 10)'
                }
              </h3>
              <TrendChart
                data={chartData}
                xKey="periodo"
                yKey="monto_total"
                title={activeTab === 'periodo' 
                  ? 'Evolución del Gasto' 
                  : 'Gasto por Departamento'
                }
                chartType={activeTab === 'periodo' ? 'line' : 'bar'}
              />
            </div>
          )}

          {/* Botones de exportación */}
          <ExportButtons
            onExport={handleExport}
            loading={exporting}
            success={exportSuccess}
            error={exportError}
          />

          {/* Tabla de datos */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-100">
              {activeTab === 'periodo'
                ? 'Compras Detalladas'
                : 'Compras por Departamento'}
              {filters.estatus && filters.estatus !== 'todos' && (
                <span className="text-sm text-blue-300 ml-2">
                  (Filtrado por: {filters.estatus})
                </span>
              )}
            </h3>
            <DataTable
              data={
                activeTab === 'periodo'
                  ? datosFiltrados.compras || []
                  : datosFiltrados.compras_por_departamento || []
              }
              columns={activeTab === 'periodo' ? columnasPeriodo : columnasDepartamentos}
              loading={loading}
              emptyMessage={`No se encontraron compras ${
                activeTab === 'periodo'
                  ? 'en el período seleccionado'
                  : 'por departamentos'
              }${filters.estatus ? ` con estatus: ${filters.estatus}` : ''}`}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ComprasReports