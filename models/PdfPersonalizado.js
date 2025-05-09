const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pdfPersonalizadoSchema = new Schema({
  usuarioId: {
    type: String,
    required: true
  },
  kitId: {
    type: String,
    required: true
  },
  beneficiarioId: {
    type: String
  },
  urlArchivo: {
    type: String,
    required: true
  },
  nombreArchivo: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  versionDocumento: {
    type: String
  },
  activo: {
    type: Boolean,
    default: true
  },
  descargas: {
    type: Number,
    default: 0
  },
  ultimaDescarga: {
    type: Date
  },
  esKitOriginal: {
    type: Boolean,
    default: false
  },
  observaciones: {
    type: String
  },
  estadoVerificacion: {
    type: String,
    enum: ['pendiente', 'verificado', 'rechazado'],
    default: 'pendiente'
  },
  metadatos: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('PdfPersonalizado', pdfPersonalizadoSchema);