import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar una imagen en la vista de listado
 * Version con consola de debug para entender qué está pasando
 */
const ListImageViewer = ({ imageId, alt, className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Mapeo de IDs a nombres de archivos REALES
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
  
  // Construir ruta de imagen - usando la estructura correcta
  const imagePath = `/contenido-herejiaecon/imagenesfondos/${imageNames[imageId]}`;
  
  useEffect(() => {
    console.log('=== DEBUG ListImageViewer ===');
    console.log('imageId:', imageId);
    console.log('imagePath:', imagePath);
    console.log('imageNames[imageId]:', imageNames[imageId]);
  }, [imageId, imagePath]);
  
  const handleImageLoad = () => {
    console.log('✅ Imagen cargada correctamente:', imagePath);
    setLoading(false);
    setError(false);
  };
  
  const handleImageError = () => {
    console.error('❌ Error al cargar imagen:', imagePath);
    console.log('Intentando rutas alternativas...');
    setLoading(false);
    setError(true);
  };
  
  if (loading) {
    return (
      <div className={className} style={{ 
        backgroundColor: '#1a2a3a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '250px',
        flexDirection: 'column'
      }}>
        <div style={{ color: '#fff', marginBottom: '10px' }}>Cargando imagen...</div>
        <div style={{ color: '#aaa', fontSize: '0.8rem' }}>ID: {imageId}</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={className} style={{ 
        backgroundColor: '#ff4444',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '250px',
        flexDirection: 'column'
      }}>
        <div style={{ color: '#fff', marginBottom: '10px' }}>Error al cargar imagen</div>
        <div style={{ color: '#ffeeee', fontSize: '0.8rem' }}>Archivo: {imagePath}</div>
        <div style={{ color: '#ffcccc', fontSize: '0.8rem', marginTop: '10px' }}>ID: {imageId}</div>
      </div>
    );
  }
  
  return (
    <div className={className} style={{ 
      backgroundColor: '#1a2a3a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '250px',
      overflow: 'hidden'
    }}>
      <img 
        src={imagePath} 
        alt={alt || `Imagen ${imageId}`}
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.3s ease'
        }}
        className="list-viewer-image"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ListImageViewer;