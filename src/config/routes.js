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

// Layout específico para reportes
const ReportesLayout = lazy(() => import('../components/layouts/ReportesLayout'))

// Páginas de reportes (SIN el layout, ya que será manejado por ReportesLayout)
const ReportesDashboard = lazy(() => import('../pages/reportes'))
const ComprasReports = lazy(() => import('../pages/reportes/ComprasReports'))
const SolicitudesReports = lazy(() => import('../pages/reportes/SolicitudesReports'))
const ExportCenter = lazy(() => import('../pages/reportes/ExportCenter'))

// Otras páginas
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
      path: '',
      element: Dashboard,
      title: 'Dashboard',
      exact: true
    },
    
    // Módulo de Solicitudes
    {
      path: 'solicitudes',
      element: ListaSolicitudes,
      title: 'Solicitudes',
      module: 'solicitudes'
    },
    {
      path: 'solicitudes/crear',
      element: CrearSolicitud,
      title: 'Crear Solicitud',
      module: 'solicitudes'
    },
    {
      path: 'solicitudes/:id',
      element: DetalleSolicitud,
      title: 'Detalle de Solicitud',
      module: 'solicitudes'
    },
    {
      path: 'solicitudes/:id/editar',
      element: EditarSolicitud,
      title: 'Editar Solicitud',
      module: 'solicitudes'
    },

    // Módulo de Compras
    {
      path: 'compras',
      element: Compras,
      title: 'Compras',
      module: 'compras'
    },
    {
      path: 'compras/crear',
      element: GestionarCompras,
      title: 'Crear Compra',
      module: 'compras'
    },
    {
      path: 'compras/editar/:id',
      element: GestionarCompras,
      title: 'Editar Compra',
      module: 'compras'
    },

    // Otros módulos
    {
      path: 'usuarios',
      element: Usuarios,
      title: 'Usuarios',
      module: 'usuarios'
    }
  ],

  // ✅ NUEVA SECCIÓN: Módulo de reportes con su propio layout
  reportes: {
    layout: ReportesLayout,
    routes: [
      {
        path: '',  // /reportes (ruta index)
        element: ReportesDashboard,
        title: 'Dashboard de Reportes',
        exact: true
      },
      {
        path: 'compras',  // /reportes/compras
        element: ComprasReports,
        title: 'Reportes de Compras'
      },
      {
        path: 'solicitudes',  // /reportes/solicitudes
        element: SolicitudesReports,
        title: 'Reportes de Solicitudes'
      },
      {
        path: 'exportar',  // /reportes/exportar
        element: ExportCenter,
        title: 'Exportar Reportes'
      }
    ]
  },

  // Configuración de redirecciones
  redirects: {
    notFound: '/login',
    unauthorized: '/login',
    afterLogin: '/',
    afterLogout: '/login'
  },

  // Configuración de títulos
  titles: {
    default: 'Sistema de Requisiciones UTEQ',
    separator: ' - ',
    suffix: 'UTEQ'
  }
}

// ===== UTILIDADES ACTUALIZADAS =====

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
  if (module === 'reportes') {
    return routesConfig.reportes.routes
  }
  return routesConfig.protected.filter(route => route.module === module)
}

/**
 * Buscar una ruta por path
 */
export const findRouteByPath = (path) => {
  const allRoutes = [
    ...routesConfig.public, 
    ...routesConfig.protected,
    ...routesConfig.reportes.routes
  ]
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

// ===== METADATOS DE RUTAS ACTUALIZADOS =====
export const routeMetadata = {
  totalRoutes: routesConfig.public.length + routesConfig.protected.length + routesConfig.reportes.routes.length,
  modules: [
    ...new Set(routesConfig.protected.map(route => route.module).filter(Boolean)),
    'reportes'
  ],
  publicRoutes: routesConfig.public.length,
  protectedRoutes: routesConfig.protected.length,
  reportesRoutes: routesConfig.reportes.routes.length
}