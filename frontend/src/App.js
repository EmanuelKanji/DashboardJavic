/**
 * App.js
 * ----------------------------------------------------------------------------
 * Define las rutas principales de la aplicación.
 * - Usa React Router para navegación entre páginas.
 * - Protege rutas privadas para que solo acceda el administrador autenticado.
 * - Rutas:
 *    /login      → login del admin
 *    /dashboard  → panel principal
 *    /libreta    → libreta de contactos (contratos cerrados)
 * ----------------------------------------------------------------------------
 */

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DealContacts from "./pages/DealContacts"; // 👈 usamos la vista ya creada
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { user, loading } = useContext(AuthContext);

  // Mientras se evalúa la sesión, mostramos un fallback simple
  if (loading) return <p>Cargando...</p>;

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/libreta"
        element={user ? <DealContacts /> : <Navigate to="/login" replace />}
      />

      {/* Por defecto → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;