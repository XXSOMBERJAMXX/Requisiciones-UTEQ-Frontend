import { FaEye, FaEdit, FaTrash, FaFileInvoice } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import comprasService from '../../services/comprasService';
import { useNotification } from '../../context/NotificationContext';
import Pagination from '../../components/common/Pagination';

const Compras = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  // Cargar compras
  useEffect(() => {
    const fetchCompras = async () => {
      setLoading(true);
      try {
        const { compras: comprasData, pagination: paginationData } = await comprasService.getAll({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm
        });
        
        setCompras(comprasData);
        setPagination({
          ...pagination,
          total: paginationData?.total || comprasData.length,
          pages: paginationData?.pages || 1
        });
      } catch (error) {
        console.error('Error al cargar compras:', error);
        showNotification('Error al cargar las compras', 'error');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCompras();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, pagination.page, pagination.limit, showNotification]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordenada': return 'bg-blue-800 text-blue-200';
      case 'en_transito': return 'bg-purple-800 text-purple-200';
      case 'entregada': return 'bg-green-800 text-green-200';
      case 'cancelada': return 'bg-red-800 text-red-200';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta compra?')) return;
    
    try {
      // Aquí deberías llamar a tu servicio para eliminar la compra
      // await comprasService.delete(id);
      showNotification('Compra eliminada exitosamente', 'success');
      setCompras(prev => prev.filter(c => c.id_compra !== id));
    } catch (error) {
      console.error('Error al eliminar compra:', error);
      showNotification('Error al eliminar la compra', 'error');
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Visualizar Compras Realizadas</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <Input
          id="searchPurchase"
          placeholder="Buscar por ID, proveedor o solicitud..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="flex-grow md:max-w-xs"
        />
        <Button 
          onClick={() => navigate('/compras/crear')} 
          variant="primary"
        >
          Crear Nueva Compra
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">ID Compra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Solicitud ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Monto Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Fecha Compra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                  Cargando compras...
                </td>
              </tr>
            ) : compras.length > 0 ? (
              compras.map((compra) => (
                <tr key={compra.id_compra}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {compra.numero_orden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {compra.solicitud_id ? (
                      <Link 
                        to={`/solicitudes/${compra.solicitud_id}`} 
                        className="text-blue-400 hover:underline"
                      >
                        {compra.solicitud?.folio_solicitud || 'N/A'}
                      </Link>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {compra.proveedor_seleccionado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    ${compra.monto_total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {new Date(compra.fecha_compra).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(compra.estatus)}`}>
                      {compra.estatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="secondary" 
                        className="p-2 rounded-full" 
                        title="Ver Facturas"
                        onClick={() => navigate(`/compras/${compra.id_compra}/facturas`)}
                      >
                        <FaFileInvoice className="w-5 h-5 text-gray-200" />
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/compras/editar/${compra.id_compra}`)} 
                        className="p-2 rounded-full" 
                        title="Editar"
                      >
                        <FaEdit className="w-5 h-5 text-gray-200" />
                      </Button>
                      <Button 
                        variant="danger" 
                        className="p-2 rounded-full" 
                        title="Eliminar"
                        onClick={() => handleDelete(compra.id_compra)}
                      >
                        <FaTrash className="w-5 h-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                  No se encontraron compras.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
  );
};

export default Compras;