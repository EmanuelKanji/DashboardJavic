/**
 * api/contacts.js
 * ----------------------------------------------------------------------------
 * Servicio para manejar las peticiones relacionadas con los contactos
 * del Dashboard. Usa el token guardado para autenticación.
 * ----------------------------------------------------------------------------
 */

import axios from "axios";

// Ruta base del backend
const API_URL = "http://localhost:5000/api/contacts";

/**
 * Obtener todos los contactos desde el backend
 * @param {string} token - JWT de autenticación
 */
export const getContacts = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Eliminar un contacto por su ID
 * @param {string} id - ID del contacto
 * @param {string} token - JWT de autenticación
 */
export const deleteContact = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Marcar un contacto como "contactado"
 * @param {string} id - ID del contacto
 * @param {string} token - JWT de autenticación
 */
export const markAsContacted = async (id, token) => {
  const response = await axios.patch(`${API_URL}/${id}/contacted`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
