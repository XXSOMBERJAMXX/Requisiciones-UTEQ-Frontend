import React from 'react'

const ExportButtons = ({ 
  onExport, 
  loading = false, 
  success = false, 
  error = null,
  formats = ['pdf', 'xlsx', 'csv']
}) => {
  const formatConfigs = {
    pdf: {
      label: 'PDF',
      icon: '📄',
      color: 'bg-red-700 hover:bg-red-800',
      description: 'Ideal para presentaciones'
    },
    xlsx: {
      label: 'Excel',
      icon: '📊',
      color: 'bg-green-700 hover:bg-green-800',
      description: 'Para análisis de datos'
    },
    csv: {
      label: 'CSV',
      icon: '📋',
      color: 'bg-blue-700 hover:bg-blue-800',
      description: 'Para importar datos'
    }
  }

  const handleExport = async (formato) => {
    if (loading) return
    await onExport(formato)
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">
          📤 Exportar Reporte
        </h3>
        {loading && (
          <div className="flex items-center text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
            <span className="text-sm">Procesando...</span>
          </div>
        )}
      </div>

      {/* Botones de exportación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {formats.map((formato) => {
          const config = formatConfigs[formato]
          if (!config) return null

          return (
            <button
              key={formato}
              onClick={() => handleExport(formato)}
              disabled={loading}
              className={`${config.color} text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg`}
            >
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">{config.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">{config.label}</div>
                  <div className="text-xs opacity-90">{config.description}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Estados de feedback */}
      {success && (
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <div className="text-green-200 text-sm">
              <p className="font-medium">¡Exportación exitosa!</p>
              <p>El archivo se ha descargado automáticamente.</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <span className="text-red-400 mr-2">❌</span>
            <div className="text-red-200 text-sm">
              <p className="font-medium">Error en la exportación</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-slate-300 bg-slate-700 rounded-lg border border-slate-600 p-3">
        <p className="mb-1">💡 <strong>Consejos:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>PDF: Incluye gráficos y formato de presentación</li>
          <li>Excel: Permite análisis avanzado y filtros</li>
          <li>CSV: Compatible con cualquier herramienta de datos</li>
        </ul>
      </div>
    </div>
  )
}

export default ExportButtons