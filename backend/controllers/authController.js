/**
 * authController.js
 * ----------------------------------------------------------------------------
 * Controlador para autenticación del administrador del Dashboard.
 * - Solo permite login (no hay registro de usuarios).
 * - Verifica email y contraseña.
 * - Devuelve un token JWT si las credenciales son válidas.
 * ----------------------------------------------------------------------------
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Buscar al usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Opcional: puedes cambiarlo por config.jwt.expiresIn si lo mueves ahí
    );

    // Respuesta
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
