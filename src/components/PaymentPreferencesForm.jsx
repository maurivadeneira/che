import React, { useState, useEffect } from 'react';

const PaymentPreferencesForm = ({ onSave, initialData = {} }) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    paymentMethod: initialData.paymentMethod || '',
    preferredCurrency: initialData.preferredCurrency || '',
    bankName: initialData.bankName || '',
    accountNumber: initialData.accountNumber || '',
    accountType: initialData.accountType || 'savings',
    paypalEmail: initialData.paypalEmail || '',
    cryptoAddress: initialData.cryptoAddress || '',
    cryptoNetwork: initialData.cryptoNetwork || 'ethereum',
    otherMethod: initialData.otherMethod || '',
    otherDetails: initialData.otherDetails || ''
  });

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
    if (name === 'preferredCurrency') {
      handleCurrencyChange(value);
    }
  };

  // Manejar cambios en el método de pago
  const handlePaymentMethodChange = (method) => {
    // Si se selecciona crypto, preseleccionar una criptomoneda
    if (method === 'crypto' && !['BTC', 'USDT', 'USDC'].includes(formData.preferredCurrency)) {
      setFormData(prev => ({
        ...prev,
        preferredCurrency: 'BTC'
      }));
    }
  };

  // Manejar cambios en la moneda
  const handleCurrencyChange = (currency) => {
    // Si se selecciona una criptomoneda, cambiar el método a crypto
    if (['BTC', 'USDT', 'USDC'].includes(currency) && formData.paymentMethod !== 'crypto') {
      setFormData(prev => ({
        ...prev,
        paymentMethod: 'crypto'
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="payment-preferences">
        <h3>Preferencias de pago</h3>
        
        <div className="form-group">
          <label htmlFor="paymentMethod">Método de pago preferido:</label>
          <select 
            id="paymentMethod" 
            name="paymentMethod" 
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un método</option>
            <option value="bank">Transferencia Bancaria</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Criptomonedas</option>
            <option value="other">Otro Método</option>
          </select>
        </div>
        
        <div className="form-group" id="currency-selection-container">
          <label htmlFor="preferredCurrency">Moneda preferida para recibir donaciones:</label>
          <select 
            id="preferredCurrency" 
            name="preferredCurrency"
            value={formData.preferredCurrency}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una moneda</option>
            <optgroup label="Monedas fiduciarias">
              <option value="USD">Dólar estadounidense (USD)</option>
              <option value="COP">Peso colombiano (COP)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="MXN">Peso mexicano (MXN)</option>
              <option value="ARS">Peso argentino (ARS)</option>
              <option value="CLP">Peso chileno (CLP)</option>
              <option value="PEN">Sol peruano (PEN)</option>
              <option value="BRL">Real brasileño (BRL)</option>
              <option value="VES">Bolívar venezolano (VES)</option>
              <option value="UYU">Peso uruguayo (UYU)</option>
              <option value="PYG">Guaraní paraguayo (PYG)</option>
              <option value="BOB">Boliviano (BOB)</option>
              <option value="CRC">Colón costarricense (CRC)</option>
              <option value="DOP">Peso dominicano (DOP)</option>
              <option value="GTQ">Quetzal guatemalteco (GTQ)</option>
              <option value="HNL">Lempira hondureño (HNL)</option>
              <option value="NIO">Córdoba nicaragüense (NIO)</option>
              <option value="PAB">Balboa panameño (PAB)</option>
              <option value="SVC">Colón salvadoreño (SVC)</option>
            </optgroup>
            <optgroup label="Criptomonedas">
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
            </optgroup>
          </select>
        </div>
        
        {/* Campos específicos para transferencia bancaria */}
        {formData.paymentMethod === 'bank' && (
          <div id="bank-fields" className="payment-method-fields">
            <div className="form-group">
              <label htmlFor="bankName">Nombre del banco:</label>
              <input 
                type="text" 
                id="bankName" 
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
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
          <div id="paypal-fields" className="payment-method-fields">
            <div className="form-group">
              <label htmlFor="paypalEmail">Email de PayPal:</label>
              <input 
                type="email" 
                id="paypalEmail" 
                name="paypalEmail"
                value={formData.paypalEmail}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
        
        {/* Campos específicos para criptomonedas */}
        {formData.paymentMethod === 'crypto' && (
          <div id="crypto-fields" className="payment-method-fields">
            <div className="form-group">
              <label htmlFor="cryptoAddress">Dirección de wallet:</label>
              <input 
                type="text" 
                id="cryptoAddress" 
                name="cryptoAddress"
                value={formData.cryptoAddress}
                onChange={handleChange}
              />
            </div>
            {['USDT', 'USDC'].includes(formData.preferredCurrency) && (
              <div className="form-group">
                <label htmlFor="cryptoNetwork">Red preferida (para stablecoins):</label>
                <select 
                  id="cryptoNetwork" 
                  name="cryptoNetwork"
                  value={formData.cryptoNetwork}
                  onChange={handleChange}
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="tron">Tron</option>
                  <option value="solana">Solana</option>
                  <option value="binance">Binance Smart Chain</option>
                </select>
              </div>
            )}
          </div>
        )}
        
        {/* Campos específicos para otros métodos */}
        {formData.paymentMethod === 'other' && (
          <div id="other-fields" className="payment-method-fields">
            <div className="form-group">
              <label htmlFor="otherMethod">Especifique método:</label>
              <input 
                type="text" 
                id="otherMethod" 
                name="otherMethod"
                value={formData.otherMethod}
                onChange={handleChange}
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
              ></textarea>
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Guardar preferencias de pago</button>
        </div>
      </div>
    </form>
  );
};

export default PaymentPreferencesForm;