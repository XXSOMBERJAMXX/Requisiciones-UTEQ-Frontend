

// ===== ARCHIVO: src/components/charts/BarChart.jsx =====
import React from 'react'

const BarChart = ({ 
  data = [], 
  xKey = 'label', 
  yKey = 'value', 
  title = 'Gráfico de Barras',
  color = '#3b82f6',
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <div>No hay datos para mostrar</div>
        </div>
      </div>
    )
  }

  const values = data.map(item => Number(item[yKey]) || 0)
  const maxValue = Math.max(...values)
  const labels = data.map(item => item[xKey])

  const svgWidth = 600
  const svgHeight = height
  const padding = 60
  const barWidth = (svgWidth - 2 * padding) / data.length * 0.8
  const barSpacing = (svgWidth - 2 * padding) / data.length * 0.2

  const formatValue = (value) => {
    if (yKey.includes('monto') || yKey.includes('volumen')) {
      return `${value.toLocaleString()}`
    }
    return value.toLocaleString()
  }

  return (
    <div className="w-full">
      <h4 className="text-lg font-medium text-gray-900 mb-4">{title}</h4>
      
      <div className="relative overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding + (svgHeight - 2 * padding) * (1 - ratio)
            return (
              <g key={index}>
                <line
                  x1={padding}
                  y1={y}
                  x2={svgWidth - padding}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {formatValue(maxValue * ratio)}
                </text>
              </g>
            )
          })}
          
          {/* Barras */}
          {data.map((item, index) => {
            const value = Number(item[yKey]) || 0
            const barHeight = ((svgHeight - 2 * padding) * value) / maxValue
            const x = padding + index * (barWidth + barSpacing)
            const y = svgHeight - padding - barHeight
            
            return (
              <g key={index}>
                {/* Barra */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                
                {/* Valor encima de la barra */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                  fontWeight="bold"
                >
                  {formatValue(value)}
                </text>
                
                {/* Etiqueta del eje X */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - padding + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6b7280"
                  className="max-w-[80px]"
                >
                  {item[xKey].length > 12 
                    ? `${item[xKey].substring(0, 12)}...` 
                    : item[xKey]
                  }
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      
      {/* Leyenda si hay múltiples series */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: color }}
          ></div>
          <span className="text-sm text-gray-600">
            {yKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
      </div>
    </div>
  )
}

export default BarChart