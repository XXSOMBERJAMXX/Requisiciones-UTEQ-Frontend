// src/components/common/Input.jsx - Versión simplificada
import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder,
  className = '',
  ...props 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-200 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="shadow appearance-none border rounded-lg w-full py-3 px-3 text-gray-300 bg-gray-700 border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
        {...props}
      />
    </div>
  );
};

export default Input;