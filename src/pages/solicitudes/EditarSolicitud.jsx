import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import solicitudesService from '../../services/solicitudesService'
import { useAuth } from '../../hooks/useAuth'
import SolicitudesLayout from '../../components/layouts/SolicitudesLayout'
import TablaItemsSolicitud from '../../components/solicitudes/TablaItemsSolicitud'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import TextArea from '../../components/common/TextArea'
import Button from '../../components/common/Button'
import {
  FaPlus,
  FaSave,
  FaUpload,
  FaTrash,
  FaDownload,
  FaTimes,
} from 'react-icons/fa'

const EditarSolicitud = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Estados principales
  const [solicitudOriginal, setSolicitudOriginal] = useState(null)
  const [cargandoSolicitud, setCargandoSolicitud] = useState(true)

  // Estado del formulario principal
  const [datosSolicitud, setDatosSolicitud] = useState({
    tipo_requisicion: 'productos',
    descripcion_detallada: '',
    cantidad: '',
    justificacion: '',
    urgencia: 'media',
    presupuesto_estimado: '',
    fecha_necesidad: '',
    comentarios_generales: '',
  })

  // Estado para ítems individuales
  const [items, setItems] = useState([
    {
      nombre: '',
      cantidad: '',
      unidad: 'piezas',
      precio_estimado: '',
      justificacion: '',
    },
  ])

  // Estado para archivos
  const [nuevosArchivos, setNuevosArchivos] = useState([])
  const [archivosAEliminar, setArchivosAEliminar] = useState([])

  // Estados de carga y errores
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')

  // Cargar datos de la solicitud para editar
  const cargarSolicitud = async () => {
    setCargandoSolicitud(true)
    try {
      if (!id) {
        throw new Error('ID de solicitud requerido')
      }

      const response = await solicitudesService.getById(id)
      const solicitud = response.data || response

      // Verificar que la solicitud se pueda editar
      if (!['pendiente', 'en_revision'].includes(solicitud.estatus)) {
        throw new Error(
          'Solo se pueden editar solicitudes pendientes o en revisión'
        )
      }

      setSolicitudOriginal(solicitud)

      // Procesar fecha de necesidad con más cuidado
      let fechaNecesidad = ''
      if (solicitud.fecha_necesidad) {
        try {
          const fecha = new Date(solicitud.fecha_necesidad)
          if (!isNaN(fecha.getTime())) {
            fechaNecesidad = fecha.toISOString().split('T')[0]
          }
        } catch (err) {
          console.warn('Error procesando fecha:', err)
        }
      }

      // Cargar datos en el formulario
      const nuevosDatos = {
        tipo_requisicion: solicitud.tipo_requisicion || 'productos',
        descripcion_detallada: solicitud.descripcion_detallada || '',
        cantidad: solicitud.cantidad || '',
        justificacion: solicitud.justificacion || '',
        urgencia: solicitud.urgencia || 'media',
        presupuesto_estimado: solicitud.presupuesto_estimado || '',
        fecha_necesidad: fechaNecesidad,
        comentarios_generales: solicitud.comentarios_generales || '',
      }

      setDatosSolicitud(nuevosDatos)

      // Cargar ítems existentes o crear uno vacío
      if (solicitud.items && solicitud.items.length > 0) {
        const itemsProcesados = solicitud.items.map((item, index) => ({
          id: item.id || `existing_${index}`, // Mantener ID o crear uno temporal
          nombre: item.nombre || '',
          cantidad: item.cantidad || '',
          unidad: item.unidad || 'piezas', // Agregar unidad por defecto
          precio_estimado: item.precio_estimado || '',
          justificacion: item.justificacion || '',
        }))

        setItems(itemsProcesados)
      }

      setError('')
    } catch (error) {
      console.error('Error al cargar solicitud:', error)
      setError(`Error al cargar la solicitud: ${error.message}`)

      if (error.message.includes('404')) {
        setError(`La solicitud con ID "${id}" no fue encontrada.`)
      }
    } finally {
      setCargandoSolicitud(false)
    }
  }

  // Efectos
  useEffect(() => {
    if (id) {
      cargarSolicitud()
    }
  }, [id])

  // Manejar cambios en el formulario principal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target
    setDatosSolicitud((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // Manejar ítems
  const manejarAgregarItem = () => {
    setItems([
      ...items,
      {
        nombre: '',
        cantidad: '',
        unidad: 'piezas',
        precio_estimado: '',
        justificacion: '',
      },
    ])
  }

  const manejarEliminarItem = (index) => {
    if (items.length > 1) {
      const nuevosItems = items.filter((_, i) => i !== index)
      setItems(nuevosItems)
    }
  }

  const manejarCambioItem = (index, campo, valor) => {
    const nuevosItems = items.map((item, i) =>
      i === index ? { ...item, [campo]: valor } : item
    )
    setItems(nuevosItems)
  }

  // Manejar archivos nuevos
  const manejarCambioArchivo = (e) => {
    const archivos = Array.from(e.target.files)
    setNuevosArchivos((prev) => [...prev, ...archivos])
  }

  const eliminarNuevoArchivo = (index) => {
    setNuevosArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  // Manejar eliminación de archivos existentes
  const marcarArchivoParaEliminar = (nombreArchivo) => {
    if (!archivosAEliminar.includes(nombreArchivo)) {
      setArchivosAEliminar((prev) => [...prev, nombreArchivo])
    }
  }

  const cancelarEliminacionArchivo = (nombreArchivo) => {
    setArchivosAEliminar((prev) =>
      prev.filter((archivo) => archivo !== nombreArchivo)
    )
  }

  // Descargar archivo existente
  const descargarArchivo = async (archivo) => {
    try {
      // Si el archivo tiene ruta_archivo (URL de Cloudinary), abrir en nueva ventana
      if (archivo.ruta_archivo && archivo.ruta_archivo.startsWith('http')) {
        window.open(archivo.ruta_archivo, '_blank')
      } else {
        // Usar método del servicio para descargar
        await solicitudesService.downloadDocument(id, archivo.nombre_archivo)
      }
    } catch (error) {
      console.error('Error al descargar archivo:', error)
      alert('Error al descargar el archivo')
    }
  }

  // Calcular presupuesto total de ítems
  const calcularPresupuestoTotal = () => {
    return items.reduce((total, item) => {
      const precio = parseFloat(item.precio_estimado) || 0
      const cantidad = parseInt(item.cantidad) || 0
      return total + precio * cantidad
    }, 0)
  }

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!datosSolicitud.descripcion_detallada.trim()) {
      nuevosErrores.descripcion_detallada =
        'La descripción detallada es requerida'
    }

    if (!datosSolicitud.justificacion.trim()) {
      nuevosErrores.justificacion = 'La justificación es requerida'
    }

    if (!datosSolicitud.fecha_necesidad) {
      nuevosErrores.fecha_necesidad = 'La fecha de necesidad es requerida'
    }

    // Validar cantidad principal
    if (!datosSolicitud.cantidad || datosSolicitud.cantidad <= 0) {
      nuevosErrores.cantidad = 'La cantidad debe ser mayor a 0'
    }

    // Validar que al menos haya un ítem válido
    const itemsValidos = items.filter(
      (item) => item.nombre.trim() && item.cantidad && item.unidad.trim()
    )

    if (itemsValidos.length === 0) {
      nuevosErrores.items = 'Debe agregar al menos un ítem válido'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Actualizar solicitud
  const manejarActualizacion = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setGuardando(true)

    try {
      // Preparar datos para actualización
      const datosActualizacion = {
        ...datosSolicitud,
        items: items.filter(
          (item) => item.nombre.trim() && item.cantidad && item.unidad.trim()
        ),
        presupuesto_estimado:
          datosSolicitud.presupuesto_estimado || calcularPresupuestoTotal(),
      }

      // Llamada al API para actualizar con el nuevo método que maneja eliminación
      await solicitudesService.update(
        id,
        datosActualizacion,
        nuevosArchivos,
        archivosAEliminar
      )

      alert('Solicitud actualizada exitosamente')
      navigate(`/solicitudes/${id}`)
    } catch (error) {
      console.error('Error al actualizar solicitud:', error)
      alert(`Error al actualizar la solicitud: ${error.message}`)
    } finally {
      setGuardando(false)
    }
  }

  const presupuestoCalculado = calcularPresupuestoTotal()

  // Obtener archivos existentes que no están marcados para eliminación
  const archivosExistentes = solicitudOriginal?.archivos_adjuntos || []
  const archivosVisibles = archivosExistentes.filter(
    archivo => !archivosAEliminar.includes(archivo.nombre_archivo)
  )

  // Estados de carga
  if (cargandoSolicitud) {
    return (
      <SolicitudesLayout title="Cargando...">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Cargando solicitud...</div>
        </div>
      </SolicitudesLayout>
    )
  }

  if (error || !solicitudOriginal) {
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

  return (
    <SolicitudesLayout
      title="Editar Solicitud"
      subtitle={`Folio: ${solicitudOriginal.folio_solicitud}`}
      backTo={`/solicitudes/${id}`}
    >
      {/* Alerta de información */}
      <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-2 text-blue-400">
          <span className="text-sm">
            <strong>Nota:</strong> Al actualizar esta solicitud, el estado
            cambiará a "Pendiente" y deberá ser revisada nuevamente por los
            aprobadores.
          </span>
        </div>
      </div>

      <form onSubmit={manejarActualizacion} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Tipo de Requisición"
            name="tipo_requisicion"
            value={datosSolicitud.tipo_requisicion}
            onChange={manejarCambioInput}
            options={[
              { value: 'productos', label: 'Productos' },
              { value: 'servicios', label: 'Servicios' },
              { value: 'mantenimiento', label: 'Mantenimiento' },
            ]}
            required
          />

          <Input
            label="Cantidad Total"
            name="cantidad"
            type="number"
            value={datosSolicitud.cantidad}
            onChange={manejarCambioInput}
            min="1"
            error={errores.cantidad}
            required
          />

          <Select
            label="Nivel de Urgencia"
            name="urgencia"
            value={datosSolicitud.urgencia}
            onChange={manejarCambioInput}
            options={[
              { value: 'baja', label: 'Baja' },
              { value: 'media', label: 'Media' },
              { value: 'alta', label: 'Alta' },
              { value: 'critica', label: 'Crítica' },
            ]}
            required
          />
        </div>

        <Input
          label="Fecha de Necesidad"
          name="fecha_necesidad"
          type="date"
          value={datosSolicitud.fecha_necesidad}
          onChange={manejarCambioInput}
          min={new Date().toISOString().split('T')[0]}
          error={errores.fecha_necesidad}
          required
        />

        <TextArea
          label="Descripción Detallada"
          name="descripcion_detallada"
          value={datosSolicitud.descripcion_detallada}
          onChange={manejarCambioInput}
          placeholder="Describa detalladamente los productos o servicios que necesita..."
          rows={4}
          error={errores.descripcion_detallada}
          required
        />

        <TextArea
          label="Justificación"
          name="justificacion"
          value={datosSolicitud.justificacion}
          onChange={manejarCambioInput}
          placeholder="Explique la razón por la cual necesita estos productos o servicios..."
          rows={3}
          error={errores.justificacion}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Presupuesto Estimado (MXN)"
            name="presupuesto_estimado"
            type="number"
            value={datosSolicitud.presupuesto_estimado}
            onChange={manejarCambioInput}
            placeholder="0.00"
            step="0.01"
            min="0"
          />

          {presupuestoCalculado > 0 && (
            <div className="flex items-end">
              <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Presupuesto Calculado
                </label>
                <p className="text-lg font-semibold text-green-400">
                  ${presupuestoCalculado.toFixed(2)} MXN
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sección de archivos existentes */}
        {solicitudOriginal?.archivos_adjuntos &&
          solicitudOriginal.archivos_adjuntos.length > 0 && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-lg font-medium text-white mb-3">
                Documentos Existentes ({archivosVisibles.length})
              </h3>

              {archivosVisibles.length > 0 ? (
                <div className="space-y-2">
                  {archivosVisibles.map((archivo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-800 p-3 rounded"
                    >
                      <div className="flex-1">
                        <span className="text-sm text-gray-300 font-medium">
                          {archivo.nombre_original || archivo.nombre_archivo}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(archivo.fecha_subida).toLocaleDateString(
                            'es-MX'
                          )}{' '}
                          •
                          {archivo.tamaño
                            ? (archivo.tamaño / 1024 / 1024).toFixed(2) + ' MB'
                            : 'Tamaño desconocido'}{' '}
                          •{archivo.tipo_mime || 'Tipo desconocido'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => descargarArchivo(archivo)}
                          className="p-2"
                          title="Descargar archivo"
                        >
                          <FaDownload className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() =>
                            marcarArchivoParaEliminar(archivo.nombre_archivo)
                          }
                          className="p-2"
                          title="Eliminar archivo"
                        >
                          <FaTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Todos los archivos existentes han sido marcados para
                  eliminación.
                </p>
              )}

              {/* Archivos marcados para eliminación */}
              {archivosAEliminar.length > 0 && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded">
                  <h4 className="text-sm font-medium text-red-400 mb-2">
                    Archivos marcados para eliminación (
                    {archivosAEliminar.length}):
                  </h4>
                  <div className="space-y-1">
                    {archivosAEliminar.map((nombreArchivo, index) => {
                      const archivo = solicitudOriginal.archivos_adjuntos.find(
                        (a) => a.nombre_archivo === nombreArchivo
                      )
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-red-300">
                            {archivo?.nombre_original || nombreArchivo}
                          </span>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              cancelarEliminacionArchivo(nombreArchivo)
                            }
                            className="p-1 text-xs"
                            title="Cancelar eliminación"
                          >
                            <FaTimes className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Si no hay archivos */}
        {(!solicitudOriginal?.archivos_adjuntos ||
          solicitudOriginal.archivos_adjuntos.length === 0) && (
          <div className="mb-6 p-4 bg-gray-600 rounded-lg border border-gray-500">
            <h3 className="text-lg font-medium text-white mb-3">
              Documentos Existentes
            </h3>
            <p className="text-gray-400 text-sm">
              No hay documentos adjuntos en esta solicitud.
            </p>
          </div>
        )}

        {/* Sección de nuevos archivos */}
        <div className="mb-6 p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Agregar Nuevos Documentos (Opcional)
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="subirNuevoArchivo"
              className="flex flex-col items-center justify-center w-full h-32 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-8 h-8 mb-3 text-blue-400" />
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">Haz clic para subir</span> o
                  arrastra y suelta
                </p>
                <p className="text-xs text-gray-400">
                  PDF, JPG, PNG (MAX. 5MB por archivo)
                </p>
              </div>
              <input
                id="subirNuevoArchivo"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={manejarCambioArchivo}
              />
            </label>
          </div>

          {nuevosArchivos.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-white">
                Nuevos archivos a subir:
              </h4>
              {nuevosArchivos.map((archivo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded"
                >
                  <div>
                    <span className="text-sm text-gray-300">
                      {archivo.name}
                    </span>
                    <div className="text-xs text-gray-400">
                      {(archivo.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => eliminarNuevoArchivo(index)}
                    className="p-1"
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ítems solicitados */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Ítems Solicitados
          </h3>
          {errores.items && (
            <p className="text-red-400 text-sm mb-2">{errores.items}</p>
          )}
          <TablaItemsSolicitud
            items={items}
            onAgregarItem={manejarAgregarItem}
            onEliminarItem={manejarEliminarItem}
            onCambiarItem={manejarCambioItem}
          />
          <Button
            type="button"
            onClick={manejarAgregarItem}
            variant="secondary"
            className="mb-6"
            icon={FaPlus}
          >
            Agregar Ítem
          </Button>
        </div>

        <TextArea
          label="Comentarios Generales (Opcional)"
          name="comentarios_generales"
          value={datosSolicitud.comentarios_generales}
          onChange={manejarCambioInput}
          placeholder="Comentarios adicionales sobre la solicitud..."
          rows={2}
        />

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/solicitudes/${id}`)}
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={FaSave}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </SolicitudesLayout>
  )
}

export default EditarSolicitud