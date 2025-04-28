const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Mostrar información de debug
console.log('📁 Contenido del directorio actual:');
console.log(fs.readdirSync('.').join('\n'));

// Ejecutar el comando de build
console.log('🔨 Ejecutando build con webpack...');
execSync('npm run build', { stdio: 'inherit' });

// Verificar que el directorio dist existe y tiene contenido
console.log('✅ Verificando el directorio de salida (dist)...');
if (fs.existsSync('./dist')) {
  console.log('📁 Contenido del directorio dist:');
  console.log(fs.readdirSync('./dist').join('\n'));
  
  // Verificar que index.html existe
  if (fs.existsSync('./dist/index.html')) {
    console.log('✅ index.html encontrado en dist');
  } else {
    console.error('❌ index.html no encontrado en dist');
  }
} else {
  console.error('❌ El directorio dist no existe después del build');
}

console.log('✅ Build completado');
