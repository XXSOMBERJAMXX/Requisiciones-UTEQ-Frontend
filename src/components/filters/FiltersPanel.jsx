import React from 'react'

const FiltersPanel = ({ 
  filters, 
  onChange, 
  availableFilters = [], 
  filtrosConfig = null,
  loading = false
}) => {
  const updateFilter = (key, value) => {
    onChange({
      ...filters,
      [key]: value === '' ? null : value
    })
  }

  const clearFilters = () => {
    const clearedFilters = { ...filters }
    Object.keys(clearedFilters).forEach(key => {
      if (!['fecha_inicio', 'fecha_fin'].includes(key)) {
        clearedFilters[key] = null
      }
    })
    onChange(clearedFilters)
  }

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => 
      !['fecha_inicio', 'fecha_fin'].includes(key) && value !== null && value !== ''
    )
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-slate-700 rounded"></div>
            <div className="h-10 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">
          🔍 Filtros
        </h3>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Rango de Fechas */}
        {availableFilters.includes('dateRange') && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filters.fecha_inicio || ''}
                onChange={(e) => updateFilter('fecha_inicio', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filters.fecha_fin || ''}
                onChange={(e) => updateFilter('fecha_fin', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Departamento */}
        {availableFilters.includes('department') && filtrosConfig?.departamentos && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Departamento
            </label>
            <select
              value={filters.departamento_id || ''}
              onChange={(e) => updateFilter('departamento_id', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los departamentos</option>
              {filtrosConfig.departamentos.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.nombre} ({dept.codigo})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Proveedor */}
        {availableFilters.includes('provider') && filtrosConfig?.proveedores && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Proveedor
            </label>
            <select
              value={filters.proveedor_id || ''}
              onChange={(e) => updateFilter('proveedor_id', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los proveedores</option>
              {filtrosConfig.proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Estatus */}
        {availableFilters.includes('status') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Estatus
            </label>
            <select
              value={filters.estatus || ''}
              onChange={(e) => updateFilter('estatus', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estatus</option>
              {filtrosConfig?.opciones_estatus?.compras?.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              )) || filtrosConfig?.opciones_estatus?.solicitudes?.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Urgencia */}
        {availableFilters.includes('urgency') && filtrosConfig?.opciones_urgencia && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Urgencia
            </label>
            <select
              value={filters.urgencia || ''}
              onChange={(e) => updateFilter('urgencia', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las urgencias</option>
              {filtrosConfig.opciones_urgencia.map((urgencia) => (
                <option key={urgencia} value={urgencia}>
                  {urgencia.charAt(0).toUpperCase() + urgencia.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Período */}
        {availableFilters.includes('period') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Agrupación
            </label>
            <select
              value={filters.periodo || 'mensual'}
              onChange={(e) => updateFilter('periodo', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        )}

        {/* Criterio (para ranking) */}
        {availableFilters.includes('criteria') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Criterio
            </label>
            <select
              value={filters.criterio || 'volumen'}
              onChange={(e) => updateFilter('criterio', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="volumen">Volumen</option>
              <option value="frecuencia">Frecuencia</option>
              <option value="calificacion">Calificación</option>
            </select>
          </div>
        )}

        {/* Límite */}
        {availableFilters.includes('limit') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Límite
            </label>
            <select
              value={filters.limite || 10}
              onChange={(e) => updateFilter('limite', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
            </select>
          </div>
        )}

        {/* Nivel de detalle */}
        {availableFilters.includes('detailLevel') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nivel de Detalle
            </label>
            <select
              value={filters.nivel_detalle || 'resumen'}
              onChange={(e) => updateFilter('nivel_detalle', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="resumen">Resumen</option>
              <option value="detallado">Detallado</option>
            </select>
          </div>
        )}

        {/* Incluir tiempos */}
        {availableFilters.includes('includeTimes') && (
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.incluir_tiempos || false}
                onChange={(e) => updateFilter('incluir_tiempos', e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
              <span className="ml-2 text-sm text-slate-300">
                Incluir estadísticas de tiempo
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Filtros activos */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-slate-300">Filtros activos:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (['fecha_inicio', 'fecha_fin'].includes(key) || !value) return null
              
              let displayValue = value
              if (key === 'departamento_id' && filtrosConfig?.departamentos) {
                const dept = filtrosConfig.departamentos.find(d => d.id == value)
                displayValue = dept ? dept.nombre : value
              }
              if (key === 'proveedor_id' && filtrosConfig?.proveedores) {
                const prov = filtrosConfig.proveedores.find(p => p.id == value)
                displayValue = prov ? prov.nombre : value
              }
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 bg-blue-900/30 text-blue-300 text-xs font-medium rounded-full border border-blue-700"
                >
                  {key.replace('_', ' ')}: {displayValue}
                  <button
                    onClick={() => updateFilter(key, null)}
                    className="ml-1 text-blue-400 hover:text-blue-200 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FiltersPanel