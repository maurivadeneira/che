const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Esquema para documentos legales
const LegalDocumentSchema = new mongoose.Schema({
  documentType: {
    type: String,
    required: true,
    enum: ['author_contract', 'user_terms', 'privacy_policy', 'user_contract']
  },
  version: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'es'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'deprecated'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  approvedBy: String,
  legalReview: {
    reviewed: Boolean,
    reviewedBy: String,
    reviewDate: Date,
    notes: String
  }
});

const LegalDocument = mongoose.model('LegalDocument', LegalDocumentSchema);

// Función para cargar el contrato a MongoDB
async function loadContractToMongoDB() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB conectada');
    
    // Leer el archivo del contrato
    const contractPath = path.join(__dirname, 'legal', 'contracts', 'author-contract-v1.0.md');
    const contractContent = fs.readFileSync(contractPath, 'utf8');
    
    // Verificar si ya existe este contrato
    const existingContract = await LegalDocument.findOne({
      documentType: 'author_contract',
      version: '1.0'
    });
    
    if (existingContract) {
      console.log('📄 Contrato ya existe, actualizando...');
      existingContract.content = contractContent;
      existingContract.lastModified = new Date();
      await existingContract.save();
      console.log('✅ Contrato actualizado en MongoDB');
    } else {
      console.log('📄 Creando nuevo contrato en MongoDB...');
      
      // Crear nuevo documento legal
      const newContract = new LegalDocument({
        documentType: 'author_contract',
        version: '1.0',
        title: 'Contrato de Autor - Kit2 Herejía Económica',
        content: contractContent,
        language: 'es',
        status: 'active',
        legalReview: {
          reviewed: false,
          notes: 'Pendiente revisión legal profesional'
        }
      });
      
      await newContract.save();
      console.log('✅ Contrato guardado exitosamente en MongoDB');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  loadContractToMongoDB();
}

module.exports = { LegalDocument, loadContractToMongoDB };