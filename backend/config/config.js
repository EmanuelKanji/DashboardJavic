/**
 * config.js
 * ----------------------------------------------------------------------------
 * Configuración global para el backend del Dashboard.
 * Centraliza constantes, mensajes, rutas y parámetros reutilizables.
 * ----------------------------------------------------------------------------
 */

module.exports = {
  // Nombre del proyecto
  projectName: 'Javic Dashboard',

  // Rutas base para las APIs
  api: {
    base: '/api/contacts' // Ruta protegida para manejar contactos
  },

  // Mensajes reutilizables
  messages: {
    serverRunning: '🚀 Servidor corriendo en el puerto',
    dbConnected: '✅ Conectado a MongoDB',
    dbError: '❌ Error al conectar MongoDB',
    rootMessage: '✅ API del Dashboard funcionando correctamente.'
  },

  // Configuración del token JWT (puedes usar esto en el futuro si quieres mover la clave fuera del .env)
  jwt: {
    expiresIn: '7d' // Token válido por 7 días
  }
};