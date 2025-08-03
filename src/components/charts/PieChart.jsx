import React from 'react'

const PieChart = ({ 
  data = [], 
  labelKey = 'label', 
  valueKey = 'value', 
  title = 'Distribución',
  size = 280 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 text-center">{title}</h4>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-slate-400">
            <div className="text-5xl mb-3">📊</div>
            <div className="text-sm">No hay datos para mostrar</div>
          </div>
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + (Number(item[valueKey]) || 0), 0)
  
  if (total === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 text-center">{title}</h4>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-slate-400">
            <div className="text-5xl mb-3">📈</div>
            <div className="text-sm">No hay datos con valores válidos</div>
          </div>
        </div>
      </div>
    )
  }

  // Colores modernos y vibrantes
  const colors = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
    '#84cc16', // lime-500
    '#ec4899', // pink-500
    '#64748b'  // slate-500
  ]

  let currentAngle = -90 // Start from top

  const slices = data.map((item, index) => {
    const value = Number(item[valueKey]) || 0
    const percentage = (value / total) * 100
    const sliceAngle = (value / total) * 360
    
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle
    currentAngle = endAngle

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 25

    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)

    const largeArcFlag = sliceAngle > 180 ? 1 : 0

    return {
      ...item,
      value,
      percentage: percentage.toFixed(1),
      color: colors[index % colors.length],
      path: `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
      labelX: centerX + (radius * 0.75) * Math.cos((startAngleRad + endAngleRad) / 2),
      labelY: centerY + (radius * 0.75) * Math.sin((startAngleRad + endAngleRad) / 2)
    }
  })

  return (
    <div className="bg-slate-800 rounded-lg">
      <h4 className="text-lg font-semibold text-slate-100 mb-6 text-center">{title}</h4>
      
      <div className="flex flex-col xl:flex-row items-center justify-center space-y-6 xl:space-y-0 xl:space-x-8">
        {/* Gráfico */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="drop-shadow-lg">
            {/* Gradientes para efectos */}
            <defs>
              {slices.map((slice, index) => (
                <radialGradient key={index} id={`gradient-${index}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={slice.color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={slice.color} stopOpacity="1" />
                </radialGradient>
              ))}
            </defs>
            
            {slices.map((slice, index) => (
              <g key={index}>
                <path
                  d={slice.path}
                  fill={`url(#gradient-${index})`}
                  stroke="#1e293b"
                  strokeWidth="2"
                  className="hover:opacity-90 hover:drop-shadow-lg transition-all duration-200 cursor-pointer"
                />
                
                {/* Etiquetas de porcentaje */}
                {slice.percentage > 8 && (
                  <text
                    x={slice.labelX}
                    y={slice.labelY}
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                    fontWeight="600"
                    className="pointer-events-none drop-shadow-sm"
                  >
                    {slice.percentage}%
                  </text>
                )}
              </g>
            ))}
          </svg>
          
          {/* Total en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-slate-700 border border-slate-600 rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-100">{total.toLocaleString()}</div>
                <div className="text-xs text-slate-400 font-medium">Total</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="space-y-3 min-w-0 flex-1">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
              <div 
                className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" 
                style={{ backgroundColor: slice.color }}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-100 truncate">
                  {slice[labelKey]}
                </div>
                <div className="text-xs text-slate-400">
                  {slice.value.toLocaleString()} ({slice.percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Estadísticas adicionales */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-blue-300">{data.length}</div>
          <div className="text-sm text-blue-400 font-medium">Categorías</div>
        </div>
        <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-emerald-300">
            {Math.max(...data.map(item => Number(item[valueKey]) || 0)).toLocaleString()}
          </div>
          <div className="text-sm text-emerald-400 font-medium">Máximo</div>
        </div>
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-amber-300">
            {Math.round(total / data.length).toLocaleString()}
          </div>
          <div className="text-sm text-amber-400 font-medium">Promedio</div>
        </div>
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-purple-300">
            {Math.min(...data.map(item => Number(item[valueKey]) || 0)).toLocaleString()}
          </div>
          <div className="text-sm text-purple-400 font-medium">Mínimo</div>
        </div>
      </div>
    </div>
  )
}

export default PieChart