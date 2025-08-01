// DocumentPreviewModal.jsx - Sin fondo
import React, { useState } from 'react';
import { FaDownload, FaTimes, FaFile, FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';
import Button from '../common/Button';

const DocumentPreviewModal = ({ documento, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!isOpen || !documento) return null;

  // Configurar la URL del archivo (ajusta según tu configuración del backend)
  const API_BASE_URL = 'http://localhost:3000';
  const fileUrl = `${API_BASE_URL}/${documento.ruta_archivo || documento.nombre_archivo}`;

  // Obtener extensión del archivo
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const extension = getFileExtension(documento.nombre_archivo);

  // Determinar el tipo de archivo
  const getFileType = (extension) => {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const pdfTypes = ['pdf'];
    const textTypes = ['txt', 'csv'];

    if (imageTypes.includes(extension)) return 'image';
    if (pdfTypes.includes(extension)) return 'pdf';
    if (textTypes.includes(extension)) return 'text';
    return 'other';
  };

  const fileType = getFileType(extension);

  // Obtener icono según el tipo
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <FaFileImage className="w-8 h-8 text-green-400" />;
      case 'pdf':
        return <FaFilePdf className="w-8 h-8 text-red-400" />;
      case 'text':
        return <FaFileAlt className="w-8 h-8 text-blue-400" />;
      default:
        return <FaFile className="w-8 h-8 text-gray-400" />;
    }
  };

  // Función para descargar el archivo
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = documento.nombre_archivo;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para abrir en nueva pestaña
  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  // Renderizar contenido según el tipo de archivo
  const renderPreviewContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <FaFile className="w-16 h-16 mb-4" />
          <p className="text-lg mb-2">No se puede mostrar la vista previa</p>
          <p className="text-sm">El archivo podría no estar disponible o en un formato no compatible</p>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <div className="flex justify-center items-center p-4">
            <img
              src={fileUrl}
              alt={documento.nombre_archivo}
              className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
          </div>
        );

      case 'pdf':
        return (
          <div className="w-full h-96">
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full border-0 rounded-lg"
              title={documento.nombre_archivo}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
          </div>
        );

      case 'text':
        return (
          <div className="p-4 bg-gray-800 rounded-lg h-96 overflow-auto">
            <iframe
              src={fileUrl}
              className="w-full h-full border-0 bg-white rounded"
              title={documento.nombre_archivo}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            {getFileIcon(extension)}
            <p className="text-lg mb-2 mt-4">Vista previa no disponible</p>
            <p className="text-sm mb-4">Tipo de archivo: .{extension.toUpperCase()}</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleOpenInNewTab}>
                Abrir en nueva pestaña
              </Button>
              <Button variant="primary" onClick={handleDownload}>
                <FaDownload className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    // SIN FONDO NEGRO - completamente transparente
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-hidden border border-slate-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3">
            {getFileIcon(extension)}
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                {documento.nombre_archivo}
              </h3>
              <p className="text-sm text-slate-400">
                {documento.fecha_subida && `Subido el ${new Date(documento.fecha_subida).toLocaleDateString()}`}
                {documento.usuario_subida && ` por ${documento.usuario_subida.nombre_completo}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <FaDownload className="w-4 h-4" />
              <span>Descargar</span>
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleOpenInNewTab}
              className="flex items-center space-x-2"
            >
              <span>Nueva pestaña</span>
            </Button>
            
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
              title="Cerrar"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 z-10">
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span>Cargando vista previa...</span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {renderPreviewContent()}
          </div>
        </div>

        {/* Footer con información adicional */}
        <div className="px-6 py-4 bg-slate-800 border-t border-slate-600">
          <div className="flex justify-between items-center text-sm text-slate-400">
            <div className="flex space-x-4">
              <span>Tipo: {extension.toUpperCase()}</span>
              {documento.tamaño && <span>Tamaño: {documento.tamaño}</span>}
            </div>
            <div className="flex space-x-2">
              <span>Presiona ESC para cerrar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;