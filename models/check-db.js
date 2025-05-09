// check-db.js
const mongoose = require('mongoose');
const connectDB = require('../db'); // Cambia './db' a '../db' para subir un nivel

async function checkCollections() {
  try {
    // Conectar a la base de datos usando la misma función que en server.js
    await connectDB();
    console.log('Conectado a MongoDB exitosamente');
    
    // Listar todas las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nColecciones existentes:');
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Verificar colecciones específicas
    const requiredCollections = ['users', 'kits', 'invitations', 'pdfpersonalizados'];
    const existingCollections = collections.map(c => c.name);
    
    console.log('\nVerificación de colecciones necesarias:');
    requiredCollections.forEach(col => {
      console.log(`${existingCollections.includes(col) ? '✅' : '❌'} ${col}`);
    });
    
    // Cerrar conexión después de verificar
    setTimeout(() => {
      mongoose.connection.close();
      console.log('\nConexión cerrada');
      process.exit(0);
    }, 1000);
  } catch (err) {
    console.error('Error al verificar colecciones:', err);
    process.exit(1);
  }
}

// Ejecutar la función
checkCollections();