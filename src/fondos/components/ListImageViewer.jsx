import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar una imagen en la vista de listado
 * Ajusta la imagen para mostrarla completa manteniendo proporciones
 */
const ListImageViewer = ({ imageId, alt, className }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

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
      
      // Probar con múltiples formatos de archivo y patrones de nombre
      const tryLoadImage = (index = 0) => {
        const imagePaths = [
          `/imagenFondos/fondo-${imageId}.svg`, // Agregar la ruta a imagenFondos primero
          `/imagenFondos/fondo-${imageId}.png`,
          `/fondos/fondo-${imageId}.svg`, // Otra ruta posible
          `/fondos/fondo-${imageId}.png`,
          `/images/fondos/fondo-${imageId}.png`,
          `/images/fondos/fondo-${imageId}.svg`,
          `/images/fondos/${imageId}-Sanacion.png`,
          `/images/fondos/${imageId}-Vivienda.png`,
          `/images/fondos/${imageId}-recreacion.png`,
          `/images/fondos/${imageId}-sistemas.png`,
          `/images/fondos/${imageId}-Bancario.png`,
          `/images/fondos/${imageId}-ProyectosIngenieria.png`,
          `/images/fondos/${imageId}-Comercial.png`,
          `/images/fondos/${imageId}-InvestigacionCiencia.png`,
          `/images/fondos/${imageId}-ArteCultura.png`,
          `/images/${imageId}-Sanacion.png`,
          `/images/${imageId}-Vivienda.png`,
          `/images/${imageId}-recreacion.png`,
          `/images/${imageId}-sistemas.png`,
          `/images/${imageId}-Bancario.png`,
          `/images/${imageId}-ProyectosIngenieria.png`,
          `/images/${imageId}-Comercial.png`,
          `/images/${imageId}-InvestigacionCiencia.png`,
          `/images/${imageId}-ArteCultura.png`
        ];
        
        if (index >= imagePaths.length) {
          // Si no se encuentra ninguna imagen, usar placeholder
          img.src = "/images/placeholder-400x200.svg";
          setImageSrc("/images/placeholder-400x200.svg");
          return;
        }
        
        img.onerror = () => {
          // Si esta ruta falla, intentar con la siguiente
          tryLoadImage(index + 1);
        };
        
        img.src = imagePaths[index];
        setImageSrc(imagePaths[index]);
      };
      
      tryLoadImage();
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
  
  // Determinar la ruta de la imagen basada en el ID y diferentes formatos posibles
  const getImageSrc = () => {
    if (imageSrc) return imageSrc;
    
    // Intentar primero con la carpeta imagenFondos
    return `/imagenFondos/fondo-${imageId}.svg`;
  };
  
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
        src={getImageSrc()} 
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
          // Cadena de intentos de fallback para cargar imágenes
          const tryFallbacks = (fallbackIndex = 0) => {
            const fallbacks = [
              `/imagenFondos/fondo-${imageId}.png`,
              `/fondos/fondo-${imageId}.svg`,
              `/fondos/fondo-${imageId}.png`,
              `/images/fondos/fondo-${imageId}.png`,
              `/images/fondos/fondo-${imageId}.svg`,
              "/images/placeholder-400x200.svg"
            ];
            
            if (fallbackIndex >= fallbacks.length) {
              e.target.src = "/images/placeholder-400x200.svg";
              return;
            }
            
            e.target.onerror = () => tryFallbacks(fallbackIndex + 1);
            e.target.src = fallbacks[fallbackIndex];
          };
          
          // Iniciar la cadena de fallbacks
          e.target.onerror = null;
          tryFallbacks(0);
        }}
      />
    </div>
  );
};

export default ListImageViewer;