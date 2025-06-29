import React, { useState } from 'react';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import { PlusIcon, FilePlusIcon, UploadIcon, TrashIcon } from '../../components/common/Icons'; // Asegúrate de importar los iconos

// Puedes crear este como un componente separado: components/tables/RequestItemsTable.jsx
const RequestItemsTable = ({ items, onAddItem, onRemoveItem, onItemChange }) => (
  <div className="overflow-x-auto mb-6 rounded-lg shadow-inner border border-gray-700">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">Ítem</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Cantidad</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Unidad</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Precio Est.</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Justificación</th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {items.map((item, index) => (
          <tr key={index}>
            <td className="p-3 whitespace-nowrap"><Input type="text" value={item.item} onChange={(e) => onItemChange(index, 'item', e.target.value)} className="!my-0 !py-1 !px-2 text-sm bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="Nombre del ítem" required/></td>
            <td className="p-3 whitespace-nowrap"><Input type="number" value={item.quantity} onChange={(e) => onItemChange(index, 'quantity', e.target.value)} className="!my-0 !py-1 !px-2 text-sm w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500" min="1" required/></td>
            <td className="p-3 whitespace-nowrap"><Input type="text" value={item.unit} onChange={(e) => onItemChange(index, 'unit', e.target.value)} className="!my-0 !py-1 !px-2 text-sm w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="Unidad" required/></td>
            <td className="p-3 whitespace-nowrap"><Input type="number" value={item.price} onChange={(e) => onItemChange(index, 'price', e.target.value)} className="!my-0 !py-1 !px-2 text-sm w-24 bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="0.00" step="0.01" min="0"/></td>
            <td className="p-3 whitespace-nowrap"><Input type="text" value={item.justification} onChange={(e) => onItemChange(index, 'justification', e.target.value)} className="!my-0 !py-1 !px-2 text-sm bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="Motivo del ítem"/></td>
            <td className="p-3 whitespace-nowrap text-right">
              <Button type="button" onClick={() => onRemoveItem(index)} variant="danger" className="p-1 rounded-full">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CreateRequest = () => {
  const [items, setItems] = useState([{ item: '', quantity: '', unit: '', price: '', justification: '' }]);
  const [pdfFile, setPdfFile] = useState(null);

  const handleAddItem = () => {
    setItems([...items, { item: '', quantity: '', unit: '', price: '', justification: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Solicitud enviada:', { items, pdfFile });
    alert('Solicitud creada exitosamente (simulado)!');
    // Lógica para limpiar el formulario o redirigir
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Crear Nueva Solicitud</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Título/Concepto de la Solicitud" id="requestTitle" placeholder="Compra de equipos de laboratorio" required />
        <TextArea label="Descripción Detallada" id="requestDescription" placeholder="Detalle la necesidad y el propósito de esta requisición." required />
        <Input label="Fecha de Necesidad" id="neededDate" type="date" required />

        <div className="mb-6 p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700">
          <label htmlFor="pdfUpload" className="block text-sm font-medium text-gray-300 mb-2">Cargar Solicitud en PDF</label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="pdfUpload"
              className="flex flex-col items-center justify-center w-full h-32 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-8 h-8 mb-3 text-blue-400" />
                <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                <p className="text-xs text-gray-400">PDF (MAX. 5MB)</p>
              </div>
              <input id="pdfUpload" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>
          {pdfFile && (
            <p className="mt-2 text-sm text-gray-300">Archivo seleccionado: <span className="font-semibold text-blue-400">{pdfFile.name}</span></p>
          )}
        </div>

        <h3 className="text-xl font-semibold text-white mb-4">Ítems Solicitados</h3>
        <RequestItemsTable
          items={items}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onItemChange={handleItemChange}
        />
        <Button type="button" onClick={handleAddItem} variant="secondary" className="mb-6" icon={PlusIcon}>
          Agregar Ítem
        </Button>

        <div className="flex justify-end gap-4">
          <Button type="submit" variant="primary" icon={FilePlusIcon}>
            Enviar Solicitud
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;