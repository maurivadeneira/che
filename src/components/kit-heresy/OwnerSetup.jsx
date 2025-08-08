import React, { useState } from 'react';
import './OwnerSetup.css';
import { useKit } from '../../context/KitContext';

const OwnerSetup = ({ onSetupComplete }) => {
  const { kitData, updateOwner } = useKit();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateOwner({ [name]: value });
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    updateOwner({
      paymentInfo: {
        ...kitData.owner.paymentInfo,
        [name]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!kitData.owner.name || !kitData.owner.email) {
      setError('Por favor, completa los campos obligatorios (nombre y email).');
      return;
    }
    
    if (!kitData.owner.email.includes('@') || !kitData.owner.email.includes('.')) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    
    if (!kitData.owner.paymentInfo?.accountName || !kitData.owner.paymentInfo?.accountNumber || !kitData.owner.paymentInfo?.bank) {
      setError('Por favor, completa la información bancaria para recibir donaciones.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulamos el proceso de guardado
    setTimeout(() => {
      // Actualizamos la información adicional del propietario
      updateOwner({
        setupDate: new Date().toISOString(),
        isOwner: true
      });
      
      setIsLoading(false);
      onSetupComplete(kitData.owner);
    }, 1000);
  };

  return (
    <div className="owner-setup-container">
      <h2>Configuración Inicial del Kit</h2>
      <p className="setup-intro">
        Como propietario original de la obra, necesitamos algunos datos para iniciar 
        el ciclo de distribución del Kit. Esta información se utilizará para dirigir las
        donaciones secundarias en las primeras activaciones.
      </p>
      
      {error && (
        <div className="setup-error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="setup-section">
          <h3>Información Personal</h3>
          
          <div className="form-group">
            <label htmlFor="name">Nombre Completo: <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={kitData.owner.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico: <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={kitData.owner.email || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="setup-section">
          <h3>Información de Pago para Recibir Donaciones</h3>
          
          <div className="form-group">
            <label htmlFor="accountName">Titular de la Cuenta: <span className="required">*</span></label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={kitData.owner.paymentInfo?.accountName || ''}
              onChange={handlePaymentInfoChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="accountNumber">Número de Cuenta: <span className="required">*</span></label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={kitData.owner.paymentInfo?.accountNumber || ''}
              onChange={handlePaymentInfoChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bank">Banco: <span className="required">*</span></label>
            <input
              type="text"
              id="bank"
              name="bank"
              value={kitData.owner.paymentInfo?.bank || ''}
              onChange={handlePaymentInfoChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="paypalEmail">Email de PayPal (opcional):</label>
            <input
              type="email"
              id="paypalEmail"
              name="paypalEmail"
              value={kitData.owner.paymentInfo?.paypalEmail || ''}
              onChange={handlePaymentInfoChange}
            />
            <p className="help-text">
              Para recibir donaciones internacionales, recomendamos proporcionar una cuenta de PayPal.
            </p>
          </div>
        </div>
        
        <div className="consent-box">
          <input type="checkbox" id="consent" required />
          <label htmlFor="consent">
            Declaro que soy el propietario de los derechos de la obra y autorizo a la Corporación
            Herejía Económica a distribuir mi Kit usando el sistema de donaciones establecido.
          </label>
        </div>
        
        <button 
          type="submit" 
          className="setup-submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Configurando...' : 'Configurar Kit como Propietario'}
        </button>
      </form>
    </div>
  );
};

export default OwnerSetup;