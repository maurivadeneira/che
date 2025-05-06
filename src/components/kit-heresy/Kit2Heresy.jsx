import React, { useState, useEffect } from 'react';
import './KitHeresy.css';
import './KitActivation.css';
import './OwnerSetup.css';
import KitActivation from './KitActivation.jsx';
import OwnerSetup from './OwnerSetup.jsx';

const Kit2Heresy = () => {
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
          name: "Kit2 de la Herejía",
          version: "1.0",
          corporationDonation: 20,
          referrerDonation: 7,
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
  
  // Función para activar directamente el Kit2
  const handleDirectActivation = () => {
    setShowActivation(true);
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
          <h1 className="kit-title">KIT2 DE LA HEREJÍA ECONÓMICA</h1>
          <h2 className="kit-subtitle">PROMOCIÓN PERSONALIZADA</h2>
          
          <div className="kit-direct-activation">
            <button 
              className="kit-activation-button-top"
              onClick={handleDirectActivation}
            >
              QUIERO MI KIT2 AHORA
            </button>
          </div>

          <div className="kit-section">
            <h2>1. INVITACIÓN PERSONAL</h2>
            <p>
              <strong>ESTA ES UNA INVITACIÓN PERSONAL QUE LE LLEGA DE:</strong><br />
              {kitInfo.remitente || "[NOMBRE DEL REMITENTE]"}
            </p>
            <p>
              <strong>Si decide adquirir el Kit2, deberá realizar una donación a:</strong><br />
              {kitInfo.beneficiario || "[NOMBRE DEL BENEFICIARIO DE LA DONACIÓN]"}
            </p>

            <div className="kit-flow-explanation">
              <h3>Flujo de Donaciones Explicado:</h3>
              <pre className="kit-diagram">
{`Cadena de Invitaciones:
X1 -----> Juan -----> Usted -----> María -----> Pedro1, Pedro2, Pedro3
     invita      invita      invita       invita

Flujo de Donaciones:
Usted dona a X1
María dona a Juan
Pedro1 dona a Usted
Pedro2 dona a Usted 
Pedro3 dona a Usted`}
              </pre>
              <p>Este esquema muestra claramente que:</p>
              <ol>
                <li>Usted dona a quien invitó a Juan (X1)</li>
                <li>María dona a quien invitó a Usted (Juan)</li>
                <li>Todos los "Pedros" (invitados por María) donan a quien invitó a María (Usted)</li>
                <li>Así, Usted recibirá múltiples donaciones de los invitados de su invitado</li>
              </ol>
            </div>
          </div>

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
                <div className="kit-section">
                  <h2>2. INTRODUCCIÓN AL KIT DE LA HEREJÍA</h2>
                  <p>
                    Bienvenido al Kit de la Herejía, un sistema basado en donaciones
                    que permite la distribución equitativa de conocimiento y valor en la sociedad.
                  </p>
                  <p>
                    <strong>Importante:</strong> El Kit de la Herejía solo puede ser adquirido por invitación
                    de alguien que ya lo haya obtenido anteriormente. No es posible adquirirlo directamente
                    de la Corporación, excepto por el autor original de la obra.      
                  </p>
                  <p>
                    Para obtener el kit completo, se requieren dos pagos:
                  </p>
                  <ul>
                    <li>Donación a la Corporación: US${kitInfo?.corporationDonation}</li>
                    <li>Donación al Referente: US${kitInfo?.referrerDonation} (a la persona indicada en este documento)</li>    
                  </ul>
                  <p>
                    <strong>Nota sobre pagos:</strong> Las donaciones se realizan en dólares estadounidenses (US$). 
                    Para residentes en Colombia, se aceptan pagos en pesos colombianos según la tasa de cambio 
                    del día de la transacción.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="kit-section">
                  <h2>3. CONTENIDO DEL KIT</h2>
                  <p>Al activar tu Kit, obtendrás acceso a:</p>
                  <ul className="kit-contents">
                    {kitInfo?.contents.map(item => (
                      <li key={item.id} className={`content-type-${item.type}`}>      
                        {item.title}
                        <span className="content-type">{item.type}</span>
                      </li>
                    ))}
                  </ul>
                  <p>Estos contenidos estarán disponibles permanentemente tras su activación.</p>
                </div>
              )}

              {step === 3 && (
                <div className="kit-section">
                  <h2>4. PROCESO DE DONACIÓN Y ACTIVACIÓN</h2>
                  
                  <h3>Primera Donación (US${kitInfo?.referrerDonation})</h3>
                  <p>
                    Esta donación se realiza a la persona indicada en este documento 
                    (no a quien te invitó, sino según el sistema de referidos).
                  </p>
                  
                  <div className="donation-info">
                    <h4>Información de Pago del Referente:</h4>
                    <p><strong>Nombre:</strong> [NOMBRE DEL REFERENTE]</p>
                    <p><strong>Banco Principal:</strong> [BANCO DEL REFERENTE]</p>
                    <p><strong>Cuenta Principal:</strong> [NÚMERO DE CUENTA DEL REFERENTE]</p>
                    
                    <h4>Métodos Alternativos de Pago (si no puede usar la cuenta principal):</h4>
                    <p><strong>Banco Alternativo:</strong> [BANCO ALTERNATIVO DEL REFERENTE]</p>
                    <p><strong>Cuenta Alternativa:</strong> [NÚMERO DE CUENTA ALTERNATIVA]</p>
                    <p><strong>PayPal:</strong> [EMAIL PAYPAL DEL REFERENTE]</p>
                    <p><strong>Otro método:</strong> [MÉTODO ADICIONAL SI EXISTE]</p>
                    
                    <p><strong>Valor:</strong> US${kitInfo?.referrerDonation} (o su equivalente en pesos colombianos según tasa del día)</p>
                    
                    <div className="payment-issues">
                      <h4>¿Problemas para realizar el pago?</h4>
                      <p>
                        Si no puede realizar la donación por ninguno de los métodos indicados, 
                        por favor contacte a la Corporación al correo [CORREO DE CONTACTO] para recibir asistencia.
                      </p>
                    </div>
                  </div>
                  
                  <h3>Segunda Donación (US${kitInfo?.corporationDonation})</h3>
                  <p>
                    La segunda donación se realiza a la Corporación Herejía Económica para mantener 
                    la plataforma y financiar nuevos proyectos. Esta donación es de libre aplicación 
                    por parte de la Corporación.
                  </p>
                  
                  <div className="donation-info">
                    <h4>Información de Pago:</h4>
                    <p><strong>Banco:</strong> [BANCO DE LA CORPORACIÓN]</p>
                    <p><strong>Cuenta:</strong> [NÚMERO DE CUENTA]</p>
                    <p><strong>Titular:</strong> Corporación Herejía Económica</p>
                    <p><strong>PayPal:</strong> [EMAIL PAYPAL]</p>
                    <p><strong>Valor:</strong> US${kitInfo?.corporationDonation} (o su equivalente en pesos colombianos según tasa del día)</p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="kit-section">
                  <h2>5. FUNCIONAMIENTO DEL SISTEMA</h2>
                  
                  <h3>Cómo Funciona el Ciclo de Donaciones</h3>
                  <p><strong>Ejemplo con nombres para mayor claridad:</strong></p>
                  <ol>
                    <li><strong>X1 invita a Juan</strong>, y Juan adquiere el Kit2.</li>
                    <li><strong>Juan le invita a Usted</strong>, y al adquirir el Kit2, Usted realiza una donación a X1.</li>
                    <li><strong>Usted invita a María</strong>, y cuando María adquiere el Kit2, ella dona a Juan.</li>
                    <li><strong>María invita a Pedro1, Pedro2 y Pedro3</strong>. Cuando ellos adquieren el Kit2, todos realizan sus donaciones a Usted.</li>
                  </ol>
                  
                  <div className="flow-summary">
                    <h4>Resumen del flujo de donaciones:</h4>
                    <ul>
                      <li>Usted no recibe donación de quien adquiere directamente su Kit2 (María)</li>
                      <li>Usted recibe donaciones de todas las personas que adquieran Kit2 de María (Pedro1, Pedro2, Pedro3)</li>
                      <li>Mientras más personas invite María, más donaciones recibirá Usted</li>
                      <li>Este sistema garantiza la distribución equitativa y sostenible a largo plazo</li>
                    </ul>
                  </div>
                  
                  <h3>Potencial de Ingresos</h3>
                  <p>
                    Depende de cuántos contactos inviten y cuántos de sus contactos adquieran el Kit2:
                  </p>
                  <ul>
                    <li>Si invita a 2 personas y cada una invita a 2 más = 4 donaciones de US${kitInfo?.referrerDonation} cada una</li>
                    <li>Si invita a 5 personas y cada una invita a 5 más = 25 donaciones de US${kitInfo?.referrerDonation} cada una</li>
                  </ul>
                  
                  <h3>Vigencia y Renovación</h3>
                  <ul>
                    <li>El Kit2 tendrá una vigencia de 12 meses (1 año) para ser promocionado</li>
                    <li>Si desea continuar promocionando después de ese tiempo, deberá adquirir nuevamente el Kit2</li>
                    <li><strong>Nota importante:</strong> La Corporación se reserva el derecho de modificar los valores de las donaciones cuando lo considere necesario, pero su Kit mantendrá los valores originales durante toda su vigencia.</li>
                  </ul>
                </div>
              )}

              {step === 5 && (
                <div>
                  <div className="kit-section">
                    <h2>6. FUNDAMENTOS ECONÓMICOS DEL SISTEMA</h2>
                    
                    <h3>La Importancia de la Circulación del Dinero</h3>
                    <p>El sistema se basa en principios económicos fundamentales como:</p>
                    <ol>
                      <li><strong>La circulación de dinero:</strong> Como enseñó Keynes, el movimiento constante del dinero es vital para una economía saludable.</li>
                      <li><strong>El ciclo económico:</strong> Igual que los ciclos naturales, la economía requiere flujos constantes y repetitivos.</li>
                      <li><strong>La distribución del ingreso:</strong> El sistema permite distribuir riqueza sin intermediarios bancarios tradicionales.</li>
                    </ol>
                  </div>
                  
                  <div className="kit-section">
                    <h2>7. ACTIVACIÓN DEL KIT</h2>
                    <p>Para activar su Kit2 y comenzar a recibir beneficios:</p>
                    <ol>
                      <li><strong>Haga clic en el botón "QUIERO MI KIT2"</strong> al inicio o al final de este documento</li>
                      <li><strong>Se le mostrará la información completa</strong> de la Corporación y la persona a quien debe realizar la donación</li>
                      <li><strong>Inscríbase en la página</strong> suministrando sus datos personales y bancarios</li>
                      <li><strong>Realice la donación solidaria</strong> a la persona referida (US${kitInfo?.referrerDonation})</li>
                      <li><strong>Envíe comprobante</strong> a la Corporación</li>
                      <li><strong>Realice la donación</strong> a la Corporación (US${kitInfo?.corporationDonation}) mediante el botón de pagos</li>
                      <li><strong>Reciba su Kit2 personalizado</strong> con los libros virtuales por correo</li>
                    </ol>
                  </div>
                  
                  <div className="kit-section">
                    <h2>8. REQUISITOS PARA PARTICIPAR</h2>
                    <ul>
                      <li><strong>Afiliación:</strong> Inscribirse en la página de la Corporación</li>
                      <li><strong>Datos personales:</strong> Nombres, identificación, contacto</li>
                      <li><strong>Cuentas bancarias:</strong> Principal y alternativa para recibir donaciones</li>
                      <li><strong>Compromiso:</strong> Hacer las donaciones correspondientes y promover el sistema</li>
                    </ul>
                  </div>
                  
                  <div className="kit-section">
                    <h2>9. BENEFICIOS PARA TODOS</h2>
                    <ul>
                      <li><strong>Para usted:</strong> Ingreso extra mensual, conocimiento económico transformador</li>
                      <li><strong>Para la Corporación:</strong> Recursos para desarrollar proyectos económicos y sociales</li>
                      <li><strong>Para el gobierno:</strong> Impuestos y actividad económica legal</li>
                      <li><strong>Para la sociedad:</strong> Nuevo sistema de distribución equitativa del ingreso</li>
                    </ul>
                    <p>Este es un sistema GANA-GANA donde todos los participantes obtienen beneficios.</p>
                  </div>
                  
                  <div className="kit-info-box">
                    <h3>¡QUIERO MI KIT2!</h3>
                    <p>Si está de acuerdo con este sistema y desea participar:</p>

                    <div className="action-buttons-container">
                      <button
                        className="kit-activation-button"
                        onClick={() => setShowActivation(true)}
                      >
                        QUIERO MI KIT2, PROMOCIÓN PERSONALIZADA
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
                      Al hacer clic, se desplegará la información completa de pago tanto de la Corporación como de la persona a la que debe realizar la donación, junto con el formulario de registro.
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
          
          <div className="kit-footer">
            <p><strong>CORPORACIÓN HEREJÍA ECONÓMICA</strong><br/>
            <strong>C.H.E. MUNDO LIBRE</strong></p>
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
                  Cuando alguien haga clic en este enlace, será dirigido directamente 
                  al formulario de registro.
                  {ownerInfo && ' Las donaciones secundarias se dirigirán a la cuenta 
                  que has proporcionado.'}
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

export default Kit2Heresy;