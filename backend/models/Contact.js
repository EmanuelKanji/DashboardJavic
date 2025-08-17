/**
 * Contact.js (Modelo de Contacto)
 * ----------------------------------------------------------------------------
 * Define el esquema de datos para los mensajes recibidos desde el formulario
 * del sitio Javic. Este modelo es compartido por el backend del Dashboard.
 * Se ha añadido el campo "contacted" para marcar los contactos atendidos.
 * ----------------------------------------------------------------------------
 */

const mongoose = require('mongoose');

// Esquema del formulario de contacto
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Correo inválido']
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true
  },
  contacted: {
    type: Boolean,
    default: false // Si no ha sido contactado, parte como false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
