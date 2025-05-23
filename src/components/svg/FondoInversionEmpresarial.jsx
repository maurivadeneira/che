import React from 'react';

const FondoInversionEmpresarial = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1080 1080"
      width="100%"
      height="100%"
      {...props}
    >
      <rect x="0" y="0" width="1080" height="1080" fill="#1a5a58"/>
      <g>
        {/* Fondo y elementos decorativos */}
        <path d="M0,0 L1080,0 L1080,1080 L0,1080 Z" fill="#1a5a58"/>
        
        {/* Plantas y elementos naturales */}
        <path d="M150,350 Q200,300 180,250 Q220,270 240,230 Q260,250 280,220 L280,600 L100,600 Z" fill="#8abeaa"/>
        <path d="M100,450 Q120,420 110,380 Q130,400 150,380 L150,600 L80,600 Z" fill="#a5cfb7"/>
        
        {/* Panel solar */}
        <rect x="150" y="380" width="100" height="60" fill="#102f2e" stroke="#d1d7c9" strokeWidth="2"/>
        <line x1="150" y1="400" x2="250" y2="400" stroke="#d1d7c9" strokeWidth="1"/>
        <line x1="150" y1="420" x2="250" y2="420" stroke="#d1d7c9" strokeWidth="1"/>
        <line x1="170" y1="380" x2="170" y2="440" stroke="#d1d7c9" strokeWidth="1"/>
        <line x1="190" y1="380" x2="190" y2="440" stroke="#d1d7c9" strokeWidth="1"/>
        <line x1="210" y1="380" x2="210" y2="440" stroke="#d1d7c9" strokeWidth="1"/>
        <line x1="230" y1="380" x2="230" y2="440" stroke="#d1d7c9" strokeWidth="1"/>
        <path d="M195,440 L170,470 L230,470 Z" fill="#102f2e"/>
        
        {/* Ventana de navegador */}
        <rect x="220" y="120" width="130" height="100" rx="10" ry="10" fill="#d1d7c9"/>
        <rect x="220" y="150" width="130" height="70" rx="0" ry="0" fill="#b3e6cc"/>
        <circle cx="235" cy="135" r="5" fill="#4a9e8c"/>
        <circle cx="250" cy="135" r="5" fill="#4a9e8c"/>
        <rect x="270" y="130" width="60" height="10" rx="5" ry="5" fill="#4a9e8c"/>
        
        {/* Ventana de comercio */}
        <rect x="440" y="120" width="130" height="100" rx="10" ry="10" fill="#d1d7c9"/>
        <rect x="440" y="150" width="130" height="70" rx="0" ry="0" fill="#b3e6cc"/>
        <circle cx="455" cy="135" r="5" fill="#4a9e8c"/>
        <circle cx="470" cy="135" r="5" fill="#4a9e8c"/>
        <path d="M505,125 L495,145 L515,145 Z" fill="#4a9e8c"/>
        <rect x="490" y="170" width="30" height="30" fill="#4a9e8c"/>
        <path d="M490,180 L520,180 M490,190 L520,190" stroke="#b3e6cc" strokeWidth="2"/>
        <path d="M500,170 L500,200 M510,170 L510,200" stroke="#b3e6cc" strokeWidth="2"/>
        
        {/* Gráfica circular */}
        <circle cx="150" cy="680" r="70" fill="#4a9e8c" stroke="#d1d7c9" strokeWidth="2"/>
        <path d="M150,680 L150,610 A70,70 0 0,1 215,660 Z" fill="#e8cd76"/>
        <path d="M150,680 L215,660 A70,70 0 0,1 170,750 Z" fill="#88c8b4"/>
        <circle cx="150" cy="680" r="20" fill="#1a5a58"/>
        
        {/* Globo terráqueo */}
        <circle cx="600" cy="300" r="80" fill="#4a9e8c"/>
        <path d="M540,260 Q580,230 610,250 Q650,270 670,250" fill="none" stroke="#88c8b4" strokeWidth="5"/>
        <path d="M530,280 Q570,310 600,300 Q640,290 670,310" fill="none" stroke="#88c8b4" strokeWidth="5"/>
        <path d="M530,320 Q560,340 620,330 Q650,320 670,340" fill="none" stroke="#88c8b4" strokeWidth="5"/>
        
        {/* Fábrica */}
        <rect x="800" y="350" width="150" height="130" fill="#1d4747"/>
        <rect x="840" y="300" width="20" height="50" fill="#1d4747"/>
        <rect x="880" y="280" width="25" height="70" fill="#1d4747"/>
        <path d="M840,300 L850,270 L860,300 Z" fill="#4a9e8c"/>
        <path d="M880,280 L892.5,240 L905,280 Z" fill="#4a9e8c"/>
        <rect x="820" y="380" width="30" height="50" rx="5" ry="5" fill="#88c8b4"/>
        <rect x="870" y="380" width="30" height="50" rx="5" ry="5" fill="#88c8b4"/>
        <path d="M860,330 Q880,310 900,330" fill="none" stroke="#88c8b4" strokeWidth="3"/>
        
        {/* Persona con tablet */}
        <path d="M850,650 C870,630 890,640 900,680 L830,680 C840,640 830,670 850,650 Z" fill="#1d4747"/>
        <circle cx="850" cy="630" r="30" fill="#1d4747"/>
        <rect x="780" y="580" width="70" height="90" rx="5" ry="5" fill="#88c8b4"/>
        <path d="M800,600 L830,600 M800,620 L830,620 M800,640 L815,640" stroke="#1d4747" strokeWidth="3"/>
        <path d="M760,620 C770,600 780,620 770,630" fill="none" stroke="#1d4747" strokeWidth="6"/>
        
        {/* Líneas conectoras */}
        <path d="M300,150 Q400,100 500,150" fill="none" stroke="#e8cd76" strokeWidth="4"/>
        <path d="M300,180 Q450,220 600,300" fill="none" stroke="#b3e6cc" strokeWidth="4"/>
        <path d="M530,340 Q500,500 400,600 Q300,700 220,680" fill="none" stroke="#e8cd76" strokeWidth="4"/>
        <path d="M600,370 Q650,450 700,500 Q750,550 780,630" fill="none" stroke="#b3e6cc" strokeWidth="4"/>
        
        {/* Conexión con la fábrica */}
        <path d="M700,300 Q750,320 800,350" fill="none" stroke="#e8cd76" strokeWidth="4"/>
        
        {/* Elementos adicionales */}
        <circle cx="550" cy="50" r="5" fill="#d1d7c9"/>
        <circle cx="650" cy="80" r="3" fill="#d1d7c9"/>
        <circle cx="750" cy="40" r="4" fill="#d1d7c9"/>
        <circle cx="450" cy="70" r="2" fill="#d1d7c9"/>
        <circle cx="850" cy="100" r="3" fill="#d1d7c9"/>
        <circle cx="350" cy="60" r="2" fill="#d1d7c9"/>
        <circle cx="950" cy="50" r="4" fill="#d1d7c9"/>
        <circle cx="500" cy="30" r="3" fill="#d1d7c9"/>
        <circle cx="600" cy="100" r="2" fill="#d1d7c9"/>
        <circle cx="700" cy="70" r="3" fill="#d1d7c9"/>
        
        {/* Cohete/nave espacial */}
        <circle cx="820" cy="120" r="50" fill="none" stroke="#d1d7c9" strokeWidth="3"/>
        <path d="M780,80 L860,160" stroke="#d1d7c9" strokeWidth="10"/>
        <path d="M860,80 L780,160" stroke="#d1d7c9" strokeWidth="10"/>
        <path d="M790,90 L850,150" stroke="#4a9e8c" strokeWidth="6"/>
        <path d="M850,90 L790,150" stroke="#4a9e8c" strokeWidth="6"/>
        <circle cx="820" cy="120" r="15" fill="#1d4747"/>
        
        {/* Computadora */}
        <rect x="500" y="480" width="70" height="50" fill="#1d4747"/>
        <rect x="520" y="530" width="30" height="10" fill="#1d4747"/>
        <rect x="510" y="540" width="50" height="5" fill="#1d4747"/>
        
        {/* Más plantas */}
        <path d="M930,600 Q950,580 940,550 Q960,570 980,540 L980,680 L900,680 Z" fill="#8abeaa"/>
        <path d="M980,650 Q1000,630 990,590 Q1010,610 1030,580 L1030,720 L950,720 Z" fill="#a5cfb7"/>
      </g>
    </svg>
  );
};

export default FondoInversionEmpresarial;
