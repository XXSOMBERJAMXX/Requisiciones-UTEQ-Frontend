// DetalleSolicitud/ModalAprobacion.jsx
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import Button from '../../../components/common/Button'
import TextArea from '../../../components/common/TextArea'
import { formatearMoneda } from './utils'

const ModalAprobacion = ({
  isOpen,
  onClose,
  tipoAccion,
  comentarios,
  setComentarios,
  solicitud,
  onConfirmar
}) => {
  if (!isOpen || !solicitud) return null

  const titulo = tipoAccion === 'aprobar' ? 'Aprobar Solicitud' : 'Denegar Solicitud'
  const accion = tipoAccion === 'aprobar' ? 'aprobar' : 'denegar'
  const variantBoton = tipoAccion === 'aprobar' ? 'primary' : 'danger'
  const textoBoton = tipoAccion === 'aprobar' ? 'Aprobar' : 'Denegar'

  // Cerrar modal al hacer clic en el backdrop
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
      <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-w-lg w-full mx-auto transform transition-all">
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
        <div className="p-6 space-y-6">
          {/* Resumen de la solicitud */}
          <div className="bg-slate-700 border border-slate-600 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-100 mb-3">
              Resumen de la Solicitud
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Folio:</span>
                <span className="text-blue-300 font-mono">
                  {solicitud.folio_solicitud}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Solicitante:</span>
                <span className="text-slate-200">
                  {solicitud.solicitante?.nombre_completo || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Presupuesto:</span>
                <span className="text-emerald-300 font-semibold">
                  {formatearMoneda(solicitud.presupuesto_estimado)}
                </span>
              </div>
            </div>
          </div>

          {/* Campo de comentarios */}
          <div>
            <TextArea
              label="Comentarios (Opcional)"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder={`Agregue comentarios sobre ${
                tipoAccion === 'aprobar' ? 'la aprobación' : 'la denegación'
              } de esta solicitud...`}
              rows={4}
              className="bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
            />
          </div>

          {/* Mensaje de confirmación */}
          <div className="bg-slate-700 border border-slate-600 p-4 rounded-lg">
            <p className="text-slate-200">
              ¿Está seguro de que desea <span className="font-semibold">{accion}</span> esta solicitud?
            </p>
            {tipoAccion === 'denegar' && (
              <p className="text-slate-300 text-sm mt-2">
                Esta acción cambiará el estado de la solicitud a "Denegada".
              </p>
            )}
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

export default ModalAprobacion