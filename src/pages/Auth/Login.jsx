import React from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión...');
    // Lógica de autenticación real aquí
    navigate('/solicitudes'); // Redirigir al dashboard después del login
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

export default Login;