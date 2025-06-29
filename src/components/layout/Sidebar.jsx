import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { HomeIcon, FilePlusIcon, FileTextIcon, ShoppingCartIcon, PieChartIcon, UsersIcon, LogOutIcon, XIcon } from '../common/Icons'; // Importa todos los iconos
import { navItems } from '../../utils/constants'; // Importa los ítems de navegación

const Sidebar = ({ location, onClose, isMobile }) => {
  return (
    <>
      <div className="flex items-center mb-8 px-4 w-full">
        <img src="https://placehold.co/48x48/1F2937/60A5FA?text=UTEQ" alt="Logo UTEQ" className="mr-3 rounded-full border-2 border-blue-500"/>
        <h1 className="text-xl font-extrabold text-blue-400">Requisiciones</h1>
        {isMobile && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white focus:outline-none">
            <XIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                onClick={isMobile ? onClose : undefined} // Cierra el sidebar móvil al hacer clic
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path ? 'bg-blue-700 text-white shadow-md' : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto px-4 py-3 border-t border-gray-700">
        <Button variant="outline" className="w-full text-gray-300 border-gray-600 hover:bg-gray-700" icon={LogOutIcon}>
          Cerrar Sesión
        </Button>
      </div>
    </>
  );
};

export default Sidebar;