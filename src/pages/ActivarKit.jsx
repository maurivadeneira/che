// src/pages/ActivarKit.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ActivarKit.css';

const ActivarKit = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const kitId = searchParams.get('kit');

  const [step, setStep] = useState(1); // 1: registro, 2: donaciones, 3: confirmación
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    pais: 'Colombia',
    banco: '',
    tipoCuenta: 'Ahorros',
    numeroCuenta: '',
    numeroDocumento: '',
    tipoDocumento: 'CC'
  });

  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    if (!kitId) {
      setError('ID de kit no válido. Por favor, utilice el enlace correcto del Kit2.');
    }
  }, [kitId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/activacion/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          kitReferencia: kitId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDonationData(data.donationData);
        setStep(2);
      } else {
        setError(data.message || 'Error al procesar el registro');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarDonaciones = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/activacion/confirmar-donaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: donationData?.usuarioId,
          kitReferencia: kitId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(3);
      } else {
        setError(data.message || 'Error al confirmar donaciones');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !kitId) {
    return (
      <div className="activar-kit-container">
        <div className="error-message">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Ir al Inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="activar-kit-container">
      <div className="activar-kit-content">
        
        {/* Header */}
        <div className="header-section">
          <h1>🎯 Activar Kit2 de la Herejía Económica</h1>
          <div className="progress-bar">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Registro</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Donaciones</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Confirmación</div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Paso 1: Registro */}
        {step === 1 && (
          <div className="step-content">
            <h2>📋 Registro de Usuario</h2>
            <p>Complete sus datos para activar su Kit2 personalizado:</p>
            
            <form onSubmit={handleSubmitRegistro}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Juan Carlos Pérez"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="usuario@ejemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: +57 300 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pais">País</label>
                  <select
                    id="pais"
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                  >
                    <option value="Colombia">Colombia</option>
                    <option value="México">México</option>
                    <option value="España">España</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tipoDocumento">Tipo de documento</label>
                  <select
                    id="tipoDocumento"
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PA">Pasaporte</option>
                    <option value="NIT">NIT</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="numeroDocumento">Número de documento *</label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 12345678"
                  />
                </div>
              </div>

              <h3>💳 Datos Bancarios (para recibir futuras donaciones)</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="banco">Banco *</label>
                  <input
                    type="text"
                    id="banco"
                    name="banco"
                    value={formData.banco}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Banco de Colombia"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipoCuenta">Tipo de cuenta</label>
                  <select
                    id="tipoCuenta"
                    name="tipoCuenta"
                    value={formData.tipoCuenta}
                    onChange={handleInputChange}
                  >
                    <option value="Ahorros">Ahorros</option>
                    <option value="Corriente">Corriente</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="numeroCuenta">Número de cuenta *</label>
                  <input
                    type="text"
                    id="numeroCuenta"
                    name="numeroCuenta"
                    value={formData.numeroCuenta}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 123456789"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? '⏳ Procesando...' : '➡️ Continuar'}
              </button>
            </form>
          </div>
        )}

        {/* Paso 2: Instrucciones de Donación */}
        {step === 2 && donationData && (
          <div className="step-content">
            <h2>💰 Instrucciones de Donación</h2>
            <p>Para activar su Kit2, debe realizar dos donaciones:</p>

            <div className="donation-instructions">
              
              {/* Donación 1: Al beneficiario */}
              <div className="donation-card">
                <div className="donation-header">
                  <h3>💳 Donación 1: ${donationData.montoBeneficiario}</h3>
                  <span className="donation-recipient">Para: {donationData.beneficiario.nombre}</span>
                </div>
                <div className="donation-details">
                  <p><strong>Banco:</strong> {donationData.beneficiario.banco}</p>
                  <p><strong>Tipo de cuenta:</strong> {donationData.beneficiario.tipoCuenta}</p>
                  <p><strong>Número de cuenta:</strong> {donationData.beneficiario.numeroCuenta}</p>
                  <p><strong>Titular:</strong> {donationData.beneficiario.nombre}</p>
                </div>
              </div>

              {/* Donación 2: A la corporación */}
              <div className="donation-card">
                <div className="donation-header">
                  <h3>🏢 Donación 2: ${donationData.montoCorporacion}</h3>
                  <span className="donation-recipient">Para: Corporación Herejía Económica</span>
                </div>
                <div className="donation-details">
                  <p><strong>Banco:</strong> {donationData.corporacion.banco}</p>
                  <p><strong>Tipo de cuenta:</strong> {donationData.corporacion.tipoCuenta}</p>
                  <p><strong>Número de cuenta:</strong> {donationData.corporacion.numeroCuenta}</p>
                  <p><strong>Titular:</strong> {donationData.corporacion.titular}</p>
                  <p className="note">Tesorero temporal de la Corporación</p>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h3>✅ Confirmación</h3>
              <p>Una vez realizadas ambas donaciones:</p>
              <ol>
                <li>Haga clic en "Confirmar Donaciones"</li>
                <li>Nuestro equipo verificará las transacciones</li>
                <li>Recibirá su Kit2 personalizado y todo el material digital</li>
              </ol>

              <div className="action-buttons">
                <button 
                  onClick={() => setStep(1)} 
                  className="btn-secondary"
                >
                  ⬅️ Volver a Registro
                </button>
                <button 
                  onClick={handleConfirmarDonaciones}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? '⏳ Procesando...' : '✅ Confirmar Donaciones'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmación Final */}
        {step === 3 && (
          <div className="step-content">
            <div className="success-message">
              <h2>🎉 ¡Registro Exitoso!</h2>
              <p>Su solicitud de Kit2 ha sido procesada correctamente.</p>
              
              <div className="next-steps">
                <h3>📧 Próximos pasos:</h3>
                <ol>
                  <li>Verificaremos sus donaciones en las próximas 24 horas</li>
                  <li>Le enviaremos por correo:
                    <ul>
                      <li>Su Kit2 personalizado en PDF</li>
                      <li>Todos los libros digitales de la Herejía Económica</li>
                      <li>Acceso a las videoconferencias explicativas</li>
                      <li>Instrucciones para comenzar a compartir su Kit2</li>
                    </ul>
                  </li>
                  <li>¡Podrá comenzar a generar ingresos adicionales!</li>
                </ol>
              </div>

              <div className="contact-info">
                <h3>📞 Contacto</h3>
                <p>Si tiene alguna pregunta, puede contactarnos a:</p>
                <p><strong>Email:</strong> soporte@corpherejiaeconomica.com</p>
                <p><strong>Teléfono:</strong> Por definir</p>
              </div>

              <button onClick={() => navigate('/')} className="btn-primary">
                🏠 Ir al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivarKit;