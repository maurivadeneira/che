import React from 'react';

// Componente para el logo mediano CHE
const CheMediumLogo = ({ style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 120 60" 
    style={{ 
      width: '120px', 
      height: '60px', 
      verticalAlign: 'middle',
      ...style 
    }}
  >
    {/* Definiciones de gradientes y filtros */}
    <defs>
      {/* Gradiente de fondo de galaxia */}
      <linearGradient id="mediumGalaxyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2a0845" />
        <stop offset="40%" stopColor="#6b0f77" />
        <stop offset="70%" stopColor="#b02a91" />
        <stop offset="100%" stopColor="#e63e6d" />
      </linearGradient>
      
      {/* Gradiente del planeta */}
      <linearGradient id="mediumPlanetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3498db" />
        <stop offset="100%" stopColor="#0e4377" />
      </linearGradient>
    </defs>
    
    {/* Fondo circular (galaxia) */}
    <circle cx="30" cy="30" r="28" fill="url(#mediumGalaxyGradient)" />
    
    {/* Borde sutíl para definición */}
    <circle cx="30" cy="30" r="28" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.3" />
    
    {/* Planeta - un poco más detallado */}
    <circle cx="30" cy="28" r="12" fill="url(#mediumPlanetGradient)" stroke="#85c5ff" strokeWidth="0.4" />
    
    {/* Continentes simplificados */}
    <path d="M25,23 Q30,21 34,25 Q37,31 33,35 Q27,36 22,32 Q20,27 25,23" fill="#56ab5f" opacity="0.8" />
    
    {/* Anillo planetario */}
    <ellipse cx="30" cy="28" rx="16" ry="4" fill="none" stroke="#ffdb58" strokeWidth="0.7" opacity="0.7" />
    
    {/* Texto CHE y MUNDO LIBRE */}
    <text x="85" y="25" 
          fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" 
          textAnchor="middle" fill="#6b0f77">C.H.E.</text>
          
    <text x="85" y="42" 
          fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" 
          textAnchor="middle" fill="#6b0f77">MUNDO LIBRE</text>
  </svg>
);

export default CheMediumLogo;
