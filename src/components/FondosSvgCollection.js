import React from 'react';

/**
 * Colección centralizada para mostrar imágenes PNG de los fondos
 * @param {number} id - ID del fondo
 * @param {object} props - Propiedades adicionales para la imagen
 * @returns {JSX.Element} Componente de imagen correspondiente al ID
 */
const FondosSvgCollection = ({ id, title, style, ...props }) => {
  // Convertir a número si es string
  const fondoId = parseInt(id);
  
  // Estilos predeterminados para la imagen
  const defaultStyle = { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover',
    objectPosition: 'center center', // Centrar la imagen
    display: 'block' // Asegura que no haya espacio adicional debajo de la imagen
  };
  
  // Combinar estilos predeterminados con los proporcionados
  const combinedStyle = { ...defaultStyle, ...style };
  
  // Usar imagen PNG en lugar de SVG interno
  return (
    <img 
      src={`/images/fondos/fondo-${fondoId}.png`}
      alt={title || `Fondo #${fondoId}`}
      style={combinedStyle}
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