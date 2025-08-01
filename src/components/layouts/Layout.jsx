import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen flex bg-slate-900 font-inter text-slate-100 overflow-hidden">
      {/* Sidebar para pantallas grandes - FIJO */}
      <div className="hidden lg:flex flex-col w-64 bg-slate-800 border-r border-slate-700 shadow-xl h-screen fixed left-0 top-0 z-30">
        <Sidebar location={location} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col h-screen lg:ml-64">
        {/* Navbar para pantallas pequeñas y medianas */}
        <div className="lg:hidden flex-shrink-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Sidebar móvil (overlay) */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        
        <div className={`fixed inset-y-0 left-0 w-72 bg-slate-800 border-r border-slate-700 shadow-2xl z-50 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden h-screen`}>
          <Sidebar 
            location={location} 
            onClose={() => setSidebarOpen(false)} 
            isMobile={true} 
          />
        </div>
        
        <main className="flex-1 overflow-auto bg-slate-900 w-full min-w-0 p-4 lg:p-8 md:p-6 sm:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;