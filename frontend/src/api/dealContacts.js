/**
 * src/api/dealContacts.js
 * ----------------------------------------------------------------------------
 * Servicio API para la "Libreta de Contactos / Contratos cerrados".
 * - Reutiliza la instancia `api` (baseURL + JSON + Authorization + manejo 401).
 * - Endpoints (V1):
 *     GET    /api/deal-contacts        → listar
 *     POST   /api/deal-contacts        → crear
 *     DELETE /api/deal-contacts/:id    → eliminar
 * - (V2 opcional):
 *     PATCH  /api/deal-contacts/:id    → editar
 * ----------------------------------------------------------------------------
 */

import api from "./api";

/** Obtener todos los contactos (más recientes primero) */
export const getDealContacts = async () => {
  const { data } = await api.get("/deal-contacts");
  return data;
};

/** Crear un nuevo contacto */
export const createDealContact = async (payload) => {
  const { data } = await api.post("/deal-contacts", payload);
  return data;
};

/** Eliminar un contacto por ID */
export const deleteDealContact = async (id) => {
  const { data } = await api.delete(`/deal-contacts/${id}`);
  return data;
};

/* ====== (V2) Actualizar contacto (cuando lo habilites en backend) ==========
export const updateDealContact = async (id, payload) => {
  const { data } = await api.patch(`/deal-contacts/${id}`, payload);
  return data;
};
=========================================================================== */