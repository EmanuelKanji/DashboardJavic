/**
 * src/api/auth.js
 * ----------------------------------------------------------------------------
 * Servicios de autenticación del Dashboard.
 * - Usa la instancia `api` (src/api/api.js) con baseURL = REACT_APP_API_URL.
 * - Envía credenciales al backend y retorna { token, user } si son válidas.
 * - Normaliza errores para que el componente muestre mensajes claros.
 * ----------------------------------------------------------------------------
 */

import api from "./api";

/**
 * loginRequest
 * ----------------------------------------------------------------------------
 * Realiza POST /auth/login con { email, password }.
 * Retorna { token, user } si el backend valida correctamente.
 * En caso de error, lanza un Error con un mensaje amigable.
 * ----------------------------------------------------------------------------
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 */
export const loginRequest = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });

    // Validación básica de la forma de la respuesta
    if (!data?.token || !data?.user) {
      throw new Error(data?.message || "Respuesta inválida del servidor");
    }

    return data; // -> { token, user }
  } catch (err) {
    // Mensaje de error consistente
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "No se pudo iniciar sesión";
    throw new Error(msg);
  }
};