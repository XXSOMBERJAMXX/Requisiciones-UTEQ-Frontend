import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // Para la versión móvil

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-900 font-inter text-white">
      {/* Sidebar para pantallas grandes */}
      <div className="hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 shadow-xl rounded-r-2xl">
        <Sidebar location={location} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar para pantallas pequeñas */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Sidebar móvil (overlay) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 shadow-lg z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <Sidebar location={location} onClose={() => setSidebarOpen(false)} isMobile={true} />
        </div>

        {/* Contenido de la página renderizado por Outlet */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;