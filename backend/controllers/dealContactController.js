/**
 * controllers/dealContactController.js
 * ----------------------------------------------------------------------------
 * Controlador para manejar la "Libreta de Contactos / Contratos cerrados".
 *
 * V1:
 *  - listDealContacts    → GET   /api/deal-contacts
 *  - createDealContact   → POST  /api/deal-contacts
 *  - deleteDealContact   → DELETE /api/deal-contacts/:id
 *
 * V2 (opcional):
 *  - updateDealContact   → PATCH /api/deal-contacts/:id
 * ----------------------------------------------------------------------------
 */

const mongoose = require('mongoose');
const DealContact = require('../models/DealContact');

/**
 * GET /api/deal-contacts
 * ----------------------------------------------------------------------------
 * Listar todos los contactos guardados (más recientes primero).
 */
exports.listDealContacts = async (req, res) => {
  try {
    const contacts = await DealContact.find().sort({ createdAt: -1 });
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('GET /deal-contacts error:', error);
    return res.status(500).json({ error: 'Error al obtener los contactos' });
  }
};

/**
 * (Alias por compatibilidad hacia atrás)
 * Si en tus rutas estabas usando getAllDealContacts, seguirá funcionando.
 */
exports.getAllDealContacts = exports.listDealContacts;

/**
 * POST /api/deal-contacts
 * ----------------------------------------------------------------------------
 * Crear un nuevo contacto en la libreta.
 * Requiere: nombre, nombreEmpresa, telefono, direccion, descripcionServicio.
 * Opcionales: fechaInicio, fechaTermino.
 */
exports.createDealContact = async (req, res) => {
  try {
    const {
      nombre,
      nombreEmpresa,
      telefono,
      direccion,
      descripcionServicio,
      fechaInicio,
      fechaTermino,
    } = req.body;

    // Validación básica
    if (!nombre || !nombreEmpresa || !telefono || !direccion || !descripcionServicio) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newContact = new DealContact({
      nombre,
      nombreEmpresa,
      telefono,
      direccion,
      descripcionServicio,
      fechaInicio: fechaInicio || null,
      fechaTermino: fechaTermino || null,
    });

    const saved = await newContact.save();
    return res.status(201).json(saved);
  } catch (error) {
    console.error('POST /deal-contacts error:', error);
    return res.status(500).json({ error: 'Error al crear el contacto' });
  }
};

/**
 * DELETE /api/deal-contacts/:id
 * ----------------------------------------------------------------------------
 * Eliminar un contacto por ID.
 * - Valida el ObjectId para evitar CastError.
 * - Devuelve 404 si no existe.
 */
exports.deleteDealContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const deleted = await DealContact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    return res.status(200).json({ ok: true, message: 'Contacto eliminado' });
  } catch (error) {
    console.error('DELETE /deal-contacts/:id error:', error);
    return res.status(500).json({ error: 'Error al eliminar contacto' });
  }
};

/**
 * PATCH /api/deal-contacts/:id
 * ----------------------------------------------------------------------------
 * (V2) Actualizar parcialmente un contacto.
 * - Solo actualiza campos presentes en el body.
 */
exports.updateDealContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Construye el objeto de actualización solo con campos enviados
    const updatable = [
      'nombre',
      'nombreEmpresa',
      'telefono',
      'direccion',
      'descripcionServicio',
      'fechaInicio',
      'fechaTermino',
    ];

    const update = {};
    for (const key of updatable) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        update[key] = req.body[key];
      }
    }

    const updated = await DealContact.findByIdAndUpdate(id, update, {
      new: true,           // devuelve el documento actualizado
      runValidators: true, // valida según el schema
    });

    if (!updated) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('PATCH /deal-contacts/:id error:', error);
    return res.status(500).json({ error: 'Error al actualizar contacto' });
  }
};