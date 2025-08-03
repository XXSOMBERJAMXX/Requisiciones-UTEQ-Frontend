import React, { useState } from 'react'
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

  const comprasPeriodo = useComprasPorPeriodo(filters)
  const comprasDepartamentos = useComprasPorDepartamentos(filters)
  const filtrosConfig = useFiltrosConfigurables()
  const { exportarReporte, exporting, exportSuccess, exportError } =
    useExportacion()

  const currentData =
    activeTab === 'periodo' ? comprasPeriodo : comprasDepartamentos
  const loading = currentData.loading || filtrosConfig.loading

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
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'entregada'
              ? 'bg-green-800 text-green-100'
              : value === 'en_transito'
              ? 'bg-yellow-700 text-yellow-100'
              : value === 'ordenada'
              ? 'bg-blue-800 text-blue-100'
              : 'bg-slate-700 text-slate-100'
          }`}
        >
          {value || 'N/A'}
        </span>
      ),
    },
  ]

  const columnasDepartamentos = [
    { key: 'departamento', label: 'Departamento' },
    { key: 'codigo', label: 'Código' },
    { key: 'cantidad_compras', label: 'Cantidad Compras' },
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
  ]

  const handleExport = async (formato) => {
    try {
      await exportarReporte({
        tipo_reporte:
          activeTab === 'periodo' ? 'compras_periodo' : 'compras_departamentos',
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
        onChange={setFilters}
        availableFilters={[
          'dateRange',
          'department',
          'provider',
          'status',
          'period',
        ]}
        filtrosConfig={filtrosConfig.data}
        loading={filtrosConfig.loading}
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
      {!loading && !currentData.error && currentData.data && (
        <>
          {/* Tarjetas de resumen */}
          <SummaryCards
            data={
              currentData.data.resumen || currentData.data.resumen_general
            }
            type="compras"
          />

          {/* Gráfico de tendencia (solo para período) */}
          {activeTab === 'periodo' && currentData.data.tendencia_periodo && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-100">
                Tendencia por Período
              </h3>
              <TrendChart
                data={currentData.data.tendencia_periodo}
                xKey="periodo"
                yKey="monto_total"
                title="Evolución del Gasto"
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
            </h3>
            <DataTable
              data={
                activeTab === 'periodo'
                  ? currentData.data.compras || []
                  : currentData.data.compras_por_departamento || []
              }
              columns={
                activeTab === 'periodo'
                  ? columnasPeriodo
                  : columnasDepartamentos
              }
              loading={loading}
              emptyMessage={`No se encontraron compras ${
                activeTab === 'periodo'
                  ? 'en el período seleccionado'
                  : 'por departamentos'
              }`}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ComprasReports