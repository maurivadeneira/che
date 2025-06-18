import React from 'react';

// Componente para el mini logo CHE
const CheMiniLogo = ({ style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 80 40" 
    style={{ 
      width: '80px', 
      height: '40px', 
      verticalAlign: 'middle',
      marginLeft: '10px',
      ...style 
    }}
  >
    {/* Definiciones de gradientes y filtros */}
    <defs>
      {/* Gradiente de fondo de galaxia */}
      <linearGradient id="miniGalaxyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2a0845" />
        <stop offset="40%" stopColor="#6b0f77" />
        <stop offset="70%" stopColor="#b02a91" />
        <stop offset="100%" stopColor="#e63e6d" />
      </linearGradient>
      
      {/* Gradiente del planeta */}
      <linearGradient id="miniPlanetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3498db" />
        <stop offset="100%" stopColor="#0e4377" />
      </linearGradient>
    </defs>
    
    {/* Fondo circular (galaxia) */}
    <circle cx="20" cy="20" r="18" fill="url(#miniGalaxyGradient)" />
    
    {/* Borde sutíl para definición */}
    <circle cx="20" cy="20" r="18" fill="none" stroke="#ffffff" strokeWidth="0.3" strokeOpacity="0.3" />
    
    {/* Planeta - simplificado */}
    <circle cx="20" cy="18" r="8" fill="url(#miniPlanetGradient)" stroke="#85c5ff" strokeWidth="0.3" />
    
    {/* Continentes ultra simplificados */}
    <path d="M17,15 Q19,14 22,16 Q24,19 22,22 Q19,23 16,21 Q15,18 17,15" fill="#56ab5f" opacity="0.8" />
    
    {/* Anillo planetario miniaturizado */}
    <ellipse cx="20" cy="18" rx="11" ry="3" fill="none" stroke="#ffdb58" strokeWidth="0.5" opacity="0.7" />
    
    {/* Texto CHE y MUNDO LIBRE */}
    <text x="52" y="17" 
          fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" 
          textAnchor="middle" fill="#6b0f77">C.H.E.</text>
          
    <text x="52" y="28" 
          fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="7" 
          textAnchor="middle" fill="#6b0f77">MUNDO LIBRE</text>
  </svg>
);

export default CheMiniLogo;
