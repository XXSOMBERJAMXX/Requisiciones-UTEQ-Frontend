import { FaEye, FaEdit, FaTrash, FaFileInvoice } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import comprasService from '../../services/comprasService'
import { useNotification } from '../../hooks/useNotification'
import Pagination from '../../components/common/Pagination'

const Compras = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [compras, setCompras] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null) // Para mostrar loading específico
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })

  // Cargar compras
  useEffect(() => {
    const fetchCompras = async () => {
      setLoading(true)
      try {
        const { compras: comprasData, pagination: paginationData } =
          await comprasService.getAll({
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm,
          })

        setCompras(comprasData)
        setPagination({
          ...pagination,
          total: paginationData?.total || comprasData.length,
          pages: paginationData?.pages || 1,
        })
      } catch (error) {
        console.error('Error al cargar compras:', error)
        showNotification('Error al cargar las compras', 'error')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchCompras()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, pagination.page, pagination.limit, showNotification])

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordenada':
        return 'bg-blue-800 text-blue-200'
      case 'en_transito':
        return 'bg-purple-800 text-purple-200'
      case 'entregada':
        return 'bg-green-800 text-green-200'
      case 'cancelada':
        return 'bg-red-800 text-red-200'
      default:
        return 'bg-slate-600 text-slate-200'
    }
  }

  // Función para determinar si se puede eliminar una compra
  const puedeEliminarCompra = (compra) => {
    // Obtener información del usuario actual (esto depende de tu implementación de auth)
    const userRole = localStorage.getItem('userRole') || 'aprobador' // Ajustar según tu auth
    const userId = parseInt(localStorage.getItem('userId')) || 0 // Ajustar según tu auth

    // Solo mostrar opción de eliminar si:
    // 1. Es admin_sistema (puede eliminar cualquiera)
    // 2. Es administrativo y la compra no está entregada
    // 3. Es el creador y la compra está en estado "ordenada"

    if (userRole === 'admin_sistema') return true

    if (
      (userRole === 'administrativo' || userRole === 'aprobador') &&
      compra.estatus !== 'entregada'
    ) {
      return true
    }

    if (compra.creado_por === userId && compra.estatus === 'ordenada') {
      return true
    }

    return false
  }

  // Función mejorada para manejar eliminación
  const handleDelete = async (compraId, numeroOrden) => {
    // Primer nivel de confirmación
    const confirmarEliminacion = window.confirm(
      `⚠️ ATENCIÓN: ¿Estás seguro de que quieres eliminar la compra ${numeroOrden}?\n\n` +
        `Esta acción NO se puede deshacer y eliminará:\n` +
        `• La orden de compra completa\n` +
        `• Todas las facturas asociadas\n` +
        `• Todos los registros relacionados\n\n` +
        `Haz clic en "Aceptar" para continuar o "Cancelar" para mantener la compra.`
    )

    if (!confirmarEliminacion) {
      return // Usuario canceló
    }

    // Segundo nivel: solicitar motivo (opcional pero recomendado)
    const motivo = window.prompt(
      `Motivo de eliminación para ${numeroOrden} (opcional):`,
      ''
    )

    // Si el usuario hace clic en "Cancelar" en el prompt, motivo será null
    if (motivo === null) {
      return // Usuario canceló en el segundo paso
    }

    // Mostrar indicador de carga específico para esta compra
    setDeleting(compraId)

    try {
      // Llamar al servicio de eliminación
      const resultado = await comprasService.delete(compraId, motivo)
      console.log(resultado)

      // Actualizar el estado local removiendo la compra eliminada
      setCompras((prevCompras) =>
        prevCompras.filter((compra) => compra.id_compra !== compraId)
      )

      // Mostrar notificación de éxito
      showNotification(
        `Compra ${numeroOrden} eliminada exitosamente`,
        'success'
      )

      // Log detallado para desarrolladores
      console.log('Compra eliminada:', {
        numeroOrden,
        facturas_eliminadas:
          resultado.data?.compra_eliminada?.facturas_eliminadas || 0,
        motivo: motivo || 'Sin motivo especificado',
      })
    } catch (error) {
      console.error('Error al eliminar compra:', error)

      // Mostrar error específico al usuario
      let mensajeError = 'Error desconocido'

      if (error.message.includes('permisos')) {
        mensajeError = 'No tienes permisos para eliminar esta compra'
      } else if (error.message.includes('entregada')) {
        mensajeError = 'No se pueden eliminar compras ya entregadas'
      } else if (error.message.includes('facturas')) {
        mensajeError =
          'Esta compra tiene facturas asociadas y requiere permisos administrativos'
      } else if (error.message.includes('confirmación')) {
        mensajeError = 'Error de confirmación. Inténtalo de nuevo'
      } else {
        mensajeError = error.message
      }

      showNotification(
        `Error al eliminar la compra ${numeroOrden}: ${mensajeError}`,
        'error'
      )
    } finally {
      // Quitar indicador de carga
      setDeleting(null)
    }
  }

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">
        Visualizar Compras Realizadas
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <Input
          id="searchPurchase"
          placeholder="Buscar por ID, proveedor o solicitud..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPagination((prev) => ({ ...prev, page: 1 }))
          }}
          className="flex-grow md:max-w-xs"
        />
        <Button onClick={() => navigate('/compras/crear')} variant="primary">
          Crear Nueva Compra
        </Button>
      </div>
      <div className="bg-slate-800 border border-slate-600 rounded-xl overflow-hidden max-w-[calc(100vw-8rem)] lg:max-w-[calc(100vw-24rem)]">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-slate-600">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  ID Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Solicitud ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Monto Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Fecha Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-600">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-slate-400"
                  >
                    Cargando compras...
                  </td>
                </tr>
              ) : compras.length > 0 ? (
                compras.map((compra) => (
                  <tr
                    key={compra.id_compra}
                    className={`hover:bg-slate-700 transition-colors ${
                      deleting === compra.id_compra ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                      {compra.numero_orden}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      {compra.solicitud_id ? (
                        <Link
                          to={`/solicitudes/${compra.solicitud_id}`}
                          className="text-blue-400 hover:underline"
                        >
                          {compra.solicitud?.folio_solicitud || 'N/A'}
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      {compra.proveedor_seleccionado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      ${compra.monto_total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      {new Date(compra.fecha_compra).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          compra.estatus
                        )}`}
                      >
                        {compra.estatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                       
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(`/compras/editar/${compra.id_compra}`)
                          }
                          className="p-2 rounded-full"
                          title="Editar"
                          disabled={deleting === compra.id_compra}
                        >
                          <FaEdit className="w-5 h-5 text-slate-200" />
                        </Button>

                        {/* Botón de eliminar con validación de permisos */}
                        {puedeEliminarCompra(compra) && (
                          <Button
                            variant="danger"
                            className="p-2 rounded-full"
                            title={
                              deleting === compra.id_compra
                                ? 'Eliminando...'
                                : 'Eliminar'
                            }
                            onClick={() =>
                              handleDelete(
                                compra.id_compra,
                                compra.numero_orden
                              )
                            }
                            disabled={deleting === compra.id_compra}
                          >
                            {deleting === compra.id_compra ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FaTrash className="w-5 h-5" />
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-slate-400"
                  >
                    No se encontraron compras.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.pages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default Compras
