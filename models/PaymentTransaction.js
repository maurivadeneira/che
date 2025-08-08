const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentTransactionSchema = new Schema({
  // Usuario que realiza la transacción
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Tipo de transacción
  type: {
    type: String,
    enum: ['donation', 'commission', 'refund'],
    default: 'donation'
  },
  
  // Usuario receptor (para donaciones)
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Detalles de la cantidad
  amount: {
    value: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    usdEquivalent: {
      type: Number
    },
    exchangeRate: {
      type: Number
    }
  },
  
  // Método de pago utilizado
  paymentMethod: {
    type: {
      type: String,
      enum: ['bank', 'paypal', 'crypto', 'other'],
      required: true
    },
    details: {
      // Campos específicos para banco
      bankName: String,
      accountNumber: String,
      accountType: String,
      
      // Campos específicos para PayPal
      paypalEmail: String,
      
      // Campos específicos para criptomonedas
      cryptoAddress: String,
      cryptoNetwork: String,
      
      // Campos para otros métodos
      otherMethod: String,
      otherDetails: String
    }
  },
  
  // Comprobante de pago
  receipt: {
    fileUrl: String,
    uploadDate: Date,
    verified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    verifiedBy: {
      type: String,
      enum: ['system', 'admin', 'automatic']
    }
  },
  
  // Estado de la transacción
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Fechas importantes
  dates: {
    created: {
      type: Date,
      default: Date.now
    },
    updated: Date,
    completed: Date
  },
  
  // Para metadatos adicionales específicos del proveedor
  metadata: {
    type: Schema.Types.Mixed
  },
  
  // Notas internas o públicas
  notes: {
    internal: String,
    public: String
  }
});

// Índices para mejorar consultas
paymentTransactionSchema.index({ userId: 1, 'dates.created': -1 });
paymentTransactionSchema.index({ recipientId: 1 });
paymentTransactionSchema.index({ status: 1 });
paymentTransactionSchema.index({ 'receipt.verified': 1 });

// Métodos personalizados
paymentTransactionSchema.methods.markAsVerified = function(verifiedBy = 'admin') {
  this.receipt.verified = true;
  this.receipt.verificationDate = new Date();
  this.receipt.verifiedBy = verifiedBy;
  this.status = 'completed';
  this.dates.updated = new Date();
  this.dates.completed = new Date();
  return this.save();
};

paymentTransactionSchema.methods.markAsFailed = function(note) {
  this.status = 'failed';
  this.dates.updated = new Date();
  if (note) {
    this.notes.internal = note;
  }
  return this.save();
};

// Hooks pre-save para actualizar fechas automáticamente
paymentTransactionSchema.pre('save', function(next) {
  this.dates.updated = new Date();
  next();
});

const PaymentTransaction = mongoose.model('PaymentTransaction', paymentTransactionSchema);

module.exports = PaymentTransaction;