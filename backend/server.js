/**
 * server.js
 * ----------------------------------------------------------------------------
 * Punto de entrada principal del backend del Dashboard de administración.
 * - Carga variables de entorno
 * - Conecta a MongoDB
 * - Configura CORS y middlewares globales
 * - Define rutas (/api/auth, /api/contacts, /health)
 * ----------------------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const config = require('./config/config'); // { api: { base: '/api/contacts' }, messages: {...} }

dotenv.config();            // 1) Variables de entorno
connectDB();                // 2) Conexión a MongoDB

const app = express();      // 3) Inicializar app

// 4) CORS (antes de las rutas)
const corsOptions = {
  origin: [
    'https://javicadmin.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // déjalo en true solo si usas cookies o envías credenciales cross-site
};
app.use(cors(corsOptions));
// Preflight explícito (opcional pero útil en algunos proxies)
app.options('*', cors(corsOptions));

// 5) Parsers
app.use(express.json());

// 6) Healthcheck (útil para Render)
app.get('/health', (req, res) => res.json({ ok: true }));

// 7) Rutas
app.use('/api/auth', authRoutes);               // POST /api/auth/login, etc.
app.use(config.api.base || '/api/contacts', contactRoutes); // CRUD contactos

// 8) Ruta raíz simple
app.get('/', (req, res) => {
  res.send(config?.messages?.rootMessage || 'Dashboard API running');
});

// 9) Arranque (usar el puerto que inyecta Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`${(config?.messages?.serverRunning || 'Server on port')} ${PORT}`);
});