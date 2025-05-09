const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pdfPersonalizadoSchema = new Schema({
  usuario: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  kit: { 
    type: Schema.Types.ObjectId, 
    ref: 'Kit', 
    required: true 
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
  }
});

module.exports = mongoose.model('PdfPersonalizado', pdfPersonalizadoSchema);