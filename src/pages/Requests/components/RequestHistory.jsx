import React from 'react';

const RequestHistory = ({ history }) => {
  return (
    <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
      <h3 className="text-xl font-semibold text-white mb-4">Historial de la Solicitud</h3>
      {history && history.length > 0 ? (
        <ul className="space-y-4">
          {history.map((entry, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-600">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-semibold text-blue-300">{entry.user}</span>
                <span className="text-gray-400">{entry.date}</span>
              </div>
              <p className="text-gray-300"><span className="font-medium text-white">{entry.action}:</span> {entry.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No hay historial disponible para esta solicitud.</p>
      )}
    </div>
  );
};

export default RequestHistory;