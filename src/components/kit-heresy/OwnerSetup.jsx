import React, { useState } from 'react';
import './OwnerSetup.css';

const OwnerSetup = ({ onSetupComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!name || !email) {
      setError('Por favor, completa los campos obligatorios (nombre y email).');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    
    if (!accountName || !accountNumber || !bank) {
      setError('Por favor, completa la información bancaria para recibir donaciones.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulamos el proceso de guardado
    setTimeout(() => {
      // Datos del propietario para inicializar el ciclo de distribución
      const ownerData = {
        name,
        email,
        paymentInfo: {
          accountName,
          accountNumber,
          bank,
          paypalEmail: paypalEmail || null
        },
        setupDate: new Date().toISOString(),
        isOwner: true
      };
      
      setIsLoading(false);
      onSetupComplete(ownerData);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico: <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="accountNumber">Número de Cuenta: <span className="required">*</span></label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bank">Banco: <span className="required">*</span></label>
            <input
              type="text"
              id="bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="paypalEmail">Email de PayPal (opcional):</label>
            <input
              type="email"
              id="paypalEmail"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
            />
            <p className="help-text">
              Para recibir donaciones internacionales, recomendamos proporcionar una cuenta de PayPal.
            </p>
          </div>
        </div>
        
        <div className="consent-box">
          <input type="checkbox" id="consent" required />
          <label htmlFor="consent">
            Declaro que soy el propietario de los derechos de la obra y autorizo a la Corporación Herejía Económica 
            a distribuirla mediante el sistema de donaciones del Kit.
          </label>
        </div>
        
        <button 
          type="submit" 
          className="setup-action-button"
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Iniciar Distribución del Kit'}
        </button>
      </form>
    </div>
  );
};

export default OwnerSetup;