// Archivo: src/components/PaymentPreferencesForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentPreferencesForm.css';

const PaymentPreferencesForm = ({ userId, kitId, onSubmit, initialData = {} }) => {
  // Estados para datos del formulario
  const [currencies, setCurrencies] = useState({ fiat: [], crypto: [] });
  const [formData, setFormData] = useState({
    currency: initialData.currency || 'USD',
    paymentMethod: initialData.paymentMethod || 'bank_transfer',
    bankName: initialData.bankName || '',
    accountNumber: initialData.accountNumber || '',
    accountType: initialData.accountType || 'savings',
    paypalEmail: initialData.paypalEmail || '',
    cryptoAddress: initialData.cryptoAddress || '',
    cryptoNetwork: initialData.cryptoNetwork || 'ethereum',
    otherMethod: initialData.otherMethod || '',
    otherDetails: initialData.otherDetails || ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener monedas disponibles
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/payment/currencies');
        if (response.data.success) {
          setCurrencies(response.data.data);
        } else {
          setError('Error al cargar monedas');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrencies();
  }, []);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Lógica específica para cuando cambia el método de pago
    if (name === 'paymentMethod') {
      handlePaymentMethodChange(value);
    }
    
    // Lógica específica para cuando cambia la moneda
    if (name === 'currency') {
      handleCurrencyChange(value);
    }
  };

  // Manejar cambios en el método de pago
  const handlePaymentMethodChange = (method) => {
    // Si se selecciona crypto, preseleccionar una criptomoneda
    if (method === 'crypto_wallet' && !['BTC', 'USDT', 'USDC'].includes(formData.currency)) {
      setFormData(prev => ({
        ...prev,
        currency: 'BTC'
      }));
    }
  };

  // Manejar cambios en la moneda
  const handleCurrencyChange = (currency) => {
    // Si se selecciona una criptomoneda, cambiar el método a crypto
    if (['BTC', 'USDT', 'USDC'].includes(currency) && formData.paymentMethod !== 'crypto_wallet') {
      setFormData(prev => ({
        ...prev,
        paymentMethod: 'crypto_wallet'
      }));
    }
  };
  
  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post('/api/payment/preferences', {
        userId,
        kitId,
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        paymentDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountType: formData.accountType,
          paypalEmail: formData.paypalEmail,
          cryptoAddress: formData.cryptoAddress,
          cryptoNetwork: formData.cryptoNetwork,
          otherMethod: formData.otherMethod,
          otherDetails: formData.otherDetails
        }
      });
      
      if (response.data.success) {
        if (onSubmit) onSubmit(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error al guardar preferencias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Obtener métodos de pago según la moneda seleccionada
  const getPaymentMethods = () => {
    // Si es criptomoneda
    if (['BTC', 'USDT', 'USDC'].includes(formData.currency)) {
      return [
        { id: 'crypto_wallet', name: 'Monedero de Criptomonedas' }
      ];
    }
    
    // Si es moneda fiduciaria
    return [
      { id: 'bank_transfer', name: 'Transferencia Bancaria' },
      { id: 'paypal', name: 'PayPal' },
      { id: 'credit_card', name: 'Tarjeta de Crédito' },
      { id: 'cash', name: 'Efectivo' },
      { id: 'other', name: 'Otro método' }
    ];
  };
  
  if (loading && currencies.fiat.length === 0) {
    return <div className="loading">Cargando opciones de pago...</div>;
  }
  
  return (
    <div className="payment-preferences-form">
      <h2>Preferencias de Pago</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currency">Moneda de Pago:</label>
          <select 
            id="currency" 
            name="currency"
            value={formData.currency} 
            onChange={handleChange}
            required
          >
            <optgroup label="Monedas Fiduciarias">
              {currencies.fiat.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </optgroup>
            <optgroup label="Criptomonedas">
              {currencies.crypto.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="paymentMethod">Método de Pago:</label>
          <select 
            id="paymentMethod" 
            name="paymentMethod"
            value={formData.paymentMethod} 
            onChange={handleChange}
            required
          >
            {getPaymentMethods().map(method => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Campos específicos para transferencia bancaria */}
        {formData.paymentMethod === 'bank_transfer' && (
          <div className="payment-method-fields">
            <div className="form-group">
              <label htmlFor="bankName">Nombre del banco:</label>
              <input 
                type="text" 
                id="bankName" 
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="accountNumber">Número de cuenta:</label>
              <input 
                type="text" 
                id="accountNumber" 
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="accountType">Tipo de cuenta:</label>
              <select 
                id="accountType" 
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <option value="savings">Ahorros</option>
                <option value="checking">Corriente</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Campos específicos para PayPal */}
        {formData.paymentMethod === 'paypal' && (
          <div className="payment-method-fields">
            <div className="form-group">
              <label htmlFor="paypalEmail">Email de PayPal:</label>
              <input 
                type="email" 
                id="paypalEmail" 
                name="paypalEmail"
                value={formData.paypalEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}
        
        {/* Campos específicos para criptomonedas */}
        {formData.paymentMethod === 'crypto_wallet' && (
          <div className="payment-method-fields">
            <div className="form-group">
              <label htmlFor="cryptoAddress">Dirección de wallet:</label>
              <input 
                type="text" 
                id="cryptoAddress" 
                name="cryptoAddress"
                value={formData.cryptoAddress}
                onChange={handleChange}
                required
              />
            </div>
            {['USDT', 'USDC'].includes(formData.currency) && (
              <div className="form-group">
                <label htmlFor="cryptoNetwork">Red:</label>
                <select 
                  id="cryptoNetwork" 
                  name="cryptoNetwork"
                  value={formData.cryptoNetwork}
                  onChange={handleChange}
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="tron">Tron</option>
                  <option value="binance">Binance Smart Chain</option>
                  <option value="solana">Solana</option>
                </select>
              </div>
            )}
          </div>
        )}
        
        {/* Campos específicos para otros métodos */}
        {formData.paymentMethod === 'other' && (
          <div className="payment-method-fields">
            <div className="form-group">
              <label htmlFor="otherMethod">Especifique método:</label>
              <input 
                type="text" 
                id="otherMethod" 
                name="otherMethod"
                value={formData.otherMethod}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="otherDetails">Detalles de pago:</label>
              <textarea 
                id="otherDetails" 
                name="otherDetails" 
                rows="3"
                value={formData.otherDetails}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
        )}
        
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Procesando...' : 'Continuar'}
        </button>
      </form>
    </div>
  );
};

export default PaymentPreferencesForm;