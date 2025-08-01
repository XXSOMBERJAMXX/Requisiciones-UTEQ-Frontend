import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import TextArea from '../../components/common/TextArea'
import comprasService from '../../services/comprasService'
import solicitudesService from '../../services/solicitudesService'
import { useNotification } from '../../hooks/useNotification'

// Helper function to safely format dates
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

export default function GestionarCompras() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [invoiceFile, setInvoiceFile] = useState(null)
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    solicitud_id: '',
    proveedor_seleccionado: '',
    monto_total: '',
    fecha_compra: formatDateForInput(new Date().toISOString()),
    fecha_entrega_estimada: '',
    terminos_entrega: '',
    observaciones: '',
  })

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar solicitudes aprobadas
        const { solicitudes: solicitudesData } =
          await solicitudesService.getAll({
            estatus: 'aprobada',
            limit: 100,
          })
        setSolicitudes(solicitudesData)

        // Si es edición, cargar los datos de la compra
        if (id) {
          const compra = await comprasService.getById(id)
          console.log(compra.data)
          setFormData({
            solicitud_id: compra.data.solicitud_id || '',
            proveedor_seleccionado: compra.data.proveedor_seleccionado || '',
            monto_total: compra.data.monto_total || '',
            fecha_compra: formatDateForInput(compra.data.fecha_compra),
            fecha_entrega_estimada: formatDateForInput(
              compra.data.fecha_entrega_estimada
            ),
            terminos_entrega: compra.data.terminos_entrega || '',
            observaciones: compra.data.observaciones || '',
          })
        }
      } catch (error) {
        showNotification('Error al cargar datos', 'error')
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [id, showNotification])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.proveedor_seleccionado.trim()) {
      showNotification('El proveedor es requerido', 'error')
      return
    }

    if (!formData.monto_total || parseFloat(formData.monto_total) <= 0) {
      showNotification('El monto total debe ser mayor a 0', 'error')
      return
    }

    if (!formData.fecha_compra) {
      showNotification('La fecha de compra es requerida', 'error')
      return
    }

    if (!formData.fecha_entrega_estimada) {
      showNotification('La fecha de entrega estimada es requerida', 'error')
      return
    }

    if (!formData.terminos_entrega.trim()) {
      showNotification('Los términos de entrega son requeridos', 'error')
      return
    }

    setLoading(true)

    try {
      const data = {
        ...formData,
        monto_total: parseFloat(formData.monto_total),
        facturas: invoiceFile
          ? [
              {
                monto_factura: parseFloat(formData.monto_total),
                fecha_factura: formData.fecha_compra,
              },
            ]
          : [],
      }

      if (id) {
        await comprasService.update(id, data, invoiceFile ? [invoiceFile] : [])
        showNotification('Compra actualizada exitosamente', 'success')
      } else {
        await comprasService.create(data, invoiceFile ? [invoiceFile] : [])
        showNotification('Compra creada exitosamente', 'success')
      }

      navigate('/compras')
    } catch (error) {
      console.error('Error al guardar compra:', error)
      showNotification(
        error.response?.data?.message || 'Error al guardar la compra',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        showNotification('El archivo debe ser menor a 10MB', 'error')
        return
      }

      // Validate file type
      const allowedTypes = ['.pdf', '.xml', '.jpg', '.jpeg', '.png']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        showNotification('Tipo de archivo no permitido', 'error')
        return
      }

      setInvoiceFile(file)
    }
  }

  // Opciones para el select de solicitudes
  const solicitudesOptions = [
    { value: '', label: 'Seleccione una solicitud (opcional)' },
    ...solicitudes.map((s) => ({
      value: s.id_solicitud,
      label: `${s.folio_solicitud} - ${
        s.descripcion_detallada?.substring(0, 50) || 'Sin descripción'
      }...`,
    })),
  ]

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">
        {id ? `Editar Compra: ${id}` : 'Crear Nueva Compra'}
      </h2>

      <form onSubmit={handleSubmit}>
        <Select
          label="Solicitud Asociada (Opcional)"
          id="solicitud_id"
          name="solicitud_id"
          value={formData.solicitud_id}
          onChange={handleChange}
          options={solicitudesOptions}
        />

        <Input
          label="Proveedor"
          id="proveedor_seleccionado"
          name="proveedor_seleccionado"
          value={formData.proveedor_seleccionado}
          onChange={handleChange}
          placeholder="Nombre del proveedor"
          required
        />

        <Input
          label="Fecha de Compra"
          id="fecha_compra"
          name="fecha_compra"
          type="date"
          value={formData.fecha_compra}
          onChange={handleChange}
          required
        />

        <Input
          label="Monto Total ($)"
          id="monto_total"
          name="monto_total"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.monto_total}
          onChange={handleChange}
          placeholder="0.00"
          required
        />

        <Input
          label="Fecha de Entrega Estimada"
          id="fecha_entrega_estimada"
          name="fecha_entrega_estimada"
          type="date"
          value={formData.fecha_entrega_estimada}
          onChange={handleChange}
          required
        />

        <TextArea
          label="Términos de Entrega"
          id="terminos_entrega"
          name="terminos_entrega"
          value={formData.terminos_entrega}
          onChange={handleChange}
          placeholder="Términos de entrega acordados"
          required
        />

        <TextArea
          label="Observaciones"
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Observaciones adicionales"
        />

        <div className="mb-6 p-4 border-2 border-dashed border-gray-600 rounded-md bg-gray-700">
          <label
            htmlFor="invoiceUpload"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Cargar Factura(s)
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="invoiceUpload"
              className="flex flex-col items-center justify-center w-full h-32 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-8 h-8 mb-3 text-blue-400" />
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">Haz clic para subir</span> o
                  arrastra y suelta
                </p>
                <p className="text-xs text-gray-400">
                  PDF, XML, JPG, PNG (Máx. 10MB)
                </p>
              </div>
              <input
                id="invoiceUpload"
                type="file"
                className="hidden"
                accept=".pdf,.xml,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {invoiceFile && (
            <div className="mt-2 flex items-center justify-between p-2 bg-gray-600 rounded">
              <p className="text-sm text-gray-300">
                Archivo seleccionado:{' '}
                <span className="font-semibold text-blue-400">
                  {invoiceFile.name}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setInvoiceFile(null)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remover
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/compras')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {id ? 'Actualizar Compra' : 'Guardar Compra'}
          </Button>
        </div>
      </form>
    </div>
  )
}

const UploadIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-upload"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)
