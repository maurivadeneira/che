const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const fs = require('fs');
const path = require('path');

// Ruta para verificar credenciales (simulada por ahora)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // En una implementación real, verificaríamos contra la base de datos
  if (username === 'admin' && password === 'HerejiaAdmin2024!') {
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: 'token_simulado_12345'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }
});

// Ruta para crear un nuevo Kit
router.post('/kits', (req, res) => {
  // En una implementación real, guardaríamos en la base de datos
  console.log('Datos recibidos para crear kit:', req.body);
  
  res.json({
    success: true,
    message: 'Kit creado exitosamente',
    kitId: `kit_${Date.now()}`
  });
});

// Ruta para guardar borrador - NUEVA
router.post('/kits/draft', (req, res) => {
  try {
    const kitData = req.body;
    
    console.log('Guardando borrador:', kitData);
    
    // Simulación de guardado (puedes implementar la lógica real con MongoDB)
    // En una implementación real, usaríamos Kit.findByIdAndUpdate o Kit.create
    
    // Simular respuesta exitosa
    res.json({
      success: true,
      message: 'Borrador guardado correctamente',
      kit: {
        ...kitData,
        _id: kitData._id || `kit_draft_${Date.now()}`,
        status: 'draft',
        updatedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error al guardar borrador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar borrador',
      error: error.message
    });
  }
});

// Ruta para activar un kit
router.put('/kits/:id/activate', (req, res) => {
  const { id } = req.params;
  
  // Simulación de activación
  console.log(`Activando kit: ${id}`);
  
  res.json({
    success: true,
    message: `Kit ${id} activado exitosamente`,
    kit: {
      _id: id,
      status: 'active',
      activatedAt: new Date()
    }
  });
});

// Ruta para generar PDF - CORREGIDO para usar la función que existe en el controlador
router.post('/generate-pdf', async (req, res) => {
  try {
    // Llamamos a la función que sí existe en nuestro controlador
    if (req.body && req.body.kitData) {
      await pdfController.generarPDFPersonalizado(req, res);
    } else {
      // Si no tiene el formato esperado, devolvemos error
      res.status(400).json({
        success: false,
        message: 'Formato de datos incorrecto. Se requiere un objeto kitData.'
      });
    }
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar PDF',
      error: error.message
    });
  }
});

// Verificar si un archivo PDF existe
router.get('/check-pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../temp', req.params.filename);
  
  if (fs.existsSync(filePath)) {
    res.json({
      exists: true,
      filePath
    });
  } else {
    res.json({
      exists: false,
      error: 'El archivo no existe'
    });
  }
});

// Ruta para obtener kits pendientes (simulada)
router.get('/kits/pending', (req, res) => {
  res.json({
    success: true,
    kits: [] // Lista vacía por ahora
  });
});

// Ruta para obtener kits activos (simulada)
router.get('/kits/active', (req, res) => {
  res.json({
    success: true,
    kits: [] // Lista vacía por ahora
  });
});

// Ruta para enviar un kit por correo (simulada)
router.post('/kits/:id/send', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: `Kit ${id} enviado exitosamente`,
    sentDate: new Date()
  });
});

// Ruta para generar un PDF de prueba (para depuración)
router.get('/test-pdf', async (req, res) => {
  try {
    await pdfController.generateTestPDF(req, res);
  } catch (error) {
    console.error('Error al generar PDF de prueba:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar PDF de prueba',
      error: error.message
    });
  }
});

// Ruta para generar el Kit2 del Autor
router.post('/generate-autor-kit', async (req, res) => {
  try {
    await pdfController.generarKitAutor(req, res);
  } catch (error) {
    console.error('Error al generar Kit2 del Autor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar Kit2 del Autor',
      error: error.message
    });
  }
});

module.exports = router;