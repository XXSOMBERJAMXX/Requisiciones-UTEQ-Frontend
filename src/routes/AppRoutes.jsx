import { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { routesConfig, generatePageTitle } from '../config/routes'
import ProtectedRoute from '../components/ProtectedRoute'
import Layout from '../components/layouts/Layout'

// Componente de loading
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
    const allRoutes = [
      ...routesConfig.public,
      ...routesConfig.protected,
      ...routesConfig.reportes.routes.map(route => ({
        ...route,
        path: `reportes/${route.path}`.replace(/\/$/, '')
      }))
    ]

    const currentRoute = allRoutes.find(route => {
      const routePattern = route.path.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^/${routePattern}$`)
      return regex.test(location.pathname)
    })

    const title = currentRoute
      ? generatePageTitle(currentRoute.title)
      : generatePageTitle()

    document.title = title
  }, [location])
}

const AppRoutes = () => {
  usePageTitle()

  return (
    <Routes>
      {/* Solo la ruta de login está fuera del layout */}
      {routesConfig.public.map(route => {
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

      {/* Todas las rutas protegidas dentro del layout principal */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Sub-rutas protegidas generales */}
        {routesConfig.protected.map(route => {
          const Component = route.element
          return (
            <Route
              key={route.path || 'index'}
              path={route.path || undefined}
              index={route.path === ''}
              element={
                <Suspense fallback={<RouteLoader />}>
                  <Component />
                </Suspense>
              }
            />
          )
        })}

        {/* Sub-rutas de reportes con layout anidado */}
        <Route
          path="reportes/*"
          element={
            <Suspense fallback={<RouteLoader />}>
              <routesConfig.reportes.layout />
            </Suspense>
          }
        >
          {routesConfig.reportes.routes.map(route => {
            const Component = route.element
            return (
              <Route
                key={route.path || 'index'}
                path={route.path || undefined}
                index={route.path === ''}
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Component />
                  </Suspense>
                }
              />
            )
          })}
        </Route>
      </Route>

      {/* Ruta comodín */}
      <Route
        path="*"
        element={<Navigate to={routesConfig.redirects.notFound} replace />}
      />
    </Routes>
  )
}

export default AppRoutes
