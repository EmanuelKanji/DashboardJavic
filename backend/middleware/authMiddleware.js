/**
 * authMiddleware.js
 * ----------------------------------------------------------------------------
 * Middleware de protección para rutas del Dashboard.
 * - Acepta tokens en formato "Authorization: Bearer <token>".
 * - Verifica el token con JWT y adjunta el payload en req.user.
 * - Maneja correctamente preflights (OPTIONS) y errores de configuración.
 * ----------------------------------------------------------------------------
 */

const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  /* 1) Permitir preflight (OPTIONS) -----------------------------------------
     - Aunque ya respondemos OPTIONS globalmente en server.js, dejar este guard
       evita bloquear preflights si algún día este middleware se aplica antes.
  -------------------------------------------------------------------------- */
  if (req.method === 'OPTIONS') return next();

  /* 2) Verificar que exista JWT_SECRET ------------------------------------- */
  if (!process.env.JWT_SECRET) {
    // Error de configuración del servidor (no del cliente)
    return res.status(500).json({ message: 'Falta JWT_SECRET en el servidor' });
  }

  /* 3) Extraer header Authorization y token -------------------------------- */
  const header = req.headers.authorization || '';
  // Esperamos "Bearer <token>"
  const isBearer = header.startsWith('Bearer ');
  if (!isBearer) {
    return res.status(401).json({ message: 'No autorizado: token ausente' });
  }

  const token = header.slice(7); // quita "Bearer "

  /* 4) Verificar token ------------------------------------------------------ */
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adjuntar info del usuario para uso posterior en controladores
    // (ej: decoded = { id, role, iat, exp })
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
