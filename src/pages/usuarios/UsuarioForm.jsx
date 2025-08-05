import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usuariosService from '../../services/usuariosService';
import departamentosService from '../../services/departamentosService';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const UsuarioForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo_institucional: '',
    numero_empleado: '',
    telefono: '',
    departamento_id: '',
    rol: 'solicitante',
    estatus: 'activo',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener departamentos
        const deptResponse = await departamentosService.getAll();
        
        setDepartamentos(deptResponse.data.data);
        
        // Si es edición, cargar datos del usuario
        console.log(isEdit, id);
        if (id) {
          const userResponse = await usuariosService.getById(id);
          setFormData({
            ...userResponse.data,
            password: '',
            confirmPassword: ''
          });
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    
    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      
      const userData = { ...formData };
      delete userData.confirmPassword;
      
      if (id) {
        await usuariosService.update(id, userData);
      } else {
        await usuariosService.create(userData);
      }
      
      navigate('/usuarios');
    } catch (err) {
      setError(err.message || 'Error procesando la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre Completo"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Correo Institucional"
            name="correo_institucional"
            type="email"
            value={formData.correo_institucional}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Número de Empleado"
            name="numero_empleado"
            value={formData.numero_empleado}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
          
          <Select
            label="Departamento"
            name="departamento_id"
            value={formData.departamento_id}
            onChange={handleChange}
            required
            options={departamentos.map(dept => ({
              value: dept.id_departamento,
              label: dept.nombre_departamento
            }))}
          />
          
          <Select
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
            options={[
              { value: 'solicitante', label: 'Solicitante' },
              { value: 'aprobador', label: 'Aprobador' },
              { value: 'administrativo', label: 'Administrativo' },
              { value: 'admin_sistema', label: 'Admin Sistema' }
            ]}
          />
          
          <Select
            label="Estatus"
            name="estatus"
            value={formData.estatus}
            onChange={handleChange}
            required
            options={[
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' }
            ]}
          />
          
          {!id && (
            <>
              <Input
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!id}
              />
              
              <Input
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!id}
              />
            </>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/usuarios')}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={loading}
          >
            {id ? 'Actualizar Usuario' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;