import React, { useState, useEffect } from 'react';
import './KitHeresy.css';
import './KitActivation.css';
import './OwnerSetup.css';
import KitActivation from './KitActivation.jsx';
import OwnerSetup from './OwnerSetup.jsx';

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
        const response = await fetch('http://localhost:3001/api/kit-info');
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
          name: "Kit2 de la Herejía Económica",
          version: "2.0",
          corporationDonation: 20,
          referrerDonation: 5,
          kitValidityDays: 365,
          contents: [
            { id: 1, title: "Guía completa del Sistema Kit2", type: "document" },
            { id: 2, title: "Educación Financiera Familiar paso a paso", type: "video" },
            { id: 3, title: "E-book: La Herejía Económica - Edición Kit2", type: "ebook" },
            { id: 4, title: "Plantillas para cuentas bancarias familiares", type: "document" },
            { id: 5, title: "Curso: PayPal para toda la familia", type: "video" },
            { id: 6, title: "Fondos Rotatorios - Implementación práctica", type: "document" }
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
    return <div className="kit-loading">Cargando información del Kit2...</div>;
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
          <h1 className="kit-title">Sistema Kit2 - La Herejía Económica</h1>
          
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
                  <h2>¿Qué es el Sistema Kit2?</h2>
                  <p>
                    <strong>Kit2</strong> es un sistema genérico que puede ser utilizado por cualquier autor 
                    para distribuir su conocimiento de manera justa y educativa. Este Kit2 específico 
                    contiene <strong>"La Herejía Económica"</strong>, pero el mismo sistema puede adaptarse 
                    a otros autores como Pietro Krespy, o cualquier creador de contenido.
                  </p>
                  <div className="highlight-box">
                    <h3>🎯 Educación Financiera Familiar</h3>
                    <p>
                      Kit2 no es solo una plataforma de distribución, es una herramienta de 
                      <strong> educación financiera intergeneracional</strong>. Los padres ayudan a 
                      sus hijos a abrir sus primeras cuentas bancarias y PayPal, construyendo 
                      capital para estudios futuros mientras aprenden el funcionamiento del dinero digital.
                    </p>
                  </div>
                  <p>
                    <strong>Principio fundamental:</strong> Solo se puede acceder al Kit2 por invitación 
                    de alguien que ya forme parte del sistema, creando una red de conocimiento 
                    distribuida y educativa.
                  </p>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h2>Sistema A, B, C, D - Flujo de Donaciones</h2>
                  <div className="donation-flow-explanation">
                    <h3>📊 Cómo Funcionan las Donaciones</h3>
                    <div className="flow-diagram">
                      <p><strong>A</strong> invita a <strong>B</strong></p>
                      <p><strong>B</strong> invita a <strong>C</strong></p>
                      <p><strong>C</strong> invita a <strong>D</strong></p>
                      <p style={{color: '#e74c3c', fontWeight: 'bold'}}>
                        🎯 <strong>D</strong> dona a <strong>B</strong> (dos niveles hacia atrás)
                      </p>
                      <p style={{color: '#e74c3c', fontWeight: 'bold'}}>
                        🎯 <strong>C</strong> dona a <strong>A</strong> (dos niveles hacia atrás)
                      </p>
                    </div>
                    <div className="system-benefits">
                      <h4>Beneficios del Sistema:</h4>
                      <ul>
                        <li><strong>Sostenibilidad:</strong> Cada persona recibe donaciones de dos niveles más adelante</li>
                        <li><strong>Educación:</strong> Las familias aprenden sobre flujos de dinero digital</li>
                        <li><strong>Capital familiar:</strong> Se construye dinero para estudios futuros</li>
                        <li><strong>Red segura:</strong> Múltiples conexiones evitan que se rompa la cadena</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <h2>Estructura de Pagos</h2>
                  <div className="payment-structure">
                    <div className="donation-section">
                      <h3>💰 Donaciones (Modelo A,B,C,D)</h3>
                      <ul>
                        <li><strong>Donación Principal:</strong> US${kitInfo?.corporationDonation} a la Corporación Herejía Económica</li>
                        <li><strong>Donación Familiar:</strong> US${kitInfo?.referrerDonation} a la persona dos niveles atrás</li>
                      </ul>
                    </div>
                    
                    <div className="sales-section">
                      <h3>📚 Ventas de Libros Físicos</h3>
                      <p>
                        <strong>100% de las ventas van a la Corporación Herejía Económica</strong>
                      </p>
                      <p>
                        El autor recibe entre 10-30% según acuerdos específicos. 
                        Esta estructura permite reinvertir en el desarrollo del sistema 
                        y mantener la plataforma operativa.
                      </p>
                    </div>

                    <div className="education-focus">
                      <h3>🎓 Enfoque Educativo</h3>
                      <p>
                        Las donaciones son herramientas de aprendizaje. Los padres enseñan 
                        a sus hijos a usar PayPal, abrir cuentas bancarias, y entender 
                        conceptos de dinero digital mientras construyen capital real.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div>
                  <h2>Educación Financiera Intergeneracional</h2>
                  <div className="family-education">
                    <h3>👨‍👩‍👧‍👦 El Poder del Aprendizaje Familiar</h3>
                    <div className="generation-flow">
                      <div className="generation">
                        <h4>Abuelos 👴👵</h4>
                        <p>Aportan sabiduría y capital inicial. Ven crecer el patrimonio familiar digital.</p>
                      </div>
                      <div className="arrow">⬇️</div>
                      <div className="generation">
                        <h4>Padres 👨‍👩</h4>
                        <p>Facilitan cuentas bancarias y PayPal. Enseñan responsabilidad financiera.</p>
                      </div>
                      <div className="arrow">⬇️</div>
                      <div className="generation">
                        <h4>Hijos 👧👦</h4>
                        <p>Aprenden dinero digital desde temprana edad. Construyen capital para sus estudios.</p>
                      </div>
                    </div>
                    
                    <div className="paypal-learning">
                      <h3>💳 PayPal como Universidad Financiera</h3>
                      <ul>
                        <li><strong>Primer contacto:</strong> Los niños aprenden a recibir y enviar dinero</li>
                        <li><strong>Responsabilidad:</strong> Entienden que el dinero real tiene consecuencias reales</li>
                        <li><strong>Ahorro digital:</strong> Acumulan fondos para gastos educativos futuros</li>
                        <li><strong>Red familiar:</strong> Toda la familia participa en el crecimiento económico</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 5 && (
                <div>
                  <h2>Activación y Visión Futura</h2>
                  <div className="activation-vision">
                    <h3>🚀 Casos de Uso Múltiples</h3>
                    <div className="use-cases">
                      <div className="case">
                        <strong>Kit2 de La Herejía Económica</strong>
                        <p>Sistema económico alternativo y educación financiera</p>
                      </div>
                      <div className="case">
                        <strong>Kit2 de Pietro Krespy</strong>
                        <p>Próximo autor que adoptará el sistema para su contenido</p>
                      </div>
                      <div className="case">
                        <strong>Kit2 Genérico</strong>
                        <p>Cualquier autor puede usar esta infraestructura</p>
                      </div>
                    </div>

                    <h3>🔄 Fondos Rotatorios</h3>
                    <p>
                      Al final del proceso, cuando el sistema madure, se implementarán 
                      <strong> fondos rotatorios familiares</strong> donde el capital acumulado 
                      por las familias se reinvierta en educación y crecimiento conjunto.
                    </p>

                    <h3>📈 Estrategia Recomendada</h3>
                    <p>
                      Se recomienda que las familias registren múltiples cuentas (padres, hijos mayores) 
                      para crear redundancia en el sistema y maximizar las oportunidades de aprendizaje 
                      y generación de capital educativo.
                    </p>
                    
                    <div className="kit-info-box">
                      <h3>💡 ¿Listo para Comenzar?</h3>
                      <p>
                        Estás viendo información sobre el Kit2 de La Herejía Económica. 
                        Para acceder al sistema completo, necesitas ser invitado por una 
                        familia que ya esté participando, o ser el propietario original.
                      </p>
                      
                      <div className="action-buttons-container">
                        <button 
                          className="kit-activation-button" 
                          onClick={() => setShowActivation(true)}
                        >
                          🎯 QUIERO MI KIT2
                        </button>
                        
                        <div className="separator">O</div>
                        
                        <button 
                          className="kit-owner-button" 
                          onClick={handleOwnerSetupClick}
                        >
                          📚 SOY EL PROPIETARIO DE LA OBRA
                        </button>
                      </div>
                      
                      <p className="activation-note">
                        Si tu familia ha recibido una invitación, haz clic en "QUIERO MI KIT2". 
                        Si eres el autor original, haz clic en "SOY EL PROPIETARIO DE LA OBRA".
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="kit-navigation">
              {step > 1 && (
                <button className="kit-prev-button" onClick={prevStep}>
                  ← Anterior
                </button>
              )}
              {step < 5 && (
                <button className="kit-next-button" onClick={nextStep}>
                  Siguiente →
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
              <h2>🎉 Kit2 Activado Exitosamente</h2>
              <div className="activation-details">
                <p><strong>Nombre:</strong> {activationInfo.name}</p>
                <p><strong>Email:</strong> {activationInfo.email}</p>
                <p><strong>Fecha de Activación:</strong> {new Date(activationInfo.activationDate).toLocaleDateString()}</p>
                {ownerInfo && <p><strong>Propietario Original:</strong> Sí</p>}
              </div>
              
              <div className="invitation-box">
                <h3>👨‍👩‍👧‍👦 Invita a Más Familias</h3>
                <p>Comparte este enlace único para invitar a otras familias al sistema de educación financiera:</p>
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
                    📋 Copiar
                  </button>
                </div>
                <p className="invitation-note">
                  Cuando una familia haga clic en este enlace, será dirigida al formulario de registro del Kit2.
                  {ownerInfo && ' Las donaciones familiares se dirigirán automáticamente a tu cuenta registrada.'}
                </p>
              </div>
              
              {ownerInfo && (
                <div className="owner-payment-info">
                  <h3>💳 Información de Pago Registrada</h3>
                  <p>Esta información será utilizada para las donaciones familiares del sistema A,B,C,D:</p>
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
                ← Volver a la Información del Kit2
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