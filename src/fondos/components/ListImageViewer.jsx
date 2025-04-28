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
      console.log(`🔍 Origen para imágenes absolutas: ${origin}`);
      
      // Probar con múltiples formatos de archivo y patrones de nombre
      const tryLoadImage = (index = 0) => {
        setLoadingAttempts(prev => prev + 1);
        
        // PRIMERA PRIORIDAD: Rutas que sabemos existen en el despliegue local
        const imagePaths = [
          // Rutas específicas para Vercel que sabemos funcionan
          `${origin}/images/${imageId}-fondo.png`,  // Formato para fondos 1, 2, 3, 9
          `${origin}/images/${imageId}-${nameMap[imageId] || ''}.png`, // Formato para otros fondos en raíz
          `${origin}/images/fondos/${imageId}-${nameMap[imageId] || ''}.png`, // Formato en subcarpeta fondos
          
          // Rutas relativas para entorno local
          `/images/${imageId}-fondo.png`,
          `/images/${imageId}-${nameMap[imageId] || ''}.png`,
          `/images/fondos/${imageId}-${nameMap[imageId] || ''}.png`,
          
          // Formatos alternativos y fallbacks
          `/imagenFondos/fondo-${imageId}.png`,
          `/imagenFondos/fondo-${imageId}.svg`,
          `/fondos/fondo-${imageId}.png`,
          `/fondos/fondo-${imageId}.svg`,
          `/images/fondos/fondo-${imageId}.png`,
          `/images/fondos/fondo-${imageId}.svg`,
          
          // Fallback final a placeholder
          "/images/placeholder-400x200.svg"
        ];
        
        if (index >= imagePaths.length) {
          // Si no se encuentra ninguna imagen, usar placeholder absoluto
          const placeholderPath = `${origin}/images/placeholder-400x200.svg`;
          console.log(`⚠️ Usando placeholder después de ${loadingAttempts} intentos: ${placeholderPath}`);
          img.src = placeholderPath;
          setImageSrc(placeholderPath);
          return;
        }
        
        img.onerror = () => {
          // Si esta ruta falla, intentar con la siguiente
          console.log(`❌ Error cargando imagen: ${imagePaths[index]}, intento ${index + 1}/${imagePaths.length}`);
          tryLoadImage(index + 1);
        };
        
        console.log(`🔄 Intentando cargar imagen ${imageId} desde: ${imagePaths[index]}`);
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
    
    // Obtener el origen para rutas absolutas
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    
    // Nombres de fondos basados en la nueva nomenclatura
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

    // Intentar con el nuevo formato primero (con ruta absoluta)
    if (['1', '2', '3', '9'].includes(imageId)) {
      return `${origin}/images/${imageId}-fondo.png`;
    } else if (nameMap[imageId]) {
      return `${origin}/images/${imageId}-${nameMap[imageId]}.png`;
    }
    
    // Fallback a formato anterior
    return `${origin}/images/fondos/${imageId}-${nameMap[imageId] || ''}.png`;
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
          console.log(`❌ Error inicial con imagen ${imageId}, iniciando cadena de fallbacks`);
          
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
            
            // Obtener el origen para rutas absolutas
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            
            // Combinamos rutas absolutas y relativas para máxima compatibilidad
            const fallbacks = [
              // Rutas absolutas (más confiables en producción)
              `${origin}/images/fondos/${imageId}-${nameMap[imageId] || ''}.png`,
              `${origin}/images/${imageId}-fondo.png`,
              `${origin}/images/${imageId}-${nameMap[imageId] || ''}.png`,
              
              // Rutas relativas (pueden funcionar en entorno local)
              `/images/fondos/${imageId}-${nameMap[imageId] || ''}.png`,
              `/images/${imageId}-fondo.png`,
              `/images/${imageId}-${nameMap[imageId] || ''}.png`,
              
              // Formatos antiguos
              `/imagenFondos/fondo-${imageId}.png`,
              `/imagenFondos/fondo-${imageId}.svg`,
              
              // Placeholder como último recurso
              `${origin}/images/placeholder-400x200.svg`,
              "/images/placeholder-400x200.svg"
            ];
            
            if (fallbackIndex >= fallbacks.length) {
              console.log(`⚠️ No se pudo cargar ninguna imagen para el fondo ${imageId} después de ${fallbacks.length} intentos`);
              e.target.src = `${origin}/images/placeholder-400x200.svg`;
              return;
            }
            
            e.target.onerror = () => {
              console.log(`❌ Fallback ${fallbackIndex + 1}/${fallbacks.length} falló: ${fallbacks[fallbackIndex]}`);
              tryFallbacks(fallbackIndex + 1);
            };
            
            console.log(`🔄 Probando fallback ${fallbackIndex + 1}/${fallbacks.length}: ${fallbacks[fallbackIndex]}`);
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