import React from 'react';

const FondoProyectosIngenieria = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1080 1080"
      width="100%"
      height="100%"
      {...props}
    >
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d4b73" />
          <stop offset="100%" stopColor="#1b2e47" />
        </linearGradient>
        <linearGradient id="blueprint-grid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#375d8f" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#375d8f" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Fondo principal */}
      <rect width="1080" height="1080" fill="url(#bg-gradient)" />
      
      {/* Grid de plano */}
      <g>
        <rect width="1080" height="1080" fill="url(#blueprint-grid)" />
        
        {/* Líneas horizontales */}
        {Array.from({ length: 22 }).map((_, i) => (
          <line 
            key={`h-${i}`}
            x1="0" 
            y1={i * 50} 
            x2="1080" 
            y2={i * 50} 
            stroke="#4a81c3" 
            strokeWidth="1"
            opacity="0.4"
          />
        ))}
        
        {/* Líneas verticales */}
        {Array.from({ length: 22 }).map((_, i) => (
          <line 
            key={`v-${i}`}
            x1={i * 50} 
            y1="0" 
            x2={i * 50} 
            y2="1080" 
            stroke="#4a81c3" 
            strokeWidth="1"
            opacity="0.4"
          />
        ))}
      </g>
      
      {/* Elementos de ingeniería */}
      
      {/* Edificio/Estructura */}
      <g transform="translate(200, 300)">
        <rect x="0" y="0" width="200" height="300" fill="#375d8f" opacity="0.7" />
        <rect x="20" y="30" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="80" y="30" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="140" y="30" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="20" y="120" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="80" y="120" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="140" y="120" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="20" y="210" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="80" y="210" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="140" y="210" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
        <rect x="80" y="280" width="40" height="60" fill="#8fb2e3" opacity="0.9" />
      </g>
      
      {/* Planos de construcción */}
      <g transform="translate(500, 150)">
        <rect x="0" y="0" width="300" height="200" fill="#d9e6fb" opacity="0.8" />
        <line x1="20" y1="20" x2="280" y2="20" stroke="#375d8f" strokeWidth="2" />
        <line x1="20" y1="50" x2="280" y2="50" stroke="#375d8f" strokeWidth="1" />
        <line x1="20" y1="80" x2="280" y2="80" stroke="#375d8f" strokeWidth="1" />
        <line x1="20" y1="110" x2="280" y2="110" stroke="#375d8f" strokeWidth="1" />
        <line x1="20" y1="140" x2="280" y2="140" stroke="#375d8f" strokeWidth="1" />
        <line x1="20" y1="170" x2="280" y2="170" stroke="#375d8f" strokeWidth="1" />
        
        <line x1="20" y1="20" x2="20" y2="170" stroke="#375d8f" strokeWidth="1" />
        <line x1="50" y1="20" x2="50" y2="170" stroke="#375d8f" strokeWidth="1" />
        <line x1="80" y1="20" x2="80" y2="170" stroke="#375d8f" strokeWidth="1" />
        <line x1="110" y1="20" x2="110" y2="170" stroke="#375d8f" strokeWidth="1" />
        <line x1="140" y1="20" x2="140" y2="170" stroke="#375d8f" strokeWidth="1" />
        <line x1="170" y1="20" x2="170" y2="170" stroke="#375d8f" strokeWidth="1" />
        <line x1="200" y1="20" x2="200" y2="170" stroke="#375d8f" strokeWidth="1" />
        <line x1="230" y1="20" x2="230" y2="170" stroke="#375d8f" strokeWidth="1" />
        <line x1="260" y1="20" x2="260" y2="170" stroke="#375d8f" strokeWidth="1" />
        
        {/* Dibujo arquitectónico */}
        <path d="M100,60 L200,60 L200,130 L100,130 Z" fill="none" stroke="#1f354d" strokeWidth="2" />
        <path d="M100,95 L140,95" stroke="#1f354d" strokeWidth="2" />
        <path d="M140,95 L140,130" stroke="#1f354d" strokeWidth="2" />
        <path d="M140,60 L140,80" stroke="#1f354d" strokeWidth="2" />
        <circle cx="170" cy="95" r="15" fill="none" stroke="#1f354d" strokeWidth="2" />
      </g>
      
      {/* Engranajes y elementos mecánicos */}
      <g transform="translate(600, 400)">
        {/* Engranaje grande */}
        <circle cx="100" cy="100" r="80" fill="#375d8f" opacity="0.7" />
        <circle cx="100" cy="100" r="20" fill="#8fb2e3" />
        
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = 100 + 80 * Math.cos(angle);
          const y1 = 100 + 80 * Math.sin(angle);
          const x2 = 100 + 100 * Math.cos(angle);
          const y2 = 100 + 100 * Math.sin(angle);
          
          return (
            <line 
              key={`gear-${i}`}
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke="#8fb2e3" 
              strokeWidth="15"
              strokeLinecap="round"
            />
          );
        })}
      </g>
      
      <g transform="translate(430, 450)">
        {/* Engranaje pequeño */}
        <circle cx="50" cy="50" r="40" fill="#375d8f" opacity="0.7" />
        <circle cx="50" cy="50" r="10" fill="#8fb2e3" />
        
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const x1 = 50 + 40 * Math.cos(angle);
          const y1 = 50 + 40 * Math.sin(angle);
          const x2 = 50 + 55 * Math.cos(angle);
          const y2 = 50 + 55 * Math.sin(angle);
          
          return (
            <line 
              key={`small-gear-${i}`}
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke="#8fb2e3" 
              strokeWidth="10"
              strokeLinecap="round"
            />
          );
        })}
      </g>
      
      {/* Conexión entre engranajes */}
      <line x1="520" y1="500" x2="550" y2="500" stroke="#8fb2e3" strokeWidth="3" />
      
      {/* Herramientas de ingeniería */}
      <g transform="translate(150, 700)">
        {/* Regla/escuadra */}
        <path d="M0,0 L180,0 L0,180 Z" fill="none" stroke="#8fb2e3" strokeWidth="3" />
        
        {Array.from({ length: 18 }).map((_, i) => (
          <line 
            key={`ruler-h-${i}`}
            x1={i * 10} 
            y1="0" 
            x2={i * 10} 
            y2={i % 2 === 0 ? 10 : 5} 
            stroke="#8fb2e3" 
            strokeWidth="1"
          />
        ))}
        
        {Array.from({ length: 18 }).map((_, i) => (
          <line 
            key={`ruler-v-${i}`}
            x1="0" 
            y1={i * 10} 
            x2={i % 2 === 0 ? 10 : 5} 
            y2={i * 10} 
            stroke="#8fb2e3" 
            strokeWidth="1"
          />
        ))}
      </g>
      
      <g transform="translate(400, 650)">
        {/* Compás */}
        <path d="M0,0 L60,100" stroke="#8fb2e3" strokeWidth="3" />
        <path d="M100,0 L40,100" stroke="#8fb2e3" strokeWidth="3" />
        <circle cx="0" cy="0" r="5" fill="#8fb2e3" />
        <circle cx="100" cy="0" r="5" fill="#8fb2e3" />
        <circle cx="50" cy="100" r="3" fill="#8fb2e3" />
        <path d="M40,100 C40,110 60,110 60,100" stroke="#8fb2e3" strokeWidth="3" fill="none" />
      </g>
      
      {/* Tuberías/conductos */}
      <g transform="translate(750, 300)">
        <path d="M0,0 C50,0 50,50 100,50 C150,50 150,100 200,100" 
          fill="none" stroke="#8fb2e3" strokeWidth="20" strokeLinecap="round" opacity="0.7" />
        <path d="M0,30 C50,30 50,80 100,80 C150,80 150,130 200,130" 
          fill="none" stroke="#8fb2e3" strokeWidth="20" strokeLinecap="round" opacity="0.7" />
          
        <circle cx="0" cy="0" r="15" fill="#375d8f" stroke="#8fb2e3" strokeWidth="3" />
        <circle cx="0" cy="30" r="15" fill="#375d8f" stroke="#8fb2e3" strokeWidth="3" />
        <circle cx="100" cy="50" r="15" fill="#375d8f" stroke="#8fb2e3" strokeWidth="3" />
        <circle cx="100" cy="80" r="15" fill="#375d8f" stroke="#8fb2e3" strokeWidth="3" />
        <circle cx="200" cy="100" r="15" fill="#375d8f" stroke="#8fb2e3" strokeWidth="3" />
        <circle cx="200" cy="130" r="15" fill="#375d8f" stroke="#8fb2e3" strokeWidth="3" />
      </g>
      
      {/* Panel de control/computadora */}
      <g transform="translate(700, 600)">
        <rect x="0" y="0" width="200" height="150" rx="10" fill="#375d8f" />
        <rect x="10" y="10" width="180" height="100" rx="5" fill="#d9e6fb" />
        
        {/* Pantalla con gráficos */}
        <line x1="20" y1="30" x2="180" y2="30" stroke="#1f354d" strokeWidth="1" />
        <line x1="20" y1="50" x2="180" y2="50" stroke="#1f354d" strokeWidth="1" />
        <line x1="20" y1="70" x2="180" y2="70" stroke="#1f354d" strokeWidth="1" />
        <line x1="20" y1="90" x2="180" y2="90" stroke="#1f354d" strokeWidth="1" />
        
        <path d="M40,20 L40,100" stroke="#1f354d" strokeWidth="1" />
        <path d="M80,20 L80,100" stroke="#1f354d" strokeWidth="1" />
        <path d="M120,20 L120,100" stroke="#1f354d" strokeWidth="1" />
        <path d="M160,20 L160,100" stroke="#1f354d" strokeWidth="1" />
        
        <path d="M20,40 L40,60 L60,30 L80,80 L100,60 L120,90 L140,40 L160,70 L180,50" 
          fill="none" stroke="#4a81c3" strokeWidth="2" />
          
        <rect x="30" y="120" width="140" height="20" rx="5" fill="#8fb2e3" />
        <rect x="40" y="125" width="20" height="10" rx="2" fill="#1f354d" />
        <rect x="80" y="125" width="20" height="10" rx="2" fill="#1f354d" />
        <rect x="120" y="125" width="20" height="10" rx="2" fill="#1f354d" />
        <rect x="160" y="125" width="10" height="10" rx="2" fill="#1f354d" />
      </g>
      
      {/* Puente/estructura civil */}
      <g transform="translate(100, 550)">
        {/* Base */}
        <rect x="0" y="100" width="300" height="20" fill="#8fb2e3" />
        
        {/* Pilares */}
        <rect x="20" y="120" width="20" height="80" fill="#8fb2e3" />
        <rect x="260" y="120" width="20" height="80" fill="#8fb2e3" />
        
        {/* Arco */}
        <path d="M20,100 C80,-20 220,-20 280,100" 
          fill="none" stroke="#8fb2e3" strokeWidth="10" />
          
        {/* Estructura */}
        <path d="M20,100 L40,80 L60,100" fill="none" stroke="#8fb2e3" strokeWidth="3" />
        <path d="M60,100 L80,80 L100,100" fill="none" stroke="#8fb2e3" strokeWidth="3" />
        <path d="M100,100 L120,80 L140,100" fill="none" stroke="#8fb2e3" strokeWidth="3" />
        <path d="M140,100 L160,80 L180,100" fill="none" stroke="#8fb2e3" strokeWidth="3" />
        <path d="M180,100 L200,80 L220,100" fill="none" stroke="#8fb2e3" strokeWidth="3" />
        <path d="M220,100 L240,80 L260,100" fill="none" stroke="#8fb2e3" strokeWidth="3" />
      </g>
      
      {/* Ingeniero con planos */}
      <g transform="translate(850, 700)">
        {/* Persona */}
        <circle cx="50" cy="50" r="25" fill="#8fb2e3" />
        <path d="M50,75 L50,130" stroke="#8fb2e3" strokeWidth="10" />
        <path d="M50,90 L20,120" stroke="#8fb2e3" strokeWidth="8" />
        <path d="M50,90 L80,120" stroke="#8fb2e3" strokeWidth="8" />
        <path d="M50,130 L30,180" stroke="#8fb2e3" strokeWidth="8" />
        <path d="M50,130 L70,180" stroke="#8fb2e3" strokeWidth="8" />
        
        {/* Plano */}
        <rect x="80" y="90" width="70" height="50" fill="#d9e6fb" />
        <line x1="90" y1="100" x2="140" y2="100" stroke="#1f354d" strokeWidth="1" />
        <line x1="90" y1="110" x2="140" y2="110" stroke="#1f354d" strokeWidth="1" />
        <line x1="90" y1="120" x2="140" y2="120" stroke="#1f354d" strokeWidth="1" />
        <line x1="90" y1="130" x2="140" y2="130" stroke="#1f354d" strokeWidth="1" />
      </g>
      
      {/* Elementos adicionales de fondo */}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle 
          key={`star-${i}`}
          cx={Math.random() * 1080} 
          cy={Math.random() * 1080} 
          r={Math.random() * 2 + 1} 
          fill="#d9e6fb" 
          opacity={Math.random() * 0.5 + 0.5} 
        />
      ))}
    </svg>
  );
};

export default FondoProyectosIngenieria;
