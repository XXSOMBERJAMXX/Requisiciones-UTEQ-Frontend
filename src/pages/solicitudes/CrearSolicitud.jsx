import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import solicitudesService from '../../services/requestService'
import { useAuth } from '../../hooks/useAuth'
import SolicitudesLayout from '../../components/layouts/SolicitudesLayout'
import TablaItemsSolicitud from '../../components/solicitudes/TablaItemsSolicitud'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import TextArea from '../../components/common/TextArea'
import Button from '../../components/common/Button'
import {
  FaPlus,
  FaFileCirclePlus,
  FaUpload,
  FaTrash
} from 'react-icons/fa6'

const CrearSolicitud = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

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

  // Estado para archivos
  const [archivos, setArchivos] = useState([])

  // Estados de carga y errores
  const [cargando, setCargando] = useState(false)
  const [errores, setErrores] = useState({})

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

  // Manejar archivos
  const manejarCambioArchivo = (e) => {
    const archivos = Array.from(e.target.files)
    setArchivos((prev) => [...prev, ...archivos])
  }

  const eliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
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

  // Enviar solicitud
  const manejarEnvio = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setCargando(true)

    try {
      // Preparar datos para envío
      const datosEnvio = {
        ...datosSolicitud,
        solicitante_id: user.id,
        departamento_id: user.departamento_id,
        items: items.filter(
          (item) => item.nombre.trim() && item.cantidad && item.unidad.trim()
        ),
        presupuesto_estimado:
          datosSolicitud.presupuesto_estimado || calcularPresupuestoTotal(),
      }

      console.log('Datos a enviar:', datosEnvio)
      console.log('Archivos:', archivos)

      // Llamada al API
      const response = await solicitudesService.create(datosEnvio, archivos)
      console.log("Respuesta", response)

      alert('Solicitud creada exitosamente')
      navigate('/solicitudes')
    } catch (error) {
      console.error('Error al crear solicitud:', error)
      alert(`Error al crear la solicitud: ${error.message}`)
    } finally {
      setCargando(false)
    }
  }

  const presupuestoCalculado = calcularPresupuestoTotal()

  return (
    <SolicitudesLayout title="Crear Nueva Solicitud">
      <form onSubmit={manejarEnvio} className="space-y-6">
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

        {/* Sección de archivos */}
        <div className="mb-6 p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Documentos de Soporte (Opcional)
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="subirArchivo"
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
                id="subirArchivo"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={manejarCambioArchivo}
              />
            </label>
          </div>

          {archivos.length > 0 && (
            <div className="mt-4 space-y-2">
              {archivos.map((archivo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded"
                >
                  <span className="text-sm text-gray-300">{archivo.name}</span>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => eliminarArchivo(index)}
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
            onClick={() => navigate('/solicitudes')}
            disabled={cargando}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={FaFileCirclePlus}
            disabled={cargando}
          >
            {cargando ? 'Creando...' : 'Crear Solicitud'}
          </Button>
        </div>
      </form>
    </SolicitudesLayout>
  )
}

export default CrearSolicitud