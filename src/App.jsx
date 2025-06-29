import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importar el layout principal
import Layout from './components/layout/Layout';

// Importar las páginas (vistas)
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/Requests/CreateRequest';
import ManageRequests from './pages/Requests/ManageRequests';
import RequestDetails from './pages/Requests/RequestDetails';
import Compras from './pages/Compras';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el login sin el layout */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas que usan el layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="solicitudes/crear" element={<CreateRequest />} />
          <Route path="solicitudes" element={<ManageRequests />} />
          <Route path="solicitudes/:id" element={<RequestDetails />} />
          <Route path="compras" element={<Compras />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="usuarios" element={<Usuarios />} />
          {/* Añadir una ruta comodín para 404 o redirigir */}
          <Route path="*" element={<Dashboard />} /> {/* O una página 404 */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;