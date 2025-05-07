const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Asegurar que el directorio temp existe
if (!fs.existsSync(path.join(__dirname, '../temp'))) {
  fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
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
        doc.fillColor('white')
          .fontSize(12)
          .text('DOCUMENTO DE SIMULACIÓN - NO REALIZAR PAGOS REALES', 
                doc.page.width / 2, 38, { align: 'center' });
        
        doc.moveDown(2);
      }
      
      // CONTENIDO DEL PDF
      
      // Encabezado
      doc.fillColor('black')
        .fontSize(24).font('Helvetica-Bold')
        .text('KIT2 DE LA HEREJÍA ECONÓMICA', { align: 'center' });
      doc.fontSize(18).font('Helvetica')
        .text('PROMOCIÓN PERSONALIZADA', { align: 'center', margin: 20 });
      
      // Botón de Activación Superior
      doc.rect(50, doc.y + 10, 500, 40).fill('#4CAF50');
      doc.fillColor('white').fontSize(14).font('Helvetica-Bold')
        .text('QUIERO MI KIT2 AHORA', { align: 'center', link: activationUrl, underline: false, continued: false });
      
      doc.fillColor('black').moveDown(2);
      
      // Sección 1: Invitación Personal
      doc.fontSize(16).font('Helvetica-Bold').text('1. INVITACIÓN PERSONAL');
      doc.fontSize(12).font('Helvetica-Bold').text('ESTA ES UNA INVITACIÓN PERSONAL QUE LE LLEGA DE:');
      doc.font('Helvetica').text(kitData.clientName || 'Corporación Herejía Económica');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').text('Si decide adquirir el Kit2, deberá realizar una donación a:');
      doc.font('Helvetica').text('Corporación Herejía Económica');
      
      doc.moveDown();
      doc.fontSize(14).font('Helvetica-Bold').text('Flujo de Donaciones Explicado:');
      
      // Diagrama
      doc.fontSize(10).font('Courier').rect(50, doc.y, 500, 140).fill('#F0F0F0');
      doc.fillColor('black').text(`
Cadena de Invitaciones:
X1 -----> Juan -----> Usted -----> María -----> Pedro1, Pedro2, Pedro3
     invita      invita      invita       invita

Flujo de Donaciones:
Usted dona a X1
María dona a Juan
Pedro1 dona a Usted
Pedro2 dona a Usted 
Pedro3 dona a Usted`, 60, doc.y + 10);
      
      doc.moveDown(8);
      doc.fillColor('black').fontSize(12).font('Helvetica').text('Este esquema muestra claramente que:');
      doc.moveDown(0.5);
      doc.list([
        'Usted dona a quien invitó a Juan (X1)',
        'María dona a quien invitó a Usted (Juan)',
        'Todos los "Pedros" (invitados por María) donan a quien invitó a María (Usted)',
        'Así, Usted recibirá múltiples donaciones de los invitados de su invitado'
      ], { bulletRadius: 2 });
      
      // Nueva página
      doc.addPage();
      
      // Si es versión de prueba, agregar marca en la nueva página
      if (kitData.isTestVersion) {
        doc.save();
        doc.fontSize(60)
          .fillColor('rgba(244, 67, 54, 0.2)')
          .rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] })
          .text('VERSIÓN DE PRUEBA', doc.page.width / 2 - 250, doc.page.height / 2 - 30, {
            align: 'center'
          });
        doc.restore();
        
        // Agregar encabezado de prueba
        doc.rect(50, 30, doc.page.width - 100, 30)
          .fillAndStroke('#f44336', '#f44336');
        doc.fillColor('white')
          .fontSize(12)
          .text('DOCUMENTO DE SIMULACIÓN - NO REALIZAR PAGOS REALES', 
                doc.page.width / 2, 38, { align: 'center' });
        
        doc.moveDown(2);
        doc.fillColor('black');
      }
      
      // Sección 2: Introducción
      doc.fontSize(16).font('Helvetica-Bold').text('2. INTRODUCCIÓN AL KIT DE LA HEREJÍA');
      doc.fontSize(12).font('Helvetica').text(
        'Bienvenido al Kit de la Herejía, un sistema basado en donaciones ' +
        'que permite la distribución equitativa de conocimiento y valor en la sociedad.'
      );
      doc.moveDown(0.5);
      doc.fontSize(12).text('Importante: ', { continued: true }).font('Helvetica-Bold');
      doc.font('Helvetica').text(
        'El Kit de la Herejía solo puede ser adquirido por invitación ' +
        'de alguien que ya lo haya obtenido anteriormente. No es posible adquirirlo directamente ' +
        'de la Corporación, excepto por el autor original de la obra.'
      );
      
      doc.moveDown(0.5);
      doc.text('Para obtener el kit completo, se requieren dos pagos:');
      doc.moveDown(0.5);
      doc.list([
        `Donación a la Corporación: US$${kitData.corporationDonation || 20}`,
        `Donación al Referente: US$${kitData.referrerDonation || 7} (a la persona indicada en este documento)`
      ], { bulletRadius: 2 });
      
      // Información Bancaria
      doc.moveDown();
      doc.fontSize(16).font('Helvetica-Bold').text('3. INFORMACIÓN BANCARIA');
      doc.fontSize(12).font('Helvetica').text('Para realizar las donaciones, utilice la siguiente información bancaria:');
      
      doc.moveDown(0.5);
      doc.fontSize(14).font('Helvetica-Bold').text('Información del Cliente:');
      doc.fontSize(12).font('Helvetica').text(`Nombre: ${kitData.clientName}`);
      doc.text(`Banco: ${kitData.paymentInfo.bankName}`);
      doc.text(`Cuenta: ${kitData.paymentInfo.accountNumber}`);
      doc.text(`Tipo: ${kitData.paymentInfo.accountType}`);
      if (kitData.paymentInfo.paypalEmail) {
        doc.text(`PayPal: ${kitData.paymentInfo.paypalEmail}`);
      }
      
      // Sección 3: Botón de Activación Final
      doc.moveDown(2);
      doc.rect(50, doc.y, 500, 40).fill('#4CAF50');
      doc.fillColor('white').fontSize(14).font('Helvetica-Bold')
        .text('¡QUIERO MI KIT2 AHORA!', { align: 'center', link: activationUrl, underline: false });
      
      doc.moveDown(3);
      
      // Pie de página
      doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text('CORPORACIÓN HEREJÍA ECONÓMICA', { align: 'center' });
      doc.text('C.H.E. MUNDO LIBRE', { align: 'center' });
      
      // Si es versión de prueba, agregar nota final
      if (kitData.isTestVersion) {
        doc.moveDown();
        doc.rect(50, doc.y, 500, 30).fillAndStroke('#f44336', '#f44336');
        doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
          .text('ESTE DOCUMENTO ES UNA SIMULACIÓN PARA PRUEBAS - NO REALIZAR PAGOS REALES', 
                { align: 'center' });
      }
      
      // Finalizar documento
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = exports;
