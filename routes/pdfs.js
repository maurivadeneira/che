const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Importar el modelo
const PdfPersonalizado = require('../models/PdfPersonalizado');

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

module.exports = router;