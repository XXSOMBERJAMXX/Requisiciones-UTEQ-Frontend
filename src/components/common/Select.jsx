// src/components/common/Select.jsx
import React from 'react';

const Select = ({ label, name, value, onChange, options, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;