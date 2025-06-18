import React from 'react';

const FondosSvgCollection = ({ id, title, style, className, ...props }) => {
  const fondoId = parseInt(id);
  
  // Usa los nombres correctos de archivos
  const imageNames = {
    1: '01_Inversion_Empresarial.png',
    2: '02_Editorial_y_Medios.png',
    3: '03_Sanacion_Emocional.png',
    4: '04_Vivienda.png',
    5: '05_Recreacion_Social.png',
    6: '06_Sistemas_y_Plataformas.png',
    7: '07_Bancario.png',
    8: '08_Ingenieria.png',
    9: '09_Comercial.png',
    10: '10_Investigacion_Cientifica.png',
    11: '11_Arte_y_Cultura.png'
  };
  
  let defaultStyle = {};
  
  if (className === 'fondo-detail-image') {
    defaultStyle = { 
      width: '100%', 
      height: 'auto',
      maxHeight: '100%',
      objectFit: 'contain',
      display: 'block',
      padding: '10px'
    };
  } else {
    defaultStyle = { 
      width: '100%', 
      height: '100%', 
      objectFit: 'contain', // Cambia de 'cover' a 'contain'
      objectPosition: 'center 40%',
      display: 'block',
      padding: '10px'
    };
  }
  
  const combinedStyle = { ...defaultStyle, ...style };
  
  // Usa la misma ruta que funciona
  const imagePath = `/${imageNames[fondoId]}`;
  
  return (
    <img 
      src={imagePath}
      alt={title || `Fondo #${fondoId}`}
      style={combinedStyle}
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `/imagenes/fondos/placeholder.svg`;
      }}
      {...props}
    />
  );
};

export default FondosSvgCollection;