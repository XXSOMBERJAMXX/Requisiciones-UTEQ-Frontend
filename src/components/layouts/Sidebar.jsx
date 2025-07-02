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
    <>
      <div className="flex items-center mb-8 px-4 w-full">
        <img
          src="https://placehold.co/48x48/1F2937/60A5FA?text=UTEQ"
          alt="Logo UTEQ"
          className="mr-3 rounded-full border-2 border-blue-500"
        />
        <h1 className="text-xl font-extrabold text-blue-400">Requisiciones</h1>
        {isMobile && (
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-white focus:outline-none"
          >
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
                onClick={isMobile ? onClose : undefined}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Información del usuario */}
      {user && (
        <div className="px-4 py-3 border-t border-gray-700">
          <div className="mb-3">
            <p className="text-sm font-medium text-white truncate">
              {user.nombre_completo}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.correo_institucional}
            </p>
            <p className="text-xs text-blue-400 capitalize">
              {user.rol?.replace('_', ' ')}
            </p>
          </div>
        </div>
      )}
      
      {/* Botón de logout */}
      <div className="px-4 py-3 border-t border-gray-700">
        <Button
          variant="outline"
          className="w-full text-gray-300 border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          icon={LogOutIcon}
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
        </Button>
      </div>
    </>
  )
}

export default Sidebar