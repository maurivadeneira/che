import React, { useState, useEffect } from 'react';

// Componente SVG logo incrustado directamente
const LogoSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" style={{ width: '150px', height: '150px' }}>
    {/* Definiciones de gradientes y filtros */}
    <defs>
      {/* Gradiente de fondo de galaxia */}
      <linearGradient id="galaxyGradient" x1="0%" y1="0%" x2="100%" y2="100%">        
        <stop offset="0%" stopColor="#2a0845" />
        <stop offset="40%" stopColor="#6b0f77" />
        <stop offset="70%" stopColor="#b02a91" />
        <stop offset="100%" stopColor="#e63e6d" />
      </linearGradient>

      {/* Gradiente del planeta */}
      <linearGradient id="planetGradient" x1="0%" y1="0%" x2="100%" y2="100%">        
        <stop offset="0%" stopColor="#3498db" />
        <stop offset="100%" stopColor="#0e4377" />
      </linearGradient>

      {/* Radial para efecto de brillo */}
      <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">  
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* Filtro para el brillo cósmico */}
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Fondo circular grande (galaxia) */}
    <circle cx="400" cy="400" r="350" fill="url(#galaxyGradient)" />

    {/* Efecto de brillo alrededor de la galaxia */}
    <circle cx="400" cy="400" r="370" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.2" />
    <circle cx="400" cy="400" r="380" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.1" />

    {/* Estrellas pequeñas dispersas por la galaxia */}
    <g>
      <circle cx="200" cy="300" r="2" fill="white" opacity="0.8" />
      <circle cx="300" cy="150" r="1.5" fill="white" opacity="0.7" />
      <circle cx="500" cy="200" r="2" fill="white" opacity="0.9" />
      <circle cx="650" cy="300" r="1.5" fill="white" opacity="0.7" />
      <circle cx="550" cy="450" r="2" fill="white" opacity="0.8" />
      <circle cx="250" cy="500" r="1.5" fill="white" opacity="0.9" />
      <circle cx="480" cy="600" r="2" fill="white" opacity="0.7" />
      <circle cx="350" cy="550" r="1.5" fill="white" opacity="0.8" />
      <circle cx="600" cy="550" r="1.5" fill="white" opacity="0.7" />
      <circle cx="150" cy="400" r="2" fill="white" opacity="0.9" />
      <circle cx="530" cy="180" r="1.5" fill="white" opacity="0.7" />
      <circle cx="420" cy="150" r="2" fill="white" opacity="0.8" />
    </g>

    {/* Planeta (el "ojo" de la cara) - ligeramente desplazado para mostrar asimetría */}
    <circle cx="400" cy="270" r="140" fill="url(#planetGradient)" stroke="#85c5ff" strokeWidth="2" />

    {/* Continentes de la Tierra más reconocibles */}
    {/* América del Norte y Central */}
    <path d="M320,230 Q345,225 350,240 Q355,260 345,270 Q335,280 330,295 Q340,310 330,320 Q320,310 315,300 Q305,290 300,270 Q305,250 320,230"
          fill="#56ab5f" opacity="0.8" />

    {/* América del Sur */}
    <path d="M350,320 Q360,330 355,350 Q350,360 340,365 Q330,355 335,340 Q345,330 350,320"
          fill="#56ab5f" opacity="0.8" />

    {/* Europa y África */}
    <path d="M365,240 Q380,235 395,240 Q400,250 410,260 Q415,280 405,300 Q400,320 395,330 Q385,340 375,330 Q370,315 380,300 Q385,280 380,270 Q370,260 365,240"
          fill="#56ab5f" opacity="0.8" />

    {/* Asia y Oceanía */}
    <path d="M415,240 Q435,235 450,240 Q470,250 480,270 Q485,290 475,310 Q465,315 455,310 Q440,305 430,310 Q420,315 415,310 Q410,290 405,275 Q410,255 415,240"
          fill="#56ab5f" opacity="0.8" />

    {/* Australia */}
    <path d="M460,330 Q475,325 485,335 Q490,345 485,355 Q475,360 465,355 Q455,345 460,330"
          fill="#56ab5f" opacity="0.8" />

    {/* Brillo en el planeta */}
    <circle cx="365" cy="235" r="25" fill="white" opacity="0.2" />

    {/* Anillo planetario */}
    <ellipse cx="400" cy="270" rx="190" ry="50" fill="none" stroke="#ffdb58" strokeWidth="6" opacity="0.7" />

    {/* Pequeñas lunas u objetos celestes para dar más profundidad */}
    <circle cx="550" cy="350" r="15" fill="#aabbcc" opacity="0.6" />
    <circle cx="250" cy="430" r="12" fill="#ccddee" opacity="0.5" />

    {/* Texto principal - en arco superior */}
    <path id="textCirclePathTop"
          d="M400,400 m-240,0 a240,240 0 0,1 480,0"
          fill="none" />

    <text>
      <textPath href="#textCirclePathTop" startOffset="50%" textAnchor="middle"       
                fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="28" fill="white" letterSpacing="1.5">
        CORPORACIÓN HEREJÍA ECONÓMICA
      </textPath>
    </text>

    {/* Texto central - en el centro del círculo */}
    <text x="400" y="480"
          fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="70"
          textAnchor="middle" fill="white" filter="url(#glow)">C.H.E.</text>

    {/* Texto inferior - en arco inferior */}
    <path id="textCirclePathBottom"
          d="M400,520 m-200,0 a200,200 0 0,0 400,0"
          fill="none" />

    <text>
      <textPath href="#textCirclePathBottom" startOffset="50%" textAnchor="middle"    
                fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="28" fill="white" letterSpacing="2">
        MUNDO LIBRE
      </textPath>
    </text>
  </svg>
);

// Ícono de hamburguesa
const HamburgerIcon = ({ isOpen }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '2rem',
    height: '2rem',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    zIndex: 1000,
  }}>
    <div style={{
      width: '2rem',
      height: '0.25rem',
      background: '#FFF',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      transform: isOpen ? 'rotate(45deg) translate(0.5rem, 0.5rem)' : 'none'
    }} />
    <div style={{
      width: '2rem',
      height: '0.25rem',
      background: '#FFF',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      opacity: isOpen ? '0' : '1',
      transform: isOpen ? 'translateX(100%)' : 'none'
    }} />
    <div style={{
      width: '2rem',
      height: '0.25rem',
      background: '#FFF',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      transform: isOpen ? 'rotate(-45deg) translate(0.5rem, -0.5rem)' : 'none'
    }} />
  </div>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estilos de los enlaces
  const linkStyles = {
    color: 'white',
    textDecoration: 'none'
  };

  const specialLinkStyles = {
    ...linkStyles,
    color: '#f59e0b',
    fontWeight: 'bold'
  };

  // Mejorar detección de móvil
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 768px)').matches || 
             ('ontouchstart' in window && window.innerWidth < 768);
    }
    return false;
  });

  useEffect(() => {
    const checkDevice = () => {
      const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
      const isTouchDevice = 'ontouchstart' in window;
      const isMobileSize = window.innerWidth <= 768 || window.innerHeight <= 568;
      
      const shouldShowMobileUI = mobileMediaQuery.matches || (isTouchDevice && isMobileSize);
      
      setIsMobile(shouldShowMobileUI);
      if (!shouldShowMobileUI) {
        setIsMenuOpen(false);
      }
    };

    // Verificar inicialmente
    checkDevice();

    // Agregar listeners
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    // Listener para cambios en media query
    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaQueryChange = (e) => {
      checkDevice();
    };
    mobileMediaQuery.addListener(handleMediaQueryChange);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
      mobileMediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  console.log('isMobile:', isMobile); // Para debugging

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#000',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <LogoSVG />
      </div>

      {/* Ícono hamburguesa */}
      {isMobile && (
        <div 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ cursor: 'pointer' }}
        >
          <HamburgerIcon isOpen={isMenuOpen} />
        </div>
      )}

      {/* Navegación */}
      <nav style={{
        display: isMobile ? (isMenuOpen ? 'block' : 'none') : 'block',
        position: isMobile ? 'absolute' : 'relative',
        top: isMobile ? '100%' : 'auto',
        left: isMobile ? '0' : 'auto',
        right: isMobile ? '0' : 'auto',
        backgroundColor: isMobile ? '#000' : 'transparent',
        padding: isMobile ? '20px' : '0',
        boxShadow: isMobile ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
      }}>
        <ul style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          listStyle: 'none',
          gap: isMobile ? '10px' : '15px',
          color: 'white',
          margin: 0,
          padding: 0,
          alignItems: isMobile ? 'center' : 'stretch'
        }}>
          <li><a href="/" style={linkStyles}>Inicio</a></li>
          <li><a href="/herejias-ia" style={specialLinkStyles}>Herejías con IA</a></li>
          <li><a href="/kit-heresy" style={linkStyles}>Kit Heresy</a></li>
          <li><a href="/conferencias" style={linkStyles}>Conferencias</a></li>
          <li><a href="/biblioteca" style={linkStyles}>Biblioteca</a></li>
          <li><a href="/fondos" style={linkStyles}>Fondos Rotatorios</a></li>
          <li><a href="/about" style={linkStyles}>Nosotros</a></li>
          <li><a href="/contact" style={linkStyles}>Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;