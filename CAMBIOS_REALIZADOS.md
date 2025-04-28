# Cambios realizados para solucionar el problema de imágenes en Vercel

## 1. Configuración de build para incluir imagenFondos

Se modificó el archivo `vercel-build.js` para incluir la carpeta `imagenFondos` de la raíz del proyecto:

```javascript
// Copiar directorios de imágenes y recursos estáticos manualmente
const directories = [
  { source: './public/images', target: './dist/images' },
  { source: './public/imagenFondos', target: './dist/imagenFondos' },
  { source: './imagenFondos', target: './dist/imagenFondos' },  // Añadido para buscar también en la raíz
  { source: './public/fondos', target: './dist/fondos' },
  { source: './public/assets', target: './dist/assets' },
  { source: './public/documentos', target: './dist/documentos' },
  { source: './public', target: './dist' }
];
```

## 2. Modificación del componente ListImageViewer

### Primera modificación:
Se actualizó el componente `ListImageViewer.jsx` para buscar las imágenes en múltiples rutas, incluyendo:
- `/imagenFondos/fondo-${imageId}.svg` (prioritario)
- `/imagenFondos/fondo-${imageId}.png`
- `/fondos/fondo-${imageId}.svg`
- `/fondos/fondo-${imageId}.png`
- Y otras rutas alternativas

Se simplificó el manejo de errores para que pruebe de manera secuencial diferentes rutas si la imagen principal no se encuentra.

### Segunda modificación (corrección adicional):
Se adaptó el componente para que busque los archivos con los nombres actuales que tienen en la carpeta `/dist/images/`:

```javascript
// Nuevos patrones de nombre detectados en la estructura actual
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

// Rutas prioritarias para buscar imágenes
const imagePaths = [
  `/images/${imageId}-fondo.png`,
  `/images/fondos/${imageId}-${nameMap[imageId] || ''}.png`,
  `/images/${imageId}-${nameMap[imageId] || ''}.png`,
  // ... otras rutas de fallback
];
```

Esta modificación hace que el componente busque primero las imágenes en los formatos que realmente existen actualmente en el proyecto, como:
- `/images/1-fondo.png`
- `/images/fondos/1-Proyectos.png`
- `/images/5-recreacion.png`

## ¿Por qué estos cambios deberían solucionar el problema?

1. El error en los logs de Vercel mostraba claramente que la carpeta `imagenFondos` no se estaba encontrando en el directorio `dist`
2. La modificación del script de build ahora copia la carpeta desde la raíz del proyecto
3. El componente ListImageViewer ahora busca las imágenes con los nombres y en las ubicaciones exactas donde se encuentran actualmente

Estos cambios aseguran que tanto la carpeta como su contenido estén disponibles en el despliegue, y que el componente pueda encontrar las imágenes correctamente, independientemente de cuál sea el formato específico de nombre de archivo para cada fondo.