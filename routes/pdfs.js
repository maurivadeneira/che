const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Importar el modelo
const PdfPersonalizado = require('../models/PdfPersonalizado');

// Importar el controlador de generación de PDFs
const pdfController = require('../controllers/pdfController');

// Ruta para generar un PDF a partir de la plantilla HTML
router.post('/generar', pdfController.generatePDF);

// Ruta para generar un PDF de prueba (útil para testing)
router.get('/test', pdfController.generateTestPDF);

// Ruta para registrar un nuevo PDF personalizado
router.post('/', async (req, res) => {
  try {
    const { usuario, kit, urlArchivo, nombreArchivo, versionDocumento } = req.body;
    
    // Crear nuevo registro
    const nuevoPdf = new PdfPersonalizado({
      usuario,
      kit,
      urlArchivo,
      nombreArchivo,
      versionDocumento
    });
    
    await nuevoPdf.save();
    
    res.json(nuevoPdf);
  } catch (err) {
    console.error('Error al registrar PDF personalizado:', err.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta para obtener todos los PDFs de un usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const pdfs = await PdfPersonalizado.find({ 
      usuario: req.params.usuarioId,
      activo: true 
    })
    .populate('kit', 'clientName')
    .sort({ fechaCreacion: -1 });
    
    res.json(pdfs);
  } catch (err) {
    console.error('Error al obtener PDFs:', err.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta para descargar un PDF específico
router.get('/descargar/:pdfId', async (req, res) => {
  try {
    const pdf = await PdfPersonalizado.findById(req.params.pdfId);
    
    if (!pdf) {
      return res.status(404).json({ msg: 'PDF no encontrado' });
    }
    
    // Incrementar contador de descargas
    pdf.descargas += 1;
    pdf.ultimaDescarga = Date.now();
    await pdf.save();
    
    // Construir la ruta al archivo
    const filePath = path.join(__dirname, '..', pdf.urlArchivo);
    
    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
      return res.download(filePath, pdf.nombreArchivo);
    } else {
      return res.status(404).json({ msg: 'Archivo no encontrado en el servidor' });
    }
  } catch (err) {
    console.error('Error al descargar PDF:', err.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta para desactivar un PDF
router.put('/desactivar/:pdfId', async (req, res) => {
  try {
    const pdf = await PdfPersonalizado.findById(req.params.pdfId);
    
    if (!pdf) {
      return res.status(404).json({ msg: 'PDF no encontrado' });
    }
    
    pdf.activo = false;
    await pdf.save();
    
    res.json({ msg: 'PDF desactivado correctamente' });
  } catch (err) {
    console.error('Error al desactivar PDF:', err.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta combinada para generar y registrar un PDF en un solo paso
router.post('/generar-y-registrar', async (req, res) => {
  try {
    const { kitData } = req.body;
    
    // Verificar datos mínimos requeridos
    if (!kitData || !kitData.clientName || !kitData.clientEmail || !kitData.usuario) {
      return res.status(400).json({
        success: false,
        message: 'Datos del cliente o usuario incompletos'
      });
    }
    
    // Crear nombre de archivo único
    const fileName = `kit2_${kitData.clientName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../temp', fileName);
    
    // Generar el PDF usando el controlador
    await pdfController.createPDFFromTemplate(kitData, filePath);
    
    console.log(`PDF generado: ${filePath}`);
    
    // Registrar en la base de datos
    const nuevoPdf = new PdfPersonalizado({
      usuario: kitData.usuario,
      kit: kitData.kitId,
      urlArchivo: `/temp/${fileName}`,
      nombreArchivo: fileName,
      versionDocumento: kitData.versionDocumento || '1.0',
      activo: true,
      fechaCreacion: new Date()
    });
    
    await nuevoPdf.save();
    
    // Responder con éxito y la información del PDF
    res.json({
      success: true,
      message: 'PDF generado y registrado correctamente',
      pdfData: nuevoPdf
    });
    
  } catch (error) {
    console.error('Error al generar y registrar PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar y registrar PDF',
      error: error.message
    });
  }
});

module.exports = router;