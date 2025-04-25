import React from 'react';

/**
 * Colección centralizada para mostrar imágenes PNG de los fondos
 * @param {number} id - ID del fondo
 * @param {object} props - Propiedades adicionales para la imagen
 * @returns {JSX.Element} Componente de imagen correspondiente al ID
 */
const FondosSvgCollection = ({ id, title, style, className, ...props }) => {
  // Convertir a número si es string
  const fondoId = parseInt(id);
  
  // Determinar qué estilo aplicar basado en la clase
  let defaultStyle = {};
  
  if (className === 'fondo-detail-image') {
    // Estilo para la vista detallada (mostrar imagen completa)
    defaultStyle = { 
      width: '90%', 
      height: '90%', 
      objectFit: 'contain',
      display: 'block'
    };
  } else {
    // Estilo para el listado 
    defaultStyle = { 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover',
      objectPosition: 'center 40%',
      display: 'block'
    };
  }
  
  // Combinar estilos predeterminados con los proporcionados
  const combinedStyle = { ...defaultStyle, ...style };
  
  // Usar imagen PNG en lugar de SVG interno
  return (
    <img 
      src={`/images/fondos/fondo-${fondoId}.png`}
      alt={title || `Fondo #${fondoId}`}
      style={combinedStyle}
      className={className}
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