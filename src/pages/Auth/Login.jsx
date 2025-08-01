import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
  
const Login = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    correo_institucional: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Si ya está autenticado, redirigir al dashboard
  // IMPORTANTE: Verificar que no esté en loading antes de redirigir
  if (isAuthenticated && !loading) {
    return <Navigate to="/solicitudes" replace />;
  }

  const validateForm = () => {
    const errors = {};
    
    if (!formData.correo_institucional) {
      errors.correo_institucional = 'El correo electrónico es requerido';
    } else if (!formData.correo_institucional.includes('@')) {
      errors.correo_institucional = 'Ingresa un correo electrónico válido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.correo_institucional, formData.password);
      
      // Si llegamos aquí, el login fue exitoso
      // El Navigate se encargará de la redirección automáticamente
    } catch (error) {
      console.error('Error en login:', error);
      // El error ya se maneja en el hook useAuth
    }
  };

  // Mostrar loading mientras se inicializa la autenticación
  if (loading && !formData.correo_institucional && !formData.password) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <img 
            src="https://placehold.co/80x80/1F2937/60A5FA?text=UTEQ" 
            alt="Logo UTEQ" 
            className="mx-auto mb-4 rounded-full shadow-lg border-2 border-blue-500"
          />
          <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
          <p className="text-gray-400">Inicia sesión para acceder al sistema</p>
        </div>

        {/* Mostrar errores de la API */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            id="correo_institucional"
            name="correo_institucional"
            label="Correo Electrónico" 
            type="email" 
            placeholder="tu@uteq.edu.mx" 
            value={formData.correo_institucional}
            onChange={handleChange}
            error={formErrors.correo_institucional}
            required 
          />
          
          <Input 
            id="password"
            name="password" 
            label="Contraseña" 
            type="password" 
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            required 
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-6 text-lg py-3"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;