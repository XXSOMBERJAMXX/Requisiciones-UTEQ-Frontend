// ListaSolicitudes/FiltrosSolicitudes.jsx
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import Button from '../../../components/common/Button'
import { ESTADO_OPTIONS, TIPO_OPTIONS, URGENCIA_OPTIONS } from './utils'

const FiltrosSolicitudes = ({
  terminoBusqueda,
  filtroEstado,
  filtroTipo,
  filtroUrgencia,
  onCambioBusqueda,
  onCambioFiltro,
  onLimpiarFiltros,
  totalSolicitudes
}) => {
  const hayFiltrosActivos = terminoBusqueda || 
    filtroEstado !== 'todas' || 
    filtroTipo !== 'todos' || 
    filtroUrgencia !== 'todas'

  return (
    <>
      {/* Filtros y búsqueda */}
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          Filtros de Búsqueda
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative flex-col justify-between">
            <Input
              label="Buscador"
              type="text"
              placeholder="Buscar por folio, descripción..."
              value={terminoBusqueda}
              onChange={onCambioBusqueda}
              className='h'
            />
          </div>

          <Select
            label="Estado"
            value={filtroEstado}
            onChange={(e) => onCambioFiltro('estado', e.target.value)}
            options={ESTADO_OPTIONS}
          />

          <Select
            label="Tipo"
            value={filtroTipo}
            onChange={(e) => onCambioFiltro('tipo', e.target.value)}
            options={TIPO_OPTIONS}
          />

          <Select
            label="Urgencia"
            value={filtroUrgencia}
            onChange={(e) => onCambioFiltro('urgencia', e.target.value)}
            options={URGENCIA_OPTIONS}
          />
        </div>
      </div>

      {/* Resumen */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-700 border border-slate-600 p-4 rounded-lg mb-6 gap-4">
        <p className="text-slate-200">
          Mostrando{' '}
          <span className="font-semibold text-blue-300">{totalSolicitudes}</span>{' '}
          solicitudes en total
        </p>

        {hayFiltrosActivos && (
          <Button 
            variant="secondary" 
            onClick={onLimpiarFiltros} 
            size="sm"
            className="w-full sm:w-auto"
          >
            Limpiar Filtros
          </Button>
        )}
      </div>
    </>
  )
}

export default FiltrosSolicitudes