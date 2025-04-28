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

Se actualizó el componente `ListImageViewer.jsx` para buscar las imágenes en múltiples rutas, incluyendo:
- `/imagenFondos/fondo-${imageId}.svg` (prioritario)
- `/imagenFondos/fondo-${imageId}.png`
- `/fondos/fondo-${imageId}.svg`
- `/fondos/fondo-${imageId}.png`
- Y otras rutas alternativas

Se simplificó el manejo de errores para que pruebe de manera secuencial diferentes rutas si la imagen principal no se encuentra.

## ¿Por qué estos cambios deberían solucionar el problema?

1. El error en los logs de Vercel mostraba claramente que la carpeta `imagenFondos` no se estaba encontrando en el directorio `dist`
2. La modificación del script de build ahora copia la carpeta desde la raíz del proyecto
3. El componente ListImageViewer ahora busca las imágenes en múltiples ubicaciones, dando prioridad a `/imagenFondos/`

Estos cambios aseguran que tanto la carpeta como su contenido estén disponibles en el despliegue, y que el componente pueda encontrar las imágenes correctamente.
