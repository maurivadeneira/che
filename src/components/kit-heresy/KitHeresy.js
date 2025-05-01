import React, { useState, useEffect } from 'react';
import './KitHeresy.css';
import './KitActivation.css';
import './OwnerSetup.css';
import KitActivation from './KitActivation.js';
import OwnerSetup from './OwnerSetup.js';

const KitHeresy = () => {
  // Estados
  const [kitInfo, setKitInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [showActivation, setShowActivation] = useState(false);
  const [activationInfo, setActivationInfo] = useState(null);
  const [invitationLink, setInvitationLink] = useState('');
  const [showOwnerSetup, setShowOwnerSetup] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);
  
  // Efecto para cargar datos del kit y verificar si hay una invitación activa
  useEffect(() => {
    // Verificar si hay un parámetro de invitación en la URL
    const checkInvitation = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const invitedBy = urlParams.get('invited_by');
      if (invitedBy) {
        setShowActivation(true);
      }
    };

    const fetchKitInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/kit-info');
        if (!response.ok) {
          throw new Error('Error al cargar información del Kit');
        }
        const data = await response.json();
        setKitInfo(data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudo cargar la información del Kit. Usando datos locales.');
        // Datos de respaldo en caso de error
        setKitInfo({
          name: "Kit de la Herejía",
          version: "1.0",
          corporationDonation: 20,
          referrerDonation: 5,
          kitValidityDays: 365,
          contents: [
            { id: 1, title: "Guía de iniciación a la Herejía Económica", type: "document" },
            { id: 2, title: "Vídeo explicativo del sistema económico", type: "video" },
            { id: 3, title: "E-book: Fundamentos de la Herejía Económica", type: "ebook" },
            { id: 4, title: "Curso introductorio a los fondos rotatorios", type: "document" },
            { id: 5, title: "Documentos de implementación práctica", type: "document" }
          ]
        });
        setLoading(false);
      }
    };
    
    fetchKitInfo();
    checkInvitation();
  }, []);
  
  // Generar enlace de invitación
  useEffect(() => {
    if (activationInfo) {
      // Generar un ID único para esta invitación basado en el nombre del usuario 
      // (simplificado para esta demo, en producción usaríamos un ID más seguro)
      const invitationId = activationInfo.name.replace(/\s+/g, '').toLowerCase() + '_' + Date.now();
      const baseUrl = window.location.origin + window.location.pathname;
      setInvitationLink(`${baseUrl}?invited_by=${invitationId}`);
    }
  }, [activationInfo]);
  
  // Agregar botón para la configuración del propietario en el paso 5
  const handleOwnerSetupClick = () => {
    setShowOwnerSetup(true);
  };

  // Manejar la finalización de la configuración del propietario
  const handleOwnerSetupComplete = (data) => {
    setOwnerInfo(data);
    // Generar un enlace único para el propietario
    const ownerInvitationId = `owner_${data.name.replace(/\s+/g, '').toLowerCase()}_${Date.now()}`;
    const baseUrl = window.location.origin + window.location.pathname;
    setInvitationLink(`${baseUrl}?invited_by=${ownerInvitationId}&owner=true`);
    setShowOwnerSetup(false);
  };
  
  // Función para avanzar en el wizard
  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };
  
  // Función para retroceder en el wizard
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Función para copiar el enlace de invitación al portapapeles
  const copyInvitationLink = () => {
    navigator.clipboard.writeText(invitationLink)
      .then(() => {
        alert('Enlace copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar enlace:', err);
      });
  };
  
  // Renderizar un estado de carga
  if (loading) {
    return <div className="kit-loading">Cargando información del Kit...</div>;
  }
  
  // Renderizar mensaje de error si hay problemas
  if (error) {
    console.warn(error);
  }
  
  // Si estamos en la configuración del propietario
  if (showOwnerSetup) {
    return <OwnerSetup onSetupComplete={handleOwnerSetupComplete} />;
  }
  
  return (
    <div className="kit-heresy-container">
      {!showActivation ? (
        <>
          <h1 className="kit-title">Kit de la Herejía</h1>
          
          {/* Wizard de pasos */}
          <div className="kit-wizard">
            <div className="kit-steps">
              {[1, 2, 3, 4, 5].map(s => (
                <div 
                  key={s} 
                  className={`kit-step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
                >
                  {s}
                </div>
              ))}
            </div>
            
            <div className="kit-step-content">
              {step === 1 && (
                <div>
                  <h2>Introducción al Kit de la Herejía</h2>
                  <p>
                    Bienvenido al Kit de la Herejía, un sistema basado en donaciones
                    que permite la distribución equitativa de conocimiento y valor.
                  </p>
                  <p>
                    <strong>Importante:</strong> El Kit de la Herejía solo puede ser adquirido por invitación
                    de alguien que ya lo haya obtenido anteriormente. No es posible adquirirlo directamente 
                    de la Corporación, excepto por el autor original de la obra.
                  </p>
                  <p>
                    Para obtener el kit completo, se requieren dos donaciones:
                  </p>
                  <ul>
                    <li>Donación a la Corporación: US${kitInfo?.corporationDonation}</li>
                    <li>Donación al Referente: US${kitInfo?.referrerDonation}</li>
                  </ul>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h2>Contenido del Kit</h2>
                  <p>Al activar tu Kit, obtendrás acceso a:</p>
                  <ul className="kit-contents">
                    {kitInfo?.contents.map(item => (
                      <li key={item.id} className={`content-type-${item.type}`}>
                        {item.title}
                        <span className="content-type">{item.type}</span>
                      </li>
                    ))}
                  </ul>
                  <p>Estos contenidos estarán disponibles por {kitInfo?.kitValidityDays} días desde la activación.</p>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <h2>Primera Donación</h2>
                  <p>
                    La primera donación de US${kitInfo?.corporationDonation} se realiza a la Corporación
                    para mantener la plataforma y financiar nuevos proyectos.
                  </p>
                  <p>
                    Estas donaciones son de libre aplicación por parte de la Corporación, destinadas
                    a los proyectos más relevantes que esté desarrollando en su momento, incluyendo
                    los costos de su propia administración y operación.
                  </p>
                  <div className="donation-info">
                    <h3>Información de Pago:</h3>
                    <p>Banco: Banco Ejemplo</p>
                    <p>Cuenta: 123-456-789</p>
                    <p>Titular: Corporación Kit de la Herejía</p>
                    <p><strong>PayPal:</strong> kit@herejia.org</p>
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div>
                  <h2>Segunda Donación</h2>
                  <p>
                    La segunda donación de US${kitInfo?.referrerDonation} se realiza NO a quien te 
                    ofreció el Kit, sino a la persona que le ofreció el Kit a tu referidor.
                  </p>
                  <p>
                    Este sistema crea una red de distribución donde los beneficios
                    fluyen a través de la comunidad de manera equitativa.
                  </p>
                </div>
              )}
              
              {step === 5 && (
                <div>
                  <h2>Activación y Distribución</h2>
                  <p>
                    <strong>Proceso de activación:</strong> Cuando alguien te invite a formar parte del sistema,
                    recibirás un enlace único que te llevará directamente al formulario de registro.
                    Solo necesitas completar tus datos y confirmar las donaciones para activar tu Kit.
                  </p>
                  <p>
                    <strong>Uso de las donaciones:</strong> Las donaciones recibidas por la Corporación
                    serán destinadas a los proyectos más relevantes que se estén desarrollando en cada momento,
                    incluyendo costos administrativos y operativos necesarios para mantener el sistema.
                  </p>
                  <p>
                    <strong>Estrategia recomendada:</strong> Se recomienda registrar más de una cuenta en el sistema.
                    Esto permite que, si una cuenta se estanca o se cierra por cualquier motivo, no se detenga
                    el flujo de donaciones para otras personas en la cadena. Esta práctica beneficia a toda
                    la comunidad al mantener activo el sistema de distribución.
                  </p>
                  <p>
                    Recuerda que no recibirás donaciones directamente de las personas
                    a quienes ofrezcas el Kit, sino de quienes ellos refieran, creando así
                    una cadena de valor sostenible.
                  </p>
                  <div className="kit-info-box">
                    <h3>Esperando invitación</h3>
                    <p>Actualmente estás viendo información sobre el Kit de la Herejía. Para obtenerlo,
                    necesitas ser invitado por alguien que ya posea el Kit. Esta persona te enviará
                    un enlace único para activar tu registro.</p>
                    
                    <div className="action-buttons-container">
                      <button 
                        className="kit-activation-button" 
                        onClick={() => setShowActivation(true)}
                      >
                        QUIERO MI KIT2
                      </button>
                      
                      <div className="separator">O</div>
                      
                      <button 
                        className="kit-owner-button" 
                        onClick={handleOwnerSetupClick}
                      >
                        SOY EL PROPIETARIO DE LA OBRA
                      </button>
                    </div>
                    
                    <p className="activation-note">
                      Si has recibido una invitación, haz clic en "QUIERO MI KIT2". 
                      Si eres el propietario original, haz clic en "SOY EL PROPIETARIO DE LA OBRA".
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="kit-navigation">
              {step > 1 && (
                <button className="kit-prev-button" onClick={prevStep}>
                  Anterior
                </button>
              )}
              {step < 5 && (
                <button className="kit-next-button" onClick={nextStep}>
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Componente de activación cuando se muestra */}
          {activationInfo ? (
            <div className="kit-activated-info">
              <h2>Kit Activado Exitosamente</h2>
              <div className="activation-details">
                <p><strong>Nombre:</strong> {activationInfo.name}</p>
                <p><strong>Email:</strong> {activationInfo.email}</p>
                <p><strong>Fecha de Activación:</strong> {new Date(activationInfo.activationDate).toLocaleDateString()}</p>
                {ownerInfo && <p><strong>Propietario:</strong> Sí</p>}
              </div>
              
              <div className="invitation-box">
                <h3>Invita a más Personas</h3>
                <p>Comparte este enlace único para invitar a otras personas al sistema:</p>
                <div className="invitation-link-container">
                  <input 
                    type="text" 
                    value={invitationLink} 
                    readOnly 
                    className="invitation-link-input" 
                  />
                  <button 
                    className="copy-link-button"
                    onClick={copyInvitationLink}
                  >
                    Copiar
                  </button>
                </div>
                <p className="invitation-note">
                  Cuando alguien haga clic en este enlace, será dirigido directamente al formulario de registro.
                  {ownerInfo && ' Las donaciones secundarias se dirigirán a la cuenta que has proporcionado.'}
                </p>
              </div>
              
              {ownerInfo && (
                <div className="owner-payment-info">
                  <h3>Información de Pago Registrada</h3>
                  <p>Esta información será utilizada para las donaciones secundarias:</p>
                  <div className="payment-details">
                    <p><strong>Titular:</strong> {ownerInfo.paymentInfo.accountName}</p>
                    <p><strong>Cuenta:</strong> {ownerInfo.paymentInfo.accountNumber}</p>
                    <p><strong>Banco:</strong> {ownerInfo.paymentInfo.bank}</p>
                    {ownerInfo.paymentInfo.paypalEmail && (
                      <p><strong>PayPal:</strong> {ownerInfo.paymentInfo.paypalEmail}</p>
                    )}
                  </div>
                </div>
              )}
              
              <button className="kit-back-button" onClick={() => setShowActivation(false)}>
                Volver a la Información del Kit
              </button>
            </div>
          ) : (
            <KitActivation onActivationComplete={(info) => {
              setActivationInfo(info);
            }} />
          )}
        </>
      )}
    </div>
  );
};

export default KitHeresy;