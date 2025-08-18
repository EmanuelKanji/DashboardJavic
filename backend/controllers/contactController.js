/**
 * contactController.js
 * ----------------------------------------------------------------------------
 * Controlador para gestionar los contactos del Dashboard.
 * - GET    /api/contacts                 → lista (más recientes primero)
 * - DELETE /api/contacts/:id             → elimina por ID
 * - PATCH  /api/contacts/:id/contacted   → marca como contactado (o según body)
 * ----------------------------------------------------------------------------
 */

const mongoose = require('mongoose');
const Contact = require('../models/Contact');

/* Utilidad: validar IDs de Mongo -------------------------------------------
   Evita errores de casteo cuando llega un id inválido en la ruta.
--------------------------------------------------------------------------- */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Obtener todos los contactos (más recientes primero)
// @route   GET /api/contacts
// @access  Privado (requiere token)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json(contacts);
  } catch (err) {
    console.error('Error al obtener contactos:', err);
    return res.status(500).json({ message: 'Error al obtener los contactos' });
  }
};

// @desc    Eliminar contacto por ID
// @route   DELETE /api/contacts/:id
// @access  Privado (requiere token)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    return res.json({ message: 'Contacto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar contacto:', err);
    return res.status(500).json({ message: 'Error al eliminar contacto' });
  }
};

// @desc    Marcar contacto como "contactado"
// @route   PATCH /api/contacts/:id/contacted
// @access  Privado (requiere token)
exports.markAsContacted = async (req, res) => {
  try {
    const { id } = req.params;
    // Permite sobreescribir valor vía body { contacted: boolean }
    const { contacted = true } = req.body || {};

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const updated = await Contact.findByIdAndUpdate(
      id,
      { contacted: !!contacted },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    return res.json(updated);
  } catch (err) {
    console.error('Error al marcar como contactado:', err);
    return res.status(500).json({ message: 'Error al actualizar contacto' });
  }
};