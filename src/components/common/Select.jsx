import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error,
  required,
  disabled,
  placeholder = "Seleccionar opción...",
  className = "",
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const inputRef = useRef(null);

  // Filtrar opciones basado en búsqueda
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Encontrar la opción seleccionada
  const selectedOption = options.find(option => option.value === value);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar selección de opción
  const handleOptionSelect = (option) => {
    if (onChange) {
      // Simular evento de cambio para compatibilidad
      const syntheticEvent = {
        target: {
          name,
          value: option.value
        }
      };
      onChange(syntheticEvent);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  // Manejar teclas
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (filteredOptions.length === 1) {
        handleOptionSelect(filteredOptions[0]);
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-slate-200 mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Select container */}
      <div ref={selectRef} className="relative">
        {/* Main select button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            relative w-full bg-slate-700 border rounded-lg px-3 py-2.5 text-left cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-slate-600 hover:border-slate-500'
            }
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={`block truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-100'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaChevronDown 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-hidden">
            {/* Search input */}
            {options.length > 5 && (
              <div className="p-2 border-b border-slate-600">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`
                      relative w-full px-3 py-2.5 text-left hover:bg-slate-600 
                      focus:bg-slate-600 focus:outline-none cursor-pointer
                      transition-colors duration-150 flex items-center justify-between
                      ${value === option.value ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    `}
                  >
                    <span className={`block truncate ${
                      value === option.value ? 'text-white font-medium' : 'text-slate-100'
                    }`}>
                      {option.label}
                    </span>
                    {value === option.value && (
                      <FaCheck className="w-4 h-4 text-white flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-slate-400 text-sm">
                  No se encontraron opciones
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Hidden native select for form compatibility */}
      <select
        name={name}
        value={value}
        onChange={() => {}} // Controlled by our custom component
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
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