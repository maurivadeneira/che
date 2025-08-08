// Archivo: src/services/currencyService.js

const axios = require('axios');

// API URLs para tasas de cambio
const FIAT_EXCHANGE_API = 'https://api.exchangerate-api.com/v4/latest/USD';
const CRYPTO_EXCHANGE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether,usd-coin&vs_currencies=usd';

// Cache para tasas de cambio
let exchangeRatesCache = {
  fiat: null,
  crypto: null,
  lastUpdated: null
};

// Tiempo de expiración del cache (15 minutos)
const CACHE_EXPIRATION = 15 * 60 * 1000;

/**
 * Obtiene tasas de cambio actualizadas
 */
const getExchangeRates = async () => {
  const now = new Date().getTime();
  
  // Si el cache es válido, devolverlo
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
    const fiatResponse = await axios.get(FIAT_EXCHANGE_API);
    const fiatRates = fiatResponse.data.rates;
    
    // Obtener tasas de criptomonedas
    const cryptoResponse = await axios.get(CRYPTO_EXCHANGE_API);
    const cryptoRates = {
      BTC: 1 / cryptoResponse.data.bitcoin.usd,
      USDT: 1 / cryptoResponse.data.tether.usd,
      USDC: 1 / cryptoResponse.data['usd-coin'].usd
    };
    
    // Actualizar cache
    exchangeRatesCache = {
      fiat: fiatRates,
      crypto: cryptoRates,
      lastUpdated: now
    };
    
    return exchangeRatesCache;
  } catch (error) {
    console.error('Error al obtener tasas de cambio:', error);
    
    // En caso de error, devolver tasas por defecto o las últimas conocidas
    return {
      fiat: exchangeRatesCache.fiat || { USD: 1, EUR: 0.85, COP: 3800, MXN: 17.5 },
      crypto: exchangeRatesCache.crypto || { BTC: 0.000017, USDT: 1, USDC: 1 }
    };
  }
};

/**
 * Convierte monto entre diferentes monedas
 */
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (!amount || fromCurrency === toCurrency) {
    return amount;
  }
  
  // Manejar caso especial de $Col
  if (fromCurrency === '$Col') fromCurrency = 'COP';
  if (toCurrency === '$Col') toCurrency = 'COP';
  
  const rates = await getExchangeRates();
  
  // Convertir a USD primero
  let amountInUSD;
  
  if (fromCurrency === 'USD') {
    amountInUSD = amount;
  } else if (['BTC', 'USDT', 'USDC'].includes(fromCurrency)) {
    // Conversión de cripto a USD
    amountInUSD = amount / rates.crypto[fromCurrency];
  } else {
    // Conversión de fiduciaria a USD
    amountInUSD = amount / rates.fiat[fromCurrency];
  }
  
  // Convertir de USD a moneda destino
  if (toCurrency === 'USD') {
    return amountInUSD;
  } else if (['BTC', 'USDT', 'USDC'].includes(toCurrency)) {
    // Conversión de USD a cripto
    return amountInUSD * rates.crypto[toCurrency];
  } else {
    // Conversión de USD a fiduciaria
    return amountInUSD * rates.fiat[toCurrency];
  }
};

/**
 * Formatea monto en la moneda especificada
 */
const formatCurrency = (amount, currency) => {
  if (!amount && amount !== 0) return '';
  
  // Manejar caso especial de $Col (Peso Colombiano)
  if (currency === '$Col') {
    return `$${Math.round(amount).toLocaleString('es-CO')} COP`;
  }
  
  // Configuraciones por moneda
  const currencyFormats = {
    BTC: { decimals: 8, symbol: '₿' },
    USDT: { decimals: 2, symbol: 'USDT' },
    USDC: { decimals: 2, symbol: 'USDC' },
    USD: { decimals: 2, symbol: '$' },
    EUR: { decimals: 2, symbol: '€' },
    COP: { decimals: 0, symbol: '$' },
    MXN: { decimals: 2, symbol: '$' },
  };
  
  // Formato por defecto
  const format = currencyFormats[currency] || { decimals: 2, symbol: currency };
  
  // Formatear número
  const formattedNumber = Number(amount).toFixed(format.decimals);
  
  // Devolver con símbolo
  if (['BTC', 'USDT', 'USDC'].includes(currency)) {
    return `${formattedNumber} ${format.symbol}`;
  } else {
    return `${format.symbol}${formattedNumber}`;
  }
};

// Obtener lista de monedas disponibles
const getAvailableCurrencies = () => {
  return {
    fiat: [
      { code: 'USD', name: 'Dólar estadounidense' },
      { code: 'EUR', name: 'Euro' },
      { code: 'COP', name: 'Peso colombiano' },
      { code: '$Col', name: 'Peso colombiano' },
      { code: 'MXN', name: 'Peso mexicano' },
      { code: 'ARS', name: 'Peso argentino' },
      { code: 'PEN', name: 'Sol peruano' },
      { code: 'CLP', name: 'Peso chileno' }
    ],
    crypto: [
      { code: 'BTC', name: 'Bitcoin' },
      { code: 'USDT', name: 'Tether (USDT)' },
      { code: 'USDC', name: 'USD Coin (USDC)' }
    ]
  };
};

module.exports = {
  getExchangeRates,
  convertCurrency,
  formatCurrency,
  getAvailableCurrencies
};