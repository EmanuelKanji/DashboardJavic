/**
 * src/api/dealContacts.js
 * ----------------------------------------------------------------------------
 * Servicio API para la "Libreta de Contactos / Contratos cerrados".
 * - Reutiliza la instancia `api` (baseURL + JSON + Authorization + manejo 401).
 * - Endpoints (V1):
 *     GET  /api/deal-contacts       → listar
 *     POST /api/deal-contacts       → crear
 * - (V1.1 opcional):
 *     PATCH /api/deal-contacts/:id  → editar
 *     DELETE /api/deal-contacts/:id → eliminar
 * ----------------------------------------------------------------------------
 */

import api from "./api";

/**
 * getDealContacts
 * ----------------------------------------------------------------------------
 * Obtiene la lista completa ordenada (más recientes primero).
 * @returns {Promise<Array>} Array de deal-contacts
 */
export const getDealContacts = async () => {
  const { data } = await api.get("/deal-contacts");
  return data;
};

/**
 * createDealContact
 * ----------------------------------------------------------------------------
 * Crea un nuevo registro en la libreta.
 * Campos requeridos:
 *  - nombre, nombreEmpresa, telefono, direccion, descripcionServicio
 * Opcionales:
 *  - fechaInicio (Date ISO string), fechaTermino (Date ISO string)
 * @param {Object} payload
 * @returns {Promise<Object>} Registro creado
 */
export const createDealContact = async (payload) => {
  const { data } = await api.post("/deal-contacts", payload);
  return data;
};

/* ==================== V1.1 (opcional, por si lo habilitas) ====================

export const updateDealContact = async (id, payload) => {
  const { data } = await api.patch(`/deal-contacts/${id}`, payload);
  return data;
};

export const deleteDealContact = async (id) => {
  const { data } = await api.delete(`/deal-contacts/${id}`);
  return data;
};

=============================================================================== */