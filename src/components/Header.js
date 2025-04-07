import React from 'react';

// Componente SVG logo incrustado directamente
const LogoSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" style={{ width: '150px', height: '150px' }}>
    {/* Fondo degradado */}
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a0d5e" />
        <stop offset="50%" stopColor="#8a1b90" />
        <stop offset="100%" stopColor="#e93b81" />
      </linearGradient>
      
      <linearGradient id="planetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2b78e4" />
        <stop offset="100%" stopColor="#1e4b9c" />
      </linearGradient>
    </defs>
    
    {/* Fondo circular grande */}
    <circle cx="400" cy="400" r="350" fill="url(#bgGradient)" />
    
    {/* Planeta (más pequeño y en la parte superior) */}
    <circle cx="400" cy="270" r="140" fill="url(#planetGradient)" stroke="#85c5ff" strokeWidth="2" />
    
    {/* Detalles del planeta (continentes) */}
    <path d="M350,230 Q380,210 410,220 Q440,240 470,230 Q480,260 460,290 Q430,300 400,290 Q370,310 340,290 Q330,270 350,230" fill="#56ab5f" opacity="0.8" />
    <path d="M320,270 Q340,250 360,260 Q370,280 350,300 Q330,290 320,270" fill="#56ab5f" opacity="0.8" />
    <path d="M410,310 Q440,300 470,310 Q480,330 450,340 Q430,330 410,310" fill="#56ab5f" opacity="0.8" />
    
    {/* Anillo planetario */}
    <ellipse cx="400" cy="270" rx="190" ry="50" fill="none" stroke="#ffdb58" strokeWidth="6" opacity="0.7" />
    
    {/* Pequeño brillo en el planeta */}
    <circle cx="365" cy="235" r="25" fill="white" opacity="0.2" />
    
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
    
    {/* Texto central - en el centro del círculo (posición ajustada) */}
    <text x="400" y="480" 
          fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="70" 
          textAnchor="middle" fill="white">C.H.E.</text>
          
    {/* Texto inferior - en arco inferior (posición ajustada) */}
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

const Header = () => {
  return (
    <header style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 20px', 
      backgroundColor: '#000'
    }}>
      <div style={{
      display: 'flex', 
      alignItems: 'center'
      }}>
      <LogoSVG />
      </div>
      <nav>
        <ul style={{
          display: 'flex', 
          listStyle: 'none', 
          gap: '15px', 
          color: 'white'
        }}>
          <li><a href="/" style={{color: 'white', textDecoration: 'none'}}>Inicio</a></li>
          <li><a href="/fondos" style={{color: 'white', textDecoration: 'none'}}>Fondos Rotatorios</a></li>
          <li><a href="/about" style={{color: 'white', textDecoration: 'none'}}>Nosotros</a></li>
          <li><a href="/contact" style={{color: 'white', textDecoration: 'none'}}>Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
