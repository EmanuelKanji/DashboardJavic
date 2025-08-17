/**
 * App.js
 * ----------------------------------------------------------------------------
 * Define las rutas principales de la aplicación.
 * - Usa React Router para navegación entre páginas.
 * - Protege la ruta del Dashboard para que solo acceda el administrador.
 * ----------------------------------------------------------------------------
 */

import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  // Mientras se carga el estado de autenticación, no renderiza nada
  if (loading) return <p>Cargando...</p>;

  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route path="/login" element={<Login />} />

      {/* Ruta protegida: Dashboard */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      {/* Ruta por defecto: redirige a login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
