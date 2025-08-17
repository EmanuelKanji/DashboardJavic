/**
 * server.js
 * ----------------------------------------------------------------------------
 * Punto de entrada principal del backend del Dashboard de administración.
 * - Carga configuración global y variables de entorno.
 * - Conecta a la base de datos MongoDB compartida con Javic.
 * - Aplica middlewares globales (CORS, JSON parsing).
 * - Define las rutas protegidas para contactos.
 * ----------------------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const config = require('./config/config'); // Configuración global

// Cargar variables de entorno desde .env
dotenv.config();

// Conectar a MongoDB Atlas (misma base de datos de Javic)
connectDB();

// Inicializar app
const app = express();

// Middlewares globales
app.use(cors());              // Permite peticiones desde otros dominios (React, etc.)
app.use(express.json());      // Habilita lectura de JSON en el body de las requests

// Rutas de autenticación (login)
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
app.use(config.api.base, contactRoutes); // → /api/contacts

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send(config.messages.rootMessage); // Mensaje definido en config
});

// Puerto y arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`${config.messages.serverRunning} ${PORT}`);
});
