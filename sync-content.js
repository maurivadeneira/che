// sync-content.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = path.join(__dirname, 'ContenidoProyChe', 'contenido-herejiaecon');
const destination = path.join(__dirname, 'public', 'contenido-herejiaecon');

console.log('Ì¥Ñ Sincronizando contenido...');
console.log('Desde:', source);
console.log('Hacia:', destination);

// Eliminar destino si existe
if (fs.existsSync(destination)) {
  fs.rmSync(destination, { recursive: true, force: true });
}

// Crear directorio destino
fs.mkdirSync(destination, { recursive: true });

// Copiar recursivamente
function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDirectory(source, destination);
  console.log('‚úÖ Sincronizaci√≥n completada');
} catch (error) {
  console.error('‚ùå Error en la sincronizaci√≥n:', error);
}
