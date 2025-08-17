/**
 * db.js
 * ----------------------------------------------------------------------------
 * Se encarga de conectar el backend del Dashboard a la base de datos MongoDB.
 * Usa la URI definida en el archivo .env (compartida con el proyecto Javic).
 * Muestra mensajes personalizados desde config.js.
 * ----------------------------------------------------------------------------
 */

const mongoose = require('mongoose');
const config = require('./config'); // Importa configuración global

const connectDB = async () => {
  try {
    // Conexión a MongoDB usando MONGO_URI del archivo .env
    await mongoose.connect(process.env.MONGO_URI);

    // Mensaje de éxito
    console.log(config.messages.dbConnected);
  } catch (error) {
    // Mensaje de error
    console.error(`${config.messages.dbError}:`, error);

    // Detiene la aplicación si no se puede conectar
    process.exit(1);
  }
};

module.exports = connectDB;
