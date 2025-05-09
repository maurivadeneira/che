// controllers/pdfController.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const PdfPersonalizado = require('../models/PdfPersonalizado');
const User = require('../models/User'); // Asegúrate de ajustar la ruta según tu estructura

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

// Esta es la función que faltaba y que estaba siendo referenciada en adminRoutes.js
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
    
    // Generar el PDF usando la plantilla HTML
    await createPDFFromTemplate(kitData, filePath);
    
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

// Función para crear PDF a partir de la plantilla HTML usando Puppeteer
const createPDFFromTemplate = async (kitData, filePath) => {
  try {
    // Leer la plantilla HTML
    const templatePath = path.join(__dirname, '../templates/kit2_template.html');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Plantilla no encontrada en: ${templatePath}`);
    }
    
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // URL para activación
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const invitationId = `kit_${kitData.clientName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
    const activationUrl = `${baseUrl}/registro?invited_by=${invitationId}`;
    
    // Preparar datos para reemplazar en la plantilla
    const fechaActual = new Date().toLocaleDateString('es-ES');
    
    // Reemplazar placeholders
    htmlTemplate = htmlTemplate
      .replace(/\[NOMBRE_REFERENTE\]/g, kitData.referentName || 'Administrador del Sistema')
      .replace(/\[URL_ACTIVACION\]/g, activationUrl)
      .replace(/\[NOMBRE_CLIENTE\]/g, kitData.clientName)
      .replace(/\[EMAIL_CLIENTE\]/g, kitData.clientEmail)
      .replace(/\[FECHA_ACTUAL\]/g, fechaActual);
    
    // Si es versión de prueba, agregar marca de agua
    if (kitData.isTestVersion) {
      // Inyectar CSS para la marca de agua
      const watermarkCSS = `
        <style>
          body::before {
            content: "VERSIÓN DE PRUEBA";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 8em;
            color: rgba(255, 0, 0, 0.2);
            transform: rotate(-45deg);
            pointer-events: none;
            z-index: 1000;
          }
          
          body::after {
            content: "DOCUMENTO DE PRUEBA - NO VÁLIDO PARA USO REAL";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f44336;
            color: white;
            font-size: 12px;
            z-index: 1001;
          }
        </style>
      `;
      
      // Insertar CSS después de la etiqueta <head>
      htmlTemplate = htmlTemplate.replace('</head>', `${watermarkCSS}</head>`);
    }
    
    // Generar PDF con Puppeteer
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    
    // Generar PDF
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    return filePath;
  } catch (error) {
    console.error('Error al crear PDF desde plantilla:', error);
    throw error;
  }
};

// Exportar la función para uso externo
exports.createPDFFromTemplate = createPDFFromTemplate;

// Función para prueba - genera un PDF de prueba
exports.generateTestPDF = async (req, res) => {
  try {
    // Datos de prueba
    const testData = {
      clientName: 'Cliente de Prueba',
      clientEmail: 'prueba@ejemplo.com',
      referentName: 'Referente de Prueba',
      isTestVersion: true
    };
    
    // Crear nombre de archivo único
    const fileName = `kit2_test_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../temp', fileName);
    
    // Generar el PDF de prueba
    await createPDFFromTemplate(testData, filePath);
    
    console.log(`PDF de prueba generado: ${filePath}`);
    
    // Responder con éxito y la ruta al archivo
    res.json({
      success: true,
      message: 'PDF de prueba generado correctamente',
      pdfUrl: `/temp/${fileName}` // URL relativa para acceder al archivo
    });
    
  } catch (error) {
    console.error('Error al generar PDF de prueba:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar PDF de prueba',
      error: error.message
    });
  }
};

// Función para generar un PDF personalizado - la que ya tenías
exports.generarPDFPersonalizado = async (req, res) => {
  try {
    const { 
      usuarioId, 
      referenteId,
      nombreCliente, 
      emailCliente 
    } = req.body;

    // Validar datos requeridos
    if (!usuarioId || !referenteId || !nombreCliente || !emailCliente) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos para generar el PDF personalizado'
      });
    }

    // Obtener información del referente
    const referente = await User.findById(referenteId);
    if (!referente) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el referente especificado'
      });
    }

    // Generar URL única para activación
    const urlActivacion = `https://corpherejiaeconomica.com/activar/${usuarioId}`;
    
    // Leer la plantilla HTML
    const templatePath = path.join(__dirname, '../templates/kit2_template.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Reemplazar placeholders
    const fechaActual = new Date().toLocaleDateString('es-ES');
    htmlTemplate = htmlTemplate
      .replace(/\[NOMBRE_REFERENTE\]/g, referente.nombre)
      .replace(/\[URL_ACTIVACION\]/g, urlActivacion)
      .replace(/\[NOMBRE_CLIENTE\]/g, nombreCliente)
      .replace(/\[EMAIL_CLIENTE\]/g, emailCliente)
      .replace(/\[FECHA_ACTUAL\]/g, fechaActual);
    
    // Generar PDF con puppeteer
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    
    // Definir nombre de archivo único
    const fileName = `kit2_${usuarioId}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../temp', fileName);
    
    // Generar PDF
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    // URL pública para acceder al PDF
    const urlArchivo = `${req.protocol}://${req.get('host')}/temp/${fileName}`;
    
    // Guardar registro en la base de datos
    const pdfDoc = new PdfPersonalizado({
      usuarioId,
      kitId: `KIT2-${usuarioId}`,
      urlArchivo,
      nombreArchivo: fileName,
      fechaCreacion: new Date(),
      versionDocumento: '1.0',
      activo: true,
      esKitOriginal: false,
      observaciones: 'Kit2 personalizado',
      estadoVerificacion: 'verificado'
    });
    
    await pdfDoc.save();
    
    // Responder con la URL
    res.status(201).json({
      success: true,
      message: 'PDF personalizado generado con éxito',
      data: {
        urlArchivo,
        pdfId: pdfDoc._id
      }
    });
    
  } catch (error) {
    console.error('Error al generar PDF personalizado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar PDF personalizado',
      error: error.message
    });
  }
};

// Función para obtener un PDF personalizado por ID
exports.obtenerPDFPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pdf = await PdfPersonalizado.findById(id);
    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF personalizado no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: pdf
    });
    
  } catch (error) {
    console.error('Error al obtener PDF personalizado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener PDF personalizado',
      error: error.message
    });
  }
};

// Función para listar todos los PDFs de un usuario
exports.listarPDFsUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const pdfs = await PdfPersonalizado.find({ usuarioId, activo: true });
    
    res.status(200).json({
      success: true,
      count: pdfs.length,
      data: pdfs
    });
    
  } catch (error) {
    console.error('Error al listar PDFs personalizados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar PDFs personalizados',
      error: error.message
    });
  }
};

// Función para generar el Kit2 del Autor con un beneficiario designado
exports.generarKitAutor = async (req, res) => {
  try {
    console.log('Datos recibidos en generarKitAutor:', JSON.stringify(req.body, null, 2));
    
    const { 
      autorId,
      nombreAutor,
      emailAutor,
      telefonoAutor,
      paisAutor,
      metodosPagoAutor,
      
      beneficiarioId,
      nombreBeneficiario,
      emailBeneficiario,
      telefonoBeneficiario,
      paisBeneficiario,
      metodosPagoBeneficiario,
      
      observaciones
    } = req.body;

    // Validar datos requeridos básicos
    if (!autorId || !nombreAutor || !emailAutor || 
        !beneficiarioId || !nombreBeneficiario || !emailBeneficiario) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos para generar el Kit2 del Autor'
      });
    }

    // Verificar que el autor y el beneficiario no sean la misma persona
    if (autorId === beneficiarioId || emailAutor === emailBeneficiario) {
      return res.status(400).json({
        success: false,
        message: 'El autor y el beneficiario no pueden ser la misma persona'
      });
    }

    // Verificar que haya métodos de pago
    if (!metodosPagoAutor || !metodosPagoAutor.length || 
        !metodosPagoBeneficiario || !metodosPagoBeneficiario.length) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un método de pago tanto para el autor como para el beneficiario'
      });
    }

    // Generar URL única para activación
    const urlActivacion = `https://corpherejiaeconomica.com/activar/${autorId}`;
    
    // Leer la plantilla HTML
    const templatePath = path.join(__dirname, '../templates/kit2_template.html');
    
    console.log('Verificando si existe la plantilla:', templatePath);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Plantilla no encontrada en: ${templatePath}`);
    }
    
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    console.log('Plantilla leída correctamente');
    
    // Reemplazar placeholders - El autor es el cliente, el beneficiario es el referente
    const fechaActual = new Date().toLocaleDateString('es-ES');
    htmlTemplate = htmlTemplate
      .replace(/\[NOMBRE_REFERENTE\]/g, nombreBeneficiario)
      .replace(/\[URL_ACTIVACION\]/g, urlActivacion)
      .replace(/\[NOMBRE_CLIENTE\]/g, nombreAutor)
      .replace(/\[EMAIL_CLIENTE\]/g, emailAutor)
      .replace(/\[FECHA_ACTUAL\]/g, fechaActual);
    
    console.log('Placeholders reemplazados correctamente');
    
    // Generar PDF con puppeteer
    console.log('Iniciando navegador Puppeteer...');
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    
    // Definir nombre de archivo único
    const fileName = `kit2_autor_${autorId}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../temp', fileName);
    
    console.log(`Generando PDF en: ${filePath}`);
    
    // Generar PDF
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    console.log('Navegador cerrado');
    
    // Verificar que el archivo se haya creado
    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo PDF no se creó correctamente en: ${filePath}`);
    }
    
    console.log('PDF generado correctamente');
    
    // URL pública para acceder al PDF
    const urlArchivo = `${req.protocol}://${req.get('host')}/temp/${fileName}`;
    
    // ID único para el kit
    const kitId = `KIT2-AUTOR-${Date.now()}`;
    
    console.log('Creando documento en la base de datos...');
    
    // Guardar registro en la base de datos
    const pdfDoc = new PdfPersonalizado({
      usuarioId: autorId,
      kitId: kitId,
      beneficiarioId: beneficiarioId,
      urlArchivo,
      nombreArchivo: fileName,
      fechaCreacion: new Date(),
      versionDocumento: '1.0',
      activo: true,
      esKitOriginal: true,
      observaciones: observaciones || 'Kit2 original creado por el autor',
      estadoVerificacion: 'verificado',
      metadatos: {
        // Datos del autor
        nombreAutor,
        emailAutor,
        telefonoAutor,
        paisAutor,
        metodosPagoAutor,
        
        // Datos del beneficiario
        nombreBeneficiario,
        emailBeneficiario,
        telefonoBeneficiario,
        paisBeneficiario,
        metodosPagoBeneficiario
      }
    });
    
    console.log('Guardando documento en la base de datos...');
    const savedPdf = await pdfDoc.save();
    console.log('PDF guardado en la base de datos:', savedPdf._id);
    
    // Responder con la URL
    res.status(201).json({
      success: true,
      message: 'Kit2 del Autor generado con éxito',
      data: {
        urlArchivo,
        pdfId: pdfDoc._id,
        kitId: kitId
      }
    });
    
  } catch (error) {
    console.error('Error detallado al generar Kit2 del Autor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar Kit2 del Autor',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};