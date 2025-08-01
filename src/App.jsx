import AppProviders from './providers/AppProviders'
import AppRoutes from './routes/AppRoutes'

/**
 * Componente principal de la aplicación
 * Mantiene una estructura simple y delega responsabilidades:
 * - AppProviders: Maneja todos los contextos y providers
 * - AppRoutes: Maneja toda la lógica de enrutamiento
 */
function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App