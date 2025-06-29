import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getStatusColor } from '../../utils/constants'; // Importa la función de utilidad
import RequestItemsTable from '../../components/tables/RequestItemsTable'; // Importa el componente de tabla
import RequestHistory from './components/RequestHistory';
import SuppliersSection from './components/SuppliersSection.jsx';
import ReceiptsSection from './components/ReceiptsSection';
import { EditIcon, CheckIcon, XIcon } from '../../components/common/Icons';

// Datos de ejemplo para una solicitud detallada
const sampleDetailedRequest = {
  id: 'REQ001',
  title: 'Compra de Equipos de Laboratorio',
  description: 'Se requiere la adquisición de equipos de última generación para el laboratorio de robótica, incluyendo dos osciloscopios digitales de 100MHz y una fuente de alimentación programable de triple salida. Estos equipos son cruciales para el desarrollo de proyectos de investigación y prácticas de los estudiantes de ingeniería mecatrónica.',
  department: 'Ingeniería Mecatrónica',
  requestor: 'Dr. Juan Pérez',
  date: '2025-05-10',
  neededDate: '2025-06-01',
  status: 'Pendiente',
  items: [
    { item: 'Osciloscopio Digital 100MHz', quantity: 2, unit: 'unidades', price: '1200.00', justification: 'Para medición de señales electrónicas.' },
    { item: 'Fuente de Alimentación Programable', quantity: 1, unit: 'unidad', price: '850.00', justification: 'Para alimentar circuitos experimentales.' },
    { item: 'Cables BNC', quantity: 10, unit: 'metros', price: '15.00', justification: 'Conexión de equipos.' },
  ],
  attachedPdf: 'solicitud_equipos_lab_REQ001.pdf',
  history: [
    { date: '2025-05-10 10:00', user: 'Dr. Juan Pérez', action: 'Solicitud creada', status: 'Pendiente' },
    { date: '2025-05-10 11:30', user: 'Admin. Contabilidad', action: 'En revisión', status: 'Revisión' },
  ],
  suppliers: [
    { name: 'Electrónica MX', contact: 'ventas@electronica.mx', quote: '2500.00' },
    { name: 'Instrumentos Científicos SA', contact: 'info@instrumentoscientificos.com', quote: '2700.00' },
  ],
  receipts: [
    { name: 'Factura_Osciloscopios_ELEC_001.pdf', date: '2025-06-15', amount: '2400.00', status: 'Pagado' },
  ],
};

const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('items'); // Estado para la pestaña activa

  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a una API para obtener los detalles de la solicitud
    // usando el `id` de los parámetros de la URL.
    if (id === sampleDetailedRequest.id) {
      setRequest(sampleDetailedRequest);
    } else {
      // Manejar caso donde la solicitud no se encuentra
      setRequest(null);
    }
  }, [id]);

  if (!request) {
    return (
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 text-center text-gray-400">
        <p className="text-xl font-semibold">Cargando detalles de la solicitud...</p>
        <p>O la solicitud con ID "{id}" no fue encontrada.</p>
      </div>
    );
  }

  const handleApprove = () => {
    alert(`Solicitud ${request.id} Aprobada! (Simulado)`);
    // Lógica para actualizar el estado en el backend
    setRequest({ ...request, status: 'Aprobada' });
  };

  const handleDeny = () => {
    alert(`Solicitud ${request.id} Denegada! (Simulado)`);
    // Lógica para actualizar el estado en el backend
    setRequest({ ...request, status: 'Denegada' });
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-bold text-white">Detalles de Solicitud: <span className="text-blue-400">{request.id}</span></h2>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
          {request.status === 'Pendiente' && (
            <>
              <Button variant="primary" onClick={handleApprove} icon={CheckIcon}>Aprobar</Button>
              <Button variant="danger" onClick={handleDeny} icon={XIcon}>Denegar</Button>
            </>
          )}
          <Button variant="secondary" onClick={() => alert('Editar solicitud')} icon={EditIcon}>Editar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-300">
        <div>
          <p><span className="font-semibold text-white">Título:</span> {request.title}</p>
          <p><span className="font-semibold text-white">Solicitante:</span> {request.requestor}</p>
          <p><span className="font-semibold text-white">Departamento:</span> {request.department}</p>
        </div>
        <div>
          <p><span className="font-semibold text-white">Fecha de Creación:</span> {request.date}</p>
          <p><span className="font-semibold text-white">Fecha Necesaria:</span> {request.neededDate}</p>
          <p><span className="font-semibold text-white">PDF Adjunto:</span>{' '}
            {request.attachedPdf ? (
              <a href="#" onClick={() => alert(`Descargando ${request.attachedPdf}`)} className="text-blue-400 hover:underline">
                {request.attachedPdf}
              </a>
            ) : 'N/A'}
          </p>
        </div>
      </div>
      <div className="mb-8">
        <p className="font-semibold text-white mb-2">Descripción:</p>
        <p className="text-gray-300 bg-gray-700 p-4 rounded-lg border border-gray-600">
          {request.description}
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
              activeTab === 'items' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Ítems Solicitados
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
              activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Historial
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
              activeTab === 'suppliers' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Proveedores
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
              activeTab === 'receipts' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Recibos/Pagos
          </button>
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div>
        {activeTab === 'items' && (
          <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">Detalle de Ítems</h3>
            <RequestItemsTable items={request.items} isReadOnly={true} />
          </div>
        )}
        {activeTab === 'history' && <RequestHistory history={request.history} />}
        {activeTab === 'suppliers' && <SuppliersSection suppliers={request.suppliers} />}
        {activeTab === 'receipts' && <ReceiptsSection receipts={request.receipts} />}
      </div>
    </div>
  );
};

export default RequestDetails;