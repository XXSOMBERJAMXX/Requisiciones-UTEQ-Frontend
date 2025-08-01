// ListaSolicitudes/TablaSolicitudes.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaFilter,
} from 'react-icons/fa'
import Button from '../../../components/common/Button'
import {
  obtenerColorEstado,
  obtenerColorUrgencia,
  formatearEstado,
  formatearTipoRequisicion,
  formatearUrgencia,
  formatearFecha,
  formatearMoneda,
  verificarPermisos,
} from './utils'

const TablaSolicitudes = ({
  solicitudes,
  user,
  onAprobar,
  onDenegar,
  onEditar,
  onEliminar,
  onLimpiarFiltros,
}) => {
  const ContenidoVacio = () => (
    <div className="flex flex-col items-center space-y-4 py-8">
      <FaFilter className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500" />
      <div className="text-center">
        <p className="text-lg font-medium text-slate-300 mb-2">
          No se encontraron solicitudes
        </p>
        <p className="text-sm text-slate-400">
          No hay solicitudes que coincidan con los criterios de búsqueda.
        </p>
      </div>
      <Button variant="secondary" onClick={onLimpiarFiltros} className="mt-2">
        Limpiar Filtros
      </Button>
    </div>
  )

  const renderPersona = (solicitud) => (
    <div>
      <div className="font-medium">
        {solicitud.solicitante?.nombre_completo ||
          solicitud.usuario?.nombre_completo ||
          'N/A'}
      </div>
      <div className="text-slate-400 text-xs">
        {solicitud.solicitante?.numero_empleado ||
          solicitud.usuario?.numero_empleado ||
          ''}
      </div>
    </div>
  )

  const renderDepartamento = (solicitud) => (
    <div>
      <div className="font-medium">
        {solicitud.departamento?.nombre_departamento || 'N/A'}
      </div>
      <div className="text-slate-400 text-xs">
        {solicitud.departamento?.codigo_departamento || ''}
      </div>
    </div>
  )

  const renderAcciones = (solicitud, esMobile = false) => {
    const permisos = verificarPermisos(solicitud, user)

    const ButtonComponent = esMobile
      ? ({ variant, onClick, icon: Icon, children, ...props }) => (
          <Button
            variant={variant}
            size="sm"
            onClick={onClick}
            icon={Icon}
            {...props}
          >
            {children}
          </Button>
        )
      : ({ variant, onClick, title, children }) => (
          <Button
            variant={variant}
            onClick={onClick}
            className="p-2 rounded-full"
            title={title}
          >
            {children}
          </Button>
        )

    const containerClass = esMobile
      ? 'flex flex-wrap gap-2 pt-2'
      : 'flex justify-end space-x-1'

    return (
      <div className={containerClass}>
        <Link to={`/solicitudes/${solicitud.id_solicitud}`}>
          <ButtonComponent
            variant="secondary"
            title="Ver Detalles"
            icon={esMobile ? FaEye : undefined}
          >
            {esMobile ? 'Ver' : <FaEye className="w-4 h-4" />}
          </ButtonComponent>
        </Link>

        {permisos.puedeAprobar && (
          <>
            <ButtonComponent
              variant="primary"
              onClick={() => onAprobar(solicitud)}
              title="Aprobar"
              icon={esMobile ? FaCheck : undefined}
            >
              {esMobile ? 'Aprobar' : <FaCheck className="w-4 h-4" />}
            </ButtonComponent>
            <ButtonComponent
              variant="danger"
              onClick={() => onDenegar(solicitud)}
              title="Denegar"
              icon={esMobile ? FaTimes : undefined}
            >
              {esMobile ? 'Denegar' : <FaTimes className="w-4 h-4" />}
            </ButtonComponent>
          </>
        )}

        {permisos.puedeEditar && (
          <ButtonComponent
            variant="secondary"
            onClick={() => onEditar(solicitud.id_solicitud)}
            title="Editar"
            icon={esMobile ? FaEdit : undefined}
          >
            {esMobile ? 'Editar' : <FaEdit className="w-4 h-4" />}
          </ButtonComponent>
        )}

        {permisos.puedeEliminar && (
          <ButtonComponent
            variant="danger"
            onClick={() =>
              onEliminar(solicitud.id_solicitud, solicitud.folio_solicitud)
            }
            title="Eliminar"
            icon={esMobile ? FaTrash : undefined}
          >
            {esMobile ? 'Eliminar' : <FaTrash className="w-4 h-4" />}
          </ButtonComponent>
        )}
      </div>
    )
  }

  const FilaSolicitud = ({ solicitud }) => (
    <tr className="hover:bg-slate-700 transition-colors">
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-300">
        {solicitud.folio_solicitud || 'N/A'}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
        <span className="px-2 py-1 bg-slate-600 border border-slate-500 rounded-full text-xs">
          {formatearTipoRequisicion(solicitud.tipo_requisicion)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-200">
        <div
          className="max-w-xs truncate"
          title={solicitud.descripcion_detallada}
        >
          {solicitud.descripcion_detallada || 'Sin descripción'}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
        {renderPersona(solicitud)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
        {renderDepartamento(solicitud)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorUrgencia(
            solicitud.urgencia
          )}`}
        >
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
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${obtenerColorEstado(
            solicitud.estatus
          )}`}
        >
          {formatearEstado(solicitud.estatus)}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        {renderAcciones(solicitud, false)}
      </td>
    </tr>
  )

  const CardSolicitud = ({ solicitud }) => (
    <div className="p-4 sm:p-6 hover:bg-slate-700 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="font-medium text-blue-300 text-lg truncate">
            {solicitud.folio_solicitud || 'N/A'}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${obtenerColorEstado(
                solicitud.estatus
              )}`}
            >
              {formatearEstado(solicitud.estatus)}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorUrgencia(
                solicitud.urgencia
              )}`}
            >
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
            <span className="ml-2 text-slate-200 truncate">
              {solicitud.solicitante?.nombre_completo ||
                solicitud.usuario?.nombre_completo ||
                'N/A'}
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
          <span className="ml-2 text-slate-200 truncate">
            {solicitud.departamento?.nombre_departamento || 'N/A'}
          </span>
        </div>

        {/* Acciones */}
        {renderAcciones(solicitud, true)}
      </div>
    </div>
  )

  return (
    <div className="w-full">
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block">
        <div className="bg-slate-800 border border-slate-600 rounded-xl overflow-hidden max-w-[calc(100vw-29.2rem)]">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-slate-600">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Folio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Solicitante
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Departamento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Urgencia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Presupuesto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-200 uppercase tracking-wider whitespace-nowrap">
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
                    <td
                      colSpan="10"
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      <ContenidoVacio />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Vista de cards para móvil */}
      <div className="lg:hidden">
        <div className="bg-slate-800 border border-slate-600 rounded-xl overflow-hidden divide-y divide-slate-600">
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
    </div>
  )
}

export default TablaSolicitudes
