const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

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

// Ruta para crear un nuevo Kit (simulada)
router.post('/kits', (req, res) => {
  // En una implementación real, guardaríamos en la base de datos
  console.log('Datos recibidos para crear kit:', req.body);
  
  res.json({
    success: true,
    message: 'Kit creado exitosamente',
    kitId: `kit_${Date.now()}`
  });
});

// Ruta para generar PDF
router.post('/generate-pdf', pdfController.generatePDF);

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

// Ruta para activar un kit (simulada)
router.post('/kits/:id/activate', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: `Kit ${id} activado exitosamente`,
    activationDate: new Date()
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

module.exports = router;
