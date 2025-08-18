/**
 * models/DealContact.js
 * ----------------------------------------------------------------------------
 * Modelo "DealContact" (Libreta de contactos / contratos cerrados).
 * - Representa clientes con los que se concretó un trato de trabajo.
 * - Se almacena en la misma base que el resto del Dashboard.
 * - Incluye validaciones mínimas y timestamps automáticos.
 * 
 * Campos:
 *  - nombre               (string, requerido)
 *  - nombreEmpresa        (string, requerido)
 *  - telefono             (string, requerido)
 *  - direccion            (string, requerido)
 *  - descripcionServicio  (string, requerido)
 *  - fechaInicio          (date, opcional)
 *  - fechaTermino         (date, opcional, debe ser >= fechaInicio si ambas existen)
 * 
 * Extras:
 *  - timestamps           (createdAt, updatedAt)
 *  - índices              (búsqueda frecuente por nombre/nombreEmpresa/createdAt)
 * ----------------------------------------------------------------------------
 */

const mongoose = require('mongoose');

const DealContactSchema = new mongoose.Schema(
  {
    // Datos principales del cliente/contrato
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre es muy corto'],
      maxlength: [120, 'El nombre es demasiado largo'],
    },
    nombreEmpresa: {
      type: String,
      required: [true, 'El nombre de la empresa es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre de la empresa es muy corto'],
      maxlength: [160, 'El nombre de la empresa es demasiado largo'],
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      // Validación simple: dígitos, +, espacios, guiones y paréntesis
      match: [/^[0-9+()\-.\s]+$/, 'Formato de teléfono inválido'],
      maxlength: [30, 'El teléfono es demasiado largo'],
    },
    direccion: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true,
      maxlength: [240, 'La dirección es demasiado larga'],
    },
    descripcionServicio: {
      type: String,
      required: [true, 'La descripción del servicio es obligatoria'],
      trim: true,
      maxlength: [2000, 'La descripción es demasiado larga'],
    },

    // Fechas del contrato (opcionales)
    fechaInicio: {
      type: Date,
      default: null,
    },
    fechaTermino: {
      type: Date,
      default: null,
      // Regla: si existe fechaInicio, fechaTermino debe ser >= fechaInicio
      validate: {
        validator: function (value) {
          if (!value) return true; // si no hay fechaTermino, pasa
          if (!this.fechaInicio) return true; // si no hay inicio, pasa
          return value >= this.fechaInicio;
        },
        message: 'La fecha de término debe ser posterior o igual a la fecha de inicio',
      },
    },

    // (Opcional futuro) Para auditoría si agregas multiusuario luego
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  {
    timestamps: true, // createdAt, updatedAt automáticos
    versionKey: false,
  }
);

/* Índices recomendados -------------------------------------------------------
   - Búsquedas por nombre/nombreEmpresa
   - Orden por fecha de creación (lista reciente)
----------------------------------------------------------------------------- */
DealContactSchema.index({ nombre: 1 });
DealContactSchema.index({ nombreEmpresa: 1 });
DealContactSchema.index({ createdAt: -1 });

/* Normalización/limpieza ligera antes de guardar -----------------------------
   - Recortar espacios redundantes en campos de texto
----------------------------------------------------------------------------- */
DealContactSchema.pre('save', function (next) {
  if (this.isModified('telefono') && this.telefono) {
    this.telefono = this.telefono.trim();
  }
  if (this.isModified('direccion') && this.direccion) {
    this.direccion = this.direccion.trim();
  }
  if (this.isModified('descripcionServicio') && this.descripcionServicio) {
    this.descripcionServicio = this.descripcionServicio.trim();
  }
  next();
});

module.exports = mongoose.model('DealContact', DealContactSchema);