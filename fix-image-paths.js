const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando corrección de rutas de imágenes...');

// Asegurar que los directorios necesarios existan
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`✅ Creando directorio: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

// Copiar archivo si existe
function copyFileIfExists(source, target) {
  if (fs.existsSync(source)) {
    const targetDir = path.dirname(target);
    ensureDirectoryExists(targetDir);
    
    fs.copyFileSync(source, target);
    console.log(`✅ Copiado: ${source} -> ${target}`);
    return true;
  }
  return false;
}

// Copiar directorio recursivamente
function copyDirectoryRecursive(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`❌ Directorio no encontrado: ${sourceDir}`);
    return false;
  }

  ensureDirectoryExists(targetDir);
  
  const files = fs.readdirSync(sourceDir);
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copiado: ${sourcePath} -> ${targetPath}`);
    }
  }
  
  console.log(`✅ Carpeta copiada con éxito: ${sourceDir} -> ${targetDir}`);
  return true;
}

// Corregir rutas en el directorio dist
function fixPaths() {
  const distDir = path.resolve(__dirname, 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.log('❌ El directorio dist no existe. Ejecuta primero el build.');
    return;
  }
  
  // Crear la carpeta fondos en dist si no existe
  const fondosDir = path.join(distDir, 'fondos');
  ensureDirectoryExists(fondosDir);
  
  // Crear la carpeta imagenFondos en dist si no existe
  const imagenFondosDir = path.join(distDir, 'imagenFondos');
  ensureDirectoryExists(imagenFondosDir);
  
  // Nueva ruta desde ContenidoProyChe
  const contenidoProyChePath = path.join(__dirname, 'ContenidoProyChe');
  
  // Primero, intentar copiar desde la nueva estructura organizada
  if (fs.existsSync(contenidoProyChePath)) {
    const contenidoHerejiaPath = path.join(contenidoProyChePath, 'contenido-herejiaecon');
    if (fs.existsSync(contenidoHerejiaPath)) {
      // Copiar imágenes de fondos
      const imagenesFondosPath = path.join(contenidoHerejiaPath, 'imagenesfondos');
      if (fs.existsSync(imagenesFondosPath)) {
        console.log('✅ Copiando desde nueva estructura organizada...');
        copyDirectoryRecursive(imagenesFondosPath, imagenFondosDir);
        copyDirectoryRecursive(imagenesFondosPath, fondosDir);
        copyDirectoryRecursive(imagenesFondosPath, path.join(distDir, 'images'));
      }
    }
  } else {
    // Copiar imágenes de dist/images/fondos a dist/fondos (estructura antigua)
    copyDirectoryRecursive(path.join(distDir, 'images', 'fondos'), fondosDir);
    
    // Copiar imágenes de dist/images a dist/imagenFondos (estructura antigua)
    copyDirectoryRecursive(path.join(distDir, 'images'), imagenFondosDir);
    
    // Copiar imágenes con nombres nuevos (01_Inversion_Empresarial.png) si existen
    const sourceDir = path.join(__dirname, 'contenido-herejiaecon', 'imagenesfondos');
    if (fs.existsSync(sourceDir)) {
      copyDirectoryRecursive(sourceDir, imagenFondosDir);
      copyDirectoryRecursive(sourceDir, path.join(distDir, 'images'));
    }

    // También copiar desde public/assets/imagenesfondos si existe
    const publicAssetsDir = path.join(__dirname, 'public', 'assets', 'imagenesfondos');
    if (fs.existsSync(publicAssetsDir)) {
      copyDirectoryRecursive(publicAssetsDir, imagenFondosDir);
      copyDirectoryRecursive(publicAssetsDir, path.join(distDir, 'images'));
    }
  }
  
  console.log('✅ Corrección de rutas de imágenes completada');
}

// Ejecutar la función
fixPaths();