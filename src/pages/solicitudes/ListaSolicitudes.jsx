import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import solicitudesService from '../../services/requestService'
import { useAuth } from '../../hooks/useAuth'
import SolicitudesLayout from '../../components/layouts/SolicitudesLayout'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import {
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter
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

const formatearFecha = (fechaString) => {
  if (!fechaString) return 'N/A'
  return new Date(fechaString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatearMoneda = (cantidad) => {
  if (!cantidad) return 'N/A'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(cantidad)
}

const ListaSolicitudes = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Estados principales
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [montado, setMontado] = useState(false)

  // Estados de filtros y búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroUrgencia, setFiltroUrgencia] = useState('todas')

  // Estados de modales
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null)
  const [tipoAccion, setTipoAccion] = useState('')

  // Cargar solicitudes
  const cargarSolicitudes = async () => {
    if (cargando || !user) return
    
    setCargando(true)
    try {
      const params = {}

      if (terminoBusqueda.trim()) params.search = terminoBusqueda.trim()
      if (filtroEstado !== 'todas') params.estatus = filtroEstado
      if (filtroTipo !== 'todos') params.tipo_requisicion = filtroTipo
      if (filtroUrgencia !== 'todas') params.urgencia = filtroUrgencia

      console.log('Cargando solicitudes con parámetros:', params)

      const response = await solicitudesService.getAll(params)
      setSolicitudes(response.solicitudes || response.data || [])
      setError('')
    } catch (error) {
      console.error('Error al cargar solicitudes:', error)
      
      if (error.response?.status === 401) {
        return
      }
      
      setError(`Error al cargar las solicitudes: ${error.message}`)
      setSolicitudes([])
    } finally {
      setCargando(false)
      if (!montado) setMontado(true)
    }
  }

  // Efectos
  useEffect(() => {
    if (user && !cargando) {
      cargarSolicitudes()
    }
  }, [user])

  useEffect(() => {
    if (!montado || !user) return

    const timeoutId = setTimeout(() => {
      cargarSolicitudes()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [terminoBusqueda, filtroEstado, filtroTipo, filtroUrgencia])

  // Manejadores de eventos
  const manejarCambioBusqueda = (e) => {
    setTerminoBusqueda(e.target.value)
  }

  const manejarCambioFiltro = (tipoFiltro, valor) => {
    switch (tipoFiltro) {
      case 'estado':
        setFiltroEstado(valor)
        break
      case 'tipo':
        setFiltroTipo(valor)
        break
      case 'urgencia':
        setFiltroUrgencia(valor)
        break
    }
  }

  const limpiarFiltros = () => {
    setTerminoBusqueda('')
    setFiltroEstado('todas')
    setFiltroTipo('todos')
    setFiltroUrgencia('todas')
  }

  const abrirModalConfirmacion = (solicitud, tipo) => {
    setSolicitudSeleccionada(solicitud)
    setTipoAccion(tipo)
    setModalConfirmacionAbierto(true)
  }

  const cerrarModalConfirmacion = () => {
    setModalConfirmacionAbierto(false)
    setSolicitudSeleccionada(null)
    setTipoAccion('')
  }

  const manejarCambioEstado = async () => {
    if (solicitudSeleccionada && tipoAccion) {
      try {
        const nuevoEstado = tipoAccion === 'aprobar' ? 'aprobada' : 'denegada'

        await solicitudesService.updateStatus(
          solicitudSeleccionada.id_solicitud,
          nuevoEstado,
          'Estado actualizado desde la gestión de solicitudes'
        )

        setSolicitudes(
          solicitudes.map((sol) =>
            sol.id_solicitud === solicitudSeleccionada.id_solicitud
              ? { ...sol, estatus: nuevoEstado }
              : sol
          )
        )

        alert(
          `Solicitud ${solicitudSeleccionada.folio_solicitud} ha sido ${formatearEstado(
            nuevoEstado
          )} con éxito.`
        )
        cerrarModalConfirmacion()
      } catch (error) {
        console.error('Error al actualizar estado:', error)
        alert(`Error al actualizar el estado: ${error.message}`)
      }
    }
  }

  const manejarEliminacion = async (solicitudId, folio) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar la solicitud ${folio}?`
      )
    ) {
      try {
        await solicitudesService.delete(solicitudId)

        setSolicitudes(
          solicitudes.filter((sol) => sol.id_solicitud !== solicitudId)
        )
        alert(`Solicitud ${folio} eliminada.`)
      } catch (error) {
        console.error('Error al eliminar solicitud:', error)
        alert(`Error al eliminar la solicitud: ${error.message}`)
      }
    }
  }

  // Renderizado de estados de carga y error
  if (!user) {
    return (
      <SolicitudesLayout title="Cargando...">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Verificando autenticación...</div>
        </div>
      </SolicitudesLayout>
    )
  }

  if (cargando && !montado) {
    return (
      <SolicitudesLayout title="Cargando...">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Cargando solicitudes...</div>
        </div>
      </SolicitudesLayout>
    )
  }

  if (error && !montado) {
    return (
      <SolicitudesLayout title="Error">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
          <Button variant="primary" onClick={cargarSolicitudes} className="mt-4">
            Reintentar
          </Button>
        </div>
      </SolicitudesLayout>
    )
  }

  // Crear botón para el header
  const botonNuevaSolicitud = (
    <Button
      variant="primary"
      icon={FaPlus}
      onClick={() => navigate('/solicitudes/crear')}
    >
      Nueva Solicitud
    </Button>
  )

  return (
    <SolicitudesLayout 
      title="Gestionar Solicitudes" 
      showBackButton={false}
      rightContent={botonNuevaSolicitud}
    >
      {/* Filtros y búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por folio, descripción o solicitante..."
            value={terminoBusqueda}
            onChange={manejarCambioBusqueda}
            className="pl-10"
          />
        </div>

        <Select
          value={filtroEstado}
          onChange={(e) => manejarCambioFiltro('estado', e.target.value)}
          options={[
            { value: 'todas', label: 'Todos los Estados' },
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'en_revision', label: 'En Revisión' },
            { value: 'aprobada', label: 'Aprobada' },
            { value: 'denegada', label: 'Denegada' },
            { value: 'en_proceso', label: 'En Proceso' },
            { value: 'completada', label: 'Completada' },
          ]}
        />

        <Select
          value={filtroTipo}
          onChange={(e) => manejarCambioFiltro('tipo', e.target.value)}
          options={[
            { value: 'todos', label: 'Todos los Tipos' },
            { value: 'productos', label: 'Productos' },
            { value: 'servicios', label: 'Servicios' },
            { value: 'mantenimiento', label: 'Mantenimiento' },
          ]}
        />

        <Select
          value={filtroUrgencia}
          onChange={(e) => manejarCambioFiltro('urgencia', e.target.value)}
          options={[
            { value: 'todas', label: 'Todas las Urgencias' },
            { value: 'baja', label: 'Baja' },
            { value: 'media', label: 'Media' },
            { value: 'alta', label: 'Alta' },
            { value: 'critica', label: 'Crítica' },
          ]}
        />
      </div>

      {/* Resumen */}
      <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg mb-6">
        <p className="text-gray-300">
          Mostrando{' '}
          <span className="font-semibold text-white">{solicitudes.length}</span>{' '}
          solicitudes en total
        </p>

        {(terminoBusqueda || filtroEstado !== 'todas' || filtroTipo !== 'todos' || filtroUrgencia !== 'todas') && (
          <Button variant="secondary" onClick={limpiarFiltros} size="sm">
            Limpiar Filtros
          </Button>
        )}
      </div>

      {/* Error durante operación */}
      {error && montado && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-red-400">
            <span>Error: {error}</span>
            <Button variant="secondary" size="sm" onClick={cargarSolicitudes}>
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {/* Indicador de carga */}
      {cargando && montado && (
        <div className="text-center py-4">
          <div className="text-gray-400">Actualizando resultados...</div>
        </div>
      )}

      {/* Tabla de solicitudes */}
      <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">
                Folio
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Solicitante
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Urgencia
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Presupuesto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {solicitudes.length > 0 ? (
              solicitudes.map((solicitud, index) => (
                <tr
                  key={solicitud.id_solicitud || `solicitud-${index}`}
                  className="hover:bg-gray-750 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-400">
                    {solicitud.folio_solicitud || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    <span className="px-2 py-1 bg-gray-600 rounded-full text-xs">
                      {formatearTipoRequisicion(solicitud.tipo_requisicion)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 max-w-xs">
                    <div
                      className="truncate"
                      title={solicitud.descripcion_detallada}
                    >
                      {solicitud.descripcion_detallada || 'Sin descripción'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    <div>
                      <div className="font-medium">
                        {solicitud.solicitante?.nombre_completo || solicitud.usuario?.nombre_completo || 'N/A'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {solicitud.solicitante?.numero_empleado || solicitud.usuario?.numero_empleado || ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    <div>
                      <div className="font-medium">
                        {solicitud.departamento?.nombre_departamento || 'N/A'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {solicitud.departamento?.codigo_departamento || ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatearMoneda(solicitud.presupuesto_estimado)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
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
                    <div className="flex justify-end space-x-2">
                      <Link to={`/solicitudes/${solicitud.id_solicitud}`}>
                        <Button
                          variant="secondary"
                          className="p-2 rounded-full"
                          title="Ver Detalles"
                        >
                          <FaEye className="w-4 h-4" />
                        </Button>
                      </Link>

                      {/* Botones de aprobación para usuarios con permisos */}
                      {(user?.rol === 'aprobador' ||
                        user?.rol === 'admin_sistema') &&
                        solicitud.estatus === 'pendiente' && (
                          <>
                            <Button
                              variant="primary"
                              onClick={() =>
                                abrirModalConfirmacion(solicitud, 'aprobar')
                              }
                              className="p-2 rounded-full"
                              title="Aprobar"
                            >
                              <FaCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() =>
                                abrirModalConfirmacion(solicitud, 'denegar')
                              }
                              className="p-2 rounded-full"
                              title="Denegar"
                            >
                              <FaTimes className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                      {/* Botón de editar para el solicitante o admin */}
                      {(solicitud.solicitante_id === user?.id_usuario ||
                        user?.rol === 'admin_sistema') &&
                        (solicitud.estatus === 'pendiente' ||
                          solicitud.estatus === 'denegada') && (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              navigate(
                                `/solicitudes/${solicitud.id_solicitud}/editar`
                              )
                            }
                            className="p-2 rounded-full"
                            title="Editar"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Button>
                        )}

                      {/* Botón de eliminar para admin o solicitante (si está pendiente) */}
                      {((solicitud.solicitante_id === user?.id_usuario &&
                        solicitud.estatus === 'pendiente') ||
                        user?.rol === 'admin_sistema') && (
                        <Button
                          variant="danger"
                          onClick={() =>
                            manejarEliminacion(
                              solicitud.id_solicitud,
                              solicitud.folio_solicitud
                            )
                          }
                          className="p-2 rounded-full"
                          title="Eliminar"
                        >
                          <FaTrash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-8 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <FaFilter className="w-8 h-8 text-gray-500" />
                    <p>
                      No se encontraron solicitudes que coincidan con los
                      criterios.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={limpiarFiltros}
                      className="mt-2"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={modalConfirmacionAbierto}
        onClose={cerrarModalConfirmacion}
        title={
          tipoAccion === 'aprobar'
            ? 'Confirmar Aprobación'
            : 'Confirmar Denegación'
        }
        footer={
          <>
            <Button variant="secondary" onClick={cerrarModalConfirmacion}>
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
        <div className="text-gray-300">
          <p className="mb-4">
            ¿Estás seguro de que quieres{' '}
            {tipoAccion === 'aprobar' ? 'aprobar' : 'denegar'} la solicitud?
          </p>

          {solicitudSeleccionada && (
            <div className="bg-gray-700 p-4 rounded-lg space-y-2">
              <div>
                <span className="font-semibold text-white">Folio:</span>
                <span className="ml-2 text-blue-400">
                  {solicitudSeleccionada.folio_solicitud}
                </span>
              </div>
              <div>
                <span className="font-semibold text-white">Descripción:</span>
                <span className="ml-2">
                  {solicitudSeleccionada.descripcion_detallada}
                </span>
              </div>
              <div>
                <span className="font-semibold text-white">Solicitante:</span>
                <span className="ml-2">
                  {solicitudSeleccionada.solicitante?.nombre_completo || solicitudSeleccionada.usuario?.nombre_completo || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-white">Presupuesto:</span>
                <span className="ml-2">
                  {formatearMoneda(solicitudSeleccionada.presupuesto_estimado)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </SolicitudesLayout>
  )
}

export default ListaSolicitudes