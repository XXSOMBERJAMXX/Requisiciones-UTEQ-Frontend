import React from 'react';
import Input from '../common/Input'; // Asegúrate de la ruta correcta
import Button from '../common/Button';
import { TrashIcon } from '../common/Icons'; // Asegúrate de la ruta correcta

const RequestItemsTable = ({ items, onAddItem, onRemoveItem, onItemChange, isReadOnly = false }) => {
  return (
    <div className="overflow-x-auto mb-6 rounded-lg shadow-inner border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">Ítem</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Cantidad</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Precio Est.</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Justificación</th>
            {!isReadOnly && <th className="px-4 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Acciones</th>}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {items.map((item, index) => (
            <tr key={index}>
              <td className="p-3 whitespace-nowrap">
                {isReadOnly ? <p className="text-sm text-gray-300">{item.item}</p> : <Input type="text" value={item.item} onChange={(e) => onItemChange(index, 'item', e.target.value)} className="!my-0 !py-1 !px-2 text-sm bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="Nombre del ítem" required={!isReadOnly} readOnly={isReadOnly} />}
              </td>
              <td className="p-3 whitespace-nowrap">
                {isReadOnly ? <p className="text-sm text-gray-300">{item.quantity}</p> : <Input type="number" value={item.quantity} onChange={(e) => onItemChange(index, 'quantity', e.target.value)} className="!my-0 !py-1 !px-2 text-sm w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500" min="1" required={!isReadOnly} readOnly={isReadOnly} />}
              </td>
              <td className="p-3 whitespace-nowrap">
                {isReadOnly ? <p className="text-sm text-gray-300">${item.price ? parseFloat(item.price).toFixed(2) : '0.00'}</p> : <Input type="number" value={item.price} onChange={(e) => onItemChange(index, 'price', e.target.value)} className="!my-0 !py-1 !px-2 text-sm w-24 bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="0.00" step="0.01" min="0" readOnly={isReadOnly} />}
              </td>
              <td className="p-3 whitespace-nowrap">
                {isReadOnly ? <p className="text-sm text-gray-300">{item.justification}</p> : <Input type="text" value={item.justification} onChange={(e) => onItemChange(index, 'justification', e.target.value)} className="!my-0 !py-1 !px-2 text-sm bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="Motivo del ítem" readOnly={isReadOnly} />}
              </td>
              {!isReadOnly && (
                <td className="p-3 whitespace-nowrap text-right">
                  <Button type="button" onClick={() => onRemoveItem(index)} variant="danger" className="p-1 rounded-full">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={isReadOnly ? 5 : 6} className="p-4 text-center text-gray-400">No hay ítems agregados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestItemsTable;