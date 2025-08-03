import React, { useState, useMemo } from 'react'

const DataTable = ({ 
  data = [], 
  columns = [], 
  loading = false, 
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  exportable = false,
  searchable = true,
  sortable = true
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [data, searchTerm, columns])

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      const aString = aValue.toString().toLowerCase()
      const bString = bValue.toString().toLowerCase()
      return sortConfig.direction === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString)
    })
  }, [filteredData, sortConfig])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [sortedData, currentPage, rowsPerPage])

  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  const handleSort = (key) => {
    if (!sortable) return
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleExport = () => {
    const headers = columns.map(col => col.label).join(',')
    const rows = sortedData.map(row => 
      columns.map(col => {
        const value = row[col.key]
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      }).join(',')
    )
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `datos_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-300">Cargando datos...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow overflow-hidden text-gray-100">
      {(searchable || exportable) && (
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex justify-between items-center">
            {searchable && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar en la tabla..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              {exportable && (
                <button
                  onClick={handleExport}
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  📊 Exportar CSV
                </button>
              )}
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-gray-600 rounded-md text-sm bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 filas</option>
                <option value={25}>25 filas</option>
                <option value={50}>50 filas</option>
                <option value={100}>100 filas</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${
                    sortable ? 'cursor-pointer hover:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable && sortConfig.key === column.key && (
                      <span className="text-blue-400">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                  <div>
                    <div className="text-4xl mb-2">📭</div>
                    <div className="text-lg font-medium">{emptyMessage}</div>
                    {searchTerm && (
                      <div className="text-sm mt-1">
                        Intenta cambiar los términos de búsqueda
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-gray-800' : ''} transition-colors`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : row[column.key] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-gray-900 px-4 py-3 border-t border-gray-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Mostrando{' '}
                  <span className="font-medium text-gray-100">
                    {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)}
                  </span>{' '}
                  a{' '}
                  <span className="font-medium text-gray-100">
                    {Math.min(currentPage * rowsPerPage, sortedData.length)}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium text-gray-100">{sortedData.length}</span> resultados
                </p>
              </div>

              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Anterior
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-900 border-blue-500 text-blue-300'
                            : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente →
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
