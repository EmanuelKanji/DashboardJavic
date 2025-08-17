/**
 * authMiddleware.js
 * ----------------------------------------------------------------------------
 * Middleware que protege las rutas del Dashboard.
 * - Verifica si el token JWT es válido.
 * - Si lo es, agrega la info del usuario a la request.
 * - Si no lo es, bloquea el acceso con un error 401.
 * ----------------------------------------------------------------------------
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtener token del encabezado Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Token faltante.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar info del usuario a la request
    req.user = decoded;

    // Continuar con la ruta protegida
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;
