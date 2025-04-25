import React from 'react';

/**
 * Colección centralizada para mostrar imágenes PNG de los fondos
 * @param {number} id - ID del fondo
 * @param {object} props - Propiedades adicionales para la imagen
 * @returns {JSX.Element} Componente de imagen correspondiente al ID
 */
const FondosSvgCollection = ({ id, title, ...props }) => {
  // Convertir a número si es string
  const fondoId = parseInt(id);
  
  // Usar imagen PNG en lugar de SVG interno
  return (
    <img 
      src={`/images/fondos/fondo-${fondoId}.png`}
      alt={title || `Fondo #${fondoId}`}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={(e) => {
        // Si falla la carga de PNG, usar placeholder
        e.target.onerror = null;
        e.target.src = "/images/placeholder-400x200.svg";
      }}
      {...props}
    />
  );
};

export default FondosSvgCollection;