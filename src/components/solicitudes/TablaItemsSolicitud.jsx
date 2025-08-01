// components/solicitudes/TablaItemsSolicitud.jsx
import React from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { FaTrash } from 'react-icons/fa'

const TablaItemsSolicitud = ({
  items,
//   onAgregarItem,
  onEliminarItem,
  onCambiarItem,
  readonly = false
}) => (
  <div className="overflow-x-auto mb-6 rounded-lg shadow-inner border border-gray-700">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">
            Ítem
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
            Cantidad
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
            Precio Est.
          </th>
          {readonly && (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Subtotal
            </th>
          )}
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
            Justificación
          </th>
          {!readonly && (
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">
              Acciones
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {items.map((item, index) => (
          <tr key={index}>
            <td className="p-3 whitespace-nowrap">
              {readonly ? (
                <span className="text-sm text-white font-medium">{item.nombre}</span>
              ) : (
                <Input
                  type="text"
                  value={item.nombre}
                  onChange={(e) => onCambiarItem(index, 'nombre', e.target.value)}
                  className="!my-0 !py-1 !px-2 text-sm bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                  placeholder="Nombre del ítem"
                  required
                />
              )}
            </td>
            <td className="p-3 whitespace-nowrap">
              {readonly ? (
                <span className="text-sm text-gray-300">{item.cantidad}</span>
              ) : (
                <Input
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => onCambiarItem(index, 'cantidad', e.target.value)}
                  className="!my-0 !py-1 !px-2 text-sm w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                  min="1"
                  required
                />
              )}
            </td>
            <td className="p-3 whitespace-nowrap">
              {readonly ? (
                <span className="text-sm text-gray-300">
                  {item.precio_estimado ? `$${parseFloat(item.precio_estimado).toFixed(2)}` : 'N/A'}
                </span>
              ) : (
                <Input
                  type="number"
                  value={item.precio_estimado}
                  onChange={(e) => onCambiarItem(index, 'precio_estimado', e.target.value)}
                  className="!my-0 !py-1 !px-2 text-sm w-24 bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              )}
            </td>
            {readonly && (
              <td className="px-4 py-3 text-sm text-gray-300 font-medium">
                {item.precio_estimado && item.cantidad 
                  ? `$${(parseFloat(item.precio_estimado) * parseInt(item.cantidad)).toFixed(2)}` 
                  : 'N/A'}
              </td>
            )}
            <td className="p-3 whitespace-nowrap">
              {readonly ? (
                <span className="text-sm text-gray-300">{item.justificacion || 'Sin justificación'}</span>
              ) : (
                <Input
                  type="text"
                  value={item.justificacion}
                  onChange={(e) => onCambiarItem(index, 'justificacion', e.target.value)}
                  className="!my-0 !py-1 !px-2 text-sm bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                  placeholder="Justificación del ítem"
                />
              )}
            </td>
            {!readonly && (
              <td className="p-3 whitespace-nowrap">
                <Button
                  type="button"
                  onClick={() => onEliminarItem(index)}
                  variant="danger"
                  className="p-1 rounded-full"
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default TablaItemsSolicitud