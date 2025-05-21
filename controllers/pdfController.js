// controllers/pdfController.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const PdfPersonalizado = require('../models/PdfPersonalizado');
const User = require('../models/User');
const Kit = require('../models/Kit');
const { createPdf } = require('../utils/pdfGenerator');
const currencyService = require('../src/services/currencyService');

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

// ========== NUEVA FUNCIÓN PARA EL KIT2 INICIAL ==========

// Función específica para generar el Kit2 inicial de Mauricio Rivadeneira
exports.generarKit2Inicial = async (req, res) => {
  try {
    console.log('🚀 Iniciando generación del Kit2 inicial de Mauricio Rivadeneira...');

    // 1. CREAR O VERIFICAR USUARIOS EN LA BASE DE DATOS
    
    // Crear/verificar Daniel Rivadeneira (X0 - Beneficiario)
    let daniel = await User.findOne({ email: 'daniel.rivadeneira@ejemplo.com' });
    if (!daniel) {
      daniel = new User({
        name: 'Daniel Rivadeneira',
        email: 'daniel.rivadeneira@ejemplo.com',
        password: 'temp123', // Temporal, se debe cambiar
        phone: 'Por definir',
        bankAccount: {
          bank: 'Banco de Colombia',
          accountType: 'Ahorros',
          accountNumber: 'Por definir'
        },
        role: 'user'
      });
      await daniel.save();
      console.log('✅ Usuario Daniel creado:', daniel._id);
    } else {
      console.log('✅ Usuario Daniel ya existe:', daniel._id);
    }

    // Crear/verificar Mauricio Rivadeneira (X1 - Autor)
    let mauricio = await User.findOne({ email: 'mauricio.rivadeneira@herejiaeconomica.com' });
    if (!mauricio) {
      mauricio = new User({
        name: 'Mauricio Rivadeneira',
        email: 'mauricio.rivadeneira@herejiaeconomica.com',
        password: 'temp123', // Temporal, se debe cambiar
        phone: 'Por definir',
        bankAccount: {
          bank: 'Banco de Colombia',
          accountType: 'Ahorros',
          accountNumber: 'Por definir'
        },
        role: 'admin'
      });
      await mauricio.save();
      console.log('✅ Usuario Mauricio creado:', mauricio._id);
    } else {
      console.log('✅ Usuario Mauricio ya existe:', mauricio._id);
    }

    // 2. VERIFICAR SI YA EXISTE UN KIT INICIAL ACTIVO
    const kitExistente = await Kit.findOne({ 
      clientEmail: 'mauricio.rivadeneira@herejiaeconomica.com',
      isInitialKit: true,
      status: 'active'
    });

    if (kitExistente) {
      console.log('⚠️ Ya existe un Kit2 inicial activo');
      // Si ya existe, podemos devolver el PDF existente o generar uno nuevo
      // Por ahora, continuamos para generar uno nuevo
    }

    // 3. CREAR REGISTRO DEL KIT EN LA BASE DE DATOS
    const kitData = {
      clientName: 'Mauricio Rivadeneira',
      clientEmail: 'mauricio.rivadeneira@herejiaeconomica.com',
      clientPhone: 'Por definir',
      bankAccounts: [{
        bankName: 'Banco de Colombia',
        accountNumber: 'Por definir',
        accountType: 'Ahorros',
        primary: true
      }],
      donationRecipient: {
        name: 'Daniel Rivadeneira',
        bankAccounts: [{
          bankName: 'Banco de Colombia',
          accountNumber: 'Por definir',
          accountType: 'Ahorros',
          primary: true
        }]
      },
      isInitialKit: true,
      status: 'active'
    };

    const kit = new Kit(kitData);
    await kit.save();
    console.log('✅ Kit creado en la base de datos:', kit._id);

    // 4. GENERAR PDF
    
    // Leer la plantilla HTML
    const templatePath = path.join(__dirname, '../templates/kit2_template.html');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`❌ Plantilla no encontrada en: ${templatePath}`);
    }

    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    console.log('✅ Plantilla HTML leída correctamente');

    // URL de activación - Debe apuntar a corpherejiaeconomica.com
    const urlActivacion = `https://corpherejiaeconomica.com/activar?kit=${kit._id}`;

    // Fecha actual
    const fechaActual = new Date().toLocaleDateString('es-ES');

    console.log('🔄 Reemplazando placeholders en la plantilla...');

    // Reemplazar todos los placeholders usando formato {{}}
    htmlTemplate = htmlTemplate
      .replace(/\{\{BENEFICIARIO_NOMBRE\}\}/g, 'Daniel Rivadeneira')
      .replace(/\{\{URL_ACTIVACION\}\}/g, urlActivacion)
      .replace(/\{\{EMAIL_CLIENTE\}\}/g, 'mauricio.rivadeneira@herejiaeconomica.com')
      .replace(/\{\{FECHA_ACTUAL\}\}/g, fechaActual)
      // Mantener compatibilidad con el formato anterior si existe
      .replace(/\[NOMBRE_REFERENTE\]/g, 'Daniel Rivadeneira')
      .replace(/\[URL_ACTIVACION\]/g, urlActivacion)
      .replace(/\[NOMBRE_CLIENTE\]/g, 'Mauricio Rivadeneira')
      .replace(/\[EMAIL_CLIENTE\]/g, 'mauricio.rivadeneira@herejiaeconomica.com')
      .replace(/\[FECHA_ACTUAL\]/g, fechaActual);

    console.log('✅ Placeholders reemplazados correctamente');

    // Generar PDF con Puppeteer
    console.log('🔄 Iniciando generación de PDF con Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);

    // Nombre de archivo único
    const fileName = `kit2_mauricio_rivadeneira_inicial_${Date.now()}.pdf`;
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
    console.log('✅ PDF generado correctamente:', filePath);

    // 5. GUARDAR REGISTRO EN PdfPersonalizado
    const urlArchivo = `${req.protocol}://${req.get('host')}/temp/${fileName}`;
    
    const pdfDoc = new PdfPersonalizado({
      usuarioId: mauricio._id,
      kitId: `KIT2-INICIAL-${mauricio._id}`,
      beneficiarioId: daniel._id,
      urlArchivo,
      nombreArchivo: fileName,
      fechaCreacion: new Date(),
      versionDocumento: '1.0',
      activo: true,
      esKitOriginal: true,
      observaciones: 'Kit2 inicial del autor Mauricio Rivadeneira',
      estadoVerificacion: 'verificado',
      metadatos: {
        nombreAutor: 'Mauricio Rivadeneira',
        emailAutor: 'mauricio.rivadeneira@herejiaeconomica.com',
        nombreBeneficiario: 'Daniel Rivadeneira',
        urlActivacion: urlActivacion,
        tipoKit: 'inicial'
      }
    });

    await pdfDoc.save();
    console.log('✅ Registro guardado en PdfPersonalizado:', pdfDoc._id);

    // 6. ACTUALIZAR EL KIT CON LA URL DEL PDF
    kit.pdfUrl = urlArchivo;
    kit.activatedAt = new Date();
    await kit.save();
    console.log('✅ Kit actualizado con URL del PDF');

    console.log('🎉 Kit2 inicial generado exitosamente');

    // 7. RESPONDER CON EL PDF
    const pdfBuffer = fs.readFileSync(filePath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Kit2_Mauricio_Rivadeneira_Inicial.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error al generar Kit2 inicial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar Kit2 inicial de Mauricio',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ========== FUNCIONES EXISTENTES ==========

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
// VERSIÓN ACTUALIZADA con soporte multimoneda
exports.generarKitAutor = async (req, res) => {
  try {
    console.log('Datos recibidos en generarKitAutor:', JSON.stringify(req.body, null, 2));

    const {
      autorId,
      autorNombre,
      autorEmail,
      autorTelefono,
      autorPais,
      autorMetodosPago,

      beneficiarioId,
      beneficiarioNombre,
      beneficiarioEmail,
      beneficiarioTelefono,
      beneficiarioPais,
      beneficiarioMetodosPago,

      observaciones
    } = req.body;

    // Validar datos requeridos básicos
    if (!autorId || !autorNombre || !autorEmail ||
        !beneficiarioId || !beneficiarioNombre || !beneficiarioEmail) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos para generar el Kit2 del Autor'
      });
    }

    // Verificar que el autor y el beneficiario no sean la misma persona
    if (autorId === beneficiarioId || autorEmail === beneficiarioEmail) {
      return res.status(400).json({
        success: false,
        message: 'El autor y el beneficiario no pueden ser la misma persona'
      });
    }

    // Verificar que haya métodos de pago
    if (!autorMetodosPago || !autorMetodosPago.length ||
        !beneficiarioMetodosPago || !beneficiarioMetodosPago.length) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un método de pago tanto para el autor como para el beneficiario'
      });
    }

    // Obtener monedas preferidas
    const autorMonedaPreferida = autorMetodosPago[0]?.monedaPreferida || 'USD';
    const beneficiarioMonedaPreferida = beneficiarioMetodosPago[0]?.monedaPreferida || 'USD';

    // Montos base en USD
    const montoCorporacionUSD = 20;
    const montoBeneficiarioUSD = 7;

    // Convertir a monedas preferidas
    const montoCorporacion = await currencyService.convertCurrency(
      montoCorporacionUSD,
      'USD',
      autorMonedaPreferida
    );

    const montoBeneficiario = await currencyService.convertCurrency(
      montoBeneficiarioUSD,
      'USD',
      beneficiarioMonedaPreferida
    );

    // Formatear montos
    const montoCorporacionFormateado = currencyService.formatCurrency(
      montoCorporacion,
      autorMonedaPreferida
    );

    const montoBeneficiarioFormateado = currencyService.formatCurrency(
      montoBeneficiario,
      beneficiarioMonedaPreferida
    );

    // Generar ID único para el kit
    const kitId = `KIT-${Date.now().toString(36).toUpperCase()}`;

    // Intentar usar el nuevo generador de PDF primero
    try {
      // Preparar contenido del PDF
      const contenidoPDF = {
        kitId: kitId,
        fechaCreacion: new Date().toLocaleDateString('es-CO'),
        autor: {
          nombre: autorNombre,
          email: autorEmail,
          telefono: autorTelefono,
          pais: autorPais,
          metodosPago: autorMetodosPago
        },
        beneficiario: {
          nombre: beneficiarioNombre,
          email: beneficiarioEmail,
          telefono: beneficiarioTelefono,
          pais: beneficiarioPais,
          metodosPago: beneficiarioMetodosPago
        },
        donacionesRequeridas: {
          corporacion: {
            monto: montoCorporacionFormateado,
            moneda: autorMonedaPreferida,
            montoUSD: montoCorporacionUSD !== montoCorporacion ? `US$${montoCorporacionUSD}` : null
          },
          beneficiario: {
            monto: montoBeneficiarioFormateado,
            moneda: beneficiarioMonedaPreferida,
            nombre: beneficiarioNombre,
            montoUSD: montoBeneficiarioUSD !== montoBeneficiario ? `US$${montoBeneficiarioUSD}` : null
          }
        },
        observaciones: observaciones || '',
        activationUrl: process.env.FRONTEND_URL || 'https://corpherejiaeconomica.com'
      };

      console.log('Generando PDF con nuevo generador...');
      // Generar PDF con el nuevo método
      const pdfBuffer = await createPdf('kitAutor', contenidoPDF);

      // Definir nombre de archivo único
      const fileName = `kit2_autor_${autorId}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../temp', fileName);

      // Guardar el buffer en un archivo
      fs.writeFileSync(filePath, pdfBuffer);

      console.log(`PDF guardado en: ${filePath}`);

      // URL pública para acceder al PDF
      const urlArchivo = `${req.protocol}://${req.get('host')}/temp/${fileName}`;

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
          nombreAutor: autorNombre,
          emailAutor: autorEmail,
          telefonoAutor: autorTelefono,
          paisAutor: autorPais,
          metodosPagoAutor: autorMetodosPago,

          // Datos del beneficiario
          nombreBeneficiario: beneficiarioNombre,
          emailBeneficiario: beneficiarioEmail,
          telefonoBeneficiario: beneficiarioTelefono,
          paisBeneficiario: beneficiarioPais,
          metodosPagoBeneficiario: beneficiarioMetodosPago,

          // Información de las donaciones
          montoCorporacionUSD,
          montoCorporacion,
          montoCorporacionFormateado,
          autorMonedaPreferida,

          montoBeneficiarioUSD,
          montoBeneficiario,
          montoBeneficiarioFormateado,
          beneficiarioMonedaPreferida
        }
      });

      console.log('Guardando documento en la base de datos...');
      const savedPdf = await pdfDoc.save();
      console.log('PDF guardado en la base de datos:', savedPdf._id);

      // Responder enviando el PDF directamente
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Kit2_${autorNombre.replace(/\s+/g, '_')}.pdf"`);
      res.send(pdfBuffer);

      return;
    } catch (e) {
      console.error('Error con el nuevo generador de PDF, usando método antiguo:', e);
      // Si falla, continuamos con el método antiguo
    }

    // MÉTODO ANTIGUO (FALLBACK) - Usar solo si el nuevo método falla
    console.log('Usando método antiguo de generación de PDF...');

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
      .replace(/\[NOMBRE_REFERENTE\]/g, beneficiarioNombre)
      .replace(/\[URL_ACTIVACION\]/g, urlActivacion)
      .replace(/\[NOMBRE_CLIENTE\]/g, autorNombre)
      .replace(/\[EMAIL_CLIENTE\]/g, autorEmail)
      .replace(/\[FECHA_ACTUAL\]/g, fechaActual);

    // Agregar información de donaciones con montos en múltiples monedas
    const donacionesHTML = `
      <div class="donaciones-section">
        <h3>DONACIONES REQUERIDAS</h3>
        <p>Para adquirir el Kit2, debe realizar dos donaciones:</p>
        <ul>
          <li>${montoBeneficiarioFormateado} a ${beneficiarioNombre}
            ${montoBeneficiarioUSD !== montoBeneficiario ?
              `<span style="font-size: 0.9em; color: #666; font-style: italic;">(equivalente a US$${montoBeneficiarioUSD})</span>` : ''}
          </li>
          <li>${montoCorporacionFormateado} a la Corporación Herejía Económica
            ${montoCorporacionUSD !== montoCorporacion ?
              `<span style="font-size: 0.9em; color: #666; font-style: italic;">(equivalente a US$${montoCorporacionUSD})</span>` : ''}
          </li>
        </ul>
      </div>
    `;

    // Añadir sección de donaciones al HTML
    htmlTemplate = htmlTemplate.replace('</body>', `${donacionesHTML}</body>`);

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
        nombreAutor: autorNombre,
        emailAutor: autorEmail,
        telefonoAutor: autorTelefono,
        paisAutor: autorPais,
        metodosPagoAutor: autorMetodosPago,

        // Datos del beneficiario
        nombreBeneficiario: beneficiarioNombre,
        emailBeneficiario: beneficiarioEmail,
        telefonoBeneficiario: beneficiarioTelefono,
        paisBeneficiario: beneficiarioPais,
        metodosPagoBeneficiario: beneficiarioMetodosPago,

        // Información de las donaciones
        montoCorporacionUSD,
        montoCorporacion,
        montoCorporacionFormateado,
        autorMonedaPreferida,

        montoBeneficiarioUSD,
        montoBeneficiario,
        montoBeneficiarioFormateado,
        beneficiarioMonedaPreferida
      }
    });

    console.log('Guardando documento en la base de datos...');
    const savedPdf = await pdfDoc.save();
    console.log('PDF guardado en la base de datos:', savedPdf._id);

    // Leer el archivo para enviarlo como respuesta
    const pdfBuffer = fs.readFileSync(filePath);

    // Responder con el PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Kit2_${autorNombre.replace(/\s+/g, '_')}.pdf"`);
    res.send(pdfBuffer);

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