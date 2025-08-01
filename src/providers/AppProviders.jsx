// ===== ARCHIVO: src/providers/AppProviders.jsx =====
import { BrowserRouter as Router } from 'react-router-dom'
import { NotificationProvider } from './NotificationProvider'
import { AuthProvider } from './AuthProvider'

/**
 * Componente que agrupa todos los providers de la aplicación
 * Esto mantiene App.jsx limpio y organiza todos los contextos en un solo lugar
 */
const AppProviders = ({ children }) => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          {children}
        </Router>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default AppProviders