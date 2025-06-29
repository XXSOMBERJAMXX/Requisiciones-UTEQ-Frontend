import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { SearchIcon, EyeIcon, CheckIcon, XIcon, EditIcon, TrashIcon } from '../../components/common/Icons';
import { getStatusColor } from '../../utils/constants'; // Importa la función de utilidad
import { Link } from 'react-router-dom';

const sampleRequests = [
  {
    id: 'REQ001',
    title: 'Compra de Equipos de Laboratorio',
    department: 'Ingeniería Mecatrónica',
    requestor: 'Dr. Juan Pérez',
    date: '2025-05-10',
    status: 'Pendiente',
    details: 'Solicitud para la adquisición de 2 osciloscopios y 1 fuente de poder.',
  },
  {
    id: 'REQ002',
    title: 'Suministros de Oficina',
    department: 'Administración',
    requestor: 'Lic. Ana Gómez',
    date: '2025-05-12',
    status: 'Aprobada',
    details: 'Resmas de papel, tóner para impresoras, bolígrafos, etc.',
  },
  {
    id: 'REQ003',
    title: 'Mobiliario para Aulas',
    department: 'Rectoría',
    requestor: 'Mtro. Luis Hernández',
    date: '2025-05-15',
    status: 'Denegada',
    details: 'Renovación de pupitres y sillas para el edificio B.',
  },
  {
    id: 'REQ004',
    title: 'Actualización de Software',
    department: 'Sistemas',
    requestor: 'Ing. Carlos Ruiz',
    date: '2025-05-18',
    status: 'Revisión',
    details: 'Licencias de software especializado para diseño gráfico.',
  },
  {
    id: 'REQ005',
    title: 'Material Didáctico',
    department: 'Pedagogía',
    requestor: 'Mtra. Laura Vega',
    date: '2025-05-20',
    status: 'Aprobada',
    details: 'Libros de texto y material lúdico para nuevas carreras.',
  },
];

const ManageRequests = () => {
  const [requests, setRequests] = useState(sampleRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' or 'deny'

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.requestor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todas' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openConfirmModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedRequest(null);
    setActionType('');
  };

  const handleStatusChange = () => {
    if (selectedRequest && actionType) {
      const newStatus = actionType === 'approve' ? 'Aprobada' : 'Denegada';
      setRequests(requests.map(req =>
        req.id === selectedRequest.id ? { ...req, status: newStatus } : req
      ));
      alert(`Solicitud ${selectedRequest.id} ha sido ${newStatus === 'Aprobada' ? 'Aprobada' : 'Denegada'} con éxito.`);
      closeConfirmModal();
    }
  };

  const handleDelete = (requestId) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la solicitud ${requestId}?`)) {
      setRequests(requests.filter(req => req.id !== requestId));
      alert(`Solicitud ${requestId} eliminada.`);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Gestionar Solicitudes</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            id="search"
            type="text"
            placeholder="Buscar por ID, título o solicitante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={SearchIcon} // Esto es un ejemplo, el Input no tiene prop 'icon'
            className="pl-10" // Necesitarías CSS para el icono interno
          />
        </div>
        <div className="w-full md:w-60">
          <Select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'Todas', label: 'Todas' },
              { value: 'Pendiente', label: 'Pendiente' },
              { value: 'Aprobada', label: 'Aprobada' },
              { value: 'Denegada', label: 'Denegada' },
              { value: 'Revisión', label: 'Revisión' },
            ]}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">ID Solicitud</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Título</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Departamento</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Solicitante</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-400">{req.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{req.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{req.department}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{req.requestor}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{req.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/solicitudes/${req.id}`}>
                        <Button variant="secondary" className="p-2 rounded-full" title="Ver Detalles">
                          <EyeIcon className="w-5 h-5" />
                        </Button>
                      </Link>
                      {req.status === 'Pendiente' && (
                        <>
                          <Button variant="primary" onClick={() => openConfirmModal(req, 'approve')} className="p-2 rounded-full" title="Aprobar">
                            <CheckIcon className="w-5 h-5" />
                          </Button>
                          <Button variant="danger" onClick={() => openConfirmModal(req, 'deny')} className="p-2 rounded-full" title="Denegar">
                            <XIcon className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                      <Button variant="secondary" onClick={() => alert('Función de editar para ' + req.id)} className="p-2 rounded-full" title="Editar">
                        <EditIcon className="w-5 h-5" />
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(req.id)} className="p-2 rounded-full" title="Eliminar">
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-400">No se encontraron solicitudes que coincidan con los criterios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title={actionType === 'approve' ? 'Confirmar Aprobación' : 'Confirmar Denegación'}
        footer={
          <>
            <Button variant="secondary" onClick={closeConfirmModal}>Cancelar</Button>
            <Button variant={actionType === 'approve' ? 'primary' : 'danger'} onClick={handleStatusChange}>
              {actionType === 'approve' ? 'Aprobar' : 'Denegar'}
            </Button>
          </>
        }
      >
        <p className="text-gray-300">
          ¿Estás seguro de que quieres {actionType === 'approve' ? 'aprobar' : 'denegar'} la solicitud
          <span className="font-semibold text-white ml-1">{selectedRequest?.id}</span>
          : <span className="italic text-blue-300">"{selectedRequest?.title}"</span>?
        </p>
      </Modal>
    </div>
  );
};

export default ManageRequests;