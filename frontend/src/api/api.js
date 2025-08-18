/**
 * src/api/api.js
 * ----------------------------------------------------------------------------
 * Instancia única de Axios para el frontend (React).
 * - Usa REACT_APP_API_URL como base (Netlify) → https://dashboardjavic.onrender.com/api
 * - Agrega automáticamente el token (Authorization: Bearer <token>) desde localStorage
 * - Maneja globalmente respuestas 401 (token inválido/expirado) → limpia sesión y redirige a /login
 * - Establece encabezados JSON por defecto
 * ----------------------------------------------------------------------------
 */

import axios from "axios";

/* 1) Crear instancia con baseURL --------------------------------------------
   - La variable REACT_APP_API_URL se define en Netlify (Build & Deploy → Environment).
   - Ejemplo de valor: https://dashboardjavic.onrender.com/api
   - Cualquier servicio (auth, contacts, etc.) importará esta instancia.
---------------------------------------------------------------------------- */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
  // Nota: si en algún caso usas cookies/sesiones, aquí podrías setear withCredentials: true
});

/* 2) Interceptor de REQUEST --------------------------------------------------
   - Antes de cada request, intenta leer { user, token } de localStorage (clave "auth").
   - Si existe token, agrega "Authorization: Bearer <token>".
   - Esto evita tener que pasar el token manualmente en cada función de API.
---------------------------------------------------------------------------- */
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth"); // auth = { user, token }
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Si algo falla leyendo localStorage, no rompemos la request
  }
  return config;
});

/* 3) Interceptor de RESPONSE -------------------------------------------------
   - Captura errores globales.
   - Si el backend responde 401 (no autorizado: token ausente/expirado/inválido):
       * Limpia la sesión guardada
       * Redirige a /login (si no estás ya allí)
   - Esto mantiene una UX coherente cuando el token deja de ser válido.
---------------------------------------------------------------------------- */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    // Manejo unificado de sesión expirada/no autorizada
    if (status === 401) {
      try {
        localStorage.removeItem("auth");
      } catch {}
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Propaga el error para que el llamado específico pueda mostrar mensajes
    return Promise.reject(err);
  }
);

/* 4) Exportación -------------------------------------------------------------
   - Exportamos "api" para usarla en:
       * src/api/auth.js   → api.post('/auth/login', {...})
       * src/api/contacts.js → api.get('/contacts'), api.patch('/contacts/:id/contacted'), etc.
---------------------------------------------------------------------------- */
export default api;