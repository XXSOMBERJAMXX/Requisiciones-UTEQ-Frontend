import React, { useState } from 'react'
import { useSolicitudesPorEstatus, useCuellosBottella, useFiltrosConfigurables, useExportacion } from '../../hooks/useReportes'
import FiltersPanel from '../../components/filters/FiltersPanel'
import DataTable from '../../components/common/DataTable'
import PieChart from '../../components/charts/PieChart'
import ExportButtons from '../../components/common/ExportButtons'

const SolicitudesReports = () => {
  const [activeTab, setActiveTab] = useState('estatus')
  const [filters, setFilters] = useState({
    fecha_inicio: '2025-05-01',
    fecha_fin: '2025-07-30',
    incluir_tiempos: true,
    nivel_detalle: 'resumen',
    estatus: null,
    departamento_id: null,
    urgencia: null
  })

  // Hooks para datos
  const solicitudesEstatus = useSolicitudesPorEstatus(filters)
  const cuellosBottella = useCuellosBottella(filters)
  const filtrosConfig = useFiltrosConfigurables()
  const { exportarReporte, exporting, exportSuccess, exportError } = useExportacion()

  const currentData = activeTab === 'estatus' ? solicitudesEstatus : cuellosBottella
  const loading = currentData.loading || filtrosConfig.loading

  // Columnas para solicitudes por estatus
  const columnasSolicitudes = [
    { key: 'folio_solicitud', label: 'Folio' },
    { key: 'solicitante', label: 'Solicitante' },
    { key: 'departamento', label: 'Departamento' },
    { 
      key: 'fecha_creacion', 
      label: 'Fecha Creación',
      render: (value) => new Date(value).toLocaleDateString() 
    },
    { 
      key: 'estatus', 
      label: 'Estatus',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'completada' ? 'bg-green-800 text-green-100' :
          value === 'aprobada' ? 'bg-blue-800 text-blue-100' :
          value === 'en_proceso' ? 'bg-yellow-700 text-yellow-100' :
          value === 'pendiente' ? 'bg-orange-700 text-orange-100' :
          'bg-slate-700 text-slate-100'
        }`}>
          {value || 'N/A'}
        </span>
      )
    },
    { key: 'tipo_requisicion', label: 'Tipo' },
    { 
      key: 'urgencia', 
      label: 'Urgencia',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'critica' ? 'bg-red-800 text-red-100' :
          value === 'alta' ? 'bg-orange-700 text-orange-100' :
          value === 'media' ? 'bg-yellow-700 text-yellow-100' :
          'bg-green-800 text-green-100'
        }`}>
          {value || 'baja'}
        </span>
      )
    },
    { 
      key: 'tiempo_aprobacion_dias', 
      label: 'Días Aprobación',
      render: (value) => value ? `${value} días` : 'N/A'
    }
  ]

  // Columnas para cuellos de botella
  const columnasCuellos = [
    { key: 'aprobador', label: 'Aprobador' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'total_aprobaciones', label: 'Total Aprobaciones' },
    { 
      key: 'promedio_dias_respuesta', 
      label: 'Promedio Días',
      render: (value) => `${(value || 0).toFixed(1)} días`
    }
  ]

  // Columnas para solicitudes estancadas
  const columnasEstancadas = [
    { key: 'folio_solicitud', label: 'Folio' },
    { key: 'solicitante', label: 'Solicitante' },
    { key: 'departamento', label: 'Departamento' },
    { 
      key: 'fecha_creacion', 
      label: 'Fecha Creación',
      render: (value) => new Date(value).toLocaleDateString() 
    },
    { 
      key: 'dias_estancada', 
      label: 'Días Estancada',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value > 15 ? 'bg-red-800 text-red-100' :
          value > 7 ? 'bg-yellow-700 text-yellow-100' :
          'bg-green-800 text-green-100'
        }`}>
          {value} días
        </span>
      )
    },
    { key: 'estatus', label: 'Estatus' }
  ]

  const handleExport = async (formato) => {
    await exportarReporte({
      tipo_reporte: activeTab === 'estatus' ? 'solicitudes_estatus' : 'cuellos_botella',
      formato,
      parametros: filters,
      incluir_graficos: formato === 'pdf'
    })
  }

  const tabs = [
    { id: 'estatus', label: 'Por Estatus', icon: '📊' },
    { id: 'cuellos', label: 'Cuellos de Botella', icon: '⚠️' }
  ]

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Reportes de Solicitudes</h1>
        <p className="text-slate-400 mt-1">Análisis de solicitudes por estatus y identificación de cuellos de botella</p>
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

      {/* Panel de Filtros */}
      <FiltersPanel
        filters={filters}
        onChange={setFilters}
        availableFilters={
          activeTab === 'estatus' 
            ? ['dateRange', 'status', 'department', 'urgency', 'includeTimes'] 
            : ['dateRange', 'detailLevel']
        }
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
        </div>
      )}

      {/* Contenido principal */}
      {!loading && !currentData.error && currentData.data && (
        <>
          {/* Distribución por Estatus (solo en tab estatus) */}
          {activeTab === 'estatus' && currentData.data.distribucion_estatus && (
            <div className="gap-6">
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Distribución por Estatus
                </h3>
                <PieChart 
                  data={currentData.data.distribucion_estatus}
                  labelKey="estatus"
                  valueKey="cantidad"
                />
              </div>

              {/* Estadísticas de Tiempo */}
              {currentData.data.estadisticas_tiempo && (
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">
                    Estadísticas de Tiempo
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Promedio días aprobación:</span>
                      <span className="font-semibold text-slate-100">{currentData.data.estadisticas_tiempo.promedio_dias_aprobacion} días</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Solicitudes con aprobación:</span>
                      <span className="font-semibold text-slate-100">{currentData.data.estadisticas_tiempo.solicitudes_con_aprobacion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tiempo mínimo:</span>
                      <span className="font-semibold text-slate-100">{currentData.data.estadisticas_tiempo.tiempo_minimo} días</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tiempo máximo:</span>
                      <span className="font-semibold text-slate-100">{currentData.data.estadisticas_tiempo.tiempo_maximo} días</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recomendaciones (solo en cuellos de botella) */}
          {activeTab === 'cuellos' && currentData.data.recomendaciones && (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                💡 Recomendaciones
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {currentData.data.recomendaciones.map((rec, index) => (
                  <li key={index} className="text-yellow-200">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botones de exportación */}
          <ExportButtons
            onExport={handleExport}
            loading={exporting}
            success={exportSuccess}
            error={exportError}
          />

          {/* Tablas de datos */}
          <div className="space-y-6">
            {/* Tabla principal */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                {activeTab === 'estatus' ? 'Solicitudes Detalladas' : 'Cuellos de Botella'}
              </h3>
              
              <DataTable
                data={activeTab === 'estatus' 
                  ? currentData.data.solicitudes || []
                  : currentData.data.cuellos_botella || []
                }
                columns={activeTab === 'estatus' ? columnasSolicitudes : columnasCuellos}
                loading={loading}
                emptyMessage={`No se encontraron ${activeTab === 'estatus' ? 'solicitudes' : 'cuellos de botella'}`}
              />
            </div>

            {/* Tabla de solicitudes estancadas (solo en cuellos de botella) */}
            {activeTab === 'cuellos' && currentData.data.solicitudes_estancadas && currentData.data.solicitudes_estancadas.length > 0 && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  🚨 Solicitudes Estancadas
                </h3>
                
                <DataTable
                  data={currentData.data.solicitudes_estancadas}
                  columns={columnasEstancadas}
                  loading={loading}
                  emptyMessage="No hay solicitudes estancadas"
                />
              </div>
            )}

            {/* Análisis por etapas (solo en cuellos de botella) */}
            {activeTab === 'cuellos' && currentData.data.analisis_etapas && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  📈 Análisis por Etapas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentData.data.analisis_etapas.map((etapa, index) => (
                    <div key={index} className="bg-slate-700 rounded-lg border border-slate-600 p-4">
                      <h4 className="font-medium text-slate-100 capitalize">{etapa.etapa}</h4>
                      <p className="text-2xl font-bold text-blue-400 mt-2">{etapa.cantidad_solicitudes}</p>
                      <p className="text-sm text-slate-400">
                        Promedio: {etapa.promedio_dias_etapa} días
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SolicitudesReports