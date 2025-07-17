// src/components/common/TextArea.jsx
import React from 'react';

const TextArea = ({ label, name, value, onChange, placeholder, rows = 3, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block text-gray-200 text-sm font-bold mb-2">{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline min-h-12"
        {...props}
      ></textarea>
    </div>
  );
};

export default TextArea;