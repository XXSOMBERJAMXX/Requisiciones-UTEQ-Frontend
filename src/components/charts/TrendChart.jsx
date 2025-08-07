import React, { useState } from 'react'

const TrendChart = ({ 
  data = [], 
  xKey = 'periodo', 
  yKey = 'monto_total', 
  title = 'Tendencia',
  height = 300,
  chartType = 'line' // 'line' o 'bar'
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800 rounded-lg border border-slate-700">
        <div className="text-center text-slate-400">
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

  // 🔧 TAMAÑOS RESPONSIVOS MEJORADOS
  const svgWidth = 600  // Reducido de 800 a 600
  const svgHeight = height
  const padding = 60

  const chartWidth = svgWidth - 2 * padding
  const chartHeight = svgHeight - 2 * padding

  // Crear puntos para la línea o barras
  const points = data.map((item, index) => {
    const x = padding + (index * chartWidth) / Math.max(data.length - 1, 1)
    const y = padding + ((maxValue - (Number(item[yKey]) || 0)) * chartHeight) / range
    return { x, y, value: Number(item[yKey]) || 0, label: item[xKey] }
  })

  // Para barras, calcular ancho
  const barWidth = chartType === 'bar' ? Math.max(chartWidth / data.length - 10, 20) : 0

  // Crear path para la línea (solo si es tipo line)
  const pathData = chartType === 'line' ? points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') : ''

  // Crear path para el área bajo la curva (solo si es tipo line)
  const areaData = chartType === 'line' ? 
    `M ${points[0].x} ${padding + chartHeight} L ${pathData.substring(2)} L ${points[points.length - 1].x} ${padding + chartHeight} Z` : ''

  // Formatear valores
  const formatValue = (value) => {
    if (yKey.includes('monto') || yKey.includes('total')) {
      return `$${value.toLocaleString()}`
    }
    return value.toLocaleString()
  }

  // Formatear labels del eje X
  const formatXLabel = (label) => {
    if (typeof label === 'string' && label.length > 10) {
      return label.substring(0, 8) + '...'
    }
    return label
  }

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-lg font-medium text-slate-100 mb-4">{title}</h4>
      )}
      
      {/* 🔧 CONTAINER MEJORADO CON MAX-WIDTH */}
      <div className="relative overflow-x-auto bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="w-full max-w-full flex justify-center">
          <svg 
            width={svgWidth} 
            height={svgHeight} 
            className="max-w-full h-auto"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          >
            {/* Definiciones */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1" opacity="0.3"/>
              </pattern>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
              </linearGradient>
              <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#1e40af" stopOpacity="1"/>
              </linearGradient>
            </defs>
            
            {/* Fondo con grid */}
            <rect width="100%" height="100%" fill="transparent" />
            <rect 
              x={padding} 
              y={padding} 
              width={chartWidth} 
              height={chartHeight} 
              fill="url(#grid)" 
            />
            
            {/* Líneas de referencia del eje Y */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding + chartHeight - (ratio * chartHeight)
              return (
                <line
                  key={index}
                  x1={padding}
                  y1={y}
                  x2={padding + chartWidth}
                  y2={y}
                  stroke="#475569"
                  strokeWidth="1"
                  opacity="0.2"
                />
              )
            })}

            {/* RENDERIZADO CONDICIONAL: LÍNEA O BARRAS */}
            {chartType === 'line' ? (
              <>
                {/* Área bajo la curva */}
                {points.length > 1 && (
                  <path
                    d={areaData}
                    fill="url(#areaGradient)"
                    stroke="none"
                  />
                )}
                
                {/* Línea principal */}
                {points.length > 1 && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                
                {/* Puntos */}
                {points.map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={hoveredPoint === index ? "8" : "6"}
                      fill="#3b82f6"
                      stroke="#1e293b"
                      strokeWidth="2"
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    
                    {/* Tooltip */}
                    {hoveredPoint === index && (
                      <g>
                        <rect
                          x={point.x - 50}
                          y={point.y - 45}
                          width="100"
                          height="30"
                          fill="rgba(15, 23, 42, 0.95)"
                          stroke="#475569"
                          strokeWidth="1"
                          rx="6"
                        />
                        <text
                          x={point.x}
                          y={point.y - 32}
                          textAnchor="middle"
                          fill="#e2e8f0"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          {point.label}
                        </text>
                        <text
                          x={point.x}
                          y={point.y - 20}
                          textAnchor="middle"
                          fill="#60a5fa"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {formatValue(point.value)}
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </>
            ) : (
              <>
                {/* Barras */}
                {points.map((point, index) => {
                  const barHeight = ((point.value / maxValue) * chartHeight) || 0
                  const barY = padding + chartHeight - barHeight
                  
                  return (
                    <g key={index}>
                      <rect
                        x={point.x - barWidth/2}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill="url(#barGradient)"
                        stroke="#1e40af"
                        strokeWidth="1"
                        rx="4"
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        opacity={hoveredPoint === index ? 0.9 : 1}
                      />
                      
                      {/* Tooltip para barras */}
                      {hoveredPoint === index && (
                        <g>
                          <rect
                            x={point.x - 50}
                            y={barY - 40}
                            width="100"
                            height="30"
                            fill="rgba(15, 23, 42, 0.95)"
                            stroke="#475569"
                            strokeWidth="1"
                            rx="6"
                          />
                          <text
                            x={point.x}
                            y={barY - 27}
                            textAnchor="middle"
                            fill="#e2e8f0"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            {point.label}
                          </text>
                          <text
                            x={point.x}
                            y={barY - 15}
                            textAnchor="middle"
                            fill="#60a5fa"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {formatValue(point.value)}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </>
            )}
            
            {/* Etiquetas del eje X */}
            {points.map((point, index) => (
              <text
                key={index}
                x={point.x}
                y={svgHeight - 15}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
              >
                {formatXLabel(point.label)}
              </text>
            ))}
            
            {/* Etiquetas del eje Y */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const value = minValue + (range * ratio)
              const y = padding + chartHeight - (ratio * chartHeight)
              
              return (
                <g key={index}>
                  <line
                    x1={padding - 8}
                    y1={y}
                    x2={padding}
                    y2={y}
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                  <text
                    x={padding - 12}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#94a3b8"
                  >
                    {formatValue(Math.round(value))}
                  </text>
                </g>
              )
            })}
            
            {/* Ejes principales */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={padding + chartHeight}
              stroke="#64748b"
              strokeWidth="2"
            />
            <line
              x1={padding}
              y1={padding + chartHeight}
              x2={padding + chartWidth}
              y2={padding + chartHeight}
              stroke="#64748b"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      
      {/* 🔧 ESTADÍSTICAS EN GRID RESPONSIVO */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-blue-400">{formatValue(maxValue)}</div>
          <div className="text-sm text-slate-300">Máximo</div>
        </div>
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-slate-200">
            {formatValue(Math.round(values.reduce((a, b) => a + b, 0) / values.length))}
          </div>
          <div className="text-sm text-slate-300">Promedio</div>
        </div>
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-green-400">{formatValue(minValue)}</div>
          <div className="text-sm text-slate-300">Mínimo</div>
        </div>
      </div>
    </div>
  )
}

export default TrendChart