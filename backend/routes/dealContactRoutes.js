/**
 * routes/dealContactRoutes.js
 * ----------------------------------------------------------------------------
 * Rutas protegidas para la "Libreta de Contactos / Contratos cerrados".
 * - Todas requieren token JWT válido (authMiddleware).
 *
 * V1 (habilitado):
 *   GET    /api/deal-contacts        → listar contactos
 *   POST   /api/deal-contacts        → crear contacto
 *   DELETE /api/deal-contacts/:id    → eliminar contacto
 *
 * V2 (opcional - comentar/activar cuando esté listo en el controller):
 *   PATCH  /api/deal-contacts/:id    → editar contacto
 * ----------------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

// Importa todas las funciones y toma el nombre disponible (compatibilidad)
const controller = require('../controllers/dealContactController');
const listDealContacts = controller.listDealContacts || controller.getAllDealContacts;
const { createDealContact, deleteDealContact /*, updateDealContact */ } = controller;

/**
 * @route   GET /api/deal-contacts
 * @desc    Listar todos los contactos de la libreta (más recientes primero)
 * @access  Privado (JWT)
 */
router.get('/', authMiddleware, listDealContacts);

/**
 * @route   POST /api/deal-contacts
 * @desc    Crear un nuevo contacto en la libreta
 * @access  Privado (JWT)
 */
router.post('/', authMiddleware, createDealContact);

/**
 * @route   DELETE /api/deal-contacts/:id
 * @desc    Eliminar un contacto por ID
 * @access  Privado (JWT)
 */
router.delete('/:id', authMiddleware, deleteDealContact);

/* ===================== V2 (opcional) =====================
// Habilita cuando implementes updateDealContact en el controller
router.patch('/:id', authMiddleware, updateDealContact);
=========================================================== */

module.exports = router;