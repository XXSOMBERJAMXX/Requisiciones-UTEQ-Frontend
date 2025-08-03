

// ===== ARCHIVO: src/components/common/AlertsPanel.jsx =====
import React from 'react'

const AlertsPanel = ({ alerts = [] }) => {
  const getAlertStyle = (tipo) => {
    switch(tipo) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getAlertIcon = (tipo) => {
    switch(tipo) {
      case 'critical':
        return '🚨'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      case 'success':
        return '✅'
      default:
        return '📢'
    }
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">✅</span>
          <div className="text-green-800">
            <h3 className="text-sm font-medium">Todo está funcionando correctamente</h3>
            <p className="text-sm">No hay alertas que requieran atención.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        🚨 Alertas del Sistema
      </h3>
      
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`border rounded-md p-4 ${getAlertStyle(alert.tipo)}`}
        >
          <div className="flex items-start">
            <span className="text-xl mr-3 flex-shrink-0">
              {getAlertIcon(alert.tipo)}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {alert.mensaje}
              </p>
              {alert.detalle && (
                <p className="text-xs mt-1 opacity-80">
                  {alert.detalle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertsPanel