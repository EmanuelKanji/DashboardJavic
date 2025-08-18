/**
 * src/api/contacts.js
 * ----------------------------------------------------------------------------
 * Servicio que maneja todas las peticiones relacionadas con los contactos
 * desde el Dashboard.
 *
 * - Se apoya en la instancia `api` (src/api/api.js), que ya incluye:
 *   * baseURL = process.env.REACT_APP_API_URL (ej: https://dashboardjavic.onrender.com/api)
 *   * Headers JSON por defecto
 *   * Token JWT de localStorage en cada request
 *   * Manejo global de 401 (redirección a /login)
 *
 * Con esto ya no necesitas pasar el token manualmente.
 * ----------------------------------------------------------------------------
 */

import api from "./api";

/**
 * Obtener todos los contactos
 * @returns {Promise<Array>} Lista de contactos desde la API
 */
export const getContacts = async () => {
  const { data } = await api.get("/contacts");
  return data;
};

/**
 * Eliminar un contacto por ID
 * @param {string} id - ID del contacto a eliminar
 * @returns {Promise<Object>} Mensaje de éxito del backend
 */
export const deleteContact = async (id) => {
  const { data } = await api.delete(`/contacts/${id}`);
  return data;
};

/**
 * Marcar un contacto como "contactado"
 * @param {string} id - ID del contacto
 * @returns {Promise<Object>} Contacto actualizado
 */
export const markAsContacted = async (id) => {
  const { data } = await api.patch(`/contacts/${id}/contacted`, {});
  return data;
};