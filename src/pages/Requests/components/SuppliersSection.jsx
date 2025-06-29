import React from 'react';
import Button from '../../../components/common/Button'; // Ajusta la ruta si es necesario
import { PlusIcon } from '../../../components/common/Icons';

const SuppliersSection = ({ suppliers }) => {
  return (
    <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Proveedores y Cotizaciones</h3>
        <Button variant="secondary" icon={PlusIcon}>Agregar Proveedor</Button>
      </div>
      {suppliers && suppliers.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">Proveedor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Cotización</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {suppliers.map((supplier, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 font-medium">{supplier.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-300">{supplier.contact}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">${parseFloat(supplier.quote).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">No hay información de proveedores y cotizaciones.</p>
      )}
    </div>
  );
};

export default SuppliersSection;