// Archivo: src/components/ActivateKit.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentPreferencesForm from './PaymentPreferencesForm';
import PaymentConfirmation from './PaymentConfirmation';
import './ActivateKit.css';

const ActivateKit = () => {
  const { kitId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [kit, setKit] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener información del usuario logueado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/user');
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          // Redirigir al login si no hay sesión
          navigate('/login', { state: { returnUrl: `/activate-kit/${kitId}` } });
        }
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        navigate('/login', { state: { returnUrl: `/activate-kit/${kitId}` } });
      }
    };
    
    fetchUserData();
  }, [kitId, navigate]);
  
  // Obtener información del kit
  useEffect(() => {
    const fetchKitData = async () => {
      if (!kitId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/kits/${kitId}`);
        if (response.data.success) {
          setKit(response.data.data);
        } else {
          setError('Kit no encontrado');
        }
      } catch (err) {
        setError('Error al cargar información del kit');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchKitData();
  }, [kitId]);
  
  // Manejar selección de preferencias de pago
  const handlePaymentPreferences = (data) => {
    setPaymentData(data);
    setCurrentStep(2);
  };
  
  // Manejar confirmación de pago
  const handlePaymentConfirmation = () => {
    setCurrentStep(3);
  };
  
  if (loading && !kit) {
    return <div className="loading">Cargando información del kit...</div>;
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
  
  return (
    <div className="activate-kit-container">
      <h1>Activación del Kit2</h1>
      
      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-title">Preferencias de Pago</div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-title">Realizar Donaciones</div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-title">Activación Completada</div>
        </div>
      </div>
      
      {currentStep === 1 && user && kit && (
        <div className="step-content">
          <div className="kit-info">
            <h2>Información del Kit2</h2>
            <p><strong>ID:</strong> {kit.kitId}</p>
            <p><strong>Propietario:</strong> {kit.ownerName}</p>
            <p><strong>Beneficiario:</strong> {kit.beneficiaryName}</p>
          </div>
          
          <PaymentPreferencesForm 
            userId={user._id} 
            kitId={kit._id} 
            onSubmit={handlePaymentPreferences} 
          />
        </div>
      )}
      
      {currentStep === 2 && paymentData && (
        <div className="step-content">
          <PaymentConfirmation 
            paymentData={paymentData}
            kit={kit}
            user={user}
            onComplete={handlePaymentConfirmation}
          />
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="step-content">
          <div className="success-message">
            <h2>¡Felicidades!</h2>
            <p>Su solicitud de activación del Kit2 ha sido recibida correctamente.</p>
            <p>Una vez verificadas las donaciones, recibirá su Kit2 activo en el correo electrónico registrado.</p>
            
            <button onClick={() => navigate('/dashboard')} className="primary-button">
              Ir a mi Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivateKit;