// ListaSolicitudes/index.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import solicitudesService from '../../../services/requestService'
import { useAuth } from '../../../hooks/useAuth'
import SolicitudesLayout from '../../../components/layouts/SolicitudesLayout'
import Button from '../../../components/common/Button'
import FiltrosSolicitudes from './FiltrosSolicitudes'
import TablaSolicitudes from './TablaSolicitudes'
import ModalConfirmacion from './ModalConfirmacion'
import { formatearEstado } from './utils'

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

  // Manejadores de eventos de filtros
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

  // Manejadores de acciones de solicitudes
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

  const manejarEdicion = (solicitudId) => {
    navigate(`/solicitudes/${solicitudId}/editar`)
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
        <FiltrosSolicitudes
          terminoBusqueda={terminoBusqueda}
          filtroEstado={filtroEstado}
          filtroTipo={filtroTipo}
          filtroUrgencia={filtroUrgencia}
          onCambioBusqueda={manejarCambioBusqueda}
          onCambioFiltro={manejarCambioFiltro}
          onLimpiarFiltros={limpiarFiltros}
          totalSolicitudes={solicitudes.length}
        />

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

        {/* Tabla de solicitudes */}
        <TablaSolicitudes
          solicitudes={solicitudes}
          user={user}
          onAprobar={(solicitud) => abrirModalConfirmacion(solicitud, 'aprobar')}
          onDenegar={(solicitud) => abrirModalConfirmacion(solicitud, 'denegar')}
          onEditar={manejarEdicion}
          onEliminar={manejarEliminacion}
          onLimpiarFiltros={limpiarFiltros}
        />

        {/* Modal de confirmación personalizado */}
        <ModalConfirmacion
          isOpen={modalConfirmacionAbierto}
          onClose={cerrarModalConfirmacion}
          solicitud={solicitudSeleccionada}
          tipoAccion={tipoAccion}
          onConfirmar={manejarCambioEstado}
        />
      </div>
    </SolicitudesLayout>
  )
}

export default ListaSolicitudes