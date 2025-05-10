import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentPreferencesForm from './PaymentPreferencesForm';
import PaymentInstructions from './PaymentInstructions';
import axios from 'axios';

const Kit2Activation = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [paymentPreferences, setPaymentPreferences] = useState(null);
  const [paymentInstructions, setPaymentInstructions] = useState(null);
  const [activationComplete, setActivationComplete] = useState(false);
  
  const navigate = useNavigate();
  const { invitationId } = useParams();
  
  // Cambiar esta constante por la URL base de tu API
  const API_BASE_URL = '/api';
  
  useEffect(() => {
    // Cargar la invitación si hay un ID
    if (invitationId) {
      fetchInvitation();
    }
  }, [invitationId]);
  
  const fetchInvitation = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/invitations/${invitationId}`);
      setInvitation(response.data.data);
    } catch (err) {
      setError('No se pudo cargar la invitación. Por favor verifica el enlace o contacta al soporte.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentPreferencesSave = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/payment-preferences`, formData);
      setPaymentPreferences(response.data.data);
      
      // Cargar instrucciones de pago
      await fetchPaymentInstructions();
      
      // Avanzar al siguiente paso
      setStep(2);
    } catch (err) {
      setError('Error al guardar las preferencias de pago: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPaymentInstructions = async () => {
    try {
      // Obtener el ID del usuario invitado desde la invitación
      const invitedUserId = invitation.invitedUser;
      
      const response = await axios.get(`${API_BASE_URL}/payment-instructions/${invitedUserId}`);
      setPaymentInstructions(response.data.data);
    } catch (err) {
      setError('Error al obtener las instrucciones de pago: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handlePaymentComplete = async (transactionId) => {
    setLoading(true);
    try {
      // Enviar solicitud para aceptar la invitación y activar el kit
      const response = await axios.post(`${API_BASE_URL}/invitations/${invitationId}/accept`, {
        transactionId
      });
      
      // Si la activación es exitosa, mostrar mensaje y avanzar al siguiente paso
      setActivationComplete(true);
      setStep(3);
    } catch (err) {
      setError('Error al activar el Kit: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadKit = () => {
    // Esto debe redirigir a la descarga del kit generado
    window.open(`${API_BASE_URL}/kit/${invitation.kitId}/download`, '_blank');
  };
  
  const handleActivateKit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/activate-kit`, {
        invitationId
      });
      
      // Redirigir al dashboard o página principal del kit
      navigate('/dashboard');
    } catch (err) {
      setError('Error al activar el Kit: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !invitation) {
    return <div className="loading">Cargando información de la invitación...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }
  
  if (!invitation && invitationId) {
    return (
      <div className="invalid-invitation">
        <h2>Invitación no válida</h2>
        <p>La invitación especificada no existe o ha expirado.</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }
  
  return (
    <div className="kit-activation">
      <h1>Activación del Kit de la Herejía</h1>
      
      <div className="activation-steps">
        <div className={`step ${step === 1 ? 'active' : (step > 1 ? 'completed' : '')}`}>
          <div className="step-number">1</div>
          <div className="step-label">Preferencias de pago</div>
        </div>
        <div className={`step ${step === 2 ? 'active' : (step > 2 ? 'completed' : '')}`}>
          <div className="step-number">2</div>
          <div className="step-label">Realizar donación</div>
        </div>
        <div className={`step ${step === 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Kit activado</div>
        </div>
      </div>
      
      <div className="step-content">
        {step === 1 && (
          <div>
            <p className="step-description">
              Para activar tu Kit, configura tus preferencias de pago para recibir donaciones futuras.
            </p>
            <PaymentPreferencesForm onSave={handlePaymentPreferencesSave} />
          </div>
        )}
        
        {step === 2 && (
          <div>
            <p className="step-description">
              Realiza tu donación siguiendo las instrucciones a continuación. Recuerda que esta donación
              es de libre asignación por parte de la Corporación.
            </p>
            <PaymentInstructions 
              paymentData={paymentInstructions}
              onPaymentComplete={handlePaymentComplete}
              onError={(message) => setError(message)}
            />
          </div>
        )}
        
        {step === 3 && (
          <div className="activation-complete">
            <h2>¡Felicidades!</h2>
            <p>Tu Kit de la Herejía ha sido activado correctamente.</p>
            
            <div className="activation-actions">
              <button 
                onClick={handleDownloadKit}
                className="download-button"
              >
                Descargar Kit
              </button>
              
              <button 
                onClick={handleActivateKit}
                className="activate-button"
              >
                Ir a mi cuenta
              </button>
            </div>
            
            <div className="activation-notes">
              <p>
                Recuerda que ahora puedes invitar a otras personas a obtener su propio Kit 
                y comenzar a construir tu red.
              </p>
              <p>
                Tu donación es de libre asignación por parte de la Corporación para 
                sus actividades educativas y de investigación.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kit2Activation;