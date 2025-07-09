import React from 'react';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg p-4 lg:hidden">
      <div className="flex justify-between items-center max-w-full">
        {/* Botón de menú */}
        <button 
          onClick={onMenuClick} 
          className="text-slate-300 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-2 transition-colors duration-200"
          aria-label="Abrir menú de navegación"
        >
          <FaBars className="w-5 h-5" />
        </button>
        
        {/* Título */}
        <div className="flex items-center space-x-3">
          <img
            src="https://placehold.co/32x32/1F2937/60A5FA?text=U"
            alt="Logo UTEQ"
            className="w-8 h-8 rounded-full border-2 border-blue-500"
          />
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 truncate">
            Requisiciones UTEQ
          </h2>
        </div>
        
        {/* Placeholder para alineación */}
        <div className="w-9 h-9" />
      </div>
    </header>
  );
};

export default Navbar;