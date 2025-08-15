// pdfService.js
const fs = require('fs');
const path = require('path');

// Comprobar si un archivo existe
exports.fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Obtener información de un archivo
exports.getFileInfo = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    console.error('Error al obtener información del archivo:', error);
    return null;
  }
};

// Eliminar archivos antiguos
exports.cleanupOldFiles = (directory, maxAgeHours = 24) => {
  try {
    if (!fs.existsSync(directory)) {
      return { success: false, message: 'El directorio no existe' };
    }

    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000; // Convertir horas a milisegundos
    let deletedCount = 0;

    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      // Ignorar el archivo .gitignore
      if (file === '.gitignore') return;
      
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtime.getTime();
      
      if (fileAge > maxAge) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    return { 
      success: true, 
      message: `Se eliminaron ${deletedCount} archivos antiguos`,
      deletedCount
    };
  } catch (error) {
    console.error('Error al limpiar archivos antiguos:', error);
    return { success: false, message: 'Error al limpiar archivos antiguos', error: error.message };
  }
};

module.exports = exports;