/**
 * AuthContext.js
 * ----------------------------------------------------------------------------
 * Contexto global para manejar la autenticación del administrador del Dashboard.
 * - Se conecta con la API de login del backend.
 * - Guarda token y usuario autenticado en localStorage.
 * - Proporciona funciones login y logout a toda la aplicación.
 * ----------------------------------------------------------------------------
 */

import { createContext, useState, useEffect } from "react";
import { loginRequest } from "../api/auth"; // Llamada a la API

// Crear contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Usuario autenticado
  const [token, setToken] = useState(null);     // Token JWT
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  // Cargar sesión guardada (si existe)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  /**
   * login() - Función para iniciar sesión.
   * Envia las credenciales al backend y guarda sesión si son válidas.
   */
  const login = async (email, password) => {
    const res = await loginRequest(email, password); // Llama a la API
    const { token, user } = res;

    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  /**
   * logout() - Función para cerrar sesión.
   * Limpia usuario y token del estado y localStorage.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Proveer contexto a toda la app
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
