// ListaSolicitudes/ModalConfirmacion.jsx
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import Button from '../../../components/common/Button'
import { formatearEstado, formatearMoneda } from './utils'

const ModalConfirmacion = ({
  isOpen,
  onClose,
  solicitud,
  tipoAccion,
  onConfirmar
}) => {
  if (!isOpen || !solicitud) return null

  const titulo = tipoAccion === 'aprobar' ? 'Confirmar Aprobación' : 'Confirmar Denegación'
  const accion = tipoAccion === 'aprobar' ? 'aprobar' : 'denegar'
  const variantBoton = tipoAccion === 'aprobar' ? 'primary' : 'danger'
  const textoBoton = tipoAccion === 'aprobar' ? 'Aprobar' : 'Denegar'

  // Cerrar modal al hacer clic en el backdrop (opcional)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <h2 className="text-xl font-semibold text-slate-100">
            {titulo}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="text-slate-200">
            <p className="mb-6 text-lg">
              ¿Estás seguro de que quieres <span className="font-semibold">{accion}</span> la solicitud?
            </p>

            <div className="bg-slate-700 border border-slate-600 p-4 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-semibold text-slate-100 min-w-[100px]">Folio:</span>
                <span className="text-blue-300 font-medium">
                  {solicitud.folio_solicitud}
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-slate-100">Descripción:</span>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {solicitud.descripcion_detallada}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-semibold text-slate-100 min-w-[100px]">Solicitante:</span>
                <span className="text-slate-200">
                  {solicitud.solicitante?.nombre_completo || 
                   solicitud.usuario?.nombre_completo || 'N/A'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-semibold text-slate-100 min-w-[100px]">Presupuesto:</span>
                <span className="text-emerald-300 font-semibold text-lg">
                  {formatearMoneda(solicitud.presupuesto_estimado)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            variant={variantBoton}
            onClick={onConfirmar}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {textoBoton}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion