import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar una imagen a pantalla completa
 * Ajusta la imagen para mostrarla completa manteniendo proporciones
 */
const FullImageViewer = ({ imageId, alt }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

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
      
      // Probar con múltiples formatos de archivo y patrones de nombre
      const tryLoadImage = (index = 0) => {
        const imagePaths = [
          `/contenido-herejiaecon/imagenesfondos/fondo-${imageId}.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Inversion.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Editorial.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Sanacion.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Vivienda.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-recreacion.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-sistemas.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Bancario.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-ProyectosIngenieria.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Comercial.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-InvestigacionCiencia.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-ArteCultura.png`,
          `/contenido-herejiaecon/imagenesfondos/fondo-${imageId}.svg`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Inversion.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Editorial.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Sanacion.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Vivienda.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-recreacion.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-sistemas.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Bancario.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-ProyectosIngenieria.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-Comercial.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-InvestigacionCiencia.png`,
          `/contenido-herejiaecon/imagenesfondos/${imageId}-ArteCultura.png`
        ];
        
        if (index >= imagePaths.length) {
          // Si no se encuentra ninguna imagen, usar placeholder
          img.src = "/contenido-herejiaecon/imagenesfondos/placeholder.svg";
          setImageSrc("/contenido-herejiaecon/imagenesfondos/placeholder.svg");
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
  
  // Determinar la ruta de la imagen basada en el ID y diferentes formatos posibles
  const getImageSrc = () => {
    if (imageSrc) return imageSrc;
    
    // Estos son los nombres alternativos según el ID
    const nameMap = {
      '1': 'Inversion',
      '2': 'Editorial',
      '3': 'Sanacion',
      '4': 'Vivienda',
      '5': 'recreacion',
      '6': 'sistemas',
      '7': 'Bancario',
      '8': 'ProyectosIngenieria',
      '9': 'Comercial',
      '10': 'InvestigacionCiencia',
      '11': 'ArteCultura'
    };
    
    // Si existe un nombre para este ID, usar el formato alternativo
    if (nameMap[imageId]) {
      return `/contenido-herejiaecon/imagenesfondos/${imageId}-${nameMap[imageId]}.png`;
    }
    
    // Caso por defecto
    return `/contenido-herejiaecon/imagenesfondos/fondo-${imageId}.png`;
  };
  
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
        src={getImageSrc()} 
        alt={alt || `Imagen ${imageId}`}
        style={{ 
          width: dimensions.width,
          height: dimensions.height,
          objectFit: 'contain',
          display: 'block',
          margin: '0 auto'
        }}
        onError={(e) => {
          // Intentar diferentes rutas en caso de error
          e.target.onerror = null;
          
          // Probar con formato SVG
          e.target.src = `/contenido-herejiaecon/imagenesfondos/fondo-${imageId}.svg`;
          
          // Si SVG falla, intentar con ruta directa a images
          e.target.onerror = () => {
            e.target.onerror = null;
            const nameMap = {
              '1': 'Inversion',
              '2': 'Editorial',
              '3': 'Sanacion',
              '4': 'Vivienda',
              '5': 'recreacion',
              '6': 'sistemas',
              '7': 'Bancario',
              '8': 'ProyectosIngenieria',
              '9': 'Comercial',
              '10': 'InvestigacionCiencia',
              '11': 'ArteCultura'
            };
            
            if (nameMap[imageId]) {
              e.target.src = `/contenido-herejiaecon/imagenesfondos/${imageId}-${nameMap[imageId]}.png`;
              
              // Si eso también falla, usar placeholder
              e.target.onerror = () => {
                e.target.onerror = null;
                e.target.src = "/contenido-herejiaecon/imagenesfondos/placeholder.svg";
              };
            } else {
              // Si no hay mapeo, usar placeholder
              e.target.src = "/contenido-herejiaecon/imagenesfondos/placeholder.svg";
            }
          };
        }}
      />
    </div>
  );
};

export default FullImageViewer;