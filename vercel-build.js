// Este script se utilizará por Vercel para construir el proyecto
const { execSync } = require('child_process');

// Ejecutar el comando de build
console.log('⚙️ Ejecutando build con webpack...');
execSync('npm run build', { stdio: 'inherit' });

console.log('✅ Build completado correctamente');
