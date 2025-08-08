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
    bankAccounts: [
      {
        bankName: '',
        accountNumber: '',
        accountType: 'Ahorros',
        primary: true
      }
    ],
    paypalEmail: '',
    donationRecipient: {
      name: '',
      bankAccounts: [
        {
          bankName: '',
          accountNumber: '',
          accountType: 'Ahorros',
          primary: true
        }
      ],
      paypalEmail: ''
    },
    isInitialKit: true,
    corporationDonation: 20,
    referrerDonation: 7,
    kitValidityDays: 365,
    isTestVersion: true,
    status: 'draft'
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

  // Manejar cambios en las cuentas bancarias
  const handleBankAccountChange = (index, field, value) => {
    setKitData(prev => {
      const newBankAccounts = [...prev.bankAccounts];
      newBankAccounts[index] = {
        ...newBankAccounts[index],
        [field]: value
      };
      return {
        ...prev,
        bankAccounts: newBankAccounts
      };
    });
  };

  // Función para añadir nueva cuenta bancaria
  const addBankAccount = () => {
    setKitData(prev => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        {
          bankName: '',
          accountNumber: '',
          accountType: 'Ahorros',
          primary: false
        }
      ]
    }));
  };

  // Función para eliminar cuenta bancaria
  const removeBankAccount = (index) => {
    if (kitData.bankAccounts.length <= 1) {
      setError('Debe tener al menos una cuenta bancaria');
      return;
    }
    
    setKitData(prev => {
      const newBankAccounts = prev.bankAccounts.filter((_, i) => i !== index);
      // Si eliminamos la cuenta principal, marcar la primera como principal
      if (prev.bankAccounts[index].primary && newBankAccounts.length > 0) {
        newBankAccounts[0].primary = true;
      }
      return {
        ...prev,
        bankAccounts: newBankAccounts
      };
    });
  };

  // Funciones para las cuentas del beneficiario
  const handleDonationRecipientBankAccountChange = (index, field, value) => {
    setKitData(prev => {
      const newDonationRecipient = { ...prev.donationRecipient };
      const newBankAccounts = [...newDonationRecipient.bankAccounts];
      newBankAccounts[index] = {
        ...newBankAccounts[index],
        [field]: value
      };
      newDonationRecipient.bankAccounts = newBankAccounts;
      return {
        ...prev,
        donationRecipient: newDonationRecipient
      };
    });
  };

  // Añadir cuenta bancaria al beneficiario
  const addDonationRecipientBankAccount = () => {
    setKitData(prev => {
      const newDonationRecipient = { ...prev.donationRecipient };
      newDonationRecipient.bankAccounts = [
        ...newDonationRecipient.bankAccounts,
        {
          bankName: '',
          accountNumber: '',
          accountType: 'Ahorros',
          primary: false
        }
      ];
      return {
        ...prev,
        donationRecipient: newDonationRecipient
      };
    });
  };

  // Eliminar cuenta bancaria del beneficiario
  const removeDonationRecipientBankAccount = (index) => {
    if (kitData.donationRecipient.bankAccounts.length <= 1) {
      setError('El beneficiario debe tener al menos una cuenta bancaria');
      return;
    }
    
    setKitData(prev => {
      const newDonationRecipient = { ...prev.donationRecipient };
      const newBankAccounts = newDonationRecipient.bankAccounts.filter((_, i) => i !== index);
      
      // Si eliminamos la cuenta principal, marcar la primera como principal
      if (newDonationRecipient.bankAccounts[index].primary && newBankAccounts.length > 0) {
        newBankAccounts[0].primary = true;
      }
      
      newDonationRecipient.bankAccounts = newBankAccounts;
      return {
        ...prev,
        donationRecipient: newDonationRecipient
      };
    });
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

  // Guardar el progreso del kit
  const saveProgress = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/kits/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kitData)
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar el progreso');
      }
      
      const result = await response.json();
      setMessage('Progreso guardado correctamente');
      
      // Actualizar ID si es un nuevo borrador
      if (result.kit._id && !kitData._id) {
        setKitData(prev => ({
          ...prev,
          _id: result.kit._id
        }));
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al guardar el progreso');
    } finally {
      setLoading(false);
    }
  };

  // Activar el kit
  const activateKit = async () => {
    if (!pdfUrl) {
      setError('Debe generar el PDF antes de activar el kit');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`/api/admin/kits/${kitData._id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al activar el kit');
      }
      
      const result = await response.json();
      setMessage('Kit activado correctamente');
      setKitData(prev => ({
        ...prev,
        status: 'active'
      }));
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al activar el kit');
    } finally {
      setLoading(false);
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
      // Validar que haya al menos una cuenta bancaria
      if (kitData.bankAccounts.length === 0) {
        throw new Error('Debe agregar al menos una cuenta bancaria');
      }
      
      // Validar que el beneficiario tenga al menos una cuenta si es un kit inicial
      if (kitData.isInitialKit && kitData.donationRecipient.bankAccounts.length === 0) {
        throw new Error('El beneficiario debe tener al menos una cuenta bancaria');
      }
      
      // Primero, generar el PDF
      const dataToSend = {
        ...kitData,
        // Compatibilidad con la estructura anterior para no romper el PDF
        paymentInfo: kitData.bankAccounts.find(acc => acc.primary) || kitData.bankAccounts[0]
      };
      
      const pdfResponse = await fetch('/api/admin/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ kitData: dataToSend })
      });
      
      if (!pdfResponse.ok) {
        throw new Error('Error al generar el PDF');
      }
      
      const pdfResult = await pdfResponse.json();
      
      // Mostrar mensaje de éxito y la URL del PDF
      setMessage('Kit2 creado y PDF generado correctamente');
      setPdfUrl(pdfResult.pdfUrl);
      
      // Guardar también el progreso con la URL del PDF
      setKitData(prev => ({
        ...prev,
        pdfUrl: pdfResult.pdfUrl,
        status: 'pending' // Cambiar a pendiente hasta que se active
      }));
      
      // Guardar el kit en la base de datos
      saveProgress();
      
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
              <p className="info-text">
                Puede agregar múltiples cuentas bancarias para facilitar las donaciones.
              </p>
              
              {kitData.bankAccounts.map((account, index) => (
                <div key={index} className="bank-account-container">
                  <div className="bank-account-header">
                    <h4>Cuenta Bancaria {index + 1}</h4>
                    {kitData.bankAccounts.length > 1 && (
                      <button
                        type="button"
                        className="remove-account-button"
                        onClick={() => removeBankAccount(index)}
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`bankAccounts-${index}-bankName`}>Nombre del Banco</label>
                    <input
                      type="text"
                      id={`bankAccounts-${index}-bankName`}
                      value={account.bankName}
                      onChange={(e) => handleBankAccountChange(index, 'bankName', e.target.value)}
                      placeholder="Nombre del banco"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`bankAccounts-${index}-accountNumber`}>Número de Cuenta</label>
                    <input
                      type="text"
                      id={`bankAccounts-${index}-accountNumber`}
                      value={account.accountNumber}
                      onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                      placeholder="Número de cuenta"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`bankAccounts-${index}-accountType`}>Tipo de Cuenta</label>
                    <select
                      id={`bankAccounts-${index}-accountType`}
                      value={account.accountType}
                      onChange={(e) => handleBankAccountChange(index, 'accountType', e.target.value)}
                      disabled={loading}
                    >
                      <option value="Ahorros">Cuenta de Ahorros</option>
                      <option value="Corriente">Cuenta Corriente</option>
                    </select>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id={`bankAccounts-${index}-primary`}
                      checked={account.primary}
                      onChange={(e) => {
                        // Si marcamos esta cuenta como principal, desmarcamos las demás
                        if (e.target.checked) {
                          setKitData(prev => {
                            const newBankAccounts = prev.bankAccounts.map((acc, i) => ({
                              ...acc,
                              primary: i === index
                            }));
                            return {
                              ...prev,
                              bankAccounts: newBankAccounts
                            };
                          });
                        }
                      }}
                      disabled={account.primary || loading}
                    />
                    <label htmlFor={`bankAccounts-${index}-primary`}>
                      Cuenta Principal
                    </label>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="add-account-button"
                onClick={addBankAccount}
                disabled={loading}
              >
                + Agregar Otra Cuenta Bancaria
              </button>
              
              <div className="form-group">
                <label htmlFor="paypalEmail">Correo de PayPal (opcional)</label>
                <input
                  type="email"
                  id="paypalEmail"
                  name="paypalEmail"
                  value={kitData.paypalEmail}
                  onChange={handleKitChange}
                  placeholder="Correo de PayPal"
                  disabled={loading}
                />
              </div>
            </div>
            
            {kitData.isInitialKit && (
              <div className="form-section">
                <h3>Información del Beneficiario de Donaciones</h3>
                <p className="info-text">
                  Como Kit inicial, debe indicar a quién se le harán las donaciones cuando otras personas
                  adquieran Kits a través de su invitación.
                </p>

                <div className="form-group">
                  <label htmlFor="donationRecipient.name">Nombre del Beneficiario</label>
                  <input
                    type="text"
                    id="donationRecipient.name"
                    name="donationRecipient.name"
                    value={kitData.donationRecipient.name}
                    onChange={handleKitChange}
                    placeholder="Nombre del beneficiario de las donaciones"
                    required={kitData.isInitialKit}
                    disabled={loading}
                  />
                </div>

                {/* Cuentas bancarias del beneficiario */}
                {kitData.donationRecipient.bankAccounts.map((account, index) => (
                  <div key={index} className="bank-account-container">
                    <div className="bank-account-header">
                      <h4>Cuenta Bancaria del Beneficiario {index + 1}</h4>
                      {kitData.donationRecipient.bankAccounts.length > 1 && (
                        <button
                          type="button"
                          className="remove-account-button"
                          onClick={() => removeDonationRecipientBankAccount(index)}
                          disabled={loading}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`donationBankAccounts-${index}-bankName`}>Nombre del Banco</label>
                      <input
                        type="text"
                        id={`donationBankAccounts-${index}-bankName`}
                        value={account.bankName}
                        onChange={(e) => handleDonationRecipientBankAccountChange(index, 'bankName', e.target.value)}
                        placeholder="Nombre del banco del beneficiario"
                        required={kitData.isInitialKit}
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`donationBankAccounts-${index}-accountNumber`}>Número de Cuenta</label>
                      <input
                        type="text"
                        id={`donationBankAccounts-${index}-accountNumber`}
                        value={account.accountNumber}
                        onChange={(e) => handleDonationRecipientBankAccountChange(index, 'accountNumber', e.target.value)}
                        placeholder="Número de cuenta del beneficiario"
                        required={kitData.isInitialKit}
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`donationBankAccounts-${index}-accountType`}>Tipo de Cuenta</label>
                      <select
                        id={`donationBankAccounts-${index}-accountType`}
                        value={account.accountType}
                        onChange={(e) => handleDonationRecipientBankAccountChange(index, 'accountType', e.target.value)}
                        disabled={loading}
                      >
                        <option value="Ahorros">Cuenta de Ahorros</option>
                        <option value="Corriente">Cuenta Corriente</option>
                      </select>
                    </div>
                    
                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id={`donationBankAccounts-${index}-primary`}
                        checked={account.primary}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setKitData(prev => {
                              const newDonationRecipient = { ...prev.donationRecipient };
                              const newBankAccounts = newDonationRecipient.bankAccounts.map((acc, i) => ({
                                ...acc,
                                primary: i === index
                              }));
                              newDonationRecipient.bankAccounts = newBankAccounts;
                              return {
                                ...prev,
                                donationRecipient: newDonationRecipient
                              };
                            });
                          }
                        }}
                        disabled={account.primary || loading}
                      />
                      <label htmlFor={`donationBankAccounts-${index}-primary`}>
                        Cuenta Principal
                      </label>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="add-account-button"
                  onClick={addDonationRecipientBankAccount}
                  disabled={loading}
                >
                  + Agregar Otra Cuenta Bancaria para el Beneficiario
                </button>

                <div className="form-group">
                  <label htmlFor="donationRecipient.paypalEmail">
                    Correo de PayPal del Beneficiario (opcional)
                  </label>
                  <input
                    type="email"
                    id="donationRecipient.paypalEmail"
                    name="donationRecipient.paypalEmail"
                    value={kitData.donationRecipient.paypalEmail}
                    onChange={handleKitChange}
                    placeholder="Correo de PayPal del beneficiario"
                    disabled={loading}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="sameBeneficiary"
                    name="sameBeneficiary"
                    checked={
                      kitData.donationRecipient.name === kitData.clientName &&
                      kitData.donationRecipient.bankAccounts[0].bankName === kitData.bankAccounts[0].bankName &&
                      kitData.donationRecipient.bankAccounts[0].accountNumber === kitData.bankAccounts[0].accountNumber
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Si está marcado, copiar los datos del cliente
                        setKitData(prev => ({
                          ...prev,
                          donationRecipient: {
                            name: prev.clientName,
                            bankAccounts: JSON.parse(JSON.stringify(prev.bankAccounts)), // Deep copy
                            paypalEmail: prev.paypalEmail
                          }
                        }));
                      } else {
                        // Si se desmarca, limpiar los datos del beneficiario
                        setKitData(prev => ({
                          ...prev,
                          donationRecipient: {
                            name: '',
                            bankAccounts: [
                              {
                                bankName: '',
                                accountNumber: '',
                                accountType: 'Ahorros',
                                primary: true
                              }
                            ],
                            paypalEmail: ''
                          }
                        }));
                      }
                    }}
                    disabled={loading}
                  />
                  <label htmlFor="sameBeneficiary">
                    El beneficiario es el mismo que el propietario del Kit
                  </label>
                </div>
              </div>
            )}
            
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
                  id="isInitialKit"
                  name="isInitialKit"
                  checked={kitData.isInitialKit}
                  onChange={handleKitChange}
                  disabled={loading}
                />
                <label htmlFor="isInitialKit">
                  Este es un Kit Inicial (del propietario original)
                </label>
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
            
            <div className="button-group">
              <button
                type="button"
                className="save-button"
                onClick={saveProgress}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Progreso'}
              </button>
              
              <button
                type="submit"
                className="admin-button"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Generar Kit2'}
              </button>
              
              {pdfUrl && (
                <button
                  type="button"
                  className="activate-button"
                  onClick={activateKit}
                  disabled={loading || kitData.status === 'active'}
                >
                  {kitData.status === 'active' ? 'Kit Activado' : 'Activar Kit'}
                </button>
              )}
            </div>
          </form>
          
          {pdfUrl && (
  <div className="pdf-preview">
    <h3>PDF Generado</h3>
    <p>Haga clic en los enlaces para ver o descargar el PDF:</p>
    <div className="pdf-links">
      <a 
        href="#"
        className="pdf-link"
        onClick={(e) => {
          e.preventDefault();
          // Abrir en nueva ventana con URL absoluta
          const absoluteUrl = `${window.location.origin}${pdfUrl}`;
          console.log('Abriendo PDF en nueva ventana:', absoluteUrl);
          window.open(absoluteUrl, '_blank');
        }}
      >
        Ver PDF
      </a>
      {' '}
      <a 
        href="#"
        className="pdf-link"
        onClick={(e) => {
          e.preventDefault();
          // Iniciar descarga con URL absoluta
          const absoluteUrl = `${window.location.origin}${pdfUrl}`;
          console.log('Descargando PDF:', absoluteUrl);
          
          // Método alternativo de descarga
          fetch(absoluteUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
              }
              return response.blob();
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = pdfUrl.split('/').pop();
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }, 0);
            })
            .catch(error => {
              console.error('Error descargando PDF:', error);
              alert('Error al descargar el PDF: ' + error.message);
            });
        }}
      >
        Descargar PDF
      </a>
    </div>
    
    {/* Agregar un iframe para mostrar una vista previa del PDF */}
    <div className="pdf-iframe-container">
      <iframe
        src={`${window.location.origin}${pdfUrl}#toolbar=1&navpanes=1`}
        title="Vista previa del PDF"
        width="100%"
        height="500px"
        style={{ border: '1px solid #ccc', marginTop: '15px' }}
      />
    </div>
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