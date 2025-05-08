const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Asegurar que el directorio temp existe
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log(`Directorio creado: ${tempDir}`);
} else {
  console.log(`Directorio temp existe: ${tempDir}`);
}

// Además, verifica que sea escribible
try {
  const testFile = path.join(tempDir, 'test.txt');
  fs.writeFileSync(testFile, 'Test de escritura');
  fs.unlinkSync(testFile);
  console.log('El directorio temp es escribible');
} catch (error) {
  console.error('ERROR: El directorio temp no es escribible:', error);
}

exports.generatePDF = async (req, res) => {
  try {
    const { kitData } = req.body;
    
    // Verificar datos mínimos requeridos
    if (!kitData || !kitData.clientName || !kitData.clientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Datos del cliente incompletos'
      });
    }
    
    // Crear nombre de archivo único
    const fileName = `kit2_${kitData.clientName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../temp', fileName);
    
    // Generar el PDF
    await createPDF(kitData, filePath);
    
    console.log(`PDF generado: ${filePath}`);
    
    // En una implementación completa, aquí enviaríamos el PDF por correo
    // await sendPDFByEmail(kitData.clientEmail, filePath, fileName);
    
    // Responder con éxito y la ruta al archivo
    res.json({
      success: true,
      message: 'PDF generado correctamente',
      pdfUrl: `/temp/${fileName}` // URL relativa para acceder al archivo
    });
    
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar PDF',
      error: error.message
    });
  }
};

// Función para crear PDF con PDFKit
const createPDF = (kitData, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear documento PDF
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      // Configurar eventos
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
      
      // Pipe al stream
      doc.pipe(stream);
      
      // URL para activación
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const invitationId = `kit_${kitData.clientName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
      const activationUrl = `${baseUrl}/registro?invited_by=${invitationId}`;
      
      // Si es versión de prueba, agregar marca de agua y encabezado
      if (kitData.isTestVersion) {
        // Función para agregar marca de agua en todas las páginas
        const addWatermark = () => {
          // Guardar estado
          doc.save();
          
          // Configurar marca de agua
          doc.fontSize(60)
            .fillColor('rgba(244, 67, 54, 0.2)')
            .rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] })
            .text('VERSIÓN DE PRUEBA', doc.page.width / 2 - 250, doc.page.height / 2 - 30, {
              align: 'center'
            });
          
          // Restaurar estado
          doc.restore();
        };
        
        // Agregar eventos para cada página
        doc.on('pageAdded', addWatermark);
        
        // Agregar marca de agua a la primera página
        addWatermark();
        
        // Agregar encabezado de prueba
        doc.rect(50, 30, doc.page.width - 100, 30)
          .fillAndStroke('#f44336', '#f44336');
        doc.fillColor('white'