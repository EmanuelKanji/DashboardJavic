/**
 * index.js
 * ----------------------------------------------------------------------------
 * Punto de entrada principal de la aplicación React.
 * - Renderiza la app dentro del DOM.
 * - Envuelve la app con el AuthProvider para manejo de sesión.
 * - Usa BrowserRouter para navegación entre páginas.
 * ----------------------------------------------------------------------------
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Importa estilos globales
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>              {/* Provee acceso global al estado de autenticación */}
      <BrowserRouter>           {/* Habilita rutas con React Router */}
        <App />                 {/* Componente principal con rutas */}
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
