import React from 'react';
import FondoInversionEmpresarial from './svg/FondoInversionEmpresarial';
import FondoEditorialMedios from './svg/FondoEditorialMedios';
import FondoSistemasPlataformas from './svg/FondoSistemesPlataformas';
import FondoProyectosIngenieria from './svg/FondoProyectosIngenieria';

/**
 * Colección centralizada de SVGs para los fondos
 * @param {number} id - ID del fondo
 * @param {object} props - Propiedades adicionales para el SVG
 * @returns {JSX.Element} Componente SVG correspondiente al ID
 */
const FondosSvgCollection = ({ id, ...props }) => {
  // Convertir a número si es string
  const fondoId = parseInt(id);
  
  // Renderizar el SVG correspondiente según el ID
  switch (fondoId) {
    case 1:
      return <FondoInversionEmpresarial {...props} />;
    case 2:
      return <FondoEditorialMedios {...props} />;
    case 6:
      return <FondoSistemasPlataformas {...props} />;
    case 8:
      return <FondoProyectosIngenieria {...props} />;
    default:
      // Placeholder para IDs sin SVG específico
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 500"
          width="100%"
          height="100%"
          {...props}
        >
          <defs>
            <linearGradient id="placeholderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e6f0ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#d9e6ff" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          <rect width="800" height="500" fill="url(#placeholderGradient)" />
          
          <g fill="#b3c9ff" opacity="0.3">
            {Array.from({ length: 30 }).map((_, i) => (
              <circle 
                key={`dot-${i}`}
                cx={Math.random() * 800} 
                cy={Math.random() * 500} 
                r={Math.random() * 4 + 1} 
              />
            ))}
          </g>
          
          <text x="400" y="225" fontFamily="Arial, sans-serif" fontSize="24" textAnchor="middle" fill="#7a94d1">
            Fondo #{fondoId}
          </text>
          <text x="400" y="260" fontFamily="Arial, sans-serif" fontSize="18" textAnchor="middle" fill="#8a9ccc">
            C.H.E. - Corporación Herejía Económica
          </text>
          
          <line x1="250" y1="310" x2="550" y2="310" stroke="#8a9ccc" strokeWidth="2" strokeDasharray="5,5" />
          
          <circle cx="400" cy="350" r="50" fill="#9b57c2" opacity="0.8" />
          <text x="400" y="356" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">
            MUNDO LIBRE
          </text>
        </svg>
      );
  }
};

export default FondosSvgCollection;
