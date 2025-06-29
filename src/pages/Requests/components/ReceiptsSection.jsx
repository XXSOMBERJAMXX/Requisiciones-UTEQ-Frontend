import React from 'react';
import Button from '../../../components/common/Button'; // Ajusta la ruta si es necesario
import { PlusIcon, UploadIcon } from '../../../components/common/Icons';

const ReceiptsSection = ({ receipts }) => {
  return (
    <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Recibos y Pagos</h3>
        <Button variant="secondary" icon={UploadIcon}>Subir Recibo</Button>
      </div>
      {receipts && receipts.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">Archivo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {receipts.map((receipt, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-300 hover:underline cursor-pointer" onClick={() => alert(`Descargando ${receipt.name}`)}>{receipt.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{receipt.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">${parseFloat(receipt.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${receipt.status === 'Pagado' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'}`}>
                      {receipt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">No hay recibos o información de pagos disponible.</p>
      )}
    </div>
  );
};

export default ReceiptsSection;