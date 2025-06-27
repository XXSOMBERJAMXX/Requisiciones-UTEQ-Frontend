import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom'; // Asegúrate de importar useParams

// Iconos simplificados para este ejemplo
const HomeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const FileTextIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);
const FilePlusIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-plus">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);
const ShoppingCartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 4H5" />
  </svg>
);
const PieChartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pie-chart">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.05" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);
const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const LogOutIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="17 17 22 12 17 7"/>
    <line x1="22" x2="11" y1="12" y2="12"/>
  </svg>
);
const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);
const PlusIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
    <path d="M12 5v14"/>
    <path d="M5 12h14"/>
  </svg>
);
const EditIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    <path d="m15 5 4 4"/>
  </svg>
);
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    <line x1="10" x2="10" y1="11" y2="17"/>
    <line x1="14" x2="14" y1="11" y2="17"/>
  </svg>
);
const CheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const UploadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" x2="12" y1="3" y2="15"/>
  </svg>
);

// Componentes reutilizables (Estilo Oscuro)
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

const Input = ({ label, id, type = 'text', className = '', icon: Icon, ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
    <div className="relative">
      <input
        type={type}
        id={id}
        className={`mt-1 block w-full pl-3 ${Icon ? 'pl-10' : ''} pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
        {...props}
      />
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
    </div>
  </div>
);

const Select = ({ label, id, options, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
    <select
      id={id}
      className={`mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, id, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
    <textarea
      id={id}
      rows="4"
      className={`mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
      {...props}
    ></textarea>
  </div>
);

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <Button onClick={onClose} variant="secondary" className="p-2 rounded-full bg-transparent border-none hover:bg-gray-700">
            <XIcon className="w-5 h-5 text-gray-300" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Componente de Layout con Sidebar responsiva (Estilo Oscuro)
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Inicio', icon: HomeIcon, path: '/' },
    { name: 'Crear Solicitud', icon: FilePlusIcon, path: '/solicitudes/crear' },
    { name: 'Gestionar Solicitudes', icon: FileTextIcon, path: '/solicitudes' },
    { name: 'Compras', icon: ShoppingCartIcon, path: '/compras' },
    { name: 'Reportes', icon: PieChartIcon, path: '/reportes' },
    { name: 'Usuarios', icon: UsersIcon, path: '/usuarios' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 font-inter text-white">
      {/* Sidebar para pantallas grandes */}
      <div className={`hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 shadow-xl rounded-r-2xl`}>
        <div className="flex items-center mb-8 px-4 w-full">
          <img src="https://placehold.co/48x48/1F2937/60A5FA?text=UTEQ" alt="Logo UTEQ" className="mr-3 rounded-full border-2 border-blue-500"/>
          <h1 className="text-xl font-extrabold text-blue-400">Requisiciones</h1>
        </div>
        <nav className="flex-1">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-blue-700 text-white shadow-md' : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto px-4 py-3 border-t border-gray-700">
          <Button variant="outline" className="w-full text-gray-300 border-gray-600 hover:bg-gray-700" icon={LogOutIcon}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar para pantallas pequeñas */}
        <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center md:hidden border-b border-gray-700">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-300 focus:outline-none hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-white">Requisiciones UTEQ</h2>
          <div className="w-6"></div> {/* Placeholder for alignment */}
        </header>

        {/* Sidebar móvil (overlay) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 shadow-lg z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="flex justify-between items-center mb-8 px-4">
            <h1 className="text-2xl font-extrabold text-blue-400">Requisiciones</h1>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white focus:outline-none">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1">
            <ul>
              {navItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      location.pathname === item.path ? 'bg-blue-700 text-white shadow-md' : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto px-4 py-3 border-t border-gray-700">
            <Button variant="outline" className="w-full text-gray-300 border-gray-600 hover:bg-gray-700" icon={LogOutIcon}>
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Contenido de la página */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Vistas de la aplicación

// Módulo de Autenticación (Estilo Oscuro)
const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión...');
    navigate('/solicitudes');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01] border border-gray-700">
        <div className="text-center mb-8">
          <img src="https://placehold.co/80x80/1F2937/60A5FA?text=UTEQ" alt="Logo UTEQ" className="mx-auto mb-4 rounded-full shadow-lg border-2 border-blue-500"/>
          <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
          <p className="text-gray-400">Inicia sesión para acceder al sistema</p>
        </div>
        <form onSubmit={handleLogin}>
          <Input id="email" label="Correo Electrónico" type="email" placeholder="tu@uteq.edu.mx" required />
          <Input id="password" label="Contraseña" type="password" placeholder="********" required />
          <Button type="submit" variant="primary" className="w-full mt-6 text-lg py-3 shadow-lg hover:shadow-xl">
            Iniciar Sesión
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
};

// Módulo de Solicitudes (Estilo Oscuro)
const CreateRequest = () => {
  const [items, setItems] = useState([{ item: '', quantity: '', unit: '', price: '', justification: '' }]);
  const [pdfFile, setPdfFile] = useState(null);

  const handleAddItem = () => {
    setItems([...items, { item: '', quantity: '', unit: '', price: '', justification: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Solicitud enviada:', { items, pdfFile });
    // Usar un modal real en prod en lugar de alert
    alert('Solicitud creada exitosamente (simulado)!');
    // Limpiar formulario o redirigir
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Crear Nueva Solicitud</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Título/Concepto de la Solicitud" id="requestTitle" placeholder="Compra de equipos de laboratorio" required />
        <TextArea label="Descripción Detallada" id="requestDescription" placeholder="Detalle la necesidad y el propósito de esta requisición." required />
        <Input label="Fecha de Necesidad" id="neededDate" type="date" required />

        <div className="mb-6 p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700">
          <label htmlFor="pdfUpload" className="block text-sm font-medium text-gray-300 mb-2">Cargar Solicitud en PDF</label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="pdfUpload"
              className="flex flex-col items-center justify-center w-full h-32 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-8 h-8 mb-3 text-blue-400" />
                <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                <p className="text-xs text-gray-400">PDF (MAX. 5MB)</p>
              </div>
              <input id="pdfUpload" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>
          {pdfFile && (
            <p className="mt-2 text-sm text-gray-300">Archivo seleccionado: <span className="font-semibold text-blue-400">{pdfFile.name}</span></p>
          )}
        </div>

        <h3 className="text-xl font-semibold text-white mb-4">Ítems Solicitados</h3>
        <div className="overflow-x-auto mb-6 rounded-lg shadow-inner border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">Ítem</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Unidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Precio Est.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Justificación</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 whitespace-nowrap"><Input type="text" value={item.item} onChange={(e) => handleItemChange(index, 'item', e.target.value)} className="!my-0 !py-1 !px-2 text-sm bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="Nombre del ítem" required/></td>
                  <td className="p-3 whitespace-nowrap"><Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="!my-0 !py-1 !px-2 text-sm w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500" min="1" required/></td>
                  <td className="p-3 whitespace-nowrap"><Input type="text" value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} className="!my-0 !py-1 !px-2 text-sm w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="Unidad" required/></td>
                  <td className="p-3 whitespace-nowrap"><Input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="!my-0 !py-1 !px-2 text-sm w-24 bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="0.00" step="0.01" min="0"/></td>
                  <td className="p-3 whitespace-nowrap"><Input type="text" value={item.justification} onChange={(e) => handleItemChange(index, 'justification', e.target.value)} className="!my-0 !py-1 !px-2 text-sm bg-gray-700 text-white border-gray-600 focus:ring-blue-500" placeholder="Motivo del ítem"/></td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <Button type="button" onClick={() => handleRemoveItem(index)} variant="danger" className="p-1 rounded-full">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" onClick={handleAddItem} variant="secondary" className="mb-6" icon={PlusIcon}>
          Agregar Ítem
        </Button>

        <div className="flex justify-end gap-4">
          <Button type="submit" variant="primary" icon={FilePlusIcon}>
            Enviar Solicitud
          </Button>
        </div>
      </form>
    </div>
  );
};

const ManageRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const requests = [
    { id: 'REQ001', title: 'Equipos de Computo para Laboratorio', applicant: 'Juan Pérez', date: '2025-06-15', status: 'Pendiente' },
    { id: 'REQ002', title: 'Material de Oficina Área Administrativa', applicant: 'Ana Gómez', date: '2025-06-10', status: 'Aprobada' },
    { id: 'REQ003', title: 'Renovación Licencias Software Diseño', applicant: 'Carlos Ruiz', date: '2025-06-08', status: 'Denegada' },
    { id: 'REQ004', title: 'Mobiliario para Aulas Nuevas', applicant: 'Laura Martínez', date: '2025-06-20', status: 'Revisión' },
    { id: 'REQ005', title: 'Suministros de Limpieza', applicant: 'Pedro López', date: '2025-06-22', status: 'Pendiente' },
  ];

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-yellow-800 text-yellow-200';
      case 'Aprobada': return 'bg-green-800 text-green-200';
      case 'Denegada': return 'bg-red-800 text-red-200';
      case 'Revisión': return 'bg-blue-800 text-blue-200';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Gestionar Solicitudes</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          id="searchRequest"
          placeholder="Buscar por título, solicitante o ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
          icon={SearchIcon}
        />
        <Select
          id="filterStatus"
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Aprobada', label: 'Aprobada' },
            { value: 'Denegada', label: 'Denegada' },
            { value: 'Revisión', label: 'En Revisión' },
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="md:w-auto"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Solicitante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{req.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{req.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{req.applicant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{req.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="secondary" onClick={() => navigate(`/solicitudes/${req.id}`)} className="p-2 rounded-full" title="Ver Detalles">
                        <EyeIcon className="w-5 h-5 text-gray-200" />
                      </Button>
                      {req.status === 'Pendiente' && (
                        <>
                          <Button variant="primary" className="p-2 rounded-full" title="Aprobar">
                            <CheckIcon className="w-5 h-5" />
                          </Button>
                          <Button variant="danger" className="p-2 rounded-full" title="Denegar">
                            <XIcon className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">No se encontraron solicitudes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [suppliers, setSuppliers] = useState([
    { name: 'Proveedor A', quote: '1200.00', link: 'http://a.com', selected: false },
    { name: 'Proveedor B', quote: '1150.00', link: 'http://b.com', selected: false },
  ]);
  const [receipts, setReceipts] = useState([]);

  const request = {
    id: id,
    title: `Detalles de Solicitud ${id}`,
    applicant: 'Juan Pérez',
    date: '2025-06-15',
    description: 'Descripción detallada de la necesidad para la solicitud de equipos de cómputo para el laboratorio de sistemas. Se requieren 10 computadoras con características específicas para programación y diseño.',
    status: 'Pendiente',
    pdfFile: 'solicitud-equipos-laboratorio.pdf',
    items: [
      { item: 'Laptop Dell XPS 15', quantity: 5, unit: 'unidades', price: '1500.00', justification: 'Para desarrollo de software' },
      { item: 'Monitor 27" 4K', quantity: 10, unit: 'unidades', price: '400.00', justification: 'Mejora de experiencia visual' },
      { item: 'Teclado mecánico', quantity: 5, unit: 'unidades', price: '80.00', justification: 'Ergonomía para programadores' },
    ],
    history: [
      { type: 'Creada', by: 'Juan Pérez', date: '2025-06-15', comments: 'Solicitud inicial generada.' },
      { type: 'En Revisión', by: 'Administrador 1', date: '2025-06-16', comments: 'Revisión inicial en curso.' },
    ]
  };

  const handleApprove = () => {
    alert(`Solicitud ${id} APROBADA!`);
    navigate('/solicitudes');
  };

  const handleDeny = () => {
    alert(`Solicitud ${id} DENEGADA!`);
    navigate('/solicitudes');
  };

  const handleRequestReview = () => {
    alert(`Solicitud ${id} EN REVISIÓN!`);
    navigate('/solicitudes');
  };

  const handleAddSupplier = (newSupplier) => {
    setSuppliers([...suppliers, newSupplier]);
    setShowSupplierModal(false);
  };

  const handleSelectSupplier = (index) => {
    const newSuppliers = suppliers.map((s, i) => ({ ...s, selected: i === index }));
    setSuppliers(newSuppliers);
  };

  const handleReceiptUpload = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        url: URL.createObjectURL(file)
      }));
      setReceipts(prev => [...prev, ...filesArray]);
      setShowReceiptModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-yellow-800 text-yellow-200';
      case 'Aprobada': return 'bg-green-800 text-green-200';
      case 'Denegada': return 'bg-red-800 text-red-200';
      case 'Revisión': return 'bg-blue-800 text-blue-200';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Detalles de Solicitud: <span className="text-blue-400">{request.id}</span></h2>

      {/* Información General */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-md">
          <h3 className="text-lg font-semibold text-white mb-4">Información General</h3>
          <p className="mb-2 text-gray-200"><span className="font-medium text-gray-100">Título:</span> {request.title}</p>
          <p className="mb-2 text-gray-200"><span className="font-medium text-gray-100">Solicitante:</span> {request.applicant}</p>
          <p className="mb-2 text-gray-200"><span className="font-medium text-gray-100">Fecha de Creación:</span> {request.date}</p>
          <p className="mb-2 text-gray-200"><span className="font-medium text-gray-100">Estado:</span> <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
            {request.status}
          </span></p>
          <p className="mb-2 text-gray-200"><span className="font-medium text-gray-100">Descripción:</span> {request.description}</p>
          <p className="mt-4">
            <a href="#" className="text-blue-400 hover:underline flex items-center">
              <FileTextIcon className="w-5 h-5 mr-1" /> Descargar PDF de Solicitud
            </a>
          </p>
        </div>

        {/* Historial de la Solicitud */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-md">
          <h3 className="text-lg font-semibold text-white mb-4">Historial</h3>
          <ul className="space-y-4">
            {request.history.map((entry, index) => (
              <li key={index} className="relative pl-6">
                <div className="absolute left-0 top-0 h-full w-0.5 bg-blue-700"></div>
                <div className="absolute left-0 top-0 h-3 w-3 rounded-full bg-blue-500 -translate-x-1/2"></div>
                <p className="text-sm font-medium text-gray-100">{entry.type} por {entry.by}</p>
                <p className="text-xs text-gray-400">{entry.date}</p>
                <p className="text-sm text-gray-300">{entry.comments}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ítems Solicitados */}
      <div className="mb-6 bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Ítems Solicitados</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">Ítem</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Unidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Precio Est.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Justificación</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {request.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-100">{item.item}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{item.quantity}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{item.unit}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">${item.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-200">{item.justification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acciones de Aprobación/Denegación */}
      <div className="mb-6 bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Acciones de Solicitud</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleApprove} variant="primary" icon={CheckIcon}>
            Aprobar Solicitud
          </Button>
          <Button onClick={handleDeny} variant="danger" icon={XIcon}>
            Denegar Solicitud
          </Button>
          <Button onClick={handleRequestReview} variant="secondary" icon={EyeIcon}>
            Solicitar Revisión
          </Button>
        </div>
        <TextArea label="Comentarios para la decisión (Opcional)" id="decisionComments" className="mt-4" placeholder="Añade un comentario sobre tu decisión." />
      </div>

      {/* Comparación y Evaluación de Proveedores */}
      <div className="mb-6 bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Evaluación de Proveedores</h3>
        <Button onClick={() => setShowSupplierModal(true)} variant="secondary" className="mb-4" icon={PlusIcon}>
          Añadir Proveedor / Cotización
        </Button>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">Proveedor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Cotización</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Enlace</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Seleccionar</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {suppliers.length > 0 ? (
                suppliers.map((supplier, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-100">{supplier.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">${supplier.quote}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">
                      <a href={supplier.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ver</a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={supplier.selected}
                        onChange={() => handleSelectSupplier(index)}
                        className="form-checkbox h-5 w-5 text-blue-500 rounded-md border-gray-600 bg-gray-700 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-400">No hay proveedores añadidos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Carga de Recibos de Compra */}
      <div className="mb-6 bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Recibos de Compra</h3>
        <Button onClick={() => setShowReceiptModal(true)} variant="secondary" className="mb-4" icon={UploadIcon}>
          Cargar Recibo(s)
        </Button>
        {receipts.length > 0 ? (
          <ul className="space-y-2">
            {receipts.map((receipt, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-md border border-gray-600">
                <span className="text-sm font-medium text-gray-200">{receipt.name} ({receipt.size})</span>
                <a href={receipt.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Ver</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No hay recibos cargados para esta solicitud.</p>
        )}
      </div>

      <Button onClick={() => navigate(-1)} variant="outline">
        Volver a Solicitudes
      </Button>

      {/* Modal para Añadir Proveedor */}
      <Modal show={showSupplierModal} onClose={() => setShowSupplierModal(false)} title="Añadir Nuevo Proveedor / Cotización">
        <SupplierForm onSubmit={handleAddSupplier} />
      </Modal>

      {/* Modal para Cargar Recibos */}
      <Modal show={showReceiptModal} onClose={() => setShowReceiptModal(false)} title="Cargar Recibos de Compra">
        <div className="flex flex-col items-center justify-center w-full">
          <label
            htmlFor="receiptUpload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-10 h-10 mb-3 text-blue-400" />
              <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG (MAX. 5MB cada uno)</p>
            </div>
            <input id="receiptUpload" type="file" className="hidden" accept=".pdf,.jpg,.png" multiple onChange={handleReceiptUpload} />
          </label>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          <p>Archivos cargados temporalmente para este ejemplo.</p>
        </div>
      </Modal>
    </div>
  );
};

const SupplierForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && quote) {
      onSubmit({ name, quote, link, selected: false });
      setName('');
      setQuote('');
      setLink('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Nombre del Proveedor" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Cotización ($)" type="number" step="0.01" value={quote} onChange={(e) => setQuote(e.target.value)} required />
      <Input label="Enlace a la Cotización (Opcional)" type="url" value={link} onChange={(e) => setLink(e.target.value)} />
      <Button type="submit" variant="primary" className="mt-4 w-full">Añadir Proveedor</Button>
    </form>
  );
};


// Módulo de Compras (Estilo Oscuro)
const ViewPurchases = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const purchases = [
    { id: 'COM001', requestId: 'REQ002', supplier: 'Tech Solutions S.A.', amount: '11500.00', date: '2025-06-20', status: 'Pagada', invoice: 'inv-001.pdf' },
    { id: 'COM002', requestId: 'REQ004', supplier: 'Mobiliario Moderno', amount: '22000.00', date: '2025-06-25', status: 'Pendiente de Pago', invoice: 'inv-002.pdf' },
  ];

  const filteredPurchases = purchases.filter(p =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagada': return 'bg-green-800 text-green-200';
      case 'Pendiente de Pago': return 'bg-yellow-800 text-yellow-200';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Visualizar Compras Realizadas</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <Input
          id="searchPurchase"
          placeholder="Buscar por ID, proveedor, o solicitud..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow md:max-w-xs"
          icon={SearchIcon}
        />
        <Button onClick={() => navigate('/compras/crear')} variant="primary" icon={PlusIcon}>
          Crear Nueva Compra
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">ID Compra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Solicitud ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Monto Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Fecha Compra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{purchase.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <Link to={`/solicitudes/${purchase.requestId}`} className="text-blue-400 hover:underline">{purchase.requestId}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{purchase.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">${purchase.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{purchase.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="secondary" className="p-2 rounded-full" title="Ver Factura">
                        <FileTextIcon className="w-5 h-5 text-gray-200" />
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/compras/editar/${purchase.id}`)} className="p-2 rounded-full" title="Editar">
                        <EditIcon className="w-5 h-5 text-gray-200" />
                      </Button>
                      <Button variant="danger" className="p-2 rounded-full" title="Eliminar">
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">No se encontraron compras.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ManagePurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceFile, setInvoiceFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      alert(`Compra ${id} actualizada (simulado)!`);
    } else {
      alert('Compra creada exitosamente (simulado)!');
    }
    navigate('/compras');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">{id ? `Editar Compra: ${id}` : 'Crear Nueva Compra'}</h2>
      <form onSubmit={handleSubmit}>
        <Select
          label="Solicitud Asociada (Opcional)"
          id="associatedRequest"
          options={[
            { value: '', label: 'Seleccione una solicitud' },
            { value: 'REQ002', label: 'REQ002 - Material de Oficina' },
            { value: 'REQ004', label: 'REQ004 - Mobiliario para Aulas' },
          ]}
        />
        <Input label="Proveedor" id="purchaseSupplier" placeholder="Nombre del proveedor" required />
        <Input label="Fecha de Compra" id="purchaseDate" type="date" required />
        <Input label="Monto Total ($)" id="purchaseAmount" type="number" step="0.01" placeholder="0.00" required />

        <div className="mb-6 p-4 border-2 border-dashed border-gray-600 rounded-md bg-gray-700">
          <label htmlFor="invoiceUpload" className="block text-sm font-medium text-gray-300 mb-2">Cargar Factura(s)</label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="invoiceUpload"
              className="flex flex-col items-center justify-center w-full h-32 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-8 h-8 mb-3 text-blue-400" />
                <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                <p className="text-xs text-gray-400">PDF, XML, JPG, PNG (Múltiples archivos)</p>
              </div>
              <input id="invoiceUpload" type="file" className="hidden" accept=".pdf,.xml,.jpg,.png" multiple onChange={handleFileChange} />
            </label>
          </div>
          {invoiceFile && (
            <p className="mt-2 text-sm text-gray-300">Archivo(s) seleccionado(s): <span className="font-semibold text-blue-400">{invoiceFile.name}</span></p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/compras')}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {id ? 'Actualizar Compra' : 'Guardar Compra'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Módulo de Reportes (Estilo Oscuro)
const GenerateReports = () => {
  const [reportType, setReportType] = useState('requests');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    console.log('Generando reporte:', { reportType, startDate, endDate });
    if (reportType === 'requests') {
      setGeneratedReport({
        type: 'Solicitudes',
        data: [
          { id: 'REQ001', title: 'Equipos de Computo', status: 'Pendiente', date: '2025-06-15' },
          { id: 'REQ002', title: 'Material de Oficina', status: 'Aprobada', date: '2025-06-10' },
          { id: 'REQ003', title: 'Licencias Software', status: 'Denegada', date: '2025-06-08' },
        ],
        summary: 'Total de solicitudes: 3, Aprobadas: 1, Pendientes: 1, Denegadas: 1.'
      });
    } else {
      setGeneratedReport({
        type: 'Compras',
        data: [
          { id: 'COM001', supplier: 'Tech Solutions', amount: '11500.00', date: '2025-06-20' },
          { id: 'COM002', supplier: 'Mobiliario Moderno', amount: '22000.00', date: '2025-06-25' },
        ],
        summary: 'Total de compras: 2, Monto total: $33,500.00.'
      });
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Generar Reportes</h2>
      <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select
          label="Tipo de Reporte"
          id="reportType"
          options={[
            { value: 'requests', label: 'Reporte de Solicitudes' },
            { value: 'purchases', label: 'Reporte de Compras' },
          ]}
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        />
        <Input label="Fecha de Inicio" id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input label="Fecha de Fin" id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" variant="primary" icon={PieChartIcon}>
            Generar Reporte
          </Button>
        </div>
      </form>

      {generatedReport && (
        <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700 shadow-md">
          <h3 className="text-xl font-semibold text-white mb-4">Reporte de {generatedReport.type}</h3>
          <p className="mb-4 text-gray-200">{generatedReport.summary}</p>

          <div className="overflow-x-auto rounded-lg border border-gray-700 mb-4">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  {Object.keys(generatedReport.data[0] || {}).map((key) => (
                    <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {generatedReport.data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary">Exportar a PDF</Button>
            <Button variant="secondary">Exportar a CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Módulo de Gestión de Usuarios (Estilo Oscuro)
const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const users = [
    { id: 'user1', name: 'Juan Pérez', email: 'juan.perez@uteq.edu.mx', role: 'Solicitante' },
    { id: 'user2', name: 'Ana Gómez', email: 'ana.gomez@uteq.edu.mx', role: 'Aprobador' },
    { id: 'user3', name: 'Carlos Ruiz', email: 'carlos.ruiz@uteq.edu.mx', role: 'Administrativo' },
    { id: 'user4', name: 'Laura Martínez', email: 'laura.martinez@uteq.edu.mx', role: 'Solicitante' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleSaveUser = (userData) => {
    console.log('Guardando usuario:', userData);
    setShowUserModal(false);
    setEditingUser(null);
    alert(`Usuario ${userData.name} guardado (simulado)!`);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Gestión de Usuarios</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <Input
          id="searchUser"
          placeholder="Buscar por nombre, email o rol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow md:max-w-xs"
          icon={SearchIcon}
        />
        <Button onClick={() => { setEditingUser(null); setShowUserModal(true); }} variant="primary" icon={PlusIcon}>
          Añadir Nuevo Usuario
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Correo Electrónico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" className="p-2 rounded-full" onClick={() => handleEditUser(user)} title="Editar Usuario">
                      <EditIcon className="w-5 h-5 text-gray-200" />
                    </Button>
                    <Button variant="danger" className="p-2 rounded-full ml-2" title="Eliminar Usuario">
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">No se encontraron usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showUserModal} onClose={() => setShowUserModal(false)} title={editingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}>
        <UserForm user={editingUser} onSubmit={handleSaveUser} />
      </Modal>
    </div>
  );
};

const UserForm = ({ user, onSubmit }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'Solicitante');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setRole('Solicitante');
      setPassword('');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: user?.id, name, email, role, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Nombre Completo" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Correo Electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {!user && (
        <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required={!user} />
      )}
      <Select
        label="Rol"
        options={[
          { value: 'Solicitante', label: 'Solicitante' },
          { value: 'Aprobador', label: 'Aprobador' },
          { value: 'Administrativo', label: 'Administrativo' },
        ]}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <Button type="submit" variant="primary" className="mt-4 w-full">
        {user ? 'Actualizar Usuario' : 'Crear Usuario'}
      </Button>
    </form>
  );
};


// Componente principal de la aplicación
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/solicitudes/crear" element={<Layout><CreateRequest /></Layout>} />
        <Route path="/solicitudes" element={<Layout><ManageRequests /></Layout>} />
        <Route path="/solicitudes/:id" element={<Layout><RequestDetails /></Layout>} />
        <Route path="/compras" element={<Layout><ViewPurchases /></Layout>} />
        <Route path="/compras/crear" element={<Layout><ManagePurchase /></Layout>} />
        <Route path="/compras/editar/:id" element={<Layout><ManagePurchase /></Layout>} />
        <Route path="/reportes" element={<Layout><GenerateReports /></Layout>} />
        <Route path="/usuarios" element={<Layout><ManageUsers /></Layout>} />
      </Routes>
    </Router>
  );
};

// Componente de Inicio/Dashboard (Estilo Oscuro)
const Home = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Bienvenido al Sistema de Gestión de Requisiciones UTEQ</h2>
      <p className="text-gray-400 mb-6">
        Aquí podrás gestionar tus solicitudes, aprobar requisiciones, registrar compras y generar reportes de manera eficiente.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/solicitudes/crear" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-blue-500 border border-transparent">
          <FilePlusIcon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Crear Solicitud</h3>
          <p className="text-gray-400 text-sm">Inicia una nueva requisición.</p>
        </Link>
        <Link to="/solicitudes" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-green-500 border border-transparent">
          <FileTextIcon className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Gestionar Solicitudes</h3>
          <p className="text-gray-400 text-sm">Revisa y gestiona las solicitudes existentes.</p>
        </Link>
        <Link to="/compras" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-purple-500 border border-transparent">
          <ShoppingCartIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Ver Compras</h3>
          <p className="text-gray-400 text-sm">Consulta el historial de compras.</p>
        </Link>
        <Link to="/reportes" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-yellow-500 border border-transparent">
          <PieChartIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Generar Reportes</h3>
          <p className="text-gray-400 text-sm">Obtén informes detallados.</p>
        </Link>
        <Link to="/usuarios" className="block p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:border-red-500 border border-transparent">
          <UsersIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Gestión de Usuarios</h3>
          <p className="text-gray-400 text-sm">Administra los usuarios del sistema.</p>
        </Link>
      </div>
    </div>
  );
};

export default App;
