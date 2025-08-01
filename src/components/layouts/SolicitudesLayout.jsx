import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { FaArrowLeft } from 'react-icons/fa'

const SolicitudesLayout = ({ 
  children, 
  title, 
  subtitle,
  showBackButton = true,
  backTo = '/solicitudes',
  rightContent = null,
  className = ""
}) => {
  const navigate = useNavigate()

  return (
    <div className={`bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 ${className}`}>
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="secondary"
              onClick={() => navigate(backTo)}
              icon={FaArrowLeft}
              className="p-2"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {rightContent && (
          <div className="flex items-center space-x-3">
            {rightContent}
          </div>
        )}
      </div>

      {/* Contenido */}
      {children}
    </div>
  )
}

export default SolicitudesLayout