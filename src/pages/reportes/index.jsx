import React, { useState } from 'react'
import { useDashboardComplete } from '../../hooks/useReportes'
import KPICard from '../../components/common/KPICard'
import AlertsPanel from '../../components/common/AlertsPanel'
import TrendChart from '../../components/charts/TrendChart'
import PeriodSelector from '../../components/filters/PeriodSelector'

const Dashboard = () => {
  const [periodo, setPeriodo] = useState('mes')
  
  const { 
    dashboard, 
    loading, 
    error, 
    refreshAll, 
    isDashboardStale,
    debug 
  } = useDashboardComplete(periodo)

  const handlePeriodoChange = (newPeriodo) => {
    setPeriodo(newPeriodo)
  }

  const handleManualRefresh = () => {
    refreshAll()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 text-red-300">
        <h3 className="text-lg font-medium">❌ Error al cargar el dashboard</h3>
        <p className="mt-2 text-sm">{error}</p>
        <div className="mt-4">
          <button
            onClick={handleManualRefresh}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard Ejecutivo</h1>
          <p className="text-slate-400 mt-1">
            Vista general del sistema de compras y solicitudes
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <PeriodSelector 
            value={periodo} 
            onChange={handlePeriodoChange}
          />
          <button
            onClick={handleManualRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            disabled={loading}
          >
            <span className="mr-2">🔄</span>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          
          {isDashboardStale && (
            <div className="bg-yellow-600/20 border border-yellow-500 rounded-lg px-3 py-1 text-yellow-300 text-sm">
              ⚠️ Actualizando datos...
            </div>
          )}
        </div>
      </div>

      {dashboard?.kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Solicitudes"
            value={dashboard.kpis.total_solicitudes?.valor || 0}
            change={dashboard.kpis.total_solicitudes?.cambio_porcentual}
            icon="📝"
            format="number"
          />
          <KPICard
            title="Solicitudes Pendientes"
            value={dashboard.kpis.solicitudes_pendientes?.valor || 0}
            percentage={
              dashboard.kpis.solicitudes_pendientes?.porcentaje_del_total
            }
            icon="⏳"
            format="number"
          />
          <KPICard
            title="Total Compras"
            value={dashboard.kpis.total_compras?.valor || 0}
            change={dashboard.kpis.total_compras?.cambio_porcentual}
            icon="🛒"
            format="number"
          />
          <KPICard
            title="Monto Total"
            value={dashboard.kpis.monto_total_compras?.valor || 0}
            change={dashboard.kpis.monto_total_compras?.cambio_porcentual}
            icon="💰"
            format="currency"
          />
        </div>
      )}

      {dashboard?.alertas?.length > 0 && (
        <AlertsPanel alerts={dashboard.alertas} />
      )}

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-100">
          Departamentos con Mayor Gasto
        </h3>
        {dashboard?.top_departamentos?.length > 0 ? (
          <div className="space-y-4">
            {dashboard.top_departamentos.map((dept, index) => (
              <div
                key={dept.departamento}
                className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {['🥇', '🥈', '🥉'][index] || '📊'}
                  </span>
                  <div>
                    <p className="font-medium text-slate-100">{dept.departamento}</p>
                    <p className="text-sm text-slate-400">
                      {dept.cantidad_compras} compras
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-100">
                    ${dept.total_gasto?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-slate-500">
              No hay datos disponibles para el período seleccionado
            </p>
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-100">
          📅 Información del Período Analizado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
            <span className="text-sm text-blue-300">Período:</span>
            <p className="text-lg font-semibold text-slate-100">
              {dashboard?.periodo_analizado || periodo}
            </p>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
            <span className="text-sm text-green-300">Fecha Inicio:</span>
            <p className="text-lg font-semibold text-slate-100">
              {debug?.fechasPeriodo?.fecha_inicio || dashboard?.fecha_inicio
                ? new Date(debug?.fechasPeriodo?.fecha_inicio || dashboard.fecha_inicio).toLocaleDateString('es-MX')
                : 'N/A'}
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
            <span className="text-sm text-purple-300">Fecha Fin:</span>
            <p className="text-lg font-semibold text-slate-100">
              {debug?.fechasPeriodo?.fecha_fin || dashboard?.fecha_fin
                ? new Date(debug?.fechasPeriodo?.fecha_fin || dashboard.fecha_fin).toLocaleDateString('es-MX')
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard