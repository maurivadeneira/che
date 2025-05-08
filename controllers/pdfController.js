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
        doc.fillColor('white');
        doc.fontSize(12)
          .text('DOCUMENTO DE PRUEBA - NO VÁLIDO PARA USO REAL', 
                doc.page.width / 2, 40, { align: 'center' });
      }
      
      // Configurar encabezado del documento
      doc.fontSize(24)
        .fillColor('#333333')
        .text('Kit de la Herejía - Documento de Activación', 50, 100, { align: 'center' });
      
      // Información del cliente
      doc.fontSize(14)
        .text(`Preparado para: ${kitData.clientName}`, 50, 150);
      doc.fontSize(12)
        .text(`Email: ${kitData.clientEmail}`, 50, 175);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 200);
      
      // URL de activación
      doc.fontSize(14)
        .fillColor('#1976D2')
        .text('URL de Activación:', 50, 250);
      doc.fontSize(12)
        .text(activationUrl, 50, 275, { underline: true });
      
      // Instrucciones
      doc.fontSize(14)
        .fillColor('#333333')
        .text('Instrucciones de Activación:', 50, 350);
      
      doc.fontSize(12)
        .text('1. Visite la URL de activación indicada arriba.', 70, 375)
        .text('2. Complete el registro con sus datos personales.', 70, 400)
        .text('3. Realice las donaciones indicadas en la plataforma.', 70, 425)
        .text('4. Confirme su activación y reciba su kit digital.', 70, 450);
      
      // Términos y condiciones
      doc.fontSize(14)
        .text('Términos y Condiciones:', 50, 500);
      
      doc.fontSize(10)
        .text('Al activar este kit, acepta los términos y condiciones del sistema de distribución del Kit de la Herejía. ' +
              'Para más información, visite nuestra página web o contacte con el administrador.', 
              50, 525, { width: 500, align: 'justify' });
      
      // Pie de página
      doc.fontSize(10)
        .text('Este documento es confidencial y está destinado únicamente para el destinatario mencionado.', 
              50, 700, { align: 'center' });
      
      // Finalizar y cerrar el documento
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};