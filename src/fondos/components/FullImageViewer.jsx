import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar imágenes con los nombres originales
 */
const FullImageViewer = ({ imageId, alt }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Mapeo de IDs a nombres de archivos
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
  
  // Construir ruta de imagen - nota la ruta actualizada
  const imagePath = `/contenido-herejiaecon/imagenesfondos/${imageNames[imageId]}`;
  
  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };
  
  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };
  
  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      position: 'relative',
      backgroundColor: loading ? '#f0f0f0' : 'transparent',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: '16px'
        }}>
          Cargando imagen...
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#d9534f',
          fontSize: '16px',
          textAlign: 'center'
        }}>
          <p>Error al cargar la imagen</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Archivo: {imagePath}
          </p>
        </div>
      )}
      
      <img
        src={imagePath}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '8px',
          display: loading || error ? 'none' : 'block'
        }}
      />
    </div>
  );
};

export default FullImageViewer;