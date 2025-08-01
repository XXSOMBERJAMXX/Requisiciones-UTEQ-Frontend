// ===== ARCHIVO: src/routes/AppRoutes.jsx =====
import { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { routesConfig, generatePageTitle } from '../config/routes'
import ProtectedRoute from '../components/ProtectedRoute'
import Layout from '../components/layouts/Layout'

// Componente de loading para lazy loading
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-950">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="text-gray-400 text-sm">Cargando página...</p>
    </div>
  </div>
)

// Hook para actualizar el título de la página
const usePageTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const currentRoute = [
      ...routesConfig.public,
      ...routesConfig.protected,
    ].find((route) => {
      // Manejar rutas con parámetros
      const routePattern = route.path.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^${routePattern}$`)
      return regex.test(location.pathname)
    })

    const title = currentRoute
      ? generatePageTitle(currentRoute.title)
      : generatePageTitle()

    document.title = title
  }, [location])
}

// Componente principal de rutas
const AppRoutes = () => {
  // Actualizar título de página automáticamente
  usePageTitle()

  return (
    <Routes>
      {/* Rutas públicas (sin layout ni protección) */}
      {routesConfig.public.map((route) => {
        const Component = route.element
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<RouteLoader />}>
                <Component />
              </Suspense>
            }
          />
        )
      })}

      {/* Rutas protegidas (con layout y autenticación) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {routesConfig.protected.map((route) => {
          const Component = route.element
          return (
            <Route
              key={route.path || 'index'} // ✅ Key mejorado para ruta vacía
              path={route.path || undefined} // ✅ undefined para ruta index
              index={route.path === ''} // ✅ Marcar como index si path está vacío
              element={
                <Suspense fallback={<RouteLoader />}>
                  <Component />
                </Suspense>
              }
            />
          )
        })}
      </Route>

      {/* Ruta comodín para 404s */}
      <Route
        path="*"
        element={<Navigate to={routesConfig.redirects.notFound} replace />}
      />
    </Routes>
  )
}

export default AppRoutes
