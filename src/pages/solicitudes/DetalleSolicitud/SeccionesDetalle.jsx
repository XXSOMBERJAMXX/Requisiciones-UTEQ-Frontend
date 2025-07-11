// DetalleSolicitud/SeccionesDetalle.jsx
import React from 'react'
import { FaFile, FaDownload } from 'react-icons/fa'
import Button from '../../../components/common/Button'
import TablaItemsSolicitud from '../../../components/solicitudes/TablaItemsSolicitud'
import { formatearFechaHora, obtenerColorEstado, obtenerColorUrgencia, formatearEstado, formatearTipoRequisicion, formatearUrgencia, formatearMoneda, formatearFecha } from './utils'

// Componente para mostrar el historial
export const HistorialSolicitud = ({ aprobaciones, solicitud }) => (
  <div className="p-6 bg-slate-800 rounded-lg border border-slate-600">
    <h3 className="text-xl font-semibold text-slate-100 mb-6">
      Historial de la Solicitud
    </h3>
    <div className="space-y-6">
      {/* Evento de creación */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-base font-medium text-slate-100">
              Solicitud Creada
            </span>
            <span className="text-sm text-slate-400">
              {formatearFechaHora(solicitud.fecha_creacion)}
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Por: {solicitud.solicitante?.nombre_completo || 'Usuario desconocido'}
          </p>
        </div>
      </div>

      {/* Eventos de aprobaciones */}
      {aprobaciones && aprobaciones.length > 0 ? (
        aprobaciones.map((aprobacion, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div
              className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                aprobacion.accion === 'aprobar'
                  ? 'bg-emerald-500'
                  : aprobacion.accion === 'denegar'
                  ? 'bg-red-500'
                  : 'bg-amber-500'
              }`}
            ></div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-base font-medium text-slate-100">
                  {aprobacion.accion === 'aprobar'
                    ? 'Solicitud Aprobada'
                    : aprobacion.accion === 'denegar'
                    ? 'Solicitud Denegada'
                    : 'En Revisión'}
                </span>
                <span className="text-sm text-slate-400">
                  {formatearFechaHora(aprobacion.fecha_accion)}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                Por: {aprobacion.aprobador?.nombre_completo || 'Usuario desconocido'}
              </p>
              {aprobacion.comentarios && (
                <div className="mt-2 p-3 bg-slate-700 border border-slate-600 rounded-lg">
                  <p className="text-sm text-slate-200">
                    <span className="font-medium">Comentarios:</span> {aprobacion.comentarios}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400">No hay eventos de aprobación registrados</p>
        </div>
      )}
    </div>
  </div>
)

// Componente para mostrar documentos
export const SeccionDocumentos = ({ documentos }) => (
  <div className="p-6 bg-slate-800 rounded-lg border border-slate-600">
    <h3 className="text-xl font-semibold text-slate-100 mb-6">
      Documentos Adjuntos
    </h3>
    {documentos && documentos.length > 0 ? (
      <div className="space-y-4">
        {documentos.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-slate-700 border border-slate-600 p-4 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <FaFile className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-100 truncate">
                  {doc.nombre_archivo}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Subido el {formatearFecha(doc.fecha_subida)}
                  {doc.usuario_subida && ` por ${doc.usuario_subida.nombre_completo}`}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                // Aquí implementarías la descarga del archivo
                alert(`Descargando ${doc.nombre_archivo}`)
              }}
              className="p-2 flex-shrink-0"
              title="Descargar archivo"
            >
              <FaDownload className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <FaFile className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <p className="text-slate-400">No hay documentos adjuntos</p>
      </div>
    )}
  </div>
)

// Componente para mostrar los ítems de la solicitud
export const SeccionItems = ({ items }) => (
  <div className="p-6 bg-slate-800 rounded-lg border border-slate-600">
    <h3 className="text-xl font-semibold text-slate-100 mb-6">Ítems Solicitados</h3>
    {items && items.length > 0 ? (
      <TablaItemsSolicitud items={items} readonly={true} />
    ) : (
      <div className="text-center py-12">
        <p className="text-slate-400">No hay ítems registrados</p>
      </div>
    )}
  </div>
)

// Componente para la sección de detalles
export const SeccionDetalles = ({ solicitud }) => (
  <div className="space-y-6">
    {/* Descripción detallada */}
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
      <h3 className="text-xl font-semibold text-slate-100 mb-4">
        Descripción Detallada
      </h3>
      <p className="text-slate-300 leading-relaxed">
        {solicitud.descripcion_detallada || 'No hay descripción disponible'}
      </p>
    </div>

    {/* Justificación */}
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
      <h3 className="text-xl font-semibold text-slate-100 mb-4">
        Justificación
      </h3>
      <p className="text-slate-300 leading-relaxed">
        {solicitud.justificacion || 'No hay justificación disponible'}
      </p>
    </div>

    {/* Comentarios generales */}
    {solicitud.comentarios_generales && (
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">
          Comentarios Generales
        </h3>
        <p className="text-slate-300 leading-relaxed">
          {solicitud.comentarios_generales}
        </p>
      </div>
    )}

    {/* Información adicional */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
        <h4 className="font-semibold text-slate-100 mb-4">
          Información de Seguimiento
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Folio:</span>
            <span className="text-blue-300 font-mono font-medium">
              {solicitud.folio_solicitud}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tipo:</span>
            <span className="text-slate-200">
              {formatearTipoRequisicion(solicitud.tipo_requisicion)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Urgencia:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${obtenerColorUrgencia(solicitud.urgencia)}`}>
              {formatearUrgencia(solicitud.urgencia)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Estado:</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${obtenerColorEstado(solicitud.estatus)}`}>
              {formatearEstado(solicitud.estatus)}
            </span>
          </div>
          {solicitud.fecha_necesidad && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Fecha Necesidad:</span>
              <span className="text-slate-200">
                {formatearFecha(solicitud.fecha_necesidad)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
        <h4 className="font-semibold text-slate-100 mb-4">
          Información del Solicitante
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Nombre:</span>
            <span className="text-slate-200">
              {solicitud.solicitante?.nombre_completo || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Empleado:</span>
            <span className="text-slate-200">
              {solicitud.solicitante?.numero_empleado || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Email:</span>
            <span className="text-blue-300 text-xs">
              {solicitud.solicitante?.correo_institucional || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Departamento:</span>
            <span className="text-slate-200">
              {solicitud.departamento?.nombre_departamento || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)