import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [kitData, setKitData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    paymentInfo: {
      bankName: '',
      accountNumber: '',
      accountType: 'Ahorros',
      paypalEmail: ''
    },
    corporationDonation: 20,
    referrerDonation: 7,
    kitValidityDays: 365,
    isTestVersion: true
  });

  // Manejar cambios en el formulario de login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el formulario de kit
  const handleKitChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setKitData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setKitData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Credenciales hardcodeadas para pruebas
    if (loginData.username === 'admin' && loginData.password === 'HerejiaAdmin2024!') {
      setIsAuthenticated(true);
      setMessage('Inicio de sesión exitoso');
      setError('');
    } else {
      setError('Credenciales inválidas');
    }
  };

  // Manejar creación de kit y generación de PDF
  const handleCreateKit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setPdfUrl('');
    
    try {
      // Primero, crear el kit en la base de datos
      const kitResponse = await fetch('/api/admin/kits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kitData)
      });
      
      if (!kitResponse.ok) {
        throw new Error('Error al crear el kit');
      }
      
      const kitResult = await kitResponse.json();
      
      // Luego, generar el PDF
      const pdfResponse = await fetch('/api/admin/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ kitData })
      });
      
      if (!pdfResponse.ok) {
        throw new Error('Error al generar el PDF');
      }
      
      const pdfResult = await pdfResponse.json();
      
      // Mostrar mensaje de éxito y la URL del PDF
      setMessage('Kit2 creado y PDF generado correctamente');
      setPdfUrl(pdfResult.pdfUrl);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Si está autenticado, mostrar panel de administración
  if (isAuthenticated) {
    return (
      <div className="admin-dashboard">
        <h1>Panel de Administración Kit2</h1>
        <p>Bienvenido al panel de administración del Kit2 de la Herejía Económica.</p>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="admin-section">
          <h2>Kits Pendientes</h2>
          <p>No hay kits pendientes de activación.</p>
        </div>
        
        <div className="admin-section">
          <h2>Crear Nuevo Kit</h2>
          <form className="admin-form" onSubmit={handleCreateKit}>
            <div className="form-section">
              <h3>Información del Cliente</h3>
              
              <div className="form-group">
                <label htmlFor="clientName">Nombre Completo</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={kitData.clientName}
                  onChange={handleKitChange}
                  placeholder="Nombre completo"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="clientEmail">Correo Electrónico</label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={kitData.clientEmail}
                  onChange={handleKitChange}
                  placeholder="Correo electrónico"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="clientPhone">Teléfono</label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={kitData.clientPhone}
                  onChange={handleKitChange}
                  placeholder="Número de teléfono"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Información Bancaria</h3>
              
              <div className="form-group">
                <label htmlFor="paymentInfo.bankName">Nombre del Banco</label>
                <input
                  type="text"
                  id="paymentInfo.bankName"
                  name="paymentInfo.bankName"
                  value={kitData.paymentInfo.bankName}
                  onChange={handleKitChange}
                  placeholder="Nombre del banco"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="paymentInfo.accountNumber">Número de Cuenta</label>
                <input
                  type="text"
                  id="paymentInfo.accountNumber"
                  name="paymentInfo.accountNumber"
                  value={kitData.paymentInfo.accountNumber}
                  onChange={handleKitChange}
                  placeholder="Número de cuenta"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="paymentInfo.accountType">Tipo de Cuenta</label>
                <select
                  id="paymentInfo.accountType"
                  name="paymentInfo.accountType"
                  value={kitData.paymentInfo.accountType}
                  onChange={handleKitChange}
                  disabled={loading}
                >
                  <option value="Ahorros">Cuenta de Ahorros</option>
                  <option value="Corriente">Cuenta Corriente</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="paymentInfo.paypalEmail">Correo de PayPal (opcional)</label>
                <input
                  type="email"
                  id="paymentInfo.paypalEmail"
                  name="paymentInfo.paypalEmail"
                  value={kitData.paymentInfo.paypalEmail}
                  onChange={handleKitChange}
                  placeholder="Correo de PayPal"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Configuración del Kit2</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="corporationDonation">Donación a la Corporación (US$)</label>
                  <input
                    type="number"
                    id="corporationDonation"
                    name="corporationDonation"
                    value={kitData.corporationDonation}
                    onChange={handleKitChange}
                    min="1"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="referrerDonation">Donación al Referente (US$)</label>
                  <input
                    type="number"
                    id="referrerDonation"
                    name="referrerDonation"
                    value={kitData.referrerDonation}
                    onChange={handleKitChange}
                    min="1"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="kitValidityDays">Validez del Kit (días)</label>
                  <input
                    type="number"
                    id="kitValidityDays"
                    name="kitValidityDays"
                    value={kitData.kitValidityDays}
                    onChange={handleKitChange}
                    min="1"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isTestVersion"
                  name="isTestVersion"
                  checked={kitData.isTestVersion}
                  onChange={handleKitChange}
                  disabled={loading}
                />
                <label htmlFor="isTestVersion">
                  Generar como VERSIÓN DE PRUEBA para simulación
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="admin-button"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Generar Kit2'}
            </button>
          </form>
          
          {pdfUrl && (
            <div className="pdf-preview">
              <h3>PDF Generado</h3>
              <p>Haga clic en el enlace para ver o descargar el PDF:</p>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pdf-link"
              >
                Ver PDF
              </a>
            </div>
          )}
        </div>
        
        <button 
          className="logout-button"
          onClick={() => setIsAuthenticated(false)}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Si no está autenticado, mostrar formulario de login
  return (
    <div className="admin-login">
      <h1>Administración Kit2</h1>
      <p>Inicie sesión para acceder al panel administrativo</p>
      
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={loginData.username}
            onChange={handleLoginChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
        </div>
        
        <button type="submit" className="login-button">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default AdminPanel;
