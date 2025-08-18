/**
 * server.js
 * ----------------------------------------------------------------------------
 * Punto de entrada del backend del Dashboard.
 * - Carga variables de entorno y conecta a MongoDB
 * - Configura CORS (incluye PATCH) y preflight global (OPTIONS)
 * - Habilita parseo de JSON
 * - Expone /health para monitoreo
 * - Monta rutas: /api/auth y /api/contacts
 * - Arranca el servidor usando el puerto de Render (process.env.PORT)
 * ----------------------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const config = require('./config/config'); // opcional: { api: { base: '/api/contacts' }, messages: {...} }

/* 1) Variables de entorno y DB ------------------------------------------------
   - dotenv: carga .env en local. En Render las env vars vienen del panel.
   - connectDB: realiza la conexión a MongoDB Atlas (usa MONGO_URI).
---------------------------------------------------------------------------- */
dotenv.config();
connectDB();

/* 2) Crear app -------------------------------------------------------------- */
const app = express();

/* 3) CORS (ANTES de las rutas) ----------------------------------------------
   - allowlist: dominios permitidos (producción Netlify + dev local).
   - methods: incluir PATCH y OPTIONS para que el preflight no sea bloqueado.
   - allowedHeaders: permitir Authorization para el token Bearer.
   - credentials: false porque autenticamos con Bearer (no cookies).
---------------------------------------------------------------------------- */
const allowlist = [
  'https://javicadmin.netlify.app', // frontend en producción (Netlify)
  'http://localhost:3000',          // CRA dev
  'http://localhost:5173',          // Vite dev
];

const corsOptions = {
  origin(origin, cb) {
    // Permite herramientas sin origin (curl/Postman) y valida allowlist en navegador
    if (!origin) return cb(null, true);
    const ok = allowlist.includes(origin);
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // 👈 PATCH incluido
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // true solo si usas cookies/sesiones
};

app.use(cors(corsOptions));

/* 4) Preflight global (OPTIONS) ----------------------------------------------
   - Algunos proxies requieren que respondamos manualmente con los headers.
   - Devuelve 204 y los encabezados de CORS para cualquier ruta.
---------------------------------------------------------------------------- */
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.sendStatus(204);
});

/* 5) Parsers -----------------------------------------------------------------
   - Habilita JSON en el body de las requests (Content-Type: application/json)
---------------------------------------------------------------------------- */
app.use(express.json());

/* 6) Healthcheck -------------------------------------------------------------
   - Endpoint simple para monitoreo (Render puede chequearlo).
   - Útil para probar disponibilidad rápida en el navegador.
---------------------------------------------------------------------------- */
app.get('/health', (req, res) => res.json({ ok: true }));

/* 7) Rutas del API -----------------------------------------------------------
   - /api/auth: login, etc. (controladores de autenticación)
   - /api/contacts: CRUD y acciones sobre contactos (protegido con JWT)
   - Si config.api?.base existe, la usa; si no, usa '/api/contacts' por defecto.
---------------------------------------------------------------------------- */
app.use('/api/auth', authRoutes);
app.use(config.api?.base || '/api/contacts', contactRoutes);

/* 8) Ruta raíz informativa ---------------------------------------------------
   - Respuesta simple para ver que la API está viva en "/".
---------------------------------------------------------------------------- */
app.get('/', (req, res) => {
  res.send(config?.messages?.rootMessage || 'Dashboard API running');
});

/* 9) Arranque del servidor ---------------------------------------------------
   - Render inyecta process.env.PORT. En local usamos 5000 como fallback.
---------------------------------------------------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`${(config?.messages?.serverRunning || 'Server on port')} ${PORT}`);
});