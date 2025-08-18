/**
 * src/context/AuthContext.js
 * ----------------------------------------------------------------------------
 * Contexto global de autenticación para el Dashboard.
 * - Gestiona el estado { user, token } de forma centralizada.
 * - Rehidrata la sesión al recargar (lee localStorage).
 * - Expone login/logout y un flag loading para controlar el render inicial.
 * - Se integra con src/api/auth.js (loginRequest) y con la instancia Axios (api.js).
 * ----------------------------------------------------------------------------
 */

import { createContext, useState, useEffect } from "react";
import { loginRequest } from "../api/auth";

// Crear contexto accesible por toda la app
export const AuthContext = createContext();

/**
 * AuthProvider
 * ----------------------------------------------------------------------------
 * Envuelve la aplicación y provee:
 *  - user   : datos del admin autenticado
 *  - token  : JWT para llamadas al backend (lo leerá api.js desde localStorage)
 *  - loading: indica si se está rehidratando la sesión al inicio
 *  - login  : función para autenticarse
 *  - logout : función para cerrar sesión
 * ----------------------------------------------------------------------------
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Usuario autenticado
  const [token, setToken] = useState(null);     // Token JWT
  const [loading, setLoading] = useState(true); // Evita parpadeos/redirecciones en el arranque

  /* 1) Rehidratar sesión en el primer render --------------------------------
     - Lee la clave "auth" del localStorage → { user, token }
     - Si existe, repone el estado sin hacer request al backend.
     - Luego marca loading=false para que las rutas se puedan renderizar.
  -------------------------------------------------------------------------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth"); // auth = { user, token }
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.user && parsed?.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      }
    } catch {
      // Si localStorage está corrupto, ignoramos y seguimos sin sesión
    } finally {
      setLoading(false);
    }
  }, []);

  /* 2) Persistencia automática ----------------------------------------------
     - Cada vez que user/token cambien, guardamos o limpiamos "auth".
     - api.js lee de aquí el token para adjuntarlo en cada request.
  -------------------------------------------------------------------------- */
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem("auth");
    }
  }, [user, token]);

  /* 3) login -----------------------------------------------------------------
     - Llama al backend con email/password (loginRequest).
     - Espera { token, user } y, si falta algo, arroja un error claro.
     - Setea el estado; el efecto de persistencia guardará "auth".
  -------------------------------------------------------------------------- */
  const login = async (email, password) => {
    try {
      const res = await loginRequest(email, password);
      const { token: tk, user: usr } = res ?? {};

      if (!tk || !usr) {
        throw new Error("Respuesta inválida del servidor");
      }

      setUser(usr);
      setToken(tk);
      return true; // útil si quieres actuar tras login (redirigir, etc.)
    } catch (err) {
      const msg =
        err?.message ||
        "No se pudo iniciar sesión. Intenta nuevamente.";
      throw new Error(msg);
    }
  };

  /* 4) logout ----------------------------------------------------------------
     - Limpia estado y almacenamiento.
  -------------------------------------------------------------------------- */
  const logout = () => {
    setUser(null);
    setToken(null);
    // El useEffect de persistencia removerá "auth", pero lo hacemos explícito:
    try {
      localStorage.removeItem("auth");
    } catch {}
  };

  /* 5) Proveer valores al árbol --------------------------------------------- */
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};