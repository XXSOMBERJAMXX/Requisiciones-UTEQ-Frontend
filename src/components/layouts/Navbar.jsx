import React from 'react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center md:hidden border-b border-gray-700">
      <button onClick={onMenuClick} className="text-gray-300 focus:outline-none hover:text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <h2 className="text-lg font-semibold text-white">Requisiciones UTEQ</h2>
      <div className="w-6"></div> {/* Placeholder for alignment */}
    </header>
  );
};

export default Navbar;