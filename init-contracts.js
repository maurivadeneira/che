const fs = require('fs');
const mongoose = require('mongoose');
const { Contract } = require('./models/Contract');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

async function initializeContracts() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectada');
    
    // Leer el contrato desde el archivo
    const contractContent = fs.readFileSync('./legal/contrato-autor-kit2.md', 'utf8');
    
    // Verificar si ya existe un contrato de autor activo
    const existingContract = await Contract.findOne({
      contractType: 'author',
      status: 'active'
    });
    
    if (existingContract) {
      console.log('⚠️  Ya existe un contrato de autor activo');
      console.log(`   Versión actual: ${existingContract.version}`);
      console.log('   Si quieres actualizar, cambia el status a "deprecated" primero');
      
      // Mostrar info del contrato existente
      console.log(`   Creado: ${existingContract.createdAt}`);
      console.log(`   Revisiones: ${existingContract.revisions.length}`);
      
      mongoose.disconnect();
      return;
    }
    
    // Crear nuevo contrato
    const newContract = new Contract({
      contractType: 'author',
      version: '1.0',
      title: 'Contrato de Autor - Kit2 Herejía Económica',
      content: {
        markdown: contractContent
      },
      status: 'active',
      effectiveDate: new Date(),
      createdBy: {
        userName: 'System Admin',
        role: 'admin'
      },
      jurisdiction: {
        country: 'Colombia',
        state: 'Caldas',
        laws: ['Ley de Derechos de Autor', 'Código Civil']
      }
    });
    
    await newContract.save();
    
    console.log('🎉 Contrato de autor creado exitosamente');
    console.log(`   ID: ${newContract._id}`);
    console.log(`   Versión: ${newContract.version}`);
    console.log(`   Status: ${newContract.status}`);
    console.log(`   Fecha efectiva: ${newContract.effectiveDate}`);
    
    // Cerrar conexión
    mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeContracts();
}

module.exports = { initializeContracts };