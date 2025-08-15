import React, { useState } from 'react';

const KitHeresy = () => {
  const [activeSection, setActiveSection] = useState('que-es');

  const sections = [
    { id: 'que-es', title: '¿Qué es el Sistema Kit2?' },
    { id: 'como-funciona', title: 'Cómo Funciona el Sistema' },
    { id: 'educacion-financiera', title: 'Educación Financiera Familiar' },
    { id: 'beneficios', title: 'Beneficios para Toda la Familia' },
    { id: 'transparencia', title: 'Transparencia y Legalidad' },
    { id: 'ejemplos', title: 'Ejemplos Prácticos' },
    { id: 'preguntas', title: 'Preguntas Frecuentes' },
    { id: 'como-empezar', title: 'Cómo Empezar' }
  ];

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #2a0845, #b02a91)',
    color: 'white',
    padding: '40px 20px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '30px'
  };

  const navStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
    justifyContent: 'center'
  };

  const navButtonStyle = (isActive) => ({
    padding: '10px 15px',    
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? '#b02a91' : '#f0f0f0',
    color: isActive ? 'white' : '#333',
    border: isActive ? '2px solid #b02a91' : '2px solid transparent'
  });

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const highlightBoxStyle = {
    background: 'linear-gradient(135deg, #e8f4f8, #d1ecf1)',
    border: '2px solid #b02a91',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px 0'
  };

  const flowDiagramStyle = {
    background: '#f8f9fa',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
    margin: '15px 0',
    textAlign: 'center'
  };

  const generationStyle = {
    background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
    border: '2px solid #b02a91',
    borderRadius: '8px',
    padding: '15px',
    margin: '10px 0',
    textAlign: 'center'
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'que-es':
        return (
          <div style={sectionStyle}>
            <h2 style={{color: '#b02a91', fontSize: '2.5em', marginBottom: '20px'}}>¿QUÉ ES EL SISTEMA KIT2?</h2>
            
            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>Una Revolución en Educación Financiera Familiar</h3>
            <p style={{fontSize: '1.1em', marginBottom: '20px'}}>
              Kit2 es un potente sistema innovador que combina tres elementos poderosos:
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '20px 0'}}>
              <div style={{...highlightBoxStyle, textAlign: 'center'}}>
                <h4 style={{color: '#b02a91'}}>📚 Distribución de Obras Digitales de Calidad</h4>
              </div>
              <div style={{...highlightBoxStyle, textAlign: 'center'}}>
                <h4 style={{color: '#b02a91'}}>👨‍👩‍👧‍👦 Educación Financiera Intergeneracional</h4>
              </div>
              <div style={{...highlightBoxStyle, textAlign: 'center'}}>
                <h4 style={{color: '#b02a91'}}>💰 Generación de Ingresos Adicionales Familiares</h4>
              </div>
            </div>

            <div style={highlightBoxStyle}>
              <h3 style={{color: '#2a0845'}}>🎯 Más que un Producto, es una Herramienta Educativa</h3>
              <p>Kit2 permite que las familias aprendan juntas sobre:</p>
              <ul style={{listStyle: 'none', padding: '0'}}>
                <li style={{margin: '10px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                  💳 Manejo de dinero digital (PayPal, transferencias bancarias)
                </li>
                <li style={{margin: '10px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                  💵 Conceptos de ahorro y construcción de capital
                </li>
                <li style={{margin: '10px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                  🚀 Habilidades emprendedoras desde temprana edad
                </li>
                <li style={{margin: '10px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                  🌱 Sistemas económicos alternativos y sostenibles
                </li>
              </ul>
            </div>

            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>Para Cualquier Tipo de Autor</h3>
            <p>El sistema Kit2 es genérico y adaptable para:</p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', margin: '20px 0'}}>
              {[
                '✍️ Escritores y autores',
                '🎤 Conferenciantes y coaches', 
                '🔬 Investigadores y académicos',
                '💻 Creadores de contenido digital',
                '🎓 Expertos en cualquier área'
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid #dee2e6',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );

      case 'como-funciona':
        return (
          <div style={sectionStyle}>
            <h2 style={{color: '#b02a91', fontSize: '2.5em', marginBottom: '20px'}}>CÓMO FUNCIONA EL SISTEMA</h2>
            
            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>El Flujo A → B → C → D</h3>
            <p>Imaginemos una secuencia simple donde cada letra representa a una persona:</p>
            
            <div style={flowDiagramStyle}>
              <div style={{fontSize: '1.3em', fontWeight: 'bold', margin: '10px 0'}}>
                <span style={{color: '#b02a91'}}>A (Iniciador)</span> → invita a → <span style={{color: '#b02a91'}}>B</span>
              </div>
              <div style={{fontSize: '1.3em', fontWeight: 'bold', margin: '10px 0'}}>
                <span style={{color: '#b02a91'}}>B</span> → invita a → <span style={{color: '#b02a91'}}>C</span>
              </div>
              <div style={{fontSize: '1.3em', fontWeight: 'bold', margin: '10px 0'}}>
                <span style={{color: '#b02a91'}}>C</span> → invita a → <span style={{color: '#b02a91'}}>D</span>
              </div>
            </div>

            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>Sistema de Donaciones Cruzadas</h3>
            <p>Aquí está la magia del sistema:</p>
            
            <div style={{...highlightBoxStyle, textAlign: 'center'}}>
              <div style={{fontSize: '1.5em', fontWeight: 'bold', color: '#e74c3c', margin: '15px 0'}}>
                🎯 <strong>C</strong> dona a <strong>A</strong> (dos niveles hacia atrás)
              </div>
              <div style={{fontSize: '1.5em', fontWeight: 'bold', color: '#e74c3c', margin: '15px 0'}}>
                🎯 <strong>D</strong> dona a <strong>B</strong> (dos niveles hacia atrás)
              </div>
            </div>

            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>¿Qué Recibe Cada Persona?</h3>
            <p>Al participar en Kit2, cada persona recibe:</p>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', margin: '20px 0'}}>
              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>📚 Obras Digitales Completas del Autor</h4>
                <ul>
                  <li>Libros, videos, cursos</li>
                  <li>Material educativo de alta calidad</li>
                  <li>Contenido exclusivo y valioso</li>
                </ul>
              </div>
              
              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>🎯 Kit2 Personalizado</h4>
                <ul>
                  <li>Con su nombre como distribuidor</li>
                  <li>Herramienta para invitar a otros</li>
                  <li>Su propio "negocio" educativo familiar</li>
                </ul>
              </div>
            </div>

            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>Estructura de Pagos Transparente</h3>
            <p>Cada participación requiere dos pagos separados:</p>
            
            <div style={flowDiagramStyle}>
              <div style={{fontSize: '1.2em', margin: '10px 0'}}>
                💰 <strong>US$x</strong> → Donación solidaria a persona designada por el sistema
              </div>
              <div style={{fontSize: '1.2em', margin: '10px 0'}}>
                🏢 <strong>US$y</strong> → Pago del Kit2 a la Corporación
              </div>
              <div style={{fontSize: '1.3em', fontWeight: 'bold', color: '#b02a91', margin: '15px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                📊 <strong>Total: US$x+y</strong>
              </div>
            </div>
          </div>
        );

      case 'educacion-financiera':
        return (
          <div style={sectionStyle}>
            <h2 style={{color: '#b02a91', fontSize: '2.5em', marginBottom: '20px'}}>EDUCACIÓN FINANCIERA FAMILIAR</h2>
            
            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>Preparación Familiar Integral</h3>
            <p>Kit2 ayuda a las familias en tres áreas fundamentales:</p>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', margin: '30px 0'}}>
              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>🏦 1. Apertura de Cuentas Bancarias</h4>
                <p>Los padres ayudan a sus hijos a:</p>
                <ul>
                  <li>Abrir su primera cuenta bancaria</li>
                  <li>Entender conceptos de ahorro</li>
                  <li>Construir capital para estudios futuros</li>
                  <li>Aprender responsabilidad financiera</li>
                </ul>
              </div>

              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>📧 2. Comunicación Digital</h4>
                <ul>
                  <li>Crear correos electrónicos seguros</li>
                  <li>Aprender comunicación profesional</li>
                  <li>Desarrollar habilidades digitales</li>
                  <li>Entender la importancia de la privacidad online</li>
                </ul>
              </div>

              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>💳 3. PayPal como Universidad Financiera</h4>
                <ul>
                  <li>Configurar cuentas PayPal familiares</li>
                  <li>Aprender transferencias seguras</li>
                  <li>Entender el dinero digital</li>
                  <li>Practicar con transacciones reales</li>
                </ul>
              </div>
            </div>

            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>Flujo Educativo del Kit2</h3>
            
            <div style={{margin: '20px 0'}}>
              <div style={generationStyle}>
                <h4 style={{color: '#b02a91'}}>📧 Paso 1: Llegada del Kit2 a la Familia</h4>
                <ul style={{textAlign: 'left', margin: '10px 0'}}>
                  <li>Un Kit2 activo llega por correo a la familia</li>
                  <li>Los padres/abuelos compran el Kit2 para el hijo/nieto</li>
                  <li>El niño recibe su primera experiencia de "venta digital"</li>
                </ul>
              </div>

              <div style={generationStyle}>
                <h4 style={{color: '#b02a91'}}>🎯 Paso 2: El Niño como Distribuidor</h4>
                <ul style={{textAlign: 'left', margin: '10px 0'}}>
                  <li>El niño aprende a explicar el sistema</li>
                  <li>Desarrolla habilidades de comunicación</li>
                  <li>Entiende conceptos de cliente, producto, donación</li>
                  <li>Construye confianza emprendedora</li>
                </ul>
              </div>

              <div style={generationStyle}>
                <h4 style={{color: '#b02a91'}}>👨‍👩‍👧‍👦 Paso 3: Expansión Familiar</h4>
                <ul style={{textAlign: 'left', margin: '10px 0'}}>
                  <li>Los padres participan vendiendo a abuelos o amigos</li>
                  <li>Cada nivel familiar se involucra en el sistema</li>
                  <li>Todo el capital generado construye el fondo educativo</li>
                  <li>La familia trabaja hacia objetivos comunes</li>
                </ul>
              </div>
            </div>

            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>Aprendizajes Clave para los Niños</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', margin: '20px 0'}}>
              {[
                '💳 Manejo de dinero digital (PayPal, transferencias)',
                '💰 Conceptos de ahorro y construcción de capital',
                '🗣️ Habilidades de ventas y comunicación',
                '👥 Trabajo en equipo familiar para objetivos comunes',
                '⚖️ Responsabilidad financiera desde pequeños',
                '🎯 Planificación a futuro (capital para estudios)'
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid #b02a91',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );

      case 'beneficios':
        return (
          <div style={sectionStyle}>
            <h2 style={{color: '#b02a91', fontSize: '2.5em', marginBottom: '20px'}}>BENEFICIOS PARA TODA LA FAMILIA</h2>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', margin: '30px 0'}}>
              <div style={highlightBoxStyle}>
                <h3 style={{color: '#2a0845'}}>👧👦 Para los Niños (8-17 años)</h3>
                <ul style={{fontSize: '1.1em', lineHeight: '1.8'}}>
                  <li>💰 Capital para estudios universitarios</li>
                  <li>📚 Educación financiera práctica desde temprana edad</li>
                  <li>🚀 Desarrollo de confianza y habilidades emprendedoras</li>
                  <li>👨‍👩‍👧‍👦 Mejor comunicación con padres y abuelos</li>
                </ul>
              </div>

              <div style={highlightBoxStyle}>
                <h3 style={{color: '#2a0845'}}>👨‍👩 Para los Padres (30-50 años)</h3>
                <ul style={{fontSize: '1.1em', lineHeight: '1.8'}}>
                  <li>🎓 Herramienta efectiva para enseñar finanzas</li>
                  <li>💵 Posibilidad de ingresos adicionales familiares</li>
                  <li>❤️ Actividad que une a la familia</li>
                  <li>💻 Participación en economía digital moderna</li>
                </ul>
              </div>

              <div style={highlightBoxStyle}>
                <h3 style={{color: '#2a0845'}}>👴👵 Para los Abuelos (50+ años)</h3>
                <ul style={{fontSize: '1.1em', lineHeight: '1.8'}}>
                  <li>💝 Conexión activa con nietos</li>
                  <li>📱 Aprendizaje de tecnología moderna</li>
                  <li>🎓 Participación en educación de nueva generación</li>
                  <li>🌐 Comprensión de sistemas económicos actuales</li>
                </ul>
              </div>

              <div style={{...highlightBoxStyle, gridColumn: 'span 2'}}>
                <h3 style={{color: '#2a0845', textAlign: 'center'}}>👨‍👩‍👧‍👦 Para la Familia Completa</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', margin: '20px 0'}}>
                  <div style={{textAlign: 'center', padding: '15px'}}>
                    <div style={{fontSize: '2em', marginBottom: '10px'}}>🤝</div>
                    <strong>Proyecto común que une generaciones</strong>
                  </div>
                  <div style={{textAlign: 'center', padding: '15px'}}>
                    <div style={{fontSize: '2em', marginBottom: '10px'}}>🏠</div>
                    <strong>Construcción de patrimonio familiar</strong>
                  </div>
                  <div style={{textAlign: 'center', padding: '15px'}}>
                    <div style={{fontSize: '2em', marginBottom: '10px'}}>📖</div>
                    <strong>Educación financiera para todos</strong>
                  </div>
                  <div style={{textAlign: 'center', padding: '15px'}}>
                    <div style={{fontSize: '2em', marginBottom: '10px'}}>🚀</div>
                    <strong>Preparación para el futuro digital</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'transparencia':
        return (
          <div style={sectionStyle}>
            <h2 style={{color: '#b02a91', fontSize: '2.5em', marginBottom: '20px'}}>TRANSPARENCIA Y LEGALIDAD</h2>
            
            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>¿Por qué es Legal y Transparente?</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', margin: '30px 0'}}>
              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>🤝 1. Donaciones Voluntarias</h4>
                <ul>
                  <li>No hay obligación de compra</li>
                  <li>Cada donación es una decisión libre</li>
                  <li>No es un esquema piramidal</li>
                </ul>
              </div>

              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>📚 2. Contenido Real y Valioso</h4>
                <ul>
                  <li>Se entrega valor genuino (libros, videos, educación)</li>
                  <li>Obras digitales de alta calidad</li>
                  <li>Material educativo con propósito claro</li>
                </ul>
              </div>

              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>🏦 3. Sistema Financiero Oficial</h4>
                <ul>
                  <li>Todo a través de bancos tradicionales y PayPal</li>
                  <li>Transacciones rastreables y legales</li>
                  <li>Sin dinero en efectivo o métodos ocultos</li>
                </ul>
              </div>

              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>🎓 4. Propósito Educativo Demostrable</h4>
                <ul>
                  <li>Educación financiera familiar real</li>
                  <li>Desarrollo de habilidades emprendedoras</li>
                  <li>Preparación para economía digital</li>
                </ul>
              </div>

              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>⏰ 5. Vigencia Limitada</h4>
                <ul>
                  <li>Cada Kit2 tiene validez de un año</li>
                  <li>Evita saturación del mercado</li>
                  <li>Sistema se renueva constantemente</li>
                </ul>
              </div>
            </div>

            <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>Diferencias con Esquemas Ilegales</h3>
            
            <div style={{...flowDiagramStyle, textAlign: 'left'}}>
              <div style={{margin: '15px 0', padding: '10px', background: '#d4edda', borderRadius: '5px'}}>
                <strong style={{color: '#721c24'}}>❌ Esquemas Piramidales:</strong> Prometen dinero sin entregar valor real<br/>
                <strong style={{color: '#155724'}}>✅ Kit2:</strong> Entrega obras valiosas + educación financiera
              </div>
              <div style={{margin: '15px 0', padding: '10px', background: '#d4edda', borderRadius: '5px'}}>
                <strong style={{color: '#721c24'}}>❌ Esquemas Piramidales:</strong> Requieren reclutar para ganar<br/>
                <strong style={{color: '#155724'}}>✅ Kit2:</strong> El valor está en el contenido y la educación
              </div>
              <div style={{margin: '15px 0', padding: '10px', background: '#d4edda', borderRadius: '5px'}}>
                <strong style={{color: '#721c24'}}>❌ Esquemas Piramidales:</strong> Benefician solo a los primeros<br/>
                <strong style={{color: '#155724'}}>✅ Kit2:</strong> Sistema circular que beneficia a todos
              </div>
            </div>
          </div>
        );

      case 'ejemplos':
        return (
          <div style={sectionStyle}>
            <h2 style={{color: '#b02a91', fontSize: '2.5em', marginBottom: '20px'}}>EJEMPLOS PRÁCTICOS</h2>
            
            <div style={{margin: '30px 0'}}>
              <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>📊 Ejemplo 1: La Familia Rodríguez</h3>
              
              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>👥 Participantes:</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '15px 0'}}>
                  <div style={{textAlign: 'center', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>👴 Abuelo Carlos</strong><br/>
                    (designado por el autor)
                  </div>
                  <div style={{textAlign: 'center', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>👨 Papá Miguel</strong><br/>
                    (compra Kit2 para hijo)
                  </div>
                  <div style={{textAlign: 'center', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>👦 Juanito (8 años)</strong><br/>
                    (recibe su primer Kit2)
                  </div>
                  <div style={{textAlign: 'center', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>👩 Mamá Ana</strong><br/>
                    (compra Kit2 de Juanito)
                  </div>
                  <div style={{textAlign: 'center', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>👵 Abuela Rosa</strong><br/>
                    (compra Kit2 de Ana)
                  </div>
                </div>
              </div>

              <div style={flowDiagramStyle}>
                <h4 style={{color: '#b02a91'}}>💰 Flujo de Donaciones Educativo:</h4>
                <div style={{margin: '20px 0', lineHeight: '2'}}>
                  <div style={{fontSize: '1.2em', margin: '10px 0'}}>
                    1. <strong>Juanito</strong> dona US$x al <strong>Abuelo Carlos</strong> → Aprende a "dar"
                  </div>
                  <div style={{fontSize: '1.2em', margin: '10px 0'}}>
                    2. <strong>Ana</strong> dona US$x a <strong>Miguel</strong> → Ve el sistema familiar
                  </div>
                  <div style={{fontSize: '1.2em', margin: '10px 0', color: '#e74c3c', fontWeight: 'bold'}}>
                    3. <strong>Rosa</strong> dona US$x a <strong>Juanito</strong> → ¡El niño recibe su primera donación!
                  </div>
                </div>
              </div>

              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>🎯 Resultados:</h4>
                <ul style={{fontSize: '1.1em', lineHeight: '1.8'}}>
                  <li><strong>Juanito:</strong> Recibe US$x, aprende finanzas, construye capital</li>
                  <li><strong>Familia:</strong> Todos tienen obras valiosas y educación financiera</li>
                  <li><strong>Capital familiar:</strong> US$x+x+x circulando + conocimiento adquirido</li>
                </ul>
              </div>
            </div>

            <div style={{margin: '40px 0'}}>
              <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>📈 Ejemplo 2: Multiplicación del Sistema</h3>
              
              <div style={flowDiagramStyle}>
                <p>Si Miguel invita a 5 familias y cada familia invita a 5 más:</p>
                <div style={{margin: '20px 0', lineHeight: '2'}}>
                  <div style={{fontSize: '1.2em', margin: '10px 0'}}>
                    📊 <strong>Nivel 1:</strong> Miguel invita a 5 familias
                  </div>
                  <div style={{fontSize: '1.2em', margin: '10px 0'}}>
                    📊 <strong>Nivel 2:</strong> 25 familias (5 × 5)
                  </div>
                  <div style={{fontSize: '1.3em', margin: '15px 0', color: '#b02a91', fontWeight: 'bold'}}>
                    💰 <strong>Donaciones para Miguel:</strong> 25 × US$x = US$25x
                  </div>
                </div>
                
                <div style={{background: '#d4edda', padding: '15px', borderRadius: '8px', marginTop: '20px'}}>
                  <strong style={{color: '#155724', fontSize: '1.2em'}}>
                    Pero más importante: 25 familias ahora tienen educación financiera y obras valiosas
                  </strong>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preguntas':
        return (
          <div style={sectionStyle}>
            <h2 style={{color: '#b02a91', fontSize: '2.5em', marginBottom: '20px'}}>PREGUNTAS FRECUENTES</h2>
            
            <div style={{margin: '30px 0'}}>
              {[
                {
                  question: "1. ¿Es esto legal?",
                  answer: (
                    <div>
                      <p><strong>Sí, completamente legal.</strong> Kit2 es un sistema educativo que:</p>
                      <ul>
                        <li>Entrega valor real (obras digitales)</li>
                        <li>Usa el sistema financiero oficial</li>
                        <li>Tiene propósito educativo claro</li>
                        <li>Está basado en donaciones voluntarias</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "2. ¿Qué pasa si no encuentro personas interesadas?",
                  answer: (
                    <div>
                      <p><strong>No hay presión.</strong> Kit2 es principalmente educativo. Si no invitas a nadie:</p>
                      <ul>
                        <li>Conservas todas las obras digitales</li>
                        <li>Tu familia aprendió sobre finanzas digitales</li>
                        <li>Tienes tu Kit2 para usar cuando quieras (Un año de vigencia)</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "3. ¿Los niños pueden manejar dinero real?",
                  answer: (
                    <div>
                      <p><strong>Con supervisión familiar, sí.</strong> Los padres:</p>
                      <ul>
                        <li>Supervisan todas las transacciones</li>
                        <li>Enseñan responsabilidad financiera</li>
                        <li>Usan cantidades educativas apropiadas</li>
                        <li>Construyen capital para estudios futuros</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "4. ¿Qué hace la Corporación con el dinero?",
                  answer: (
                    <div>
                      <p><strong>La Corporación Herejía Económica:</strong></p>
                      <ul>
                        <li>Mantiene la plataforma operativa</li>
                        <li>Desarrolla nuevos contenidos educativos</li>
                        <li>Paga regalías a autores (10-30%)</li>
                        <li>Invierte en mejoras del sistema</li>
                        <li>Utiliza para desarrollar diferentes proyectos sociales</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "5. ¿Cómo sé que recibiré las donaciones?",
                  answer: (
                    <div>
                      <p><strong>El sistema es transparente:</strong></p>
                      <ul>
                        <li>Las donaciones van directo a tu cuenta</li>
                        <li>PayPal y bancos envían confirmaciones</li>
                        <li>Puedes rastrear todas las transacciones</li>
                        <li>La Corporación no maneja las donaciones</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "6. ¿Funciona en otros países?",
                  answer: (
                    <div>
                      <p><strong>Sí, donde PayPal esté disponible:</strong></p>
                      <ul>
                        <li>Estados Unidos, Canadá, México</li>
                        <li>Países de Europa y Asia</li>
                        <li>Cualquier lugar con PayPal y bancos online</li>
                        <li>Adaptable a monedas locales</li>
                      </ul>
                    </div>
                  )
                }
              ].map((faq, index) => (
                <div key={index} style={{...highlightBoxStyle, marginBottom: '25px'}}>
                  <h4 style={{color: '#2a0845', fontSize: '1.3em', marginBottom: '15px'}}>
                    {faq.question}
                  </h4>
                  <div style={{fontSize: '1.1em'}}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'como-empezar':
        return (
          <div style={sectionStyle}>
            <h2 style={{color: '#b02a91', fontSize: '2.5em', marginBottom: '20px'}}>CÓMO EMPEZAR</h2>
            
            <div style={{margin: '30px 0'}}>
              <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>📧 Si Recibiste una Invitación:</h3>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '20px', margin: '20px 0'}}>
                <div style={generationStyle}>
                  <h4 style={{color: '#b02a91'}}>🤔 Paso 1: Evalúa tu Interés</h4>
                  <ul style={{textAlign: 'left', margin: '10px 0'}}>
                    <li>¿Te interesa la educación financiera familiar?</li>
                    <li>¿Quieres que tus hijos aprendan sobre dinero digital?</li>
                    <li>¿El contenido del autor te parece valioso?</li>
                  </ul>
                </div>

                <div style={generationStyle}>
                  <h4 style={{color: '#b02a91'}}>👨‍👩‍👧‍👦 Paso 2: Prepara a tu Familia</h4>
                  <ul style={{textAlign: 'left', margin: '10px 0'}}>
                    <li>Habla con tus hijos sobre el sistema</li>
                    <li>Asegúrate de tener PayPal y cuenta bancaria</li>
                    <li>Decide si quieres participar como familia</li>
                  </ul>
                </div>

                <div style={generationStyle}>
                  <h4 style={{color: '#b02a91'}}>💳 Paso 3: Realiza los Pagos</h4>
                  <ul style={{textAlign: 'left', margin: '10px 0'}}>
                    <li>US$x de donación solidaria (Según kit2)</li>
                    <li>US$y del Kit2 a la Corporación</li>
                    <li>Sigue las instrucciones del Kit2 que recibiste</li>
                  </ul>
                </div>

                <div style={generationStyle}>
                  <h4 style={{color: '#b02a91'}}>📦 Paso 4: Recibe tu Kit2 Personalizado</h4>
                  <ul style={{textAlign: 'left', margin: '10px 0'}}>
                    <li>Obras digitales completas</li>
                    <li>Tu Kit2 con tu nombre</li>
                    <li>Instrucciones para compartir</li>
                  </ul>
                </div>

                <div style={generationStyle}>
                  <h4 style={{color: '#b02a91'}}>🎓 Paso 5: Educa a tu Familia</h4>
                  <ul style={{textAlign: 'left', margin: '10px 0'}}>
                    <li>Enseña a tus hijos sobre el sistema</li>
                    <li>Practiquen juntos con PayPal</li>
                    <li>Decidan si quieren invitar a otros familiares</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{margin: '40px 0'}}>
              <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>✍️ Si Eres Autor y Quieres tu Propio Kit2:</h3>
              
              <div style={highlightBoxStyle}>
                <h4 style={{color: '#b02a91'}}>📞 Contacta a la Corporación:</h4>
                <div style={{fontSize: '1.2em', lineHeight: '1.8', margin: '15px 0'}}>
                  <p>📧 <strong>Email:</strong> info@corpherejiaeconomica.com</p>
                  <p>🌐 <strong>Web:</strong> corpherejiaeconomica.com</p>
                  <p>❓ <strong>Consultas:</strong> A través del sitio web</p>
                </div>
              </div>

              <div style={flowDiagramStyle}>
                <h4 style={{color: '#b02a91'}}>🔄 Proceso para Autores:</h4>
                <div style={{margin: '20px 0', lineHeight: '2'}}>
                  <div style={{fontSize: '1.1em', margin: '10px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>1. Evaluación del contenido</strong> - ¿Es educativo y valioso?
                  </div>
                  <div style={{fontSize: '1.1em', margin: '10px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>2. Acuerdo de distribución</strong> - Términos y porcentajes
                  </div>
                  <div style={{fontSize: '1.1em', margin: '10px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>3. Creación del Kit2</strong> - Personalización para tu obra
                  </div>
                  <div style={{fontSize: '1.1em', margin: '10px 0', padding: '10px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '5px'}}>
                    <strong>4. Lanzamiento</strong> - Inicio de distribución familiar
                  </div>
                </div>
              </div>
            </div>

            <div style={{margin: '40px 0'}}>
              <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>💡 CONSEJOS PARA EL ÉXITO</h3>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', margin: '20px 0'}}>
                <div style={highlightBoxStyle}>
                  <h4 style={{color: '#b02a91'}}>👨‍👩 Para Padres:</h4>
                  <ul>
                    <li>Involucra a toda la familia en las decisiones</li>
                    <li>Usa esto como oportunidad educativa real</li>
                    <li>No presiones a nadie para participar</li>
                    <li>Enfócate en el aprendizaje más que en el dinero</li>
                    <li>Supervisa siempre las actividades de los niños</li>
                  </ul>
                </div>

                <div style={highlightBoxStyle}>
                  <h4 style={{color: '#b02a91'}}>👧👦 Para Hijos/Jóvenes:</h4>
                  <ul>
                    <li>Aprende responsabilidad con dinero real</li>
                    <li>Practica comunicación al explicar el sistema</li>
                    <li>Ahorra las donaciones que recibas</li>
                    <li>Involucra a tus padres en todas las decisiones</li>
                    <li>Enfócate en ayudar a otras familias a aprender</li>
                  </ul>
                </div>

                <div style={highlightBoxStyle}>
                  <h4 style={{color: '#b02a91'}}>👴👵 Para Abuelos:</h4>
                  <ul>
                    <li>Ve esto como inversión en educación de nietos</li>
                    <li>Aprende tecnología junto con la familia</li>
                    <li>Comparte tu experiencia financiera</li>
                    <li>Disfruta la conexión intergeneracional</li>
                    <li>No tengas miedo de la tecnología moderna</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{...highlightBoxStyle, textAlign: 'center', marginTop: '40px'}}>
              <h3 style={{color: '#2a0845', fontSize: '1.8em'}}>🚀 VISIÓN A FUTURO</h3>
              <p style={{fontSize: '1.2em', lineHeight: '1.8', margin: '20px 0'}}>
                Kit2 no es solo sobre dinero, es sobre construir un futuro donde los niños llegan a la universidad 
                con capital y educación financiera, las familias están más unidas a través de proyectos comunes, 
                existe una red de apoyo económico entre familias, y las comunidades prosperan a través de la educación compartida.
              </p>
              
              <div style={{fontSize: '1.3em', fontWeight: 'bold', color: '#b02a91', margin: '25px 0', padding: '20px', background: 'rgba(176, 42, 145, 0.1)', borderRadius: '10px'}}>
                "En Kit2, cada familia que aprende es una victoria para toda la comunidad"
              </div>

              <p style={{fontSize: '1.1em', color: '#666', marginTop: '20px'}}>
                © 2025 Corporación Herejía Económica - Todos los derechos reservados
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            padding: '15px',
            marginRight: '20px'
          }}>
            <div style={{fontSize: '3em'}}>📚</div>
          </div>
          <div>
            <h1 style={{margin: '0', fontSize: '2.5em', fontWeight: 'bold'}}>
              GUÍA FAMILIAR DEL SISTEMA KIT2
            </h1>
            <p style={{margin: '10px 0 0 0', fontSize: '1.3em', opacity: '0.9'}}>
              Conectando Familias a Través de la Educación Financiera
            </p>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '1.1em'
        }}>
          <strong>CORPORACIÓN HEREJÍA ECONÓMICA</strong><br/>
          Sistema de Distribución de Obras Digitales y Educación Financiera Familiar<br/>
          <em>"Donde las familias se conectan, aprenden y prosperan juntas"</em>
        </div>
      </header>

      <nav style={navStyle}>
        {sections.map(section => (
          <button
            key={section.id}
            style={navButtonStyle(activeSection === section.id)}
            onClick={() => setActiveSection(section.id)}
          >
            {section.title}
          </button>
        ))}
      </nav>

      <main>
        {renderContent()}
      </main>

      <footer style={{
        background: 'linear-gradient(135deg, #2a0845, #b02a91)',
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <h3 style={{margin: '0 0 15px 0'}}>📞 INFORMACIÓN DE CONTACTO</h3>
        <p style={{margin: '10px 0', fontSize: '1.1em'}}>
          <strong>C.H.E. - Corporación Herejía Económica</strong>
        </p>
        <p style={{margin: '10px 0'}}>
          🌐 <strong>Sitio Web:</strong> www.corpherejiaeconomica.com<br/>
          📧 <strong>Email:</strong> info@corpherejiaeconomica.com
        </p>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          fontSize: '0.9em'
        }}>
          <strong>Compromiso de Transparencia:</strong> La corporación nunca pedirá contraseñas. 
          Tu información personal será segura. Transparencia total en el manejo de fondos, 
          educación real como objetivo principal.
        </div>
      </footer>
    </div>
  );
};

export default KitHeresy;

