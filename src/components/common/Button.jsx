import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500',
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className} flex items-center justify-center gap-2`} {...props}>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;