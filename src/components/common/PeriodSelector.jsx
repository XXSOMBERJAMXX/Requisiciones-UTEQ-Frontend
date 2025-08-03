

// ===== ARCHIVO: src/components/filters/PeriodSelector.jsx =====
import React from 'react'

const PeriodSelector = ({ value, onChange }) => {
  const periods = [
    { value: 'hoy', label: 'Hoy', icon: '📅' },
    { value: 'semana', label: 'Semana', icon: '📊' },
    { value: 'mes', label: 'Mes', icon: '📈' },
    { value: 'trimestre', label: 'Trimestre', icon: '📋' },
    { value: 'año', label: 'Año', icon: '📆' }
  ]

  return (
    <div className="flex items-center space-x-1">
      <label className="text-sm font-medium text-gray-700 mr-2">
        Período:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {periods.map((period) => (
          <option key={period.value} value={period.value}>
            {period.icon} {period.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PeriodSelector