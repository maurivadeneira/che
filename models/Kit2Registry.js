/**
 * MODELO DE REGISTRO SEGURO PARA KIT2
 * Corporación Herejía Económica
 * 
 * Esquema de MongoDB para registrar y rastrear todos los Kit2 generados
 * Incluye información de seguridad, auditoría y verificación
 */

import mongoose from 'mongoose';

const Kit2RegistrySchema = new mongoose.Schema({
  // Identificación única del Kit2
  verificationCode: {
    type: String,
    required: true,
    unique: true,
    length: 12,
    index: true
  },
  
  // Token de descarga (temporal)
  downloadToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Información del usuario propietario
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  userName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Información del archivo
  fileName: {
    type: String,
    required: true
  },
  
  filePath: {
    type: String,
    required: true
  },
  
  fileSize: {
    type: Number,
    default: 0
  },
  
  // Configuración del Kit2
  kitConfiguration: {
    corporationPurchase: {
      type: Number,
      default: 20
    },
    networkCommission: {
      type: Number,
      default: 7
    },
    contents: [{
      id: Number,
      title: String,
      type: String
    }]
  },
  
  // Seguridad y autenticación
  corporationSignature: {
    type: String,
    required: true
  },
  
  watermarkData: {
    visible: String,
    invisible: String,
    disclaimer: String
  },
  
  // Estado del Kit2
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked', 'reported'],
    default: 'active',
    index: true
  },
  
  // Fechas importantes
  generatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  
  // Actividad de descarga
  downloadActivity: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    userIP: String,
    userAgent: String,
    success: {
      type: Boolean,
      default: true
    },
    errorMessage: String
  }],
  
  downloadCount: {
    type: Number,
    default: 0
  },
  
  maxDownloads: {
    type: Number,
    default: 3
  },
  
  // Verificaciones públicas
  verificationActivity: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    verifierIP: String,
    result: String // 'authentic', 'not_found', 'expired', etc.
  }],
  
  verificationCount: {
    type: Number,
    default: 0
  },
  
  // Reportes de fraude
  fraudReports: [{
    reportId: String,
    reportedAt: {
      type: Date,
      default: Date.now
    },
    reporterEmail: String,
    reason: String,
    additionalInfo: String,
    reporterIP: String,
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending'
    },
    resolution: String,
    resolvedAt: Date
  }],
  
  // Metadatos adicionales
  metadata: {
    generationVersion: {
      type: String,
      default: '2.0'
    },
    securityLevel: {
      type: String,
      enum: ['standard', 'high', 'maximum'],
      default: 'high'
    },
    corporationVersion: String,
    additionalNotes: String
  }
}, {
  timestamps: true,
  collection: 'kit2_registry'
});

// Índices compuestos para consultas eficientes
Kit2RegistrySchema.index({ userId: 1, status: 1 });
Kit2RegistrySchema.index({ status: 1, expiresAt: 1 });
Kit2RegistrySchema.index({ userEmail: 1, generatedAt: -1 });

// Middleware pre-save para validaciones adicionales
Kit2RegistrySchema.pre('save', function(next) {
  // Validar que el código de verificación tenga exactamente 12 dígitos
  if (this.verificationCode && !/^\d{12}$/.test(this.verificationCode)) {
    return next(new Error('El código de verificación debe tener exactamente 12 dígitos'));
  }
  
  // Asegurar que la fecha de expiración sea válida
  if (this.expiresAt && this.expiresAt <= this.generatedAt) {
    return next(new Error('La fecha de expiración debe ser posterior a la fecha de generación'));
  }
  
  next();
});

// Métodos del esquema
Kit2RegistrySchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

Kit2RegistrySchema.methods.isDownloadLimitReached = function() {
  return this.downloadCount >= this.maxDownloads;
};

Kit2RegistrySchema.methods.canBeDownloaded = function() {
  return this.status === 'active' && 
         !this.isExpired() && 
         !this.isDownloadLimitReached();
};

Kit2RegistrySchema.methods.addDownloadActivity = function(userIP, userAgent, success = true, errorMessage = null) {
  this.downloadActivity.push({
    userIP,
    userAgent,
    success,
    errorMessage
  });
  
  if (success) {
    this.downloadCount += 1;
  }
  
  this.lastAccessedAt = new Date();
  return this.save();
};

Kit2RegistrySchema.methods.addVerificationActivity = function(verifierIP, result) {
  this.verificationActivity.push({
    verifierIP,
    result
  });
  
  this.verificationCount += 1;
  return this.save();
};

Kit2RegistrySchema.methods.addFraudReport = function(reportData) {
  const fraudReport = {
    reportId: `FR_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    reportedAt: new Date(),
    reporterEmail: reportData.reporterEmail,
    reason: reportData.reason,
    additionalInfo: reportData.additionalInfo || '',
    reporterIP: reportData.reporterIP,
    status: 'pending'
  };
  
  this.fraudReports.push(fraudReport);
  
  // Si hay múltiples reportes, cambiar estado a reportado
  if (this.fraudReports.length >= 2) {
    this.status = 'reported';
  }
  
  return this.save();
};

// Métodos estáticos
Kit2RegistrySchema.statics.findByVerificationCode = function(code) {
  return this.findOne({ verificationCode: code });
};

Kit2RegistrySchema.statics.findActiveByUser = function(userId) {
  return this.find({ 
    userId: userId, 
    status: 'active',
    expiresAt: { $gt: new Date() }
  }).sort({ generatedAt: -1 });
};

Kit2RegistrySchema.statics.getSecurityStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalDownloads: { $sum: '$downloadCount' },
        totalVerifications: { $sum: '$verificationCount' }
      }
    }
  ]);
};

Kit2RegistrySchema.statics.cleanupExpired = function() {
  return this.updateMany(
    { 
      expiresAt: { $lt: new Date() },
      status: 'active'
    },
    { 
      status: 'expired' 
    }
  );
};

Kit2RegistrySchema.statics.getFraudReports = function(status = 'pending') {
  return this.find({
    'fraudReports.status': status
  }).populate('userId', 'name email');
};

// Virtual para URL de verificación
Kit2RegistrySchema.virtual('verificationUrl').get(function() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://corpherejiaeconomica.com'
    : 'http://localhost:3001';
  return `${baseUrl}/verify-kit2/${this.verificationCode}`;
});

// Virtual para información de seguridad resumida
Kit2RegistrySchema.virtual('securitySummary').get(function() {
  return {
    level: this.metadata.securityLevel,
    authentic: this.status === 'active' && !this.isExpired(),
    downloadCount: this.downloadCount,
    verificationCount: this.verificationCount,
    fraudReports: this.fraudReports.length,
    corporationVerified: !!this.corporationSignature
  };
});

// Incluir virtuals en JSON
Kit2RegistrySchema.set('toJSON', { virtuals: true });
Kit2RegistrySchema.set('toObject', { virtuals: true });

const Kit2Registry = mongoose.model('Kit2Registry', Kit2RegistrySchema);

export default Kit2Registry;