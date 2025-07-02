import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import solicitudesService from '../../services/requestService'
import { useAuth } from '../../hooks/useAuth'
import SolicitudesLayout from '../../components/layouts/SolicitudesLayout'
import TablaItemsSolicitud from '../../components/solicitudes/TablaItemsSolicitud'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import TextArea from '../../components/common/TextArea'
import {
  FaEdit,
  FaCheck,
  FaTimes,
  FaDownload,
  FaFile,
  FaCalendar,
  FaUser,
  FaBuilding,
  FaDollarSign,
} from 'react-icons/fa'

// Utilidades para formatear datos
const obtenerColorEstado = (estado) => {
  const coloresEstado = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_revision: 'bg-blue-100 text-blue-800',
    aprobada: 'bg-green-100 text-green-800',
    denegada: 'bg-red-100 text-red-800',
    en_proceso: 'bg-purple-100 text-purple-800',
    completada: 'bg-gray-100 text-gray-800',
  }
  return coloresEstado[estado] || 'bg-gray-100 text-gray-800'
}

const formatearEstado = (estado) => {
  const etiquetasEstado = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    aprobada: 'Aprobada',
    denegada: 'Denegada',
    en_proceso: 'En Proceso',
    completada: 'Completada',
  }
  return etiquetasEstado[estado] || estado
}

const formatearTipoRequisicion = (tipo) => {
  const tipoLabels = {
    productos: 'Productos',
    servicios: 'Servicios',
    mantenimiento: 'Mantenimiento',
  }
  return tipoLabels[tipo] || tipo
}

const formatearUrgencia = (urgencia) => {
  const urgenciaLabels = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    critica: 'Crítica',
  }
  return urgenciaLabels[urgencia] || urgencia
}

// Componente para mostrar el historial
const HistorialSolicitud = ({ aprobaciones, solicitud }) => (
  <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
    <h3 className="text-xl font-semibold text-white mb-4">
      Historial de la Solicitud
    </h3>
    <div className="space-y-4">
      {/* Evento de creación */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">
              Solicitud Creada
            </span>
            <span className="text-xs text-gray-400">
              {new Date(solicitud.fecha_creacion).toLocaleString('es-MX')}
            </span>
          </div>
          <p className="text-sm text-gray-300">
            Por: {solicitud.solicitante.nombre_completo}
          </p>
        </div>
      </div>

      {/* Eventos de aprobaciones */}
      {aprobaciones &&
        aprobaciones.map((aprobacion, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                aprobacion.accion === 'aprobar'
                  ? 'bg-green-500'
                  : aprobacion.accion === 'denegar'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}
            ></div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">
                  {aprobacion.accion === 'aprobar'
                    ? 'Aprobada'
                    : aprobacion.accion === 'denegar'
                    ? 'Denegada'
                    : 'En Revisión'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(aprobacion.fecha_accion).toLocaleString('es-MX')}
                </span>
              </div>
              <p className="text-sm text-gray-300">
                Por: {aprobacion.aprobador.nombre_completo}
              </p>
              {aprobacion.comentarios && (
                <p className="text-sm text-gray-400 mt-1">
                  Comentarios: {aprobacion.comentarios}
                </p>
              )}
            </div>
          </div>
        ))}
    </div>
  </div>
)

// Componente para mostrar documentos
const SeccionDocumentos = ({ documentos }) => (
  <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
    <h3 className="text-xl font-semibold text-white mb-4">
      Documentos Adjuntos
    </h3>
    {documentos && documentos.length > 0 ? (
      <div className="space-y-3">
        {documentos.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <FaFile className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  {doc.nombre_archivo}
                </p>
                <p className="text-xs text-gray-400">
                  Subido el{' '}
                  {new Date(doc.fecha_subida).toLocaleDateString('es-MX')}
                  {doc.usuario_subida &&
                    ` por ${doc.usuario_subida.nombre_completo}`}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                // Aquí implementarías la descarga del archivo
                alert(`Descargando ${doc.nombre_archivo}`)
              }}
              className="p-2"
            >
              <FaDownload className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400 text-center py-4">
        No hay documentos adjuntos
      </p>
    )}
  </div>
)

// Componente para mostrar los ítems de la solicitud
const SeccionItems = ({ items }) => (
  <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
    <h3 className="text-xl font-semibold text-white mb-4">Ítems Solicitados</h3>
    {items && items.length > 0 ? (
      <TablaItemsSolicitud items={items} readonly={true} />
    ) : (
      <p className="text-gray-400 text-center py-4">No hay ítems registrados</p>
    )}
  </div>
)

const DetalleSolicitud = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Estados principales
  const [solicitud, setSolicitud] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Estados de pestañas
  const [pestanaActiva, setPestanaActiva] = useState('detalles')

  // Estados de modales
  const [modalAprobacionAbierto, setModalAprobacionAbierto] = useState(false)
  const [tipoAccion, setTipoAccion] = useState('')
  const [comentarios, setComentarios] = useState('')

  // Cargar detalles de la solicitud
  const cargarDetallesSolicitud = async () => {
    setCargando(true)
    try {
      if (!id) {
        throw new Error('ID de solicitud requerido')
      }

      const response = await solicitudesService.getById(id)
      setSolicitud(response.data || response)
    } catch (error) {
      console.error('Error al cargar solicitud:', error)
      setError(`Error al cargar los detalles: ${error.message}`)

      // Si es error 404, mostrar mensaje específico
      if (
        error.message.includes('404') ||
        error.message.includes('no encontrada')
      ) {
        setError(`La solicitud con ID "${id}" no fue encontrada.`)
      }
    } finally {
      setCargando(false)
    }
  }

  // Efectos
  useEffect(() => {
    if (id) {
      cargarDetallesSolicitud()
    }
  }, [id])

  // Funciones de acciones
  const abrirModalAprobacion = (tipo) => {
    setTipoAccion(tipo)
    setModalAprobacionAbierto(true)
  }

  const cerrarModalAprobacion = () => {
    setModalAprobacionAbierto(false)
    setTipoAccion('')
    setComentarios('')
  }

  const manejarCambioEstado = async () => {
    try {
      const nuevoEstado = tipoAccion === 'aprobar' ? 'aprobada' : 'denegada'

      await solicitudesService.updateStatus(
        solicitud.id_solicitud,
        nuevoEstado,
        comentarios
      )

      // Actualizar estado local
      setSolicitud((prev) => ({
        ...prev,
        estatus: nuevoEstado,
        aprobaciones: [
          ...prev.aprobaciones,
          {
            id_aprobacion: Date.now(),
            accion: tipoAccion === 'aprobar' ? 'aprobar' : 'denegar',
            comentarios: comentarios,
            fecha_accion: new Date().toISOString(),
            aprobador: {
              nombre_completo: user.nombre_completo,
              numero_empleado: user.numero_empleado,
            },
          },
        ],
      }))

      alert(`Solicitud ${formatearEstado(nuevoEstado)} con éxito`)
      cerrarModalAprobacion()
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      alert(`Error al actualizar el estado: ${error.message}`)
    }
  }

  // Función para formatear moneda
  const formatearMoneda = (cantidad) => {
    if (!cantidad) return 'No especificado'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(cantidad)
  }

  if (cargando) {
    return (
      <SolicitudesLayout title="Cargando...">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">
            Cargando detalles de la solicitud...
          </div>
        </div>
      </SolicitudesLayout>
    )
  }

  if (error || !solicitud) {
    return (
      <SolicitudesLayout title="Error" showBackButton={true}>
        <div className="text-center text-gray-400">
          <p className="text-xl font-semibold mb-4">
            {error || `La solicitud con ID "${id}" no fue encontrada.`}
          </p>
        </div>
      </SolicitudesLayout>
    )
  }

  // Crear botones para el header
  const botonesHeader = (
    <>
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${obtenerColorEstado(
          solicitud.estatus
        )}`}
      >
        {formatearEstado(solicitud.estatus)}
      </span>

      {/* Botones de acción según permisos */}
      {(user.rol === 'aprobador' || user.rol === 'admin_sistema') &&
        solicitud.estatus === 'pendiente' && (
          <>
            <Button
              variant="primary"
              onClick={() => abrirModalAprobacion('aprobar')}
              icon={FaCheck}
            >
              Aprobar
            </Button>
            <Button
              variant="danger"
              onClick={() => abrirModalAprobacion('denegar')}
              icon={FaTimes}
            >
              Denegar
            </Button>
          </>
        )}

      {/* Botón de editar para el solicitante o admin */}
      {(solicitud.solicitante.id_usuario === user.id ||
        user.rol === 'admin_sistema') &&
        (solicitud.estatus === 'pendiente' ||
          solicitud.estatus === 'denegada') && (
          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/solicitudes/${solicitud.id_solicitud}/editar`)
            }
            icon={FaEdit}
          >
            Editar
          </Button>
        )}
    </>
  )

  return (
    <SolicitudesLayout
      title={`Solicitud: ${solicitud.folio_solicitud}`}
      subtitle={`${formatearTipoRequisicion(
        solicitud.tipo_requisicion
      )} • ${formatearUrgencia(solicitud.urgencia)}`}
      rightContent={botonesHeader}
    >
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center space-x-3">
            <FaUser className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Solicitante</p>
              <p className="font-semibold text-white">
                {solicitud.solicitante.nombre_completo}
              </p>
              <p className="text-xs text-gray-400">
                {solicitud.solicitante.numero_empleado}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center space-x-3">
            <FaBuilding className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Departamento</p>
              <p className="font-semibold text-white">
                {solicitud.departamento.nombre_departamento}
              </p>
              <p className="text-xs text-gray-400">
                {solicitud.departamento.codigo_departamento}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center space-x-3">
            <FaCalendar className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Fecha de Creación</p>
              <p className="font-semibold text-white">
                {new Date(solicitud.fecha_creacion).toLocaleDateString('es-MX')}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(solicitud.fecha_creacion).toLocaleTimeString('es-MX')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center space-x-3">
            <FaDollarSign className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Presupuesto Estimado</p>
              <p className="font-semibold text-white">
                {formatearMoneda(solicitud.presupuesto_estimado)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-4">
          {[
            { id: 'detalles', label: 'Detalles' },
            { id: 'items', label: 'Ítems' },
            { id: 'historial', label: 'Historial' },
            { id: 'documentos', label: 'Documentos' },
          ].map((pestana) => (
            <button
              key={pestana.id}
              onClick={() => setPestanaActiva(pestana.id)}
              className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                pestanaActiva === pestana.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {pestana.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de pestañas */}
      <div className="space-y-6">
        {pestanaActiva === 'detalles' && (
          <div className="space-y-6">
            {/* Descripción detallada */}
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-semibold text-white mb-4">
                Descripción Detallada
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {solicitud.descripcion_detallada}
              </p>
            </div>

            {/* Justificación */}
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-semibold text-white mb-4">
                Justificación
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {solicitud.justificacion}
              </p>
            </div>

            {/* Comentarios generales */}
            {solicitud.comentarios_generales && (
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Comentarios Generales
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {solicitud.comentarios_generales}
                </p>
              </div>
            )}

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-white mb-2">
                  Información de Seguimiento
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Folio:</span>
                    <span className="text-blue-400 font-mono">
                      {solicitud.folio_solicitud}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-white">
                      {formatearTipoRequisicion(solicitud.tipo_requisicion)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Urgencia:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        solicitud.urgencia === 'critica'
                          ? 'bg-red-100 text-red-800'
                          : solicitud.urgencia === 'alta'
                          ? 'bg-orange-100 text-orange-800'
                          : solicitud.urgencia === 'media'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {formatearUrgencia(solicitud.urgencia)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estado:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${obtenerColorEstado(
                        solicitud.estatus
                      )}`}
                    >
                      {formatearEstado(solicitud.estatus)}
                    </span>
                  </div>
                  {solicitud.fecha_necesidad && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fecha Necesidad:</span>
                      <span className="text-white">
                        {new Date(solicitud.fecha_necesidad).toLocaleDateString(
                          'es-MX'
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-white mb-2">
                  Información del Solicitante
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nombre:</span>
                    <span className="text-white">
                      {solicitud.solicitante.nombre_completo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Empleado:</span>
                    <span className="text-white">
                      {solicitud.solicitante.numero_empleado}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-blue-400">
                      {solicitud.solicitante.correo_institucional}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Departamento:</span>
                    <span className="text-white">
                      {solicitud.departamento.nombre_departamento}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {pestanaActiva === 'items' && <SeccionItems items={solicitud.items} />}

        {pestanaActiva === 'historial' && (
          <HistorialSolicitud
            aprobaciones={solicitud.aprobaciones}
            solicitud={solicitud}
          />
        )}

        {pestanaActiva === 'documentos' && (
          <SeccionDocumentos documentos={solicitud.documentos} />
        )}
      </div>

      {/* Modal de aprobación/denegación */}
      <Modal
        isOpen={modalAprobacionAbierto}
        onClose={cerrarModalAprobacion}
        title={
          tipoAccion === 'aprobar' ? 'Aprobar Solicitud' : 'Denegar Solicitud'
        }
        footer={
          <>
            <Button variant="secondary" onClick={cerrarModalAprobacion}>
              Cancelar
            </Button>
            <Button
              variant={tipoAccion === 'aprobar' ? 'primary' : 'danger'}
              onClick={manejarCambioEstado}
            >
              {tipoAccion === 'aprobar' ? 'Aprobar' : 'Denegar'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-white mb-2">
              Resumen de la Solicitud
            </h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-400">Folio:</span>{' '}
                <span className="text-blue-400">
                  {solicitud.folio_solicitud}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Solicitante:</span>{' '}
                <span className="text-white">
                  {solicitud.solicitante.nombre_completo}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Presupuesto:</span>{' '}
                <span className="text-white">
                  {formatearMoneda(solicitud.presupuesto_estimado)}
                </span>
              </div>
            </div>
          </div>

          <TextArea
            label="Comentarios (Opcional)"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder={`Agregue comentarios sobre ${
              tipoAccion === 'aprobar' ? 'la aprobación' : 'la denegación'
            } de esta solicitud...`}
            rows={4}
          />

          <p className="text-gray-300 text-sm">
            ¿Está seguro de que desea{' '}
            {tipoAccion === 'aprobar' ? 'aprobar' : 'denegar'} esta solicitud?
            {tipoAccion === 'denegar' &&
              ' Esta acción cambiará el estado de la solicitud a "Denegada".'}
          </p>
        </div>
      </Modal>
    </SolicitudesLayout>
  )
}

export default DetalleSolicitud
