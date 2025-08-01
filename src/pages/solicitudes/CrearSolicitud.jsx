import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      (item) => item.nombre.trim() && item.cantidad
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
          (item) => item.nombre.trim() && item.cantidad
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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={manejarEnvio} className="space-y-8">
          {/* Información básica */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-4 sm:mb-6">
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

            <div className="mt-4 sm:mt-6">
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
            </div>
          </div>

          {/* Descripción y Justificación */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-4 sm:mb-6">
              Detalles de la Solicitud
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
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
            </div>
          </div>

          {/* Presupuesto */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-4 sm:mb-6">
              Información Presupuestaria
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                  <div className="bg-emerald-900/50 border border-emerald-600 p-4 rounded-lg w-full">
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Presupuesto Calculado
                    </label>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-300">
                      ${presupuestoCalculado.toFixed(2)} MXN
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección de archivos */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-4 sm:mb-6">
              Documentos de Soporte
            </h3>
            
            <div className="border-2 border-dashed border-slate-500 rounded-xl bg-slate-700/50 p-4 sm:p-6">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="subirArchivo"
                  className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border border-slate-500 rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 transition-all duration-200 hover:border-blue-400"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-6 h-6 sm:w-8 sm:h-8 mb-3 text-blue-400" />
                    <p className="mb-2 text-sm sm:text-base text-slate-200 text-center px-4">
                      <span className="font-semibold">Haz clic para subir</span> o
                      arrastra y suelta
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400 text-center">
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
                <div className="mt-4 sm:mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-slate-200">
                    Archivos seleccionados:
                  </h4>
                  {archivos.map((archivo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-slate-600 p-3 rounded-lg border border-slate-500"
                    >
                      <span className="text-sm text-slate-100 truncate flex-1 mr-4">
                        {archivo.name}
                      </span>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => eliminarArchivo(index)}
                        className="p-2 flex-shrink-0"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ítems solicitados */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-4 sm:mb-6">
              Ítems Solicitados
            </h3>
            
            {errores.items && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-600 rounded-lg">
                <p className="text-red-300 text-sm">{errores.items}</p>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <TablaItemsSolicitud
                items={items}
                onAgregarItem={manejarAgregarItem}
                onEliminarItem={manejarEliminarItem}
                onCambiarItem={manejarCambioItem}
              />
            </div>
            
            <div className="mt-4 sm:mt-6">
              <Button
                type="button"
                onClick={manejarAgregarItem}
                variant="secondary"
                icon={FaPlus}
                className="w-full sm:w-auto"
              >
                Agregar Ítem
              </Button>
            </div>
          </div>

          {/* Comentarios adicionales */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 lg:p-8">
            <TextArea
              label="Comentarios Generales (Opcional)"
              name="comentarios_generales"
              value={datosSolicitud.comentarios_generales}
              onChange={manejarCambioInput}
              placeholder="Comentarios adicionales sobre la solicitud..."
              rows={3}
            />
          </div>

          {/* Botones de acción */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/solicitudes')}
                disabled={cargando}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={FaFileCirclePlus}
                disabled={cargando}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {cargando ? 'Creando...' : 'Crear Solicitud'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </SolicitudesLayout>
  )
}

export default CrearSolicitud