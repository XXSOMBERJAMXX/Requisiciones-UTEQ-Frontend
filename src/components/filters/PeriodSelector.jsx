import React from 'react'

const PeriodSelector = ({ value, onChange, size = 'medium', showLabel = true }) => {
  const periods = [
    { 
      value: 'hoy', 
      label: 'Hoy', 
      icon: '📅',
      description: 'Datos del día actual'
    },
    { 
      value: 'semana', 
      label: 'Semana', 
      icon: '📊',
      description: 'Últimos 7 días'
    },
    { 
      value: 'mes', 
      label: 'Mes', 
      icon: '📈',
      description: 'Mes actual'
    },
    { 
      value: 'trimestre', 
      label: 'Trimestre', 
      icon: '📋',
      description: 'Últimos 3 meses'
    },
    { 
      value: 'año', 
      label: 'Año', 
      icon: '📆',
      description: 'Año actual'
    }
  ]

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs'
      case 'large':
        return 'px-4 py-3 text-base'
      default:
        return 'px-3 py-2 text-sm'
    }
  }

  const selectedPeriod = periods.find(p => p.value === value)

  return (
    <div className="flex items-center space-x-2">
      {showLabel && (
        <label className="text-sm font-medium text-slate-300">
          Período:
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            appearance-none bg-slate-700 border border-slate-600 rounded-lg text-slate-100
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-colors cursor-pointer hover:border-slate-500
            ${getSizeClasses()}
          `}
          title={selectedPeriod?.description}
        >
          {periods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.icon} {period.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg 
            className="w-4 h-4 text-slate-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </div>
      </div>
      
      {/* Descripción del período seleccionado */}
      {selectedPeriod && size !== 'small' && (
        <span className="text-xs text-slate-400 hidden sm:inline">
          {selectedPeriod.description}
        </span>
      )}
    </div>
  )
}

// Variante como botones (opcional)
export const PeriodButtonSelector = ({ value, onChange, size = 'medium' }) => {
  const periods = [
    { value: 'hoy', label: 'Hoy', icon: '📅' },
    { value: 'semana', label: 'Semana', icon: '📊' },
    { value: 'mes', label: 'Mes', icon: '📈' },
    { value: 'trimestre', label: 'Trimestre', icon: '📋' },
    { value: 'año', label: 'Año', icon: '📆' }
  ]

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs'
      case 'large':
        return 'px-4 py-3 text-base'
      default:
        return 'px-3 py-2 text-sm'
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <span className="text-sm font-medium text-slate-300 mr-2">
        Período:
      </span>
      
      <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-1">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onChange(period.value)}
            className={`
              ${getSizeClasses()}
              rounded-lg font-medium transition-all duration-200
              ${value === period.value
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
              }
            `}
          >
            <span className="mr-1">{period.icon}</span>
            {period.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Variante compacta para espacios reducidos
export const CompactPeriodSelector = ({ value, onChange }) => {
  const periods = [
    { value: 'hoy', label: 'Hoy', icon: '📅' },
    { value: 'semana', label: 'Sem', icon: '📊' },
    { value: 'mes', label: 'Mes', icon: '📈' },
    { value: 'trimestre', label: 'Trim', icon: '📋' },
    { value: 'año', label: 'Año', icon: '📆' }
  ]

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-1 text-xs bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      {periods.map((period) => (
        <option key={period.value} value={period.value}>
          {period.icon} {period.label}
        </option>
      ))}
    </select>
  )
}

export default PeriodSelector