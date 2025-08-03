import React, { useState } from 'react'
import { useExportacion, useFiltrosConfigurables, useFechasComunes } from '../../hooks/useReportes'

const ExportCenter = () => {
  const [exportConfig, setExportConfig] = useState({
    tipo_reporte: 'compras_periodo',
    formato: 'pdf',
    parametros: {
      fecha_inicio: '2025-05-01',
      fecha_fin: '2025-07-30'
    },
    incluir_graficos: true
  })

  const [exportHistory, setExportHistory] = useState([])
  
  const { exportarReporte, exporting, exportSuccess, exportError, clearExportState } = useExportacion()
  const filtrosConfig = useFiltrosConfigurables()
  const { rangos } = useFechasComunes()

  const tiposReporte = [
    { value: 'compras_periodo', label: 'Compras por Período', icon: '📅' },
    { value: 'compras_departamentos', label: 'Compras por Departamentos', icon: '🏢' },
    { value: 'cumplimiento_entregas', label: 'Cumplimiento de Entregas', icon: '📋' },
    { value: 'solicitudes_estatus', label: 'Solicitudes por Estatus', icon: '📊' },
    { value: 'cuellos_botella', label: 'Cuellos de Botella', icon: '⚠️' },
    { value: 'dashboard_ejecutivo', label: 'Dashboard Ejecutivo', icon: '📈' }
  ]

  const formatos = [
    { value: 'pdf', label: 'PDF', icon: '📄', description: 'Ideal para presentaciones y reportes ejecutivos' },
    { value: 'xlsx', label: 'Excel', icon: '📊', description: 'Para análisis de datos y tablas dinámicas' },
    { value: 'csv', label: 'CSV', icon: '📋', description: 'Para importar en otras herramientas' }
  ]

  const rangosFechas = [
    { value: 'ultimoCuatrimestre', label: 'Último Cuatrimestre', fechas: rangos.ultimoCuatrimestre },
    { value: 'mesActual', label: 'Mes Actual', fechas: rangos.mesActual },
    { value: 'ultimaSemana', label: 'Última Semana', fechas: rangos.ultimaSemana },
    { value: 'ultimosTresMeses', label: 'Últimos 3 Meses', fechas: rangos.ultimosTresMeses }
  ]

  const handleExport = async () => {
    try {
      clearExportState()
      await exportarReporte(exportConfig)
      
      // Agregar al historial
      const newExport = {
        id: Date.now(),
        tipo: exportConfig.tipo_reporte,
        formato: exportConfig.formato,
        fecha: new Date().toLocaleString(),
        parametros: exportConfig.parametros
      }
      setExportHistory(prev => [newExport, ...prev.slice(0, 9)]) // Mantener solo los últimos 10
      
    } catch (error) {
      console.error('Error en exportación:', error)
    }
  }

  const aplicarRangoFecha = (rango) => {
    setExportConfig(prev => ({
      ...prev,
      parametros: {
        ...prev.parametros,
        ...rango.fechas
      }
    }))
  }

  const updateParametros = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      parametros: {
        ...prev.parametros,
        [key]: value
      }
    }))
  }

  const tipoReporteSeleccionado = tiposReporte.find(t => t.value === exportConfig.tipo_reporte)
  const formatoSeleccionado = formatos.find(f => f.value === exportConfig.formato)

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Centro de Exportación</h1>
        <p className="text-slate-400 mt-1">Configure y descargue reportes en diferentes formatos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de Configuración */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selección de Tipo de Reporte */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              📋 Tipo de Reporte
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tiposReporte.map((tipo) => (
                <button
                  key={tipo.value}
                  onClick={() => setExportConfig(prev => ({ ...prev, tipo_reporte: tipo.value }))}
                  className={`p-4 text-left border rounded-lg transition-colors ${
                    exportConfig.tipo_reporte === tipo.value
                      ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{tipo.icon}</span>
                    <span className="font-medium text-slate-100">{tipo.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selección de Formato */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              💾 Formato de Exportación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formatos.map((formato) => (
                <button
                  key={formato.value}
                  onClick={() => setExportConfig(prev => ({ ...prev, formato: formato.value }))}
                  className={`p-4 text-center border rounded-lg transition-colors ${
                    exportConfig.formato === formato.value
                      ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-3xl mb-2">{formato.icon}</div>
                  <div className="font-medium mb-1 text-slate-100">{formato.label}</div>
                  <div className="text-xs text-slate-400">{formato.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuración de Parámetros */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              ⚙️ Parámetros del Reporte
            </h3>
            
            {/* Rangos de Fecha Rápidos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rangos de Fecha Rápidos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {rangosFechas.map((rango) => (
                  <button
                    key={rango.value}
                    onClick={() => aplicarRangoFecha(rango)}
                    className="px-3 py-2 text-sm border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-colors text-slate-100"
                  >
                    {rango.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fechas Personalizadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={exportConfig.parametros.fecha_inicio || ''}
                  onChange={(e) => updateParametros('fecha_inicio', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={exportConfig.parametros.fecha_fin || ''}
                  onChange={(e) => updateParametros('fecha_fin', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtros Adicionales */}
            {filtrosConfig.data && (
              <div className="space-y-4">
                {/* Departamento */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Departamento (Opcional)
                  </label>
                  <select
                    value={exportConfig.parametros.departamento_id || ''}
                    onChange={(e) => updateParametros('departamento_id', e.target.value || null)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos los departamentos</option>
                    {filtrosConfig.data.departamentos?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Incluir Gráficos (solo para PDF) */}
            {exportConfig.formato === 'pdf' && (
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.incluir_graficos}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, incluir_graficos: e.target.checked }))}
                    className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                  />
                  <span className="ml-2 text-sm text-slate-300">Incluir gráficos en el PDF</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Previsualización */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              👁️ Previsualización
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Tipo:</span>
                <span className="font-medium text-slate-100">{tipoReporteSeleccionado?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Formato:</span>
                <span className="font-medium text-slate-100">{formatoSeleccionado?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Período:</span>
                <span className="font-medium text-slate-100">
                  {exportConfig.parametros.fecha_inicio && exportConfig.parametros.fecha_fin
                    ? `${exportConfig.parametros.fecha_inicio} al ${exportConfig.parametros.fecha_fin}`
                    : 'No definido'
                  }
                </span>
              </div>
              {exportConfig.formato === 'pdf' && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Gráficos:</span>
                  <span className="font-medium text-slate-100">{exportConfig.incluir_graficos ? 'Sí' : 'No'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botón de Exportación */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <button
              onClick={handleExport}
              disabled={exporting || !exportConfig.parametros.fecha_inicio || !exportConfig.parametros.fecha_fin}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                exporting || !exportConfig.parametros.fecha_inicio || !exportConfig.parametros.fecha_fin
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {exporting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Exportando...
                </div>
              ) : (
                <>
                  <span className="mr-2">📤</span>
                  Exportar Reporte
                </>
              )}
            </button>

            {/* Estados de Exportación */}
            {exportSuccess && (
              <div className="mt-3 p-3 bg-green-900/30 border border-green-600 rounded-lg">
                <div className="text-green-300 text-sm">
                  ✅ Reporte exportado exitosamente
                </div>
              </div>
            )}

            {exportError && (
              <div className="mt-3 p-3 bg-red-900/30 border border-red-600 rounded-lg">
                <div className="text-red-300 text-sm">
                  ❌ Error: {exportError}
                </div>
              </div>
            )}
          </div>

          {/* Historial de Exportaciones */}
          {exportHistory.length > 0 && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                📚 Historial Reciente
              </h3>
              <div className="space-y-2">
                {exportHistory.slice(0, 5).map((item) => {
                  const tipo = tiposReporte.find(t => t.value === item.tipo)
                  const formato = formatos.find(f => f.value === item.formato)
                  
                  return (
                    <div key={item.id} className="text-xs bg-slate-700 rounded-lg p-2">
                      <div className="font-medium text-slate-100">
                        {tipo?.icon} {tipo?.label}
                      </div>
                      <div className="text-slate-400">
                        {formato?.label} - {item.fecha}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {exportHistory.length > 5 && (
                <div className="mt-2 text-xs text-slate-500 text-center">
                  y {exportHistory.length - 5} más...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportCenter