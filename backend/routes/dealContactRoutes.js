/**
 * routes/dealContactRoutes.js
 * ----------------------------------------------------------------------------
 * Rutas protegidas para la "Libreta de Contactos / Contratos cerrados".
 * - Todas requieren token JWT válido (authMiddleware).
 * - Expone endpoints para la V1:
 *     GET   /api/deal-contacts        → listar contactos
 *     POST  /api/deal-contacts        → crear contacto
 * 
 * (Futuro V1.1)
 *     PATCH /api/deal-contacts/:id    → editar contacto
 *     DELETE/api/deal-contacts/:id    → eliminar contacto
 * ----------------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllDealContacts,
  createDealContact,
  // updateDealContact,   // ← V1.1
  // deleteDealContact,   // ← V1.1
} = require('../controllers/dealContactController');

/**
 * @route   GET /api/deal-contacts
 * @desc    Listar todos los contactos de la libreta (más recientes primero)
 * @access  Privado (JWT)
 */
router.get('/', authMiddleware, getAllDealContacts);

/**
 * @route   POST /api/deal-contacts
 * @desc    Crear un nuevo contacto en la libreta
 * @access  Privado (JWT)
 */
router.post('/', authMiddleware, createDealContact);

/* (V1.1) Actualizar y eliminar
router.patch('/:id', authMiddleware, updateDealContact);
router.delete('/:id', authMiddleware, deleteDealContact);
*/

module.exports = router;