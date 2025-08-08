/**
 * Formatea un valor según la moneda especificada
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de la moneda
 * @returns {string} - Monto formateado
 */
export const formatCurrency = (amount, currency) => {
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
    ARS: { decimals: 2, symbol: '$' },
    CLP: { decimals: 0, symbol: '$' },
    PEN: { decimals: 2, symbol: 'S/' },
    BRL: { decimals: 2, symbol: 'R$' },
    VES: { decimals: 2, symbol: 'Bs.' },
    UYU: { decimals: 2, symbol: '$U' },
    PYG: { decimals: 0, symbol: '₲' },
    BOB: { decimals: 2, symbol: 'Bs' },
    CRC: { decimals: 2, symbol: '₡' },
    DOP: { decimals: 2, symbol: 'RD$' },
    GTQ: { decimals: 2, symbol: 'Q' },
    HNL: { decimals: 2, symbol: 'L' },
    NIO: { decimals: 2, symbol: 'C$' },
    PAB: { decimals: 2, symbol: 'B/' },
    SVC: { decimals: 2, symbol: '₡' }
  };
  
  // Formato por defecto si no está definido
  const format = currencyFormats[currency] || { decimals: 2, symbol: currency };
  
  // Formatear número
  const formattedNumber = Number(amount).toFixed(format.decimals);
  
  // Devolver con símbolo según el tipo de moneda
  if (['BTC', 'USDT', 'USDC'].includes(currency)) {
    return `${formattedNumber} ${format.symbol}`;
  } else {
    return `${format.symbol} ${formattedNumber}`;
  }
};

/**
 * Convierte un monto entre diferentes monedas utilizando tasas de cambio
 * @param {number} amount - Cantidad a convertir
 * @param {string} fromCurrency - Moneda de origen
 * @param {string} toCurrency - Moneda de destino
 * @param {Object} exchangeRates - Objeto con tasas de cambio
 * @returns {number} - Monto convertido
 */
export const convertAmount = (amount, fromCurrency, toCurrency, exchangeRates) => {
  if (!amount || fromCurrency === toCurrency) {
    return amount;
  }
  
  if (!exchangeRates || (!exchangeRates.fiat && !exchangeRates.crypto)) {
    console.error('No hay tasas de cambio disponibles');
    return amount;
  }
  
  try {
    // Convertir a USD primero
    let amountInUSD;
    
    if (fromCurrency === 'USD') {
      amountInUSD = amount;
    } else if (['BTC', 'USDT', 'USDC'].includes(fromCurrency)) {
      // Conversión de cripto a USD
      amountInUSD = amount * (1 / exchangeRates.crypto[fromCurrency]);
    } else {
      // Conversión de fiduciaria a USD
      amountInUSD = amount / exchangeRates.fiat[fromCurrency];
    }
    
    // Convertir de USD a la moneda de destino
    if (toCurrency === 'USD') {
      return amountInUSD;
    } else if (['BTC', 'USDT', 'USDC'].includes(toCurrency)) {
      // Conversión de USD a cripto
      return amountInUSD * exchangeRates.crypto[toCurrency];
    } else {
      // Conversión de USD a fiduciaria
      return amountInUSD * exchangeRates.fiat[toCurrency];
    }
  } catch (error) {
    console.error('Error al convertir moneda:', error);
    return amount;
  }
};

/**
 * Obtiene el símbolo de una moneda
 * @param {string} currency - Código de la moneda
 * @returns {string} - Símbolo de la moneda
 */
export const getCurrencySymbol = (currency) => {
  const symbols = {
    BTC: '₿',
    USDT: 'USDT',
    USDC: 'USDC',
    USD: '$',
    EUR: '€',
    COP: '$',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    PEN: 'S/',
    BRL: 'R$',
    VES: 'Bs.',
    UYU: '$U',
    PYG: '₲',
    BOB: 'Bs',
    CRC: '₡',
    DOP: 'RD$',
    GTQ: 'Q',
    HNL: 'L',
    NIO: 'C$',
    PAB: 'B/',
    SVC: '₡'
  };
  
  return symbols[currency] || currency;
};

export default {
  formatCurrency,
  convertAmount,
  getCurrencySymbol
};