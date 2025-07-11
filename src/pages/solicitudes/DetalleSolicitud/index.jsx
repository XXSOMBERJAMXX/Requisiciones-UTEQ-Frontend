// DetalleSolicitud/index.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FaEdit,
  FaCheck,
  FaTimes,
  FaCalendar,
  FaUser,
  FaBuilding,
  FaDollarSign,
} from 'react-icons/fa'
import solicitudesService from '../../../services/requestService'
import { useAuth } from '../../../hooks/useAuth'
import SolicitudesLayout from '../../../components/layouts/SolicitudesLayout'
import Button from '../../../components/common/Button'
import { HistorialSolicitud, SeccionDocumentos, SeccionItems, SeccionDetalles } from './SeccionesDetalle'
import ModalAprobacion from './ModalAprobacion'
import { 
  obtenerColorEstado, 
  formatearEstado, 
  formatearTipoRequisicion, 
  formatearUrgencia, 
  formatearMoneda, 
  formatearFecha,
  formatearFechaHora,
  verificarPermisos 
} from './utils'

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
          ...(prev.aprobaciones || []),
          {
            id_aprobacion: Date.now(),
            accion: tipoAccion === 'aprobar' ? 'aprobar' : 'denegar',
            comentarios: comentarios,
            fecha_accion: new Date().toISOString(),
            aprobador: {
              nombre_completo: user?.nombre_completo || 'Usuario actual',
              numero_empleado: user?.numero_empleado || '',
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

  // Renderizado de estados de carga y error
  if (cargando) {
    return (
      <SolicitudesLayout title="Cargando...">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-100 text-lg">
            Cargando detalles de la solicitud...
          </div>
        </div>
      </SolicitudesLayout>
    )
  }

  if (error || !solicitud) {
    return (
      <SolicitudesLayout title="Error" showBackButton={true}>
        <div className="text-center text-slate-400">
          <p className="text-xl font-semibold mb-4">
            {error || `La solicitud con ID "${id}" no fue encontrada.`}
          </p>
          <Button variant="primary" onClick={() => navigate('/solicitudes')}>
            Volver a Solicitudes
          </Button>
        </div>
      </SolicitudesLayout>
    )
  }

  // Verificar permisos
  const permisos = verificarPermisos(solicitud, user)

  // Crear botones para el header
  const botonesHeader = (
    <div className="flex flex-wrap items-center gap-3">
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${obtenerColorEstado(solicitud.estatus)}`}>
        {formatearEstado(solicitud.estatus)}
      </span>

      {/* Botones de acción según permisos */}
      {permisos.puedeAprobar && (
        <>
          <Button
            variant="primary"
            onClick={() => abrirModalAprobacion('aprobar')}
            icon={FaCheck}
            size="sm"
          >
            Aprobar
          </Button>
          <Button
            variant="danger"
            onClick={() => abrirModalAprobacion('denegar')}
            icon={FaTimes}
            size="sm"
          >
            Denegar
          </Button>
        </>
      )}

      {/* Botón de editar */}
      {permisos.puedeEditar && (
        <Button
          variant="secondary"
          onClick={() => navigate(`/solicitudes/${solicitud.id_solicitud}/editar`)}
          icon={FaEdit}
          size="sm"
        >
          Editar
        </Button>
      )}
    </div>
  )

  return (
    <SolicitudesLayout
      title={`Solicitud: ${solicitud.folio_solicitud}`}
      subtitle={`${formatearTipoRequisicion(
        solicitud.tipo_requisicion
      )} • ${formatearUrgencia(solicitud.urgencia)}`}
      rightContent={botonesHeader}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-4">
              <FaUser className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-400 mb-1">Solicitante</p>
                <p className="font-semibold text-slate-100 truncate">
                  {solicitud.solicitante?.nombre_completo || 'N/A'}
                </p>
                <p className="text-xs text-slate-400">
                  {solicitud.solicitante?.numero_empleado || ''}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-4">
              <FaBuilding className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-400 mb-1">Departamento</p>
                <p className="font-semibold text-slate-100 truncate">
                  {solicitud.departamento?.nombre_departamento || 'N/A'}
                </p>
                <p className="text-xs text-slate-400">
                  {solicitud.departamento?.codigo_departamento || ''}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-4">
              <FaCalendar className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-400 mb-1">Fecha de Creación</p>
                <p className="font-semibold text-slate-100">
                  {formatearFecha(solicitud.fecha_creacion)}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(solicitud.fecha_creacion).toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-4">
              <FaDollarSign className="w-8 h-8 text-purple-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-400 mb-1">Presupuesto Estimado</p>
                <p className="font-semibold text-slate-100">
                  {formatearMoneda(solicitud.presupuesto_estimado)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-6 border-b border-slate-600">
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
                className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                  pestanaActiva === pestana.id
                    ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {pestana.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de pestañas */}
        <div className="space-y-6">
          {pestanaActiva === 'detalles' && <SeccionDetalles solicitud={solicitud} />}
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
        <ModalAprobacion
          isOpen={modalAprobacionAbierto}
          onClose={cerrarModalAprobacion}
          tipoAccion={tipoAccion}
          comentarios={comentarios}
          setComentarios={setComentarios}
          solicitud={solicitud}
          onConfirmar={manejarCambioEstado}
        />
      </div>
    </SolicitudesLayout>
  )
}

export default DetalleSolicitud