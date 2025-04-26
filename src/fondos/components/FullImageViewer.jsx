import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar una imagen a pantalla completa
 * Ajusta la imagen para mostrarla completa manteniendo proporciones
 */
const FullImageViewer = ({ imageId, alt }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para calcular las dimensiones óptimas
    const calculateDimensions = () => {
      setLoading(true);
      
      // Obtener las dimensiones de la ventana disponible (con márgenes)
      const maxWidth = Math.min(window.innerWidth - 40, 1200);
      const maxHeight = 650; // Altura máxima para que quede bien en la página
      
      // Crear un objeto de imagen para obtener las dimensiones reales
      const img = new Image();
      img.onload = () => {
        // Calcular el ratio de aspecto de la imagen
        const imageRatio = img.width / img.height;
        
        // Determinar las dimensiones óptimas manteniendo la proporción
        let width, height;
        
        if (img.width / maxWidth > img.height / maxHeight) {
          // La imagen es más ancha proporcionalmente
          width = maxWidth;
          height = width / imageRatio;
        } else {
          // La imagen es más alta proporcionalmente
          height = maxHeight;
          width = height * imageRatio;
        }
        
        setDimensions({ width, height });
        setLoading(false);
      };
      
      img.onerror = () => {
        console.error('Error al cargar la imagen');
        setDimensions({ width: maxWidth, height: 400 });
        setLoading(false);
      };
      
      // Intentar cargar primero PNG, y si falla, intentar SVG
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
      <div style={{ 
        width: '100%', 
        height: '400px', 
        backgroundColor: '#1a2a3a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div>Cargando imagen...</div>
      </div>
    );
  }
  
  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      margin: '0 auto 30px auto',
      backgroundColor: '#1a2a3a',
      padding: '15px 0'
    }}>
      <img 
        src={`/images/fondos/fondo-${imageId}.png`} 
        alt={alt || `Imagen ${imageId}`}
        style={{ 
          width: dimensions.width,
          height: dimensions.height,
          objectFit: 'contain',
          display: 'block',
          margin: '0 auto'
        }}
        onError={(e) => {
          // Si falla la carga de PNG, intentar con SVG
          e.target.onerror = null;
          e.target.src = `/images/fondos/fondo-${imageId}.svg`;
          // Si también falla SVG, usar placeholder
          e.target.onerror = () => {
            e.target.onerror = null;
            e.target.src = "/images/placeholder-400x200.svg";
          };
        }}
      />
    </div>
  );
};

export default FullImageViewer;