import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { FaSignOutAlt as LogOutIcon, FaTimes as XIcon } from 'react-icons/fa'
import { navItems } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'

const Sidebar = ({ location, onClose, isMobile }) => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return // Evitar múltiples clics

    try {
      setLoggingOut(true)
      await logout()
      
      // Cerrar sidebar si está en móvil
      if (isMobile && onClose) {
        onClose()
      }
      
      // Redirigir al login
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Opcional: mostrar notificación de error
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header del sidebar */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <img
            src="https://placehold.co/48x48/1F2937/60A5FA?text=UTEQ"
            alt="Logo UTEQ"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-blue-400 truncate">
              Requisiciones
            </h1>
            <p className="text-xs text-slate-400 truncate">
              UTEQ Sistema
            </p>
          </div>
        </div>
        
        {/* Botón cerrar en móvil */}
        {isMobile && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-2 transition-colors duration-200 flex-shrink-0"
            aria-label="Cerrar menú"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Navegación */}
      <nav className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'hover:bg-slate-700 text-slate-300 hover:text-slate-100'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="font-medium truncate">
                  {item.name}
                </span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Información del usuario */}
      {user && (
        <div className="px-4 sm:px-6 py-4 border-t border-slate-700 bg-slate-800/50">
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {user.nombre_completo?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {user.nombre_completo}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user.correo_institucional}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200 border border-blue-700">
                {user.rol?.replace('_', ' ') || 'Usuario'}
              </span>
              {user.numero_empleado && (
                <span className="text-xs text-slate-500">
                  #{user.numero_empleado}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Botón de logout */}
      <div className="px-4 sm:px-6 py-4 border-t border-slate-700">
        <Button
          variant="outline"
          className="w-full text-slate-300 border-slate-600 hover:bg-slate-700 hover:border-slate-500 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          icon={LogOutIcon}
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar