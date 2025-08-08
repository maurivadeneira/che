const mongoose = require('mongoose');

// Esquema para manejar contratos legales en la aplicación
const ContractSchema = new mongoose.Schema({
  // ===== INFORMACIÓN BÁSICA =====
  contractType: {
    type: String,
    enum: ['author', 'contractor', 'user'],
    required: true
  },
  
  version: {
    type: String,
    required: true,
    default: '1.0'
  },
  
  title: {
    type: String,
    required: true,
    default: 'Contrato de Autor - Kit2 Herejía Económica'
  },
  
  // ===== CONTENIDO DEL CONTRATO =====
  content: {
    markdown: {
      type: String,
      required: true
    },
    html: {
      type: String
    },
    pdf: {
      url: String,
      generatedAt: Date
    }
  },
  
  // ===== METADATOS =====
  status: {
    type: String,
    enum: ['draft', 'active', 'deprecated'],
    default: 'draft'
  },
  
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  
  createdBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    role: String
  },
  
  // ===== MODIFICACIONES =====
  revisions: [{
    version: String,
    changes: String,
    modifiedBy: {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  
  // ===== LEGAL =====
  jurisdiction: {
    country: String,
    state: String,
    laws: [String]
  },
  
  // ===== TIMESTAMPS =====
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ===== MIDDLEWARE =====
ContractSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// ===== MÉTODOS =====
ContractSchema.methods.addRevision = function(changes, userId, userName, reason) {
  const newVersion = parseFloat(this.version) + 0.1;
  
  this.revisions.push({
    version: newVersion.toFixed(1),
    changes,
    modifiedBy: {
      userId,
      userName
    },
    reason
  });
  
  this.version = newVersion.toFixed(1);
  return this.save();
};

ContractSchema.methods.getActiveContract = function() {
  return {
    id: this._id,
    type: this.contractType,
    version: this.version,
    content: this.content.markdown,
    effectiveDate: this.effectiveDate,
    status: this.status
  };
};

// ===== ESQUEMA PARA ACEPTACIONES DE CONTRATOS =====
const ContractAcceptanceSchema = new mongoose.Schema({
  // ===== REFERENCIA AL CONTRATO =====
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  
  contractVersion: {
    type: String,
    required: true
  },
  
  // ===== USUARIO QUE ACEPTA =====
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // ===== DATOS DE ACEPTACIÓN =====
  acceptanceData: {
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    digitalSignature: String, // Hash de los datos
    geoLocation: {
      country: String,
      city: String,
      coordinates: [Number] // [longitude, latitude]
    }
  },
  
  // ===== CAMPOS DEL FORMULARIO =====
  formData: {
    // Datos específicos según el tipo de contrato
    fullName: String,
    documentId: String,
    email: String,
    phone: String,
    address: String,
    
    // Si es persona jurídica
    companyName: String,
    taxId: String,
    legalRepresentative: String,
    
    // Declaraciones específicas
    declarations: [{
      statement: String,
      accepted: Boolean,
      timestamp: Date
    }]
  },
  
  // ===== ESTADO =====
  status: {
    type: String,
    enum: ['pending', 'accepted', 'revoked'],
    default: 'accepted'
  },
  
  // ===== VERIFICACIÓN =====
  verification: {
    documentVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String,
      verifiedAt: Date
    },
    verificationNotes: String
  },
  
  // ===== TIMESTAMPS =====
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ===== MÉTODO PARA GENERAR FIRMA DIGITAL =====
ContractAcceptanceSchema.methods.generateDigitalSignature = function() {
  const crypto = require('crypto');
  const dataToSign = `${this.contractId}${this.userId}${this.acceptanceData.timestamp}${this.formData.email}`;
  return crypto.createHash('sha256').update(dataToSign).digest('hex');
};

module.exports = {
  Contract: mongoose.model('Contract', ContractSchema),
  ContractAcceptance: mongoose.model('ContractAcceptance', ContractAcceptanceSchema)
};