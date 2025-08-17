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
const corsOptions = {
  origin: ['https://javicadmin.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true, // ponlo en true solo si usas cookies o Auth headers cruzados
};

app.use(cors(corsOptions));
// Manejo explícito del preflight
app.options('*', cors(corsOptions));

app.use(express.json());

// OJO con la ruta que usas:
app.post('/auth/login', (req, res) => { /* ... */ });
// si tus rutas están bajo /api, entonces desde el front usa /api/auth/login

// Healthcheck
app.get('/health', (req,res)=>res.json({ok:true}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API on :${PORT}`));

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
