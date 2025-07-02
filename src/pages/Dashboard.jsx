import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlusSquare as FilePlusIcon,
  FaFileAlt as FileTextIcon,
  FaShoppingCart as ShoppingCartIcon,
  FaChartPie as PieChartIcon,
  FaUsers as UsersIcon
} from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Bienvenido al Sistema de Requisiciones UTEQ</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/solicitudes/crear" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-blue-500 border border-transparent">
          <FilePlusIcon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Crear Nueva Solicitud</h3>
          <p className="text-gray-400 text-sm">Inicia el proceso para nuevas requisiciones.</p>
        </Link>

        <Link to="/solicitudes" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-green-500 border border-transparent">
          <FileTextIcon className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Gestionar Solicitudes</h3>
          <p className="text-gray-400 text-sm">Visualiza y administra tus requisiciones existentes.</p>
        </Link>

        <Link to="/compras" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-purple-500 border border-transparent">
          <ShoppingCartIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Ver Compras</h3>
          <p className="text-gray-400 text-sm">Consulta el historial de compras.</p>
        </Link>

        <Link to="/reportes" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-yellow-500 border border-transparent">
          <PieChartIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Generar Reportes</h3>
          <p className="text-gray-400 text-sm">Obtén informes detallados.</p>
        </Link>

        <Link to="/usuarios" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-red-500 border border-transparent">
          <UsersIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Administrar Usuarios</h3>
          <p className="text-gray-400 text-sm">Gestiona los accesos y roles del sistema.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;