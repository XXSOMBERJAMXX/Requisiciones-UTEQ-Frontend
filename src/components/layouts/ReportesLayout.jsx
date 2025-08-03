// ===== ARCHIVO: src/components/layout/ReportesLayout.jsx =====
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const ReportesLayout = () => {

  const navItems = [
    { to: '/reportes', label: 'Dashboard', icon: '📊', exact: true },
    { to: '/reportes/compras', label: 'Compras', icon: '🛒' },
    { to: '/reportes/solicitudes', label: 'Solicitudes', icon: '📝' },
    { to: '/reportes/exportar', label: 'Exportar', icon: '📤' },
  ]

  return (
    <div className="bg-gray-800 px-4 sm:px-6 lg:px-8 py-6 rounded-xl shadow-xl border border-gray-700 ">
      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="mx-auto">
          <div className="flex space-x-1 justify-between">
            <div>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `inline-flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-t-lg border-b-2 ${
                      isActive
                        ? 'bg-gray-900 text-blue-400 border-blue-500 shadow-lg'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700 border-transparent hover:border-gray-600'
                    }`
                  }
                >
                  <span className="mr-2 text-base">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto py-4">
        <Outlet />
      </main>
    </div>
  )
}

export default ReportesLayout
