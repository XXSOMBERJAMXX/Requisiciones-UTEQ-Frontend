// ===== ARCHIVO: src/App.jsx ADAPTADO =====
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';

// Importar el sistema de autenticación
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

// Importar el layout principal
import Layout from './components/layouts/Layout';

// Importar las páginas (vistas)
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';

// Importar páginas de solicitudes
import ListaSolicitudes from './pages/solicitudes/ListaSolicitudes';
import CrearSolicitud from './pages/solicitudes/CrearSolicitud';
import DetalleSolicitud from './pages/solicitudes/DetalleSolicitud';
import EditarSolicitud from './pages/solicitudes/EditarSolicitud';

// Importar páginas de compras
import Compras from './pages/compras/Compras';
import GestionarCompras from './pages/compras/GestionarCompras';

// Otras páginas
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <NotificationProvider>          
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta para el login sin el layout */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas que usan el layout */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              
              {/* Rutas del módulo de solicitudes */}
              <Route path="solicitudes" element={<ListaSolicitudes />} />
              <Route path="solicitudes/crear" element={<CrearSolicitud />} />
              <Route path="solicitudes/:id" element={<DetalleSolicitud />} />
              <Route path="solicitudes/:id/editar" element={<EditarSolicitud />} />
              {/* Rutas del módulo de compras */}
              <Route path="compras" element={<Compras />} />
              <Route path="/compras/crear" element={<GestionarCompras/>} />
              <Route path="/compras/editar/:id" element={<GestionarCompras/>} />

              {/* Otras rutas */}
              <Route path="reportes" element={<Reportes />} />
              <Route path="usuarios" element={<Usuarios />} />
            </Route>

            {/* Ruta comodín para 404 o redirigir al dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;