import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar una imagen en la vista de listado
 * Ajusta la imagen para mostrarla completa manteniendo proporciones
 */
const ListImageViewer = ({ imageId, alt, className }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [loadingAttempts, setLoadingAttempts] = useState(0);

  useEffect(() => {
    // Función para calcular las dimensiones óptimas
    const calculateDimensions = () => {
      setLoading(true);
      setLoadingAttempts(0);
      
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
        console.log(`✅ Imagen ${imageId} cargada exitosamente desde: ${img.src}`);
      };
      
      img.onerror = () => {
        console.error(`Error al cargar la imagen ${imageId}`);
        setDimensions({ width: 400, height: 250 });
        setLoading(false);
      };
      
      // Mapeo de nombres para los fondos basado en la estructura actual de archivos
      const nameMap = {
        '1': 'Proyectos',
        '2': 'Mediosaudiovisuales',
        '3': 'Sanacion',
        '4': 'Vivienda',
        '5': 'recreacion',
        '6': 'sistemas',
        '7': 'Bancario',
        '8': 'ProyectosIngenieria',
        '9': 'Comercio',
        '10': 'InvestigacionCiencia',
        '11': 'ArteCultura'
      };
      
      // Obtener el origen para rutas absolutas
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Probar con múltiples formatos de archivo y patrones de nombre
      const tryLoadImage = (index = 0) => {
        setLoadingAttempts(prev => prev + 1);
        
        // Rutas para probar, balanceadas para funcionar en local y en producción
        const imagePaths = [
          // Local - Estas rutas funcionaban antes
          `/images/fondos/fondo-${imageId}.png`,
          `/images/fondos/${imageId}-${nameMap[imageId]}.png`,
          `/images/${imageId}-fondo.png`,
          
          // Rutas alternativas basadas en la estructura vista en VS Code
          `/fondos/${imageId}-${nameMap[imageId]}.png`,
          `/fondos/${imageId}-fondo.png`,
          
          // Rutas absolutas para Vercel
          `${origin}/images/fondos/fondo-${imageId}.png`,
          `${origin}/images/fondos/${imageId}-${nameMap[imageId]}.png`,
          `${origin}/images/${imageId}-fondo.png`,
          `${origin}/fondos/${imageId}-${nameMap[imageId]}.png`,
          
          // Fallbacks
          `/imagenFondos/fondo-${imageId}.svg`,
          `/imagenFondos/fondo-${imageId}.png`,
          
          // Placeholder como último recurso
          "/images/placeholder-400x200.jpg",
          "/images/placeholder-400x200.svg"
        ];
        
        if (index >= imagePaths.length) {
          // Si no se encuentra ninguna imagen, usar placeholder
          const placeholderPath = "/images/placeholder-400x200.svg";
          console.log(`⚠️ Usando placeholder después de ${loadingAttempts} intentos`);
          img.src = placeholderPath;
          setImageSrc(placeholderPath);
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
        height: '250px',
        flexDirection: 'column'
      }}>
        <div style={{ color: '#fff', marginBottom: '10px' }}>Cargando imagen...</div>
        <div style={{ color: '#aaa', fontSize: '0.8rem' }}>Intento {loadingAttempts}</div>
      </div>
    );
  }
  
  // Determinar la ruta de la imagen basada en el ID y diferentes formatos posibles
  const getImageSrc = () => {
    if (imageSrc) return imageSrc;
    
    // Ruta que funcionaba anteriormente en local
    return `/images/fondos/fondo-${imageId}.png`;
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
            // Mapeo de nombres para los fondos
            const nameMap = {
              '1': 'Proyectos',
              '2': 'Mediosaudiovisuales',
              '3': 'Sanacion',
              '4': 'Vivienda',
              '5': 'recreacion',
              '6': 'sistemas',
              '7': 'Bancario',
              '8': 'ProyectosIngenieria',
              '9': 'Comercio',
              '10': 'InvestigacionCiencia',
              '11': 'ArteCultura'
            };
            
            // Rutas que funcionan en local y en producción
            const fallbacks = [
              // Local
              `/images/fondos/fondo-${imageId}.png`,
              `/images/fondos/${imageId}-${nameMap[imageId]}.png`,
              `/images/${imageId}-fondo.png`,
              
              // VS Code estructura
              `/fondos/${imageId}-${nameMap[imageId]}.png`,
              `/fondos/${imageId}-fondo.png`,
              
              // Placeholder como último recurso
              "/images/placeholder-400x200.jpg",
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