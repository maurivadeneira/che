const mongoose = require('mongoose');

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
  paymentInfo: {
    bankName: String,
    accountNumber: String,
    accountType: {
      type: String,
      enum: ['Ahorros', 'Corriente'],
      default: 'Ahorros'
    },
    paypalEmail: String
  },
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
  status: {
    type: String,
    enum: ['pending', 'active', 'expired'],
    default: 'pending'
  },
  invitationId: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  activationDate: Date,
  expirationDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Kit', kitSchema);
