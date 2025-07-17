// src/components/common/Input.jsx
import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block text-gray-200 text-sm font-bold mb-2">{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
        {...props}
      />
    </div>
  );
};

export default Input;