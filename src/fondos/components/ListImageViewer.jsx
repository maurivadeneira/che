import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar una imagen en la vista de listado
 * Ajusta la imagen para mostrarla completa manteniendo proporciones
 */
const ListImageViewer = ({ imageId, alt, className }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para calcular las dimensiones óptimas
    const calculateDimensions = () => {
      setLoading(true);
      
      // Crear un objeto de imagen para obtener las dimensiones reales
      const img = new Image();
      img.onload = () => {
        // Calcular el ratio de aspecto de la imagen
        const imageRatio = img.width / img.height;
        
        // Para la vista de listado, usamos un contenedor fijo
        // pero calculamos proporciones correctas
        const containerWidth = 400; // Ancho aproximado de las tarjetas
        const containerHeight = 250; // Altura máxima del contenedor de imagen
        
        // Determinar las dimensiones óptimas manteniendo la proporción
        let width, height;
        
        if (containerWidth / containerHeight > imageRatio) {
          // Contenedor más ancho que la imagen
          height = Math.min(containerHeight, img.height);
          width = height * imageRatio;
        } else {
          // Contenedor más alto que la imagen
          width = Math.min(containerWidth, img.width);
          height = width / imageRatio;
        }
        
        setDimensions({ width, height });
        setLoading(false);
      };
      
      img.onerror = () => {
        console.error('Error al cargar la imagen');
        setDimensions({ width: 400, height: 250 });
        setLoading(false);
      };
      
      // Establecer la fuente de la imagen
      img.src = `/images/fondos/fondo-${imageId}.png`;
    };
    
    // Calcular dimensiones iniciales
    calculateDimensions();
    
    // Recalcular cuando cambie el tamaño de la ventana
    window.addEventListener('resize', calculateDimensions);
    
    // Limpieza
    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [imageId]);
  
  if (loading) {
    return (
      <div className={className} style={{ 
        backgroundColor: '#1a2a3a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '250px'
      }}>
        <div style={{ color: '#fff' }}>Cargando imagen...</div>
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
        src={`/images/fondos/fondo-${imageId}.png`} 
        alt={alt || `Imagen ${imageId}`}
        style={{ 
          width: dimensions.width,
          height: dimensions.height,
          objectFit: 'contain',
          display: 'block',
          transition: 'transform 0.3s ease'
        }}
        className="list-viewer-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/placeholder-400x200.svg";
        }}
      />
    </div>
  );
};

export default ListImageViewer;