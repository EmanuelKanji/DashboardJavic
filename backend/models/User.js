/**
 * User.js (Modelo de Usuario para el Dashboard)
 * ----------------------------------------------------------------------------
 * Define el esquema de usuario administrador del dashboard.
 * - Campos: nombre, email, contraseña (encriptada).
 * - Incluye validaciones estrictas.
 * - Incluye método para comparar contraseñas en el login.
 * ----------------------------------------------------------------------------
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Correo inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  }
}, {
  timestamps: true // Guarda automáticamente createdAt y updatedAt
});

// 🔐 Middleware: antes de guardar, encriptar la contraseña si fue modificada
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // No modificar si no cambió
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔎 Método personalizado para comparar contraseñas (login)
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
