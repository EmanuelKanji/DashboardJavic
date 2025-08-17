/**
 * authRoutes.js
 * ----------------------------------------------------------------------------
 * Define la ruta para iniciar sesión del administrador del Dashboard.
 * No permite registro de nuevos usuarios desde la app.
 * ----------------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Ruta: POST /api/auth/login
router.post('/login', login);

module.exports = router;
