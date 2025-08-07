// ===== ARCHIVO: src/components/common/KPICard.jsx =====
import React from 'react'

const KPICard = ({ title, value, change, percentage, icon, format = 'number' }) => {
  const formatValue = (val) => {
    if (val === null || val === undefined) return 'N/A'
    
    switch(format) {
      case 'currency':
        return `$${val.toLocaleString()}`
      case 'percentage':
        return `${val}%`
      default:
        return val.toLocaleString()
    }
  }

  const getChangeColor = (changeValue) => {
    if (!changeValue) return 'text-gray-400'
    const numChange = parseFloat(changeValue)
    return numChange >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getChangeIcon = (changeValue) => {
    if (!changeValue) return ''
    const numChange = parseFloat(changeValue)
    return numChange >= 0 ? '↗️' : '↘️'
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl hover:border-gray-600 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            {icon && <span className="text-2xl mr-3">{icon}</span>}
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className="text-3xl font-bold text-white mb-3">
            {formatValue(value)}
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            {change && (
              <span className={`font-medium ${getChangeColor(change)}`}>
                {getChangeIcon(change)} {Math.abs(parseFloat(change))}%
              </span>
            )}
            
            {percentage && (
              <span className="text-gray-400">
                ({percentage}% del total)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KPICard