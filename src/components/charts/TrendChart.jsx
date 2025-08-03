

// ===== ARCHIVO: src/components/charts/TrendChart.jsx =====
import React from 'react'

const TrendChart = ({ 
  data = [], 
  xKey = 'periodo', 
  yKey = 'monto_total', 
  title = 'Tendencia',
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📈</div>
          <div>No hay datos para mostrar la tendencia</div>
        </div>
      </div>
    )
  }

  // Calcular valores para el SVG
  const values = data.map(item => Number(item[yKey]) || 0)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const range = maxValue - minValue || 1

  const svgWidth = 800
  const svgHeight = height
  const padding = 60

  const chartWidth = svgWidth - 2 * padding
  const chartHeight = svgHeight - 2 * padding

  // Crear puntos para la línea
  const points = data.map((item, index) => {
    const x = padding + (index * chartWidth) / (data.length - 1)
    const y = padding + ((maxValue - (Number(item[yKey]) || 0)) * chartHeight) / range
    return { x, y, value: Number(item[yKey]) || 0, label: item[xKey] }
  })

  // Crear path para la línea
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')

  // Crear path para el área bajo la curva
  const areaData = `M ${points[0].x} ${padding + chartHeight} L ${pathData.substring(2)} L ${points[points.length - 1].x} ${padding + chartHeight} Z`

  // Formatear valores
  const formatValue = (value) => {
    if (yKey.includes('monto') || yKey.includes('total')) {
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
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Área bajo la curva */}
          <path
            d={areaData}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="none"
          />
          
          {/* Línea principal */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Puntos */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-8 transition-all cursor-pointer"
              />
              
              {/* Tooltip en hover */}
              <g className="opacity-0 hover:opacity-100 transition-opacity">
                <rect
                  x={point.x - 40}
                  y={point.y - 40}
                  width="80"
                  height="25"
                  fill="rgba(0, 0, 0, 0.8)"
                  rx="4"
                />
                <text
                  x={point.x}
                  y={point.y - 22}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {formatValue(point.value)}
                </text>
              </g>
            </g>
          ))}
          
          {/* Etiquetas del eje X */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={svgHeight - 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {point.label}
            </text>
          ))}
          
          {/* Etiquetas del eje Y */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const value = minValue + (range * ratio)
            const y = padding + chartHeight - (ratio * chartHeight)
            
            return (
              <g key={index}>
                <line
                  x1={padding - 10}
                  y1={y}
                  x2={padding}
                  y2={y}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
                <text
                  x={padding - 15}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {formatValue(value)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      
      {/* Estadísticas adicionales */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-600">{formatValue(maxValue)}</div>
          <div className="text-sm text-blue-800">Máximo</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg font-bold text-gray-600">
            {formatValue(values.reduce((a, b) => a + b, 0) / values.length)}
          </div>
          <div className="text-sm text-gray-800">Promedio</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-lg font-bold text-green-600">{formatValue(minValue)}</div>
          <div className="text-sm text-green-800">Mínimo</div>
        </div>
      </div>
    </div>
  )
}

export default TrendChart