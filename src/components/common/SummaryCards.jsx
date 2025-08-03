import React from 'react'

const SummaryCards = ({ data, type = 'general' }) => {
  if (!data) return null

  const getCardConfig = () => {
    switch (type) {
      case 'compras':
        return [
          {
            key: 'total_compras',
            label: 'Total Compras',
            icon: '💰',
            format: 'currency'
          },
          {
            key: 'cantidad_compras',
            label: 'Cantidad Órdenes',
            icon: '📊',
            format: 'number'
          },
          {
            key: 'promedio_compra',
            label: 'Promedio por Compra',
            icon: '📈',
            format: 'currency'
          }
        ]
      case 'solicitudes':
        return [
          {
            key: 'total_solicitudes',
            label: 'Total Solicitudes',
            icon: '📝',
            format: 'number'
          },
          {
            key: 'solicitudes_pendientes',
            label: 'Pendientes',
            icon: '⏳',
            format: 'number'
          },
          {
            key: 'promedio_dias_aprobacion',
            label: 'Días Promedio',
            icon: '⏱️',
            format: 'number',
            suffix: ' días'
          }
        ]
      default:
        return Object.keys(data).map(key => ({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          icon: '📊',
          format: typeof data[key] === 'number' && key.includes('monto') ? 'currency' : 'number'
        }))
    }
  }

  const formatValue = (value, format, suffix = '') => {
    if (value === null || value === undefined) return 'N/A'
    
    switch (format) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`
      case 'percentage':
        return `${value}%`
      case 'number':
        return `${Number(value).toLocaleString()}${suffix}`
      default:
        return value.toString()
    }
  }

  const cards = getCardConfig()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const value = data[card.key]
        
        if (value === undefined || value === null) return null
        
        return (
          <div
            key={card.key}
            className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{card.icon}</span>
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                    {card.label}
                  </h3>
                </div>
                <div className="text-2xl font-bold text-slate-100">
                  {formatValue(value, card.format, card.suffix)}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards