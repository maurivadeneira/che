const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función para crear directorios recursivamente si no existen
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`✅ Creado directorio: ${directory}`);
  }
}

// Función para copiar directamente una carpeta a otra
function copyFolderSync(source, target) {
  // Crear el directorio de destino si no existe
  ensureDirectoryExists(target);
  
  // Leer los archivos y subdirectorios de la carpeta de origen
  if (fs.existsSync(source)) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const sourceFile = path.join(source, file);
      const targetFile = path.join(target, file);
      
      // Si es un directorio, copiar recursivamente
      if (fs.statSync(sourceFile).isDirectory()) {
        copyFolderSync(sourceFile, targetFile);
      } else {
        // Si es un archivo, copiarlo directamente
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✅ Copiado: ${sourceFile} -> ${targetFile}`);
      }
    });
    console.log(`✅ Carpeta copiada con éxito: ${source} -> ${target}`);
  } else {
    console.error(`❌ Carpeta de origen no existe: ${source}`);
  }
}

// Ejecutar el comando de build con webpack
console.log('🔨 Ejecutando build con webpack...');
try {
  execSync('webpack --mode production', { stdio: 'inherit' });
  console.log('✅ Build de webpack completado');
} catch (error) {
  console.error('❌ Error en el build de webpack:', error);
  process.exit(1);
}

// Asegurarse de que el directorio dist existe
ensureDirectoryExists('./dist');

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

// Copiar todos los directorios especificados
directories.forEach(dir => {
  if (fs.existsSync(dir.source)) {
    console.log(`🔍 Copiando ${dir.source} a ${dir.target}...`);
    copyFolderSync(dir.source, dir.target);
  } else {
    console.log(`⚠️ Directorio no encontrado: ${dir.source}, se omite.`);
  }
});

// Verificar que el directorio dist tiene los archivos esperados
console.log('📁 Contenido del directorio dist:');
console.log(fs.readdirSync('./dist').join('\n'));

// Verificar que index.html existe
if (fs.existsSync('./dist/index.html')) {
  console.log('✅ index.html encontrado en dist');
} else {
  console.error('❌ index.html no encontrado en dist');
}

// Verificar directorios de imágenes
['images', 'imagenFondos', 'fondos', 'assets', 'documentos'].forEach(folder => {
  if (fs.existsSync(`./dist/${folder}`)) {
    console.log(`✅ Carpeta ${folder} encontrada en dist`);
    try {
      const files = fs.readdirSync(`./dist/${folder}`);
      console.log(`📁 Contenido de ${folder}:`);
      console.log(files.join('\n'));
    } catch (error) {
      console.error(`❌ Error al leer carpeta ${folder}:`, error.message);
    }
  } else {
    console.error(`❌ Carpeta ${folder} no encontrada en dist`);
  }
});

console.log('✅ Build completado');
