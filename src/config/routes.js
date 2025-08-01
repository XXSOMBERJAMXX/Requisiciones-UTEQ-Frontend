// ===== ARCHIVO: src/config/routes.js =====
import { lazy } from 'react'

// Importaciones lazy para mejor performance
const Dashboard = lazy(() => import('../pages/Dashboard'))

// Páginas de autenticación
const Login = lazy(() => import('../pages/Auth/Login'))

// Páginas de solicitudes
const ListaSolicitudes = lazy(() => import('../pages/solicitudes/ListaSolicitudes'))
const CrearSolicitud = lazy(() => import('../pages/solicitudes/CrearSolicitud'))
const DetalleSolicitud = lazy(() => import('../pages/solicitudes/DetalleSolicitud'))
const EditarSolicitud = lazy(() => import('../pages/solicitudes/EditarSolicitud'))

// Páginas de compras
const Compras = lazy(() => import('../pages/compras/Compras'))
const GestionarCompras = lazy(() => import('../pages/compras/GestionarCompras'))

// Otras páginas
const Reportes = lazy(() => import('../pages/Reportes'))
const Usuarios = lazy(() => import('../pages/Usuarios'))

// ===== CONFIGURACIÓN DE RUTAS =====
export const routesConfig = {
  // Rutas públicas (sin autenticación)
  public: [
    {
      path: '/login',
      element: Login,
      title: 'Iniciar Sesión'
    }
  ],

  // Rutas protegidas (requieren autenticación)
  protected: [
    {
      path: '',  // ✅ Cambiado de '/' a '' para la ruta index
      element: Dashboard,
      title: 'Dashboard',
      exact: true
    },
    
    // Módulo de Solicitudes
    {
      path: 'solicitudes',  // ✅ Sin '/' al inicio
      element: ListaSolicitudes,
      title: 'Solicitudes',
      module: 'solicitudes'
    },
    {
      path: 'solicitudes/crear',  // ✅ Sin '/' al inicio
      element: CrearSolicitud,
      title: 'Crear Solicitud',
      module: 'solicitudes'
    },
    {
      path: 'solicitudes/:id',  // ✅ Sin '/' al inicio
      element: DetalleSolicitud,
      title: 'Detalle de Solicitud',
      module: 'solicitudes'
    },
    {
      path: 'solicitudes/:id/editar',  // ✅ Sin '/' al inicio
      element: EditarSolicitud,
      title: 'Editar Solicitud',
      module: 'solicitudes'
    },

    // Módulo de Compras
    {
      path: 'compras',  // ✅ Sin '/' al inicio
      element: Compras,
      title: 'Compras',
      module: 'compras'
    },
    {
      path: 'compras/crear',  // ✅ Sin '/' al inicio
      element: GestionarCompras,
      title: 'Crear Compra',
      module: 'compras'
    },
    {
      path: 'compras/editar/:id',  // ✅ Sin '/' al inicio
      element: GestionarCompras,
      title: 'Editar Compra',
      module: 'compras'
    },

    // Otros módulos
    {
      path: 'reportes',  // ✅ Sin '/' al inicio
      element: Reportes,
      title: 'Reportes',
      module: 'reportes'
    },
    {
      path: 'usuarios',  // ✅ Sin '/' al inicio
      element: Usuarios,
      title: 'Usuarios',
      module: 'usuarios'
    }
  ],

  // Configuración de redirecciones
  redirects: {
    notFound: '/login',      // Ruta para 404s
    unauthorized: '/login',  // Ruta para usuarios no autenticados
    afterLogin: '/',         // Ruta después del login exitoso
    afterLogout: '/login'    // Ruta después del logout
  },

  // Configuración de títulos
  titles: {
    default: 'Sistema de Requisiciones UTEQ',
    separator: ' - ',
    suffix: 'UTEQ'
  }
}

// ===== UTILIDADES =====

/**
 * Obtener todas las rutas de un tipo específico
 */
export const getRoutesByType = (type) => {
  return routesConfig[type] || []
}

/**
 * Obtener rutas por módulo
 */
export const getRoutesByModule = (module) => {
  return routesConfig.protected.filter(route => route.module === module)
}

/**
 * Buscar una ruta por path
 */
export const findRouteByPath = (path) => {
  const allRoutes = [...routesConfig.public, ...routesConfig.protected]
  return allRoutes.find(route => route.path === path)
}

/**
 * Generar título de página
 */
export const generatePageTitle = (routeTitle) => {
  const { default: defaultTitle, separator, suffix } = routesConfig.titles
  
  if (!routeTitle) return defaultTitle
  
  return `${routeTitle}${separator}${suffix}`
}

// ===== METADATOS DE RUTAS =====
export const routeMetadata = {
  totalRoutes: routesConfig.public.length + routesConfig.protected.length,
  modules: [...new Set(routesConfig.protected.map(route => route.module).filter(Boolean))],
  publicRoutes: routesConfig.public.length,
  protectedRoutes: routesConfig.protected.length
}