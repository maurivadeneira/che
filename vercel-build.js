const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ejecutar los scripts de corrección si existen
try {
  if (fs.existsSync(path.join(__dirname, 'fixDoubleExtension.js'))) {
    console.log('🔧 Ejecutando fixDoubleExtension.js...');
    execSync('node fixDoubleExtension.js', { stdio: 'inherit' });
  }
  
  if (fs.existsSync(path.join(__dirname, 'correctionAfterExtensions.js'))) {
    console.log('🔧 Ejecutando correctionAfterExtensions.js...');
    execSync('node correctionAfterExtensions.js', { stdio: 'inherit' });
  }
  
  if (fs.existsSync(path.join(__dirname, 'fix-images.js'))) {
    console.log('🔧 Ejecutando fix-images.js...');
    execSync('node fix-images.js', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('❌ Error en scripts de preparación:', error);
}

// Ejecutar el build normal
console.log('🏗️ Iniciando build de webpack...');
try {
  execSync('webpack --mode production', { stdio: 'inherit' });
  console.log('✅ Build de webpack completado');
} catch (error) {
  console.error('❌ Error en webpack build:', error);
  process.exit(1);
}

// Copiar assets
console.log('📁 Copiando assets...');
try {
  // Asegurarse de que existan los directorios de destino
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
  }
  
  // Copiar public a dist
  execSync('npm run copy-assets', { stdio: 'inherit' });
  console.log('✅ Assets copiados correctamente');
} catch (error) {
  console.error('❌ Error copiando assets:', error);
}

// Copiar imágenes
console.log('🖼️ Copiando imágenes...');
try {
  execSync('npm run copy-images', { stdio: 'inherit' });
  console.log('✅ Imágenes copiadas correctamente');
} catch (error) {
  console.error('❌ Error copiando imágenes:', error);
}

console.log('🎉 Build para Vercel completado');
