/**
 * contactRoutes.js
 * ----------------------------------------------------------------------------
 * Define las rutas protegidas para gestionar los contactos desde el Dashboard.
 * Requiere token JWT válido para acceder.
 * ----------------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getContacts,
  deleteContact,
  markAsContacted
} = require('../controllers/contactController');

// Obtener todos los contactos
router.get('/', authMiddleware, getContacts);

// Eliminar un contacto por ID
router.delete('/:id', authMiddleware, deleteContact);

// Marcar como "contactado"
router.patch('/:id/contacted', authMiddleware, markAsContacted);

module.exports = router;
