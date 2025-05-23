import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/dashboard', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Error fetching dashboard data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        fetchDashboardData();
        setEditMode({});
        alert('Perfil actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleUpdateBankAccount = async (bankData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/bank-account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(bankData)
      });
      
      if (response.ok) {
        fetchDashboardData();
        setEditMode({});
        alert('Información bancaria actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error updating bank account:', error);
    }
  };

  const handleAddPayPal = async (paypalEmail) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/digital-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          type: 'paypal',
          identifier: paypalEmail,
          name: 'PayPal Principal'
        })
      });
      
      if (response.ok) {
        fetchDashboardData();
        alert('PayPal agregado exitosamente');
      }
    } catch (error) {
      console.error('Error adding PayPal:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando su dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="dashboard-error">Error al cargar los datos</div>;
  }

  const { user, kits, donationsSent, donationsReceived, stats } = dashboardData;

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="user-welcome">
          <h1>Bienvenido, {user.name}</h1>
          <p className="user-email">{user.email}</p>
        </div>
        <div className="user-avatar">
          <div className="avatar-circle">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Resumen
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Mi Perfil
        </button>
        <button 
          className={`tab ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Métodos de Pago
        </button>
        <button 
          className={`tab ${activeTab === 'kits' ? 'active' : ''}`}
          onClick={() => setActiveTab('kits')}
        >
          Mis Kits
        </button>
        <button 
          className={`tab ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          Donaciones
        </button>
      </div>

      {/* Contenido por pestañas */}
      <div className="dashboard-content">
        
        {/* PESTAÑA: RESUMEN */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalKits}</h3>
                  <p>Kits Totales</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.activeKits}</h3>
                  <p>Kits Activos</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${stats.totalDonationsReceived}</h3>
                  <p>Recibido</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>{stats.referralCount}</h3>
                  <p>Referidos</p>
                </div>
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="recent-activity">
              <h2>Actividad Reciente</h2>
              <div className="activity-list">
                {donationsReceived.slice(0, 5).map((donation, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">💰</div>
                    <div className="activity-info">
                      <p><strong>Donación recibida:</strong> ${donation.amount}</p>
                      <p className="activity-date">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: PERFIL */}
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="profile-section">
              <h2>Información Personal</h2>
              
              {!editMode.profile ? (
                <div className="profile-display">
                  <div className="profile-field">
                    <label>Nombre Completo:</label>
                    <span>{user.name}</span>
                  </div>
                  <div className="profile-field">
                    <label>Correo Electrónico:</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="profile-field">
                    <label>Teléfono:</label>
                    <span>{user.phone || 'No especificado'}</span>
                  </div>
                  <div className="profile-field">
                    <label>País:</label>
                    <span>{user.pais || 'No especificado'}</span>
                  </div>
                  <div className="profile-field">
                    <label>Documento:</label>
                    <span>{user.numeroDocumento || 'No especificado'}</span>
                  </div>
                  
                  <button 
                    className="btn-edit"
                    onClick={() => setEditMode({...editMode, profile: true})}
                  >
                    Editar Información
                  </button>
                </div>
              ) : (
                <ProfileEditForm 
                  user={user}
                  onSave={handleUpdateProfile}
                  onCancel={() => setEditMode({...editMode, profile: false})}
                />
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA: MÉTODOS DE PAGO */}
        {activeTab === 'payment' && (
          <div className="payment-tab">
            
            {/* Cuenta Bancaria */}
            <div className="payment-section">
              <h2>Cuenta Bancaria</h2>
              {!editMode.bank ? (
                <div className="payment-display">
                  <div className="payment-card bank-card">
                    <div className="payment-icon">🏦</div>
                    <div className="payment-info">
                      <h3>{user.bankAccount?.bank || 'Sin banco configurado'}</h3>
                      <p>{user.bankAccount?.accountType} - **** {user.bankAccount?.accountNumber?.slice(-4)}</p>
                    </div>
                    <button 
                      className="btn-edit-small"
                      onClick={() => setEditMode({...editMode, bank: true})}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ) : (
                <BankEditForm 
                  bankAccount={user.bankAccount}
                  onSave={handleUpdateBankAccount}
                  onCancel={() => setEditMode({...editMode, bank: false})}
                />
              )}
            </div>

            {/* PayPal */}
            <div className="payment-section">
              <h2>PayPal</h2>
              <div className="payment-display">
                <div className="payment-card paypal-card">
                  <div className="payment-icon">💳</div>
                  <div className="payment-info">
                    <h3>PayPal</h3>
                    <p>{user.paypalEmail || 'Sin PayPal configurado'}</p>
                  </div>
                  {!user.paypalEmail && (
                    <button 
                      className="btn-add"
                      onClick={() => {
                        const email = prompt('Ingrese su email de PayPal:');
                        if (email) handleAddPayPal(email);
                      }}
                    >
                      Agregar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Nequi */}
            <div className="payment-section">
              <h2>Nequi</h2>
              <div className="payment-display">
                <div className="payment-card nequi-card">
                  <div className="payment-icon">📱</div>
                  <div className="payment-info">
                    <h3>Nequi</h3>
                    <p>{user.phone || 'Sin teléfono configurado'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PESTAÑA: KITS */}
        {activeTab === 'kits' && (
          <div className="kits-tab">
            <h2>Mis Kits ({kits.length})</h2>
            <div className="kits-grid">
              {kits.map((kit, index) => (
                <div key={kit._id} className="kit-card">
                  <div className="kit-header">
                    <h3>Kit #{index + 1}</h3>
                    <span className={`kit-status ${kit.status}`}>
                      {kit.status === 'active' ? 'Activo' : 
                       kit.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="kit-info">
                    <p><strong>Creado:</strong> {new Date(kit.createdAt).toLocaleDateString()}</p>
                    <p><strong>Tipo:</strong> {kit.isInitialKit ? 'Kit Inicial' : 'Kit Referido'}</p>
                    {kit.activatedAt && (
                      <p><strong>Activado:</strong> {new Date(kit.activatedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  {kit.pdfUrl && (
                    <a href={kit.pdfUrl} target="_blank" rel="noopener noreferrer" className="kit-download">
                      Descargar PDF
                    </a>
                  )}
                </div>
              ))}
              
              {kits.length === 0 && (
                <div className="no-kits">
                  <p>Aún no tienes kits activados.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA: DONACIONES */}
        {activeTab === 'donations' && (
          <div className="donations-tab">
            
            <div className="donations-summary">
              <div className="summary-card received">
                <h3>Donaciones Recibidas</h3>
                <p className="amount">${stats.totalDonationsReceived}</p>
                <p className="count">{donationsReceived.length} transacciones</p>
              </div>
              <div className="summary-card sent">
                <h3>Donaciones Enviadas</h3>
                <p className="amount">${stats.totalDonationsSent}</p>
                <p className="count">{donationsSent.length} transacciones</p>
              </div>
            </div>

            <div className="donations-history">
              <h2>Historial de Donaciones</h2>
              
              <div className="donations-list">
                {[...donationsReceived, ...donationsSent]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 10)
                  .map((donation, index) => (
                    <div key={index} className="donation-item">
                      <div className={`donation-type ${donationsReceived.includes(donation) ? 'received' : 'sent'}`}>
                        {donationsReceived.includes(donation) ? '↓ Recibida' : '↑ Enviada'}
                      </div>
                      <div className="donation-info">
                        <p className="amount">${donation.amount}</p>
                        <p className="date">{new Date(donation.createdAt).toLocaleDateString()}</p>
                        <p className="status">{donation.status}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Componente para editar perfil
const ProfileEditForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    pais: user.pais || 'Colombia',
    numeroDocumento: user.numeroDocumento || '',
    tipoDocumento: user.tipoDocumento || 'Cédula de Ciudadanía'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label>Nombre Completo:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Teléfono:</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label>País:</label>
        <select
          value={formData.pais}
          onChange={(e) => setFormData({...formData, pais: e.target.value})}
        >
          <option value="Colombia">Colombia</option>
          <option value="México">México</option>
          <option value="Argentina">Argentina</option>
          <option value="España">España</option>
          <option value="Estados Unidos">Estados Unidos</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Número de Documento:</label>
        <input
          type="text"
          value={formData.numeroDocumento}
          onChange={(e) => setFormData({...formData, numeroDocumento: e.target.value})}
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-save">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

// Componente para editar cuenta bancaria
const BankEditForm = ({ bankAccount, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    bank: bankAccount?.bank || '',
    accountType: bankAccount?.accountType || 'Ahorros',
    accountNumber: bankAccount?.accountNumber || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label>Banco:</label>
        <select
          value={formData.bank}
          onChange={(e) => setFormData({...formData, bank: e.target.value})}
          required
        >
          <option value="">Seleccionar banco</option>
          <option value="Banco de Colombia">Banco de Colombia</option>
          <option value="Bancolombia">Bancolombia</option>
          <option value="Banco Caja Social">Banco Caja Social</option>
          <option value="Davivienda">Davivienda</option>
          <option value="BBVA">BBVA</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Tipo de Cuenta:</label>
        <select
          value={formData.accountType}
          onChange={(e) => setFormData({...formData, accountType: e.target.value})}
        >
          <option value="Ahorros">Ahorros</option>
          <option value="Corriente">Corriente</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Número de Cuenta:</label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
          required
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-save">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default UserDashboard;