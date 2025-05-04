import React from 'react';

const FondoEditorialMedios = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1080 1080"
      width="100%"
      height="100%"
      {...props}
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b2a7a" />
          <stop offset="100%" stopColor="#5b25a3" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#273c99" />
          <stop offset="100%" stopColor="#8838c5" />
        </linearGradient>
      </defs>
      
      {/* Fondo */}
      <rect width="1080" height="1080" fill="url(#gradient1)" />
      
      {/* Líneas decorativas */}
      <g opacity="0.5">
        <path d="M0,200 L1080,150" stroke="#3a57c4" strokeWidth="2" />
        <path d="M0,300 L1080,250" stroke="#3a57c4" strokeWidth="3" />
        <path d="M0,400 L1080,450" stroke="#3a57c4" strokeWidth="1" />
        <path d="M0,600 L1080,550" stroke="#3a57c4" strokeWidth="2" />
        <path d="M0,700 L1080,750" stroke="#3a57c4" strokeWidth="3" />
        <path d="M0,800 L1080,850" stroke="#3a57c4" strokeWidth="1" />
      </g>
      
      {/* Puntos decorativos */}
      <g fill="#5d78e0" opacity="0.6">
        <circle cx="100" cy="100" r="3" />
        <circle cx="200" cy="150" r="2" />
        <circle cx="300" cy="70" r="4" />
        <circle cx="450" cy="120" r="2" />
        <circle cx="600" cy="80" r="3" />
        <circle cx="750" cy="130" r="2" />
        <circle cx="900" cy="90" r="4" />
        <circle cx="1000" cy="140" r="2" />
        
        <circle cx="150" cy="300" r="3" />
        <circle cx="250" cy="270" r="2" />
        <circle cx="350" cy="350" r="4" />
        <circle cx="500" cy="320" r="2" />
        <circle cx="650" cy="380" r="3" />
        <circle cx="800" cy="290" r="2" />
        <circle cx="950" cy="370" r="4" />
      </g>
      
      {/* Icono de micrófono grande */}
      <g transform="translate(150, 200)">
        <circle cx="100" cy="100" r="80" fill="#3a57c4" opacity="0.7" />
        <path d="M100,50 L100,150 M70,70 Q100,50 130,70 M70,130 Q100,150 130,130" 
          stroke="#b0c2ff" strokeWidth="10" fill="none" strokeLinecap="round" />
        <rect x="85" y="150" width="30" height="40" rx="5" fill="#b0c2ff" />
      </g>
      
      {/* Iconos de cámara y media */}
      <g transform="translate(400, 100)">
        <rect x="0" y="0" width="80" height="60" rx="5" fill="#5d78e0" opacity="0.8" />
        <circle cx="25" cy="30" r="15" fill="#b0c2ff" />
        <rect x="60" y="15" width="10" height="30" rx="2" fill="#b0c2ff" />
      </g>
      
      <g transform="translate(520, 120)">
        <rect x="0" y="0" width="60" height="60" rx="10" fill="#5d78e0" opacity="0.8" />
        <rect x="15" y="15" width="30" height="30" rx="5" fill="#b0c2ff" />
      </g>
      
      <g transform="translate(650, 90)">
        <rect x="0" y="0" width="70" height="60" rx="5" fill="#5d78e0" opacity="0.8" />
        <circle cx="35" cy="30" r="20" fill="#b0c2ff" />
        <circle cx="35" cy="30" r="5" fill="#5d78e0" />
      </g>
      
      {/* Persona interactuando con pantalla */}
      <g transform="translate(450, 300)">
        {/* Panel principal interactivo */}
        <rect x="0" y="0" width="300" height="250" rx="10" fill="url(#gradient2)" opacity="0.9" />
        <rect x="20" y="20" width="260" height="180" rx="5" fill="#c5a8e0" opacity="0.7" />
        
        {/* Controles y elementos en el panel */}
        <circle cx="150" cy="130" r="40" fill="#8255b0" />
        <polygon points="140,110 140,150 170,130" fill="#c5a8e0" />
        
        <rect x="60" y="210" width="40" height="10" rx="5" fill="#8255b0" />
        <rect x="120" y="210" width="40" height="10" rx="5" fill="#8255b0" />
        <rect x="180" y="210" width="40" height="10" rx="5" fill="#8255b0" />
        
        {/* Silueta de la persona */}
        <path d="M150,550 C170,530 190,540 200,580 L100,580 C110,540 130,530 150,550 Z" fill="#2a367a" />
        <circle cx="150" cy="510" r="40" fill="#2a367a" />
        
        <path d="M220,450 L250,350" stroke="#2a367a" strokeWidth="15" strokeLinecap="round" />
        <path d="M220,450 C260,460 270,510 240,530" fill="none" stroke="#2a367a" strokeWidth="15" strokeLinecap="round" />
      </g>
      
      {/* Ondas de audio */}
      <g transform="translate(150, 600)">
        <path d="M0,50 Q25,20 50,50 Q75,80 100,50 Q125,20 150,50 Q175,80 200,50" 
          fill="none" stroke="#5d78e0" strokeWidth="8" strokeLinecap="round" />
      </g>
      
      <g transform="translate(600, 700)">
        <path d="M0,50 Q25,20 50,50 Q75,80 100,50 Q125,20 150,50 Q175,80 200,50" 
          fill="none" stroke="#5d78e0" strokeWidth="8" strokeLinecap="round" />
      </g>
      
      {/* Audiencia - siluetas de manos */}
      <g fill="#2a367a">
        <path d="M200,800 Q220,750 240,780 L240,850 L200,850 Z" />
        <path d="M300,830 Q320,780 340,800 L340,850 L300,850 Z" />
        <path d="M400,810 Q420,760 440,790 L440,850 L400,850 Z" />
        <path d="M500,825 Q520,775 540,805 L540,850 L500,850 Z" />
        <path d="M600,815 Q620,765 640,795 L640,850 L600,850 Z" />
        <path d="M700,830 Q720,780 740,810 L740,850 L700,850 Z" />
        <path d="M800,820 Q820,770 840,800 L840,850 L800,850 Z" />
      </g>
      
      {/* Siluetas de personas */}
      <g fill="#2a367a" opacity="0.6">
        <ellipse cx="250" cy="900" rx="30" ry="20" />
        <ellipse cx="350" cy="900" rx="30" ry="20" />
        <ellipse cx="450" cy="900" rx="30" ry="20" />
        <ellipse cx="550" cy="900" rx="30" ry="20" />
        <ellipse cx="650" cy="900" rx="30" ry="20" />
        <ellipse cx="750" cy="900" rx="30" ry="20" />
      </g>
    </svg>
  );
};

export default FondoEditorialMedios;
