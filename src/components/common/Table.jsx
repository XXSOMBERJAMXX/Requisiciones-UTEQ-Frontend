// components/common/Table.jsx
import React from 'react';
import { FaFilter } from 'react-icons/fa';
import Button from './Button';

const Table = ({ 
  data = [], 
  columns = [], 
  emptyMessage = "No se encontraron registros",
  onClearFilters,
  className = ''
}) => {
  // Función para renderizar el contenido cuando no hay datos
  const EmptyContent = () => (
    <div className="flex flex-col items-center space-y-4 py-8">
      <FaFilter className="w-12 h-12 text-slate-500" />
      <div className="text-center">
        <p className="text-lg font-medium text-slate-300 mb-2">
          {emptyMessage}
        </p>
        {onClearFilters && (
          <p className="text-sm text-slate-400 mb-4">
            No hay registros que coincidan con los criterios de búsqueda.
          </p>
        )}
      </div>
      {onClearFilters && (
        <Button variant="secondary" onClick={onClearFilters}>
          Limpiar Filtros
        </Button>
      )}
    </div>
  );

  // Función para renderizar celdas con formato condicional
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row);
    }
    
    // Formateo básico para valores booleanos
    if (typeof row[column.accessor] === 'boolean') {
      return row[column.accessor] ? 'Sí' : 'No';
    }
    
    return row[column.accessor] || 'N/A';
  };

  // Vista de tabla para desktop
  const DesktopTable = () => (
    <div className="hidden lg:block">
      <div className={`bg-slate-800 border border-slate-600 rounded-xl overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-slate-600">
            <thead className="bg-slate-700">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={`th-${index}`}
                    className={`px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap ${column.className || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-600">
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr 
                    key={`row-${rowIndex}`} 
                    className="hover:bg-slate-700 transition-colors"
                  >
                    {columns.map((column, colIndex) => (
                      <td 
                        key={`td-${rowIndex}-${colIndex}`}
                        className={`px-4 py-3 text-sm text-slate-200 ${column.cellClassName || ''} ${
                          column.whitespace === false ? '' : 'whitespace-nowrap'
                        }`}
                      >
                        {renderCell(row, column)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                    <EmptyContent />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Vista de cards para móvil
  const MobileCards = () => (
    <div className="lg:hidden">
      <div className={`bg-slate-800 border border-slate-600 rounded-xl overflow-hidden divide-y divide-slate-600 ${className}`}>
        {data.length > 0 ? (
          data.map((row, index) => (
            <div 
              key={`card-${index}`}
              className="p-4 sm:p-6 hover:bg-slate-700 transition-colors"
            >
              <div className="space-y-3">
                {columns.map((column, colIndex) => {
                  // Omitir columnas de acciones en móvil si no tienen render móvil específico
                  if (column.hideOnMobile && !column.mobileRender) return null;
                  
                  return (
                    <div key={`mobile-col-${colIndex}`}>
                      <span className="text-slate-400">{column.header}:</span>
                      <div className="mt-1 text-slate-200">
                        {column.mobileRender 
                          ? column.mobileRender(row) 
                          : renderCell(row, column)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 sm:p-12 text-center text-slate-400">
            <EmptyContent />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <DesktopTable />
      <MobileCards />
    </div>
  );
};

export default Table;