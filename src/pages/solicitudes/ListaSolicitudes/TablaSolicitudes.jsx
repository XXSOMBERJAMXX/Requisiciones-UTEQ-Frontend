// ListaSolicitudes/TablaSolicitudes.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { FaEye, FaCheck, FaTimes, FaEdit, FaTrash, FaFilter } from 'react-icons/fa'
import Button from '../../../components/common/Button'
import {
  obtenerColorEstado,
  obtenerColorUrgencia,
  formatearEstado,
  formatearTipoRequisicion,
  formatearUrgencia,
  formatearFecha,
  formatearMoneda,
  verificarPermisos
} from './utils'

const TablaSolicitudes = ({
  solicitudes,
  user,
  onAprobar,
  onDenegar,
  onEditar,
  onEliminar,
  onLimpiarFiltros
}) => {
  const ContenidoVacio = () => (
    <div className="flex flex-col items-center space-y-4">
      <FaFilter className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500" />
      <div>
        <p className="text-lg font-medium text-slate-300 mb-2">
          No se encontraron solicitudes
        </p>
        <p className="text-sm">
          No hay solicitudes que coincidan con los criterios de búsqueda.
        </p>
      </div>
      <Button variant="secondary" onClick={onLimpiarFiltros} className="mt-2">
        Limpiar Filtros
      </Button>
    </div>
  )

  // Componente de fila de tabla
  const FilaSolicitud = ({ solicitud }) => {
    const permisos = verificarPermisos(solicitud, user)

    return (
      <tr className="hover:bg-slate-700 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-300">
          {solicitud.folio_solicitud || 'N/A'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
          <span className="px-2 py-1 bg-slate-600 border border-slate-500 rounded-full text-xs">
            {formatearTipoRequisicion(solicitud.tipo_requisicion)}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-slate-200 max-w-xs">
          <div className="truncate" title={solicitud.descripcion_detallada}>
            {solicitud.descripcion_detallada || 'Sin descripción'}
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
          <div>
            <div className="font-medium">
              {solicitud.solicitante?.nombre_completo || solicitud.usuario?.nombre_completo || 'N/A'}
            </div>
            <div className="text-slate-400 text-xs">
              {solicitud.solicitante?.numero_empleado || solicitud.usuario?.numero_empleado || ''}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
          <div>
            <div className="font-medium">
              {solicitud.departamento?.nombre_departamento || 'N/A'}
            </div>
            <div className="text-slate-400 text-xs">
              {solicitud.departamento?.codigo_departamento || ''}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorUrgencia(solicitud.urgencia)}`}>
            {formatearUrgencia(solicitud.urgencia)}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200 font-medium">
          {formatearMoneda(solicitud.presupuesto_estimado)}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
          {formatearFecha(solicitud.fecha_creacion)}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${obtenerColorEstado(solicitud.estatus)}`}>
            {formatearEstado(solicitud.estatus)}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-1">
            <Link to={`/solicitudes/${solicitud.id_solicitud}`}>
              <Button variant="secondary" className="p-2 rounded-full" title="Ver Detalles">
                <FaEye className="w-4 h-4" />
              </Button>
            </Link>

            {permisos.puedeAprobar && (
              <>
                <Button
                  variant="primary"
                  onClick={() => onAprobar(solicitud)}
                  className="p-2 rounded-full"
                  title="Aprobar"
                >
                  <FaCheck className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDenegar(solicitud)}
                  className="p-2 rounded-full"
                  title="Denegar"
                >
                  <FaTimes className="w-4 h-4" />
                </Button>
              </>
            )}

            {permisos.puedeEditar && (
              <Button
                variant="secondary"
                onClick={() => onEditar(solicitud.id_solicitud)}
                className="p-2 rounded-full"
                title="Editar"
              >
                <FaEdit className="w-4 h-4" />
              </Button>
            )}

            {permisos.puedeEliminar && (
              <Button
                variant="danger"
                onClick={() => onEliminar(solicitud.id_solicitud, solicitud.folio_solicitud)}
                className="p-2 rounded-full"
                title="Eliminar"
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </td>
      </tr>
    )
  }

  // Componente de card para móvil
  const CardSolicitud = ({ solicitud }) => {
    const permisos = verificarPermisos(solicitud, user)

    return (
      <div className="p-4 sm:p-6 hover:bg-slate-700 transition-colors">
        <div className="space-y-3">
          {/* Header de la card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="font-medium text-blue-300 text-lg">
              {solicitud.folio_solicitud || 'N/A'}
            </div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${obtenerColorEstado(solicitud.estatus)}`}>
                {formatearEstado(solicitud.estatus)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorUrgencia(solicitud.urgencia)}`}>
                {formatearUrgencia(solicitud.urgencia)}
              </span>
            </div>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-400">Tipo:</span>
              <span className="ml-2 text-slate-200">
                {formatearTipoRequisicion(solicitud.tipo_requisicion)}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Fecha:</span>
              <span className="ml-2 text-slate-200">
                {formatearFecha(solicitud.fecha_creacion)}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Solicitante:</span>
              <span className="ml-2 text-slate-200">
                {solicitud.solicitante?.nombre_completo || solicitud.usuario?.nombre_completo || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Presupuesto:</span>
              <span className="ml-2 text-slate-200 font-medium">
                {formatearMoneda(solicitud.presupuesto_estimado)}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <span className="text-slate-400">Descripción:</span>
            <p className="text-slate-200 mt-1 text-sm line-clamp-2">
              {solicitud.descripcion_detallada || 'Sin descripción'}
            </p>
          </div>

          {/* Departamento */}
          <div>
            <span className="text-slate-400">Departamento:</span>
            <span className="ml-2 text-slate-200">
              {solicitud.departamento?.nombre_departamento || 'N/A'}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Link to={`/solicitudes/${solicitud.id_solicitud}`}>
              <Button variant="secondary" size="sm" icon={FaEye}>
                Ver
              </Button>
            </Link>

            {permisos.puedeAprobar && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAprobar(solicitud)}
                  icon={FaCheck}
                >
                  Aprobar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDenegar(solicitud)}
                  icon={FaTimes}
                >
                  Denegar
                </Button>
              </>
            )}

            {permisos.puedeEditar && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEditar(solicitud.id_solicitud)}
                icon={FaEdit}
              >
                Editar
              </Button>
            )}

            {permisos.puedeEliminar && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onEliminar(solicitud.id_solicitud, solicitud.folio_solicitud)}
                icon={FaTrash}
              >
                Eliminar
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl overflow-hidden">
      {/* Vista de tabla (desktop) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Folio
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Solicitante
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Urgencia
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Presupuesto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-600">
            {solicitudes.length > 0 ? (
              solicitudes.map((solicitud, index) => (
                <FilaSolicitud
                  key={solicitud.id_solicitud || `solicitud-${index}`}
                  solicitud={solicitud}
                />
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-12 text-center text-slate-400">
                  <ContenidoVacio />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de cards (móvil/tablet) */}
      <div className="lg:hidden divide-y divide-slate-600">
        {solicitudes.length > 0 ? (
          solicitudes.map((solicitud, index) => (
            <CardSolicitud
              key={solicitud.id_solicitud || `solicitud-${index}`}
              solicitud={solicitud}
            />
          ))
        ) : (
          <div className="p-8 sm:p-12 text-center text-slate-400">
            <ContenidoVacio />
          </div>
        )}
      </div>
    </div>
  )
}

export default TablaSolicitudes