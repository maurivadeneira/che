const PaymentTransaction = require('../models/PaymentTransaction');
const User = require('../models/User');
const Kit = require('../models/Kit');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// API para obtener tasas de cambio externas
const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';
const CRYPTO_RATE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether,usd-coin&vs_currencies=usd';

// Caché para tasas de cambio
let exchangeRatesCache = {
  fiat: null,
  crypto: null,
  lastUpdated: null
};

// Tiempo de expiración del caché (15 minutos)
const CACHE_EXPIRATION = 15 * 60 * 1000;

/**
 * Obtiene las tasas de cambio actualizadas
 */
const getExchangeRates = async () => {
  const now = new Date().getTime();
  
  // Devolver caché si es válido
  if (
    exchangeRatesCache.fiat && 
    exchangeRatesCache.crypto && 
    exchangeRatesCache.lastUpdated && 
    (now - exchangeRatesCache.lastUpdated) < CACHE_EXPIRATION
  ) {
    return exchangeRatesCache;
  }
  
  try {
    // Obtener tasas de monedas fiduciarias
    const fiatResponse = await axios.get(EXCHANGE_RATE_API);
    const fiatRates = fiatResponse.data.rates;
    
    // Obtener tasas de criptomonedas
    const cryptoResponse = await axios.get(CRYPTO_RATE_API);
    const cryptoRates = {
      BTC: 1 / cryptoResponse.data.bitcoin.usd,
      USDT: 1 / cryptoResponse.data.tether.usd,
      USDC: 1 / cryptoResponse.data['usd-coin'].usd
    };
    
    // Actualizar caché
    exchangeRatesCache = {
      fiat: fiatRates,
      crypto: cryptoRates,
      lastUpdated: now
    };
    
    return exchangeRatesCache;
  } catch (error) {
    console.error('Error al obtener tasas de cambio:', error);
    throw new Error('No se pudieron obtener las tasas de cambio actualizadas');
  }
};

/**
 * Guarda las preferencias de pago de un usuario
 */
exports.savePaymentPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      paymentMethod,
      preferredCurrency,
      bankName,
      accountNumber,
      accountType,
      paypalEmail,
      cryptoAddress,
      cryptoNetwork,
      otherMethod,
      otherDetails
    } = req.body;
    
    // Validar campos requeridos
    if (!paymentMethod || !preferredCurrency) {
      return res.status(400).json({
        success: false,
        message: 'El método de pago y la moneda son obligatorios'
      });
    }
    
    // Encontrar al usuario y actualizar sus preferencias
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Crear o actualizar el perfil de kit
    if (!user.kitProfile) {
      user.kitProfile = {};
    }
    
    if (!user.kitProfile.paymentPreferences) {
      user.kitProfile.paymentPreferences = {};
    }
    
    // Guardar las preferencias de pago
    user.kitProfile.paymentPreferences = {
      method: paymentMethod,
      currency: preferredCurrency,
      details: {
        bankName,
        accountNumber,
        accountType,
        paypalEmail,
        cryptoAddress,
        cryptoNetwork,
        otherMethod,
        otherDetails
      },
      updatedAt: new Date()
    };
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Preferencias de pago guardadas correctamente',
      data: user.kitProfile.paymentPreferences
    });
  } catch (error) {
    console.error('Error al guardar preferencias de pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al guardar las preferencias de pago',
      error: error.message
    });
  }
};

/**
 * Registra una nueva transacción de pago (donación)
 */
exports.createTransaction = async (req, res) => {
  try {
    const {
      recipientId,
      amount,
      currency,
      paymentMethod,
      paymentDetails
    } = req.body;
    
    const userId = req.user._id;
    
    // Validar campos requeridos
    if (!recipientId || !amount || !currency || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }
    
    // Verificar que el monto sea válido
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser un número positivo'
      });
    }
    
    // Verificar que el receptor exista
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Receptor no encontrado'
      });
    }
    
    // Obtener tasas de cambio y calcular equivalente en USD
    const rates = await getExchangeRates();
    let usdEquivalent = amount;
    let exchangeRate = 1;
    
    if (currency !== 'USD') {
      if (['BTC', 'USDT', 'USDC'].includes(currency)) {
        // Convertir cripto a USD
        exchangeRate = rates.crypto[currency];
        usdEquivalent = amount / exchangeRate;
      } else {
        // Convertir fiduciaria a USD
        exchangeRate = rates.fiat[currency];
        usdEquivalent = amount / exchangeRate;
      }
    }
    
    // Crear la transacción
    const transaction = new PaymentTransaction({
      userId,
      recipientId,
      type: 'donation',
      amount: {
        value: amount,
        currency,
        usdEquivalent,
        exchangeRate
      },
      paymentMethod: {
        type: paymentMethod,
        details: paymentDetails
      },
      status: 'pending',
      dates: {
        created: new Date()
      }
    });
    
    // Guardar la transacción
    await transaction.save();
    
    return res.status(201).json({
      success: true,
      message: 'Transacción creada correctamente',
      data: {
        transactionId: transaction._id,
        amount,
        currency,
        usdEquivalent,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error al crear transacción:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la transacción',
      error: error.message
    });
  }
};

/**
 * Sube un comprobante de pago
 */
exports.uploadReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha cargado ningún archivo'
      });
    }
    
    // Verificar que la transacción exista
    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) {
      // Eliminar el archivo subido si la transacción no existe
      fs.unlinkSync(req.file.path);
      
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }
    
    // Verificar que la transacción pertenezca al usuario
    if (transaction.userId.toString() !== req.user._id.toString()) {
      // Eliminar el archivo subido si no es el usuario correcto
      fs.unlinkSync(req.file.path);
      
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar esta transacción'
      });
    }
    
    // Guardar la información del comprobante
    transaction.receipt = {
      fileUrl: `/uploads/receipts/${req.file.filename}`,
      uploadDate: new Date(),
      verified: false
    };
    
    // Actualizar el estado de la transacción
    transaction.status = 'pending';
    transaction.dates.updated = new Date();
    
    await transaction.save();
    
    return res.status(200).json({
      success: true,
      message: 'Comprobante cargado correctamente',
      data: {
        transactionId: transaction._id,
        receiptUrl: transaction.receipt.fileUrl,
        status: transaction.status
      }
    });
  } catch (error) {
    console.error('Error al cargar comprobante:', error);
    
    // Eliminar el archivo en caso de error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al cargar el comprobante',
      error: error.message
    });
  }
};

/**
 * Obtiene las tasas de cambio actuales
 */
exports.getExchangeRates = async (req, res) => {
  try {
    const rates = await getExchangeRates();
    
    return res.status(200).json({
      success: true,
      data: {
        fiat: rates.fiat,
        crypto: rates.crypto,
        lastUpdated: rates.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error al obtener tasas de cambio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las tasas de cambio',
      error: error});
  }
};

/**
 * Verifica una transacción (para administradores)
 */
exports.verifyTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { verified, notes } = req.body;
    
    // Verificar que el usuario sea administrador
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para verificar transacciones'
      });
    }
    
    // Verificar que la transacción exista
    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }
    
    // Actualizar estado de verificación
    if (verified) {
      transaction.receipt.verified = true;
      transaction.receipt.verificationDate = new Date();
      transaction.receipt.verifiedBy = 'admin';
      transaction.status = 'completed';
      transaction.dates.completed = new Date();
      
      // Verificar si todas las donaciones requeridas están completas
      await checkKitActivation(transaction.userId);
    } else {
      transaction.status = 'failed';
      transaction.notes = { ...transaction.notes, internal: notes };
    }
    
    transaction.dates.updated = new Date();
    await transaction.save();
    
    return res.status(200).json({
      success: true,
      message: verified ? 'Transacción verificada correctamente' : 'Transacción marcada como fallida',
      data: {
        transactionId: transaction._id,
        status: transaction.status
      }
    });
  } catch (error) {
    console.error('Error al verificar transacción:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar la transacción',
      error: error.message
    });
  }
};

/**
 * Obtiene las instrucciones de pago para un usuario específico
 */
exports.getPaymentInstructions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Buscar usuario por ID
    const user = await User.findById(userId).select('kitProfile.paymentPreferences');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Verificar que el usuario tenga preferencias de pago configuradas
    if (!user.kitProfile || !user.kitProfile.paymentPreferences) {
      return res.status(404).json({
        success: false,
        message: 'Este usuario no tiene preferencias de pago configuradas'
      });
    }
    
    const preferences = user.kitProfile.paymentPreferences;
    let instructions = [];
    
    // Generar instrucciones según el método de pago
    switch (preferences.method) {
      case 'bank':
        instructions = [
          `Realiza una transferencia bancaria a la siguiente cuenta:`,
          `Banco: ${preferences.details.bankName}`,
          `Cuenta: ${preferences.details.accountNumber}`,
          `Tipo: ${preferences.details.accountType === 'savings' ? 'Ahorros' : 'Corriente'}`
        ];
        break;
        
      case 'paypal':
        instructions = [
          `Realiza tu donación a través de PayPal:`,
          `Correo electrónico: ${preferences.details.paypalEmail}`,
          `Asegúrate de marcar la opción "Enviar a un amigo" para evitar comisiones.`
        ];
        break;
        
      case 'crypto':
        instructions = [
          `Realiza tu donación en ${preferences.currency} a la siguiente dirección:`,
          `${preferences.details.cryptoAddress}`
        ];
        
        if (['USDT', 'USDC'].includes(preferences.currency)) {
          instructions.push(`Red: ${preferences.details.cryptoNetwork}`);
        }
        break;
        
      case 'other':
        instructions = [
          `Método de pago: ${preferences.details.otherMethod}`,
          `${preferences.details.otherDetails}`
        ];
        break;
    }
    
    // Obtener tasas de cambio para mostrar equivalencias
    const rates = await getExchangeRates();
    
    // Montos sugeridos en USD
    const suggestedAmounts = [5, 10, 20, 50];
    
    // Convertir montos sugeridos a la moneda seleccionada
    const convertedAmounts = suggestedAmounts.map(amount => {
      let converted;
      
      if (preferences.currency === 'USD') {
        converted = amount;
      } else if (['BTC', 'USDT', 'USDC'].includes(preferences.currency)) {
        converted = amount * rates.crypto[preferences.currency];
      } else {
        converted = amount * rates.fiat[preferences.currency];
      }
      
      // Formatear según el tipo de moneda
      return {
        usd: amount,
        value: converted,
        formatted: formatCurrency(converted, preferences.currency)
      };
    });
    
    return res.status(200).json({
      success: true,
      data: {
        userId,
        paymentMethod: preferences.method,
        currency: preferences.currency,
        instructions,
        suggestedAmounts: convertedAmounts,
        qrCodeData: preferences.method === 'crypto' ? preferences.details.cryptoAddress : null
      }
    });
  } catch (error) {
    console.error('Error al obtener instrucciones de pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las instrucciones de pago',
      error: error.message
    });
  }
};

/**
 * Verifica si todas las donaciones requeridas para activar el kit están completas
 */
const checkKitActivation = async (userId) => {
  try {
    // Verificar si el usuario ya tiene un kit activo
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Si el usuario ya tiene nivel de acceso 2, ya tiene el kit activado
    if (user.accessLevel >= 2) {
      return false;
    }
    
    // Obtener las donaciones verificadas del usuario
    const verifiedDonations = await PaymentTransaction.find({
      userId,
      type: 'donation',
      status: 'completed',
      'receipt.verified': true
    });
    
    // Sumar las donaciones en USD
    const totalDonated = verifiedDonations.reduce((sum, donation) => {
      return sum + donation.amount.usdEquivalent;
    }, 0);
    
    // Verificar si se cumple el mínimo requerido
    const minDonationRequired = process.env.MIN_DONATION_REQUIRED || 10; // Mínimo de 10 USD por defecto
    
    if (totalDonated >= minDonationRequired) {
      // Activar el kit para el usuario
      user.accessLevel = 2;
      
      // Crear registro del kit
      if (!user.kitProfile) {
        user.kitProfile = {};
      }
      
      if (!user.kitProfile.kitInfo) {
        user.kitProfile.kitInfo = {};
      }
      
      // Generar ID único para el kit
      const kitId = `KIT-${userId.toString().substring(0, 8)}-${Date.now().toString(36)}`;
      
      user.kitProfile.kitInfo = {
        activationDate: new Date(),
        kitId,
        status: 'active'
      };
      
      await user.save();
      
      // Crear registro en la colección Kit
      await Kit.create({
        userId,
        kitId,
        activationDate: new Date(),
        status: 'active',
        donationData: {
          totalAmountUSD: totalDonated,
          transactions: verifiedDonations.map(d => d._id)
        }
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al verificar activación del kit:', error);
    throw error;
  }
};

/**
 * Formatea un valor según la moneda especificada
 */
const formatCurrency = (amount, currency) => {
  if (!amount && amount !== 0) return '';
  
  // Configuraciones específicas por moneda
  const currencyFormats = {
    BTC: { decimals: 8, symbol: '₿' },
    USDT: { decimals: 2, symbol: 'USDT' },
    USDC: { decimals: 2, symbol: 'USDC' },
    USD: { decimals: 2, symbol: '$' },
    EUR: { decimals: 2, symbol: '€' },
    COP: { decimals: 0, symbol: '$' },
    MXN: { decimals: 2, symbol: '$' },
    // Añadir más monedas según sea necesario
  };
  
  // Formato por defecto
  const format = currencyFormats[currency] || { decimals: 2, symbol: currency };
  
  // Formatear número
  const formattedNumber = Number(amount).toFixed(format.decimals);
  
  // Devolver con símbolo
  if (['BTC', 'USDT', 'USDC'].includes(currency)) {
    return `${formattedNumber} ${format.symbol}`;
  } else {
    return `${format.symbol} ${formattedNumber}`;
  }
};

module.exports = exports;