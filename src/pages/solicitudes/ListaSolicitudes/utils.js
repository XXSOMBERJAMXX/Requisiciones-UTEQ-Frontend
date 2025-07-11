// ListaSolicitudes/utils.js

// Constantes de opciones
export const ESTADO_OPTIONS = [
  { value: 'todas', label: 'Todos los Estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_revision', label: 'En Revisión' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'denegada', label: 'Denegada' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'completada', label: 'Completada' },
]

export const TIPO_OPTIONS = [
  { value: 'todos', label: 'Todos los Tipos' },
  { value: 'productos', label: 'Productos' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
]

export const URGENCIA_OPTIONS = [
  { value: 'todas', label: 'Todas las Urgencias' },
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' },
]

// Utilidades de formateo
export const obtenerColorEstado = (estado) => {
  const coloresEstado = {
    pendiente: 'bg-amber-900/50 text-amber-200 border border-amber-600',
    en_revision: 'bg-blue-900/50 text-blue-200 border border-blue-600',
    aprobada: 'bg-emerald-900/50 text-emerald-200 border border-emerald-600',
    denegada: 'bg-red-900/50 text-red-200 border border-red-600',
    en_proceso: 'bg-purple-900/50 text-purple-200 border border-purple-600',
    completada: 'bg-slate-600 text-slate-200 border border-slate-500',
  }
  return coloresEstado[estado] || 'bg-slate-600 text-slate-200 border border-slate-500'
}

export const obtenerColorUrgencia = (urgencia) => {
  const coloresUrgencia = {
    critica: 'bg-red-900/50 text-red-200 border border-red-600',
    alta: 'bg-orange-900/50 text-orange-200 border border-orange-600',
    media: 'bg-amber-900/50 text-amber-200 border border-amber-600',
    baja: 'bg-emerald-900/50 text-emerald-200 border border-emerald-600',
  }
  return coloresUrgencia[urgencia] || 'bg-slate-600 text-slate-200 border border-slate-500'
}

export const formatearEstado = (estado) => {
  const etiquetasEstado = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    aprobada: 'Aprobada',
    denegada: 'Denegada',
    en_proceso: 'En Proceso',
    completada: 'Completada',
  }
  return etiquetasEstado[estado] || estado
}

export const formatearTipoRequisicion = (tipo) => {
  const tipoLabels = {
    productos: 'Productos',
    servicios: 'Servicios',
    mantenimiento: 'Mantenimiento',
  }
  return tipoLabels[tipo] || tipo
}

export const formatearUrgencia = (urgencia) => {
  const urgenciaLabels = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    critica: 'Crítica',
  }
  return urgenciaLabels[urgencia] || urgencia
}

export const formatearFecha = (fechaString) => {
  if (!fechaString) return 'N/A'
  return new Date(fechaString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const formatearMoneda = (cantidad) => {
  if (!cantidad) return 'N/A'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(cantidad)
}

// Verificadores de permisos
export const verificarPermisos = (solicitud, user) => {
  return {
    puedeAprobar: (user?.rol === 'aprobador' || user?.rol === 'admin_sistema') && 
                  solicitud.estatus === 'pendiente',
    
    puedeEditar: (solicitud.solicitante_id === user?.id_usuario || user?.rol === 'admin_sistema') &&
                 (solicitud.estatus === 'pendiente' || solicitud.estatus === 'denegada'),
    
    puedeEliminar: ((solicitud.solicitante_id === user?.id_usuario && solicitud.estatus === 'pendiente') ||
                    user?.rol === 'admin_sistema')
  }
}