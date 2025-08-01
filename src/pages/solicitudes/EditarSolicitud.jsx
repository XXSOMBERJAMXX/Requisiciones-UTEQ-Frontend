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
  FaTrash
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
      unidad: '',
      precio_estimado: '',
      justificacion: '',
    },
  ])

  // Estado para archivos (nuevos archivos a subir)
  const [nuevosArchivos, setNuevosArchivos] = useState([])

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
      if (
        solicitud.estatus !== 'pendiente' &&
        solicitud.estatus !== 'denegada'
      ) {
        throw new Error(
          'Solo se pueden editar solicitudes pendientes o denegadas'
        )
      }

      setSolicitudOriginal(solicitud)

      // Cargar datos en el formulario
      setDatosSolicitud({
        tipo_requisicion: solicitud.tipo_requisicion || 'productos',
        descripcion_detallada: solicitud.descripcion_detallada || '',
        justificacion: solicitud.justificacion || '',
        urgencia: solicitud.urgencia || 'media',
        presupuesto_estimado: solicitud.presupuesto_estimado || '',
        fecha_necesidad: solicitud.fecha_necesidad
          ? new Date(solicitud.fecha_necesidad).toISOString().split('T')[0]
          : '',
        comentarios_generales: solicitud.comentarios_generales || '',
      })

      // Cargar ítems existentes o crear uno vacío
      if (solicitud.items && solicitud.items.length > 0) {
        setItems(
          solicitud.items.map((item) => ({
            id: item.id, // Mantener ID para actualización
            nombre: item.nombre || '',
            cantidad: item.cantidad || '',
            unidad: item.unidad || '',
            precio_estimado: item.precio_estimado || '',
            justificacion: item.justificacion || '',
          }))
        )
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
        unidad: '',
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
      nuevosErrores.descripcion_detallada = 'La descripción detallada es requerida'
    }

    if (!datosSolicitud.justificacion.trim()) {
      nuevosErrores.justificacion = 'La justificación es requerida'
    }

    if (!datosSolicitud.fecha_necesidad) {
      nuevosErrores.fecha_necesidad = 'La fecha de necesidad es requerida'
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

      console.log('Datos a actualizar:', datosActualizacion)
      console.log('Nuevos archivos:', nuevosArchivos)

      // Llamada al API para actualizar
      await solicitudesService.update(id, datosActualizacion, nuevosArchivos)

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

  // Estados de carga
  if (cargandoSolicitud) {
    return (
      <SolicitudesLayout title="Cargando...">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">
            Cargando solicitud...
          </div>
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
            <strong>Nota:</strong> Al actualizar esta solicitud, el estado cambiará a "Pendiente" 
            y deberá ser revisada nuevamente por los aprobadores.
          </span>
        </div>
      </div>

      <form onSubmit={manejarActualizacion} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        {solicitudOriginal.documentos && solicitudOriginal.documentos.length > 0 && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h3 className="text-lg font-medium text-white mb-3">
              Documentos Existentes
            </h3>
            <div className="space-y-2">
              {solicitudOriginal.documentos.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded"
                >
                  <span className="text-sm text-gray-300">{doc.nombre_archivo}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(doc.fecha_subida).toLocaleDateString('es-MX')}
                  </span>
                </div>
              ))}
            </div>
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
              <h4 className="text-sm font-medium text-white">Nuevos archivos a subir:</h4>
              {nuevosArchivos.map((archivo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded"
                >
                  <span className="text-sm text-gray-300">{archivo.name}</span>
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