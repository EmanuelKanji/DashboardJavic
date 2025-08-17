/**
 * contactController.js
 * ----------------------------------------------------------------------------
 * Controlador para gestionar los contactos recibidos desde el sitio de Javic.
 * Funciones:
 * - Obtener todos los contactos
 * - Eliminar un contacto por ID
 * - Marcar contacto como "contactado"
 * ----------------------------------------------------------------------------
 */

const Contact = require('../models/Contact');

// @desc    Obtener todos los contactos (más recientes primero)
// @route   GET /api/contacts
// @access  Privado (requiere token)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Error al obtener contactos:', err);
    res.status(500).json({ error: 'Error al obtener los contactos' });
  }
};

// @desc    Eliminar contacto por ID
// @route   DELETE /api/contacts/:id
// @access  Privado (requiere token)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ message: 'Contacto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar contacto:', err);
    res.status(500).json({ error: 'Error al eliminar contacto' });
  }
};

// @desc    Marcar contacto como "contactado"
// @route   PATCH /api/contacts/:id/contacted
// @access  Privado (requiere token)
exports.markAsContacted = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Contact.findByIdAndUpdate(
      id,
      { contacted: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Error al marcar como contactado:', err);
    res.status(500).json({ error: 'Error al actualizar contacto' });
  }
};
