/**
 * controllers/dealContactController.js
 * ----------------------------------------------------------------------------
 * Controlador para manejar la "Libreta de Contactos / Contratos cerrados".
 * 
 * Funciones principales (V1):
 *  - getAllDealContacts  → Listar todos los contactos guardados.
 *  - createDealContact   → Crear un nuevo contacto (contrato cerrado).
 * 
 * Futuro:
 *  - updateDealContact   → Editar un contacto existente.
 *  - deleteDealContact   → Eliminar un contacto.
 * ----------------------------------------------------------------------------
 */

const DealContact = require('../models/DealContact');

/**
 * GET /api/deal-contacts
 * ----------------------------------------------------------------------------
 * Obtener todos los contactos guardados en la libreta.
 * - Ordenados por fecha de creación descendente (más reciente primero).
 * - Devuelve un array con todos los campos del modelo.
 */
exports.getAllDealContacts = async (req, res) => {
  try {
    const contacts = await DealContact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({ error: 'Error al obtener los contactos' });
  }
};

/**
 * POST /api/deal-contacts
 * ----------------------------------------------------------------------------
 * Crear un nuevo contacto en la libreta.
 * - Requiere: nombre, nombreEmpresa, telefono, direccion, descripcionServicio.
 * - Opcionales: fechaInicio, fechaTermino.
 * - Devuelve el contacto creado.
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

    // Validación básica (los requeridos)
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

    const savedContact = await newContact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    console.error('Error al crear contacto:', error);
    res.status(500).json({ error: 'Error al crear el contacto' });
  }
};