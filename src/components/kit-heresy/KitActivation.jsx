import React, { useState, useEffect } from 'react';
import { useKit } from '../../context/KitContext';

const KitActivation = ({ onActivationComplete }) => {
  const { kitData, updateBeneficiary } = useKit();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('personal'); // 'personal', 'donations', 'success'
  const [referrer, setReferrer] = useState('');
  
  // Obtener información de quien invitó desde la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const invitedBy = urlParams.get('invited_by');
    if (invitedBy) {
      setReferrer(invitedBy);
      updateBeneficiary({ referrer: invitedBy });
    }
  }, [updateBeneficiary]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBeneficiary({ [name]: value });
  };
  
  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    if (!kitData.beneficiary.name || !kitData.beneficiary.email) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    if (!kitData.beneficiary.email.includes('@') || !kitData.beneficiary.email.includes('.')) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    
    setStep('donations');
    setError('');
  };
  
  const handleDonationsConfirm = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulamos verificación de donaciones
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
      
      // Actualizamos la fecha de activación en el contexto
      updateBeneficiary({
        activationDate: new Date().toISOString(),
        referrer: referrer || 'directo',
        isBeneficiary: true
      });
      
      // Notificamos que la activación está completa
      if (onActivationComplete) {
        onActivationComplete(kitData.beneficiary);
      }
    }, 1500);
  };
  
  return (
    <div className="kit-activation-container">
      <h2>Activación del Kit de la Herejía</h2>
      
      {error && (
        <div className="kit-error-message">
          {error}
        </div>
      )}
      
      {step === 'personal' && (
        <form onSubmit={handlePersonalInfoSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre Completo:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={kitData.beneficiary.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={kitData.beneficiary.email || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="consent-box">
            <input type="checkbox" id="consent" required />
            <label htmlFor="consent">
              Declaro que me afilio libre y espontáneamente al sistema del Kit de la Herejía y acepto sus términos.
            </label>
          </div>
          
          <button type="submit" className="kit-action-button">
            Continuar
          </button>
        </form>
      )}
      
      {step === 'donations' && (
        <form onSubmit={handleDonationsConfirm}>
          <h3>Confirmación de Donaciones</h3>
          
          <div className="donation-verification">
            <div className="donation-item">
              <h4>Donación a la Corporación (US$20)</h4>
              <div className="file-upload">
                <label>
                  Comprobante de pago:
                  <input type="file" accept="image/*,.pdf" required />
                </label>
              </div>
            </div>
            
            <div className="donation-item">
              <h4>Donación al Referente (US$5)</h4>
              <div className="file-upload">
                <label>
                  Comprobante de pago:
                  <input type="file" accept="image/*,.pdf" required />
                </label>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="kit-action-button"
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'Confirmar Donaciones'}
          </button>
        </form>
      )}
      
      {step === 'success' && (
        <div className="activation-success">
          <div className="success-icon">✓</div>
          <h3>¡Activación Exitosa!</h3>
          <p>
            Tu Kit de la Herejía ha sido activado correctamente. Ahora puedes comenzar
            a compartir el conocimiento y crear valor en la comunidad.
          </p>
          
          <p className="success-message">
            Ya puedes generar tu enlace de invitación personalizado para compartir con otras personas.
            Simplemente haz clic en "Volver" para ver tu enlace único.
          </p>
          
          <button className="kit-action-button" onClick={() => window.location.reload()}>
            Acceder a Mi Kit
          </button>
        </div>
      )}
    </div>
  );
};

export default KitActivation;