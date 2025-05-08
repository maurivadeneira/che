const mongoose = require('mongoose');

// Esquema para cuentas bancarias
const bankAccountSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['Ahorros', 'Corriente'],
    default: 'Ahorros'
  },
  primary: {
    type: Boolean,
    default: false
  }
});

const kitSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  // Cambiar a un array de cuentas bancarias
  bankAccounts: [bankAccountSchema],
  paypalEmail: String,
  
  // Información del beneficiario de donaciones (para el kit inicial)
  donationRecipient: {
    name: String,
    // También permitir múltiples cuentas bancarias para el beneficiario
    bankAccounts: [bankAccountSchema],
    paypalEmail: String
  },
  
  // Indicador si es el kit inicial
  isInitialKit: {
    type: Boolean,
    default: false
  },
  
  // Configuración del kit
  corporationDonation: {
    type: Number,
    default: 20
  },
  referrerDonation: {
    type: Number,
    default: 7
  },
  kitValidityDays: {
    type: Number,
    default: 365
  },
  isTestVersion: {
    type: Boolean,
    default: false
  },
  
  // Estado del kit
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'inactive'],
    default: 'draft'
  },
  
  // PDF URL
  pdfUrl: String,
  
  // Fechas
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  activatedAt: Date
});

module.exports = mongoose.model('Kit', kitSchema);