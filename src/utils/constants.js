import { 
  FaHome as HomeIcon,
  FaPlusSquare as FilePlusIcon,  // FaFilePlus no existe, usar FaPlusSquare
  FaFileAlt as FileTextIcon,     // FaFileText no existe, usar FaFileAlt
  FaShoppingCart as ShoppingCartIcon,
  FaChartPie as PieChartIcon,
  FaUsers as UsersIcon
} from 'react-icons/fa';

export const navItems = [
  { name: 'Inicio', icon: HomeIcon, path: '/' },
  { name: 'Solicitudes', icon: FileTextIcon, path: '/solicitudes' },
  { name: 'Compras', icon: ShoppingCartIcon, path: '/compras' },
  { name: 'Reportes', icon: PieChartIcon, path: '/reportes' },
  { name: 'Usuarios', icon: UsersIcon, path: '/usuarios' },
];

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pendiente': return 'bg-yellow-800 text-yellow-200';
    case 'Aprobada': return 'bg-green-800 text-green-200';
    case 'Denegada': return 'bg-red-800 text-red-200';
    case 'Revisión': return 'bg-blue-800 text-blue-200';
    default: return 'bg-gray-600 text-gray-200';
  }
};