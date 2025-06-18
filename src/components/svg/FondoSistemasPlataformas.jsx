import React from 'react';

const FondoSistemasPlataformas = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1080 1080"
      width="100%"
      height="100%"
      {...props}
    >
      <defs>
        <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a5a58" />
          <stop offset="100%" stopColor="#2a8884" />
        </linearGradient>
        <linearGradient id="gradient-code" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4a9e8c" />
          <stop offset="100%" stopColor="#6cd4bc" />
        </linearGradient>
      </defs>
      
      {/* Fondo */}
      <rect width="1080" height="1080" fill="url(#gradient-bg)" />
      
      {/* Elementos de circuito */}
      <g opacity="0.6" stroke="#88c8b4" strokeWidth="3" fill="none">
        <path d="M50,100 L250,100 L250,300 L450,300 L450,500 L650,500 L650,700 L850,700 L850,900 L1050,900" />
        <path d="M50,200 L350,200 L350,400 L650,400 L650,600 L950,600" />
        <path d="M150,50 L150,250 L350,250 L350,450 L550,450 L550,650 L750,650 L750,850 L950,850" />
        <path d="M250,50 L250,150 L450,150 L450,350 L650,350 L650,550 L850,550 L850,750 L1050,750" />
        
        <circle cx="250" cy="100" r="8" fill="#88c8b4" />
        <circle cx="250" cy="150" r="8" fill="#88c8b4" />
        <circle cx="250" cy="300" r="8" fill="#88c8b4" />
        <circle cx="350" cy="200" r="8" fill="#88c8b4" />
        <circle cx="350" cy="250" r="8" fill="#88c8b4" />
        <circle cx="350" cy="400" r="8" fill="#88c8b4" />
        <circle cx="450" cy="150" r="8" fill="#88c8b4" />
        <circle cx="450" cy="300" r="8" fill="#88c8b4" />
        <circle cx="450" cy="350" r="8" fill="#88c8b4" />
        <circle cx="450" cy="500" r="8" fill="#88c8b4" />
        <circle cx="550" cy="450" r="8" fill="#88c8b4" />
        <circle cx="650" cy="350" r="8" fill="#88c8b4" />
        <circle cx="650" cy="400" r="8" fill="#88c8b4" />
        <circle cx="650" cy="500" r="8" fill="#88c8b4" />
        <circle cx="650" cy="550" r="8" fill="#88c8b4" />
        <circle cx="650" cy="600" r="8" fill="#88c8b4" />
        <circle cx="650" cy="700" r="8" fill="#88c8b4" />
        <circle cx="750" cy="650" r="8" fill="#88c8b4" />
        <circle cx="850" cy="550" r="8" fill="#88c8b4" />
        <circle cx="850" cy="700" r="8" fill="#88c8b4" />
        <circle cx="850" cy="750" r="8" fill="#88c8b4" />
        <circle cx="850" cy="900" r="8" fill="#88c8b4" />
        <circle cx="950" cy="600" r="8" fill="#88c8b4" />
        <circle cx="950" cy="850" r="8" fill="#88c8b4" />
      </g>
      
      {/* Bloques de código */}
      <g transform="translate(150, 200)">
        <rect x="0" y="0" width="200" height="150" rx="10" fill="url(#gradient-code)" opacity="0.8" />
        <line x1="20" y1="30" x2="120" y2="30" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="60" x2="160" y2="60" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="90" x2="140" y2="90" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="120" x2="100" y2="120" stroke="#1a5a58" strokeWidth="5" />
      </g>
      
      <g transform="translate(700, 150)">
        <rect x="0" y="0" width="200" height="150" rx="10" fill="url(#gradient-code)" opacity="0.8" />
        <line x1="20" y1="30" x2="120" y2="30" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="60" x2="160" y2="60" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="90" x2="140" y2="90" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="120" x2="100" y2="120" stroke="#1a5a58" strokeWidth="5" />
      </g>
      
      <g transform="translate(380, 500)">
        <rect x="0" y="0" width="200" height="150" rx="10" fill="url(#gradient-code)" opacity="0.8" />
        <line x1="20" y1="30" x2="120" y2="30" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="60" x2="160" y2="60" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="90" x2="140" y2="90" stroke="#1a5a58" strokeWidth="5" />
        <line x1="20" y1="120" x2="100" y2="120" stroke="#1a5a58" strokeWidth="5" />
      </g>
      
      {/* Ventanas/Interfaces */}
      <g transform="translate(480, 180)">
        <rect x="0" y="0" width="250" height="180" rx="10" fill="#d1d7c9" opacity="0.9" />
        <rect x="0" y="30" width="250" height="150" fill="#e8f4ed" />
        <circle cx="15" cy="15" r="5" fill="#e74c3c" />
        <circle cx="35" cy="15" r="5" fill="#f1c40f" />
        <circle cx="55" cy="15" r="5" fill="#2ecc71" />
        <rect x="20" y="50" width="210" height="30" rx="5" fill="#4a9e8c" opacity="0.6" />
        <rect x="20" y="90" width="150" height="30" rx="5" fill="#4a9e8c" opacity="0.6" />
        <rect x="20" y="130" width="190" height="30" rx="5" fill="#4a9e8c" opacity="0.6" />
      </g>
      
      <g transform="translate(200, 400)">
        <rect x="0" y="0" width="250" height="180" rx="10" fill="#d1d7c9" opacity="0.9" />
        <rect x="0" y="30" width="250" height="150" fill="#e8f4ed" />
        <circle cx="15" cy="15" r="5" fill="#e74c3c" />
        <circle cx="35" cy="15" r="5" fill="#f1c40f" />
        <circle cx="55" cy="15" r="5" fill="#2ecc71" />
        <rect x="20" y="50" width="210" height="30" rx="5" fill="#4a9e8c" opacity="0.6" />
        <rect x="20" y="90" width="150" height="30" rx="5" fill="#4a9e8c" opacity="0.6" />
        <rect x="20" y="130" width="190" height="30" rx="5" fill="#4a9e8c" opacity="0.6" />
      </g>
      
      {/* Gráfica/Dashboard */}
      <g transform="translate(620, 400)">
        <rect x="0" y="0" width="280" height="200" rx="10" fill="#d1d7c9" opacity="0.9" />
        <rect x="0" y="30" width="280" height="170" fill="#e8f4ed" />
        <circle cx="15" cy="15" r="5" fill="#e74c3c" />
        <circle cx="35" cy="15" r="5" fill="#f1c40f" />
        <circle cx="55" cy="15" r="5" fill="#2ecc71" />
        
        {/* Gráfica de barras */}
        <rect x="40" y="50" width="20" height="100" fill="#4a9e8c" />
        <rect x="80" y="70" width="20" height="80" fill="#4a9e8c" />
        <rect x="120" y="90" width="20" height="60" fill="#4a9e8c" />
        <rect x="160" y="50" width="20" height="100" fill="#4a9e8c" />
        <rect x="200" y="80" width="20" height="70" fill="#4a9e8c" />
        <line x1="30" y1="160" x2="230" y2="160" stroke="#1a5a58" strokeWidth="2" />
        
        {/* Etiquetas */}
        <rect x="40" y="170" width="180" height="15" rx="2" fill="#4a9e8c" opacity="0.6" />
      </g>
      
      {/* Servidor y conexiones */}
      <g transform="translate(860, 300)">
        <rect x="0" y="0" width="80" height="120" rx="5" fill="#d1d7c9" />
        <rect x="10" y="10" width="60" height="10" rx="2" fill="#4a9e8c" />
        <rect x="10" y="30" width="60" height="10" rx="2" fill="#4a9e8c" />
        <rect x="10" y="50" width="60" height="10" rx="2" fill="#4a9e8c" />
        <rect x="10" y="70" width="60" height="10" rx="2" fill="#4a9e8c" />
        <rect x="10" y="90" width="60" height="10" rx="2" fill="#4a9e8c" />
        
        <path d="M-40,60 L0,60" stroke="#88c8b4" strokeWidth="3" />
        <path d="M80,20 L120,20" stroke="#88c8b4" strokeWidth="3" />
        <path d="M80,100 L120,100" stroke="#88c8b4" strokeWidth="3" />
      </g>
      
      {/* Persona con dispositivo */}
      <g transform="translate(400, 750)">
        <path d="M0,0 C20,-20 40,-10 50,30 L-50,30 C-40,-10 -20,-20 0,0 Z" fill="#d1d7c9" />
        <circle cx="0" cy="-40" r="25" fill="#d1d7c9" />
        <rect x="-40" y="-20" width="80" height="50" rx="5" fill="#4a9e8c" />
        <rect x="-30" y="-10" width="60" height="30" rx="2" fill="#e8f4ed" />
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#1a5a58" strokeWidth="2" />
        <line x1="-20" y1="10" x2="10" y2="10" stroke="#1a5a58" strokeWidth="2" />
      </g>
      
      {/* Dispositivos conectados */}
      <g transform="translate(100, 800)">
        <rect x="0" y="0" width="60" height="100" rx="5" fill="#d1d7c9" />
        <rect x="5" y="10" width="50" height="70" rx="2" fill="#e8f4ed" />
        <rect x="20" y="85" width="20" height="5" rx="2" fill="#4a9e8c" />
        <path d="M60,40 L100,40" stroke="#88c8b4" strokeWidth="3" />
      </g>
      
      <g transform="translate(700, 800)">
        <rect x="0" y="0" width="80" height="50" rx="5" fill="#d1d7c9" />
        <rect x="10" y="10" width="60" height="30" rx="2" fill="#e8f4ed" />
        <path d="M0,25 L-40,25" stroke="#88c8b4" strokeWidth="3" />
      </g>
      
      <g transform="translate(850, 700)">
        <circle cx="0" cy="0" r="30" fill="#d1d7c9" />
        <circle cx="0" cy="0" r="20" fill="#e8f4ed" />
        <circle cx="0" cy="0" r="5" fill="#4a9e8c" />
        <path d="M-30,0 L-70,0" stroke="#88c8b4" strokeWidth="3" />
      </g>
      
      {/* Base de datos */}
      <g transform="translate(100, 600)">
        <path d="M0,0 Q40,-20 80,0 L80,60 Q40,80 0,60 Z" fill="#d1d7c9" />
        <path d="M0,0 Q40,20 80,0" fill="none" stroke="#4a9e8c" strokeWidth="2" />
        <path d="M0,20 Q40,40 80,20" fill="none" stroke="#4a9e8c" strokeWidth="2" />
        <path d="M0,40 Q40,60 80,40" fill="none" stroke="#4a9e8c" strokeWidth="2" />
        <path d="M80,30 L120,30" stroke="#88c8b4" strokeWidth="3" />
      </g>
      
      {/* Nube */}
      <g transform="translate(820, 500)">
        <path d="M0,40 Q-20,0 -40,20 Q-80,-20 -100,20 Q-130,10 -120,40 Q-140,60 -110,70 Q-120,100 -80,90 Q-80,110 -50,100 Q-30,120 0,100 Q30,110 40,80 Q70,90 60,60 Q80,40 50,30 Q40,0 0,40 Z" 
          fill="#d1d7c9" opacity="0.8" />
        <path d="M-60,50 L-60,70 M-30,60 L-30,80 M0,50 L0,70 M30,60 L30,80" 
          stroke="#4a9e8c" strokeWidth="3" />
      </g>
    </svg>
  );
};

export default FondoSistemasPlataformas;
