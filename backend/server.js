/**
 * server.js
 * ----------------------------------------------------------------------------
 * Backend del Dashboard (auth + contacts) con CORS para Netlify.
 * ----------------------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const config = require('./config/config');

dotenv.config();
connectDB();

const app = express();

// CORS (ANTES de las rutas)
const allowlist = [
  'https://javicadmin.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // permite curl/postman
    const ok = allowlist.includes(origin);
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], // 👈 incluye PATCH
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false, // true solo si usas cookies; con Bearer token déjalo false
};

app.use(cors(corsOptions));

// Preflight global (asegura headers para OPTIONS)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.sendStatus(204);
});

// Parsers
app.use(express.json());

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use(config.api?.base || '/api/contacts', contactRoutes);

// Raíz
app.get('/', (req, res) => {
  res.send(config?.messages?.rootMessage || 'Dashboard API running');
});

// Arranque
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`${(config?.messages?.serverRunning || 'Server on port')} ${PORT}`);
});
