import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import usuariosService from '../../services/usuariosService';
import UsuariosLayout from '../../components/layouts/UsuariosLayout';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
  
const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await usuariosService.getAll();
      setUsuarios(response.data.data);
      console.log('Usuarios cargados:', response.data.data);
      setError('');
    } catch (err) {
      setError('No cuenta con permisos para ver los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const columns = [
    { header: 'ID', accessor: 'id_usuario' },
    { header: 'Nombre', accessor: 'nombre_completo' },
    { header: 'Email', accessor: 'correo_institucional' },
    { header: 'Rol', accessor: 'rol' },
    { header: 'Estatus', accessor: 'estatus' },
    {
      header: 'Acciones',
      accessor: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/usuarios/${row.id_usuario}/editar`)}
            icon={FaEdit}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDesactivar(row.id_usuario)}
            icon={FaTrash}
          >
            Desactivar
          </Button>
        </div>
      )
    }
  ];

  const handleDesactivar = async (id) => {
    if (window.confirm('¿Estás seguro de desactivar este usuario?')) {
      try {
        await usuariosService.delete(id);
        cargarUsuarios();
      } catch (err) {
        console.error('Error al desactivar usuario:', err);
      }
    }
  };

  return (
    <UsuariosLayout 
      title="Gestión de Usuarios"
      rightContent={
        <Button 
          variant="primary" 
          icon={FaPlus}
          onClick={() => navigate('/usuarios/crear')}
        >
          Nuevo Usuario
        </Button>
      }
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {loading ? (
        <div>Cargando usuarios...</div>
      ) : (
        <Table 
          data={usuarios} 
          columns={columns} 
          emptyMessage="No se encontraron usuarios"
        />
      )}
    </UsuariosLayout>
  );
};

export default ListaUsuarios;