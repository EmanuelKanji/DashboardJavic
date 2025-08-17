/**
 * auth.js
 * ----------------------------------------------------------------------------
 * Módulo de servicios para autenticación.
 * - Se comunica con el backend para enviar las credenciales del login.
 * - Devuelve los datos del usuario y el token si son correctos.
 * ----------------------------------------------------------------------------
 */

import axios from 'axios';

// URL base de tu backend (usada por todas las peticiones)
const API_URL = process.env.REACT_APP_API_URL || "https://dashboardjavic.onrender.com/api";

/**
 * loginRequest
 * ----------------------------------------------------------------------------
 * Envia una solicitud POST al endpoint de login del backend.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<Object>} - Devuelve el usuario y token si las credenciales son válidas.
 */
export const loginRequest = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });

    // Retorna el token y los datos del usuario
    return response.data;

  } catch (error) {
    // Propaga el error para que lo maneje el componente que lo llama
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Error al conectar con el servidor');
    }
  }
};
