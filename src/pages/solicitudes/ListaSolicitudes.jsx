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
    pendiente: 'bg-amber-900/50 text-amber-200 border border-amber-600',
    en_revision: 'bg-blue-900/50 text-blue-200 border border-blue-600',
    aprobada: 'bg-emerald-900/50 text-emerald-200 border border-emerald-600',
    denegada: 'bg-red-900/50 text-red-200 border border-red-600',
    en_proceso: 'bg-purple-900/50 text-purple-200 border border-purple-600',
    completada: 'bg-slate-600 text-slate-200 border border-slate-500',
  }
  return coloresEstado[estado] || 'bg-slate-600 text-slate-200 border border-slate-500'
}

const obtenerColorUrgencia = (urgencia) => {
  const coloresUrgencia = {
    critica: 'bg-red-900/50 text-red-200 border border-red-600',
    alta: 'bg-orange-900/50 text-orange-200 border border-orange-600',
    media: 'bg-amber-900/50 text-amber-200 border border-amber-600',
    baja: 'bg-emerald-900/50 text-emerald-200 border border-emerald-600',
  }
  return coloresUrgencia[urgencia] || 'bg-slate-600 text-slate-200 border border-slate-500'
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
          <div className="text-slate-100 text-lg">Verificando autenticación...</div>
        </div>
      </SolicitudesLayout>
    )
  }

  if (cargando && !montado) {
    return (
      <SolicitudesLayout title="Cargando...">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-100 text-lg">Cargando solicitudes...</div>
        </div>
      </SolicitudesLayout>
    )
  }

  if (error && !montado) {
    return (
      <SolicitudesLayout title="Error">
        <div className="text-center text-red-300">
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
      className="w-full sm:w-auto"
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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filtros y búsqueda */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            Filtros de Búsqueda
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar por folio, descripción..."
                value={terminoBusqueda}
                onChange={manejarCambioBusqueda}
                className="pl-10"
              />
            </div>

            <Select
              label="Estado"
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
              label="Tipo"
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
              label="Urgencia"
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
        </div>

        {/* Resumen */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-700 border border-slate-600 p-4 rounded-lg mb-6 gap-4">
          <p className="text-slate-200">
            Mostrando{' '}
            <span className="font-semibold text-blue-300">{solicitudes.length}</span>{' '}
            solicitudes en total
          </p>

          {(terminoBusqueda || filtroEstado !== 'todas' || filtroTipo !== 'todos' || filtroUrgencia !== 'todas') && (
            <Button 
              variant="secondary" 
              onClick={limpiarFiltros} 
              size="sm"
              className="w-full sm:w-auto"
            >
              Limpiar Filtros
            </Button>
          )}
        </div>

        {/* Error durante operación */}
        {error && montado && (
          <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-red-300">
              <span className="flex-1">Error: {error}</span>
              <Button variant="secondary" size="sm" onClick={cargarSolicitudes}>
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Indicador de carga */}
        {cargando && montado && (
          <div className="text-center py-4">
            <div className="text-slate-300">Actualizando resultados...</div>
          </div>
        )}

        {/* Vista de tabla para desktop y cards para móvil */}
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
                    <tr
                      key={solicitud.id_solicitud || `solicitud-${index}`}
                      className="hover:bg-slate-700 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-300">
                        {solicitud.folio_solicitud || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
                        <span className="px-2 py-1 bg-slate-600 border border-slate-500 rounded-full text-xs">
                          {formatearTipoRequisicion(solicitud.tipo_requisicion)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-200 max-w-xs">
                        <div
                          className="truncate"
                          title={solicitud.descripcion_detallada}
                        >
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorUrgencia(solicitud.urgencia)}`}
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
                        <div className="flex justify-end space-x-1">
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
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <FaFilter className="w-12 h-12 text-slate-500" />
                        <div>
                          <p className="text-lg font-medium text-slate-300 mb-2">
                            No se encontraron solicitudes
                          </p>
                          <p className="text-sm">
                            No hay solicitudes que coincidan con los criterios de búsqueda.
                          </p>
                        </div>
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

          {/* Vista de cards (móvil/tablet) */}
          <div className="lg:hidden divide-y divide-slate-600">
            {solicitudes.length > 0 ? (
              solicitudes.map((solicitud, index) => (
                <div
                  key={solicitud.id_solicitud || `solicitud-${index}`}
                  className="p-4 sm:p-6 hover:bg-slate-700 transition-colors"
                >
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
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={FaEye}
                        >
                          Ver
                        </Button>
                      </Link>

                      {/* Botones de aprobación para usuarios con permisos */}
                      {(user?.rol === 'aprobador' ||
                        user?.rol === 'admin_sistema') &&
                        solicitud.estatus === 'pendiente' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                abrirModalConfirmacion(solicitud, 'aprobar')
                              }
                              icon={FaCheck}
                            >
                              Aprobar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                abrirModalConfirmacion(solicitud, 'denegar')
                              }
                              icon={FaTimes}
                            >
                              Denegar
                            </Button>
                          </>
                        )}

                      {/* Botón de editar para el solicitante o admin */}
                      {/* Botón de editar para el solicitante o admin */}
                      {(solicitud.solicitante_id === user?.id_usuario ||
                        user?.rol === 'admin_sistema') &&
                        (solicitud.estatus === 'pendiente' ||
                          solicitud.estatus === 'denegada') && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/solicitudes/${solicitud.id_solicitud}/editar`
                              )
                            }
                            icon={FaEdit}
                          >
                            Editar
                          </Button>
                        )}

                      {/* Botón de eliminar para admin o solicitante (si está pendiente) */}
                      {((solicitud.solicitante_id === user?.id_usuario &&
                        solicitud.estatus === 'pendiente') ||
                        user?.rol === 'admin_sistema') && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            manejarEliminacion(
                              solicitud.id_solicitud,
                              solicitud.folio_solicitud
                            )
                          }
                          icon={FaTrash}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 sm:p-12 text-center text-slate-400">
                <div className="flex flex-col items-center space-y-4">
                  <FaFilter className="w-16 h-16 text-slate-500" />
                  <div>
                    <p className="text-lg font-medium text-slate-300 mb-2">
                      No se encontraron solicitudes
                    </p>
                    <p className="text-sm">
                      No hay solicitudes que coincidan con los criterios de búsqueda.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={limpiarFiltros}
                    className="mt-2"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Button 
                variant="secondary" 
                onClick={cerrarModalConfirmacion}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                variant={tipoAccion === 'aprobar' ? 'primary' : 'danger'}
                onClick={manejarCambioEstado}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {tipoAccion === 'aprobar' ? 'Aprobar' : 'Denegar'}
              </Button>
            </div>
          }
        >
          <div className="text-slate-200">
            <p className="mb-4">
              ¿Estás seguro de que quieres{' '}
              {tipoAccion === 'aprobar' ? 'aprobar' : 'denegar'} la solicitud?
            </p>

            {solicitudSeleccionada && (
              <div className="bg-slate-700 border border-slate-600 p-4 rounded-lg space-y-3">
                <div>
                  <span className="font-semibold text-slate-100">Folio:</span>
                  <span className="ml-2 text-blue-300">
                    {solicitudSeleccionada.folio_solicitud}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-100">Descripción:</span>
                  <p className="mt-1 text-slate-200">
                    {solicitudSeleccionada.descripcion_detallada}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-100">Solicitante:</span>
                  <span className="ml-2 text-slate-200">
                    {solicitudSeleccionada.solicitante?.nombre_completo || solicitudSeleccionada.usuario?.nombre_completo || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-100">Presupuesto:</span>
                  <span className="ml-2 text-emerald-300 font-medium">
                    {formatearMoneda(solicitudSeleccionada.presupuesto_estimado)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </SolicitudesLayout>
  )
}

export default ListaSolicitudes