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

// Ruta para generar el Kit2 del Autor (con logs mejorados)
router.post('/generate-autor-kit', async (req, res) => {
  try {
    console.log('Recibida solicitud para generar Kit2 del Autor');
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    await pdfController.generarKitAutor(req, res);
  } catch (error) {
    console.error('Error detallado al generar Kit2 del Autor:', error);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error al generar Kit2 del Autor',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ========== NUEVAS RUTAS PARA EL KIT2 INICIAL ==========

// Ruta para generar el Kit2 inicial de Mauricio - GET (interfaz)
router.get('/generate-initial-kit', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Generar Kit2 Inicial - Mauricio Rivadeneira</title>
        <meta charset="UTF-8">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 40px; 
                background-color: #f5f5f5;
            }
            .container { 
                max-width: 700px; 
                margin: 0 auto; 
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { 
                color: #e67e22; 
                text-align: center;
                margin-bottom: 30px;
            }
            .info-box {
                background-color: #fff3cd;
                border: 1px solid #ffeeba;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .warning-box {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            button { 
                background-color: #e67e22; 
                color: white; 
                padding: 15px 30px; 
                border: none; 
                border-radius: 5px; 
                font-size: 16px; 
                cursor: pointer; 
                width: 100%;
                margin-top: 20px;
            }
            button:hover { background-color: #d68910; }
            button:disabled { 
                background-color: #cccccc; 
                cursor: not-allowed; 
            }
            .result {
                margin-top: 20px;
                padding: 15px;
                border-radius: 5px;
                display: none;
            }
            .success { 
                background-color: #d4edda; 
                border: 1px solid #c3e6cb; 
                color: #155724; 
            }
            .error { 
                background-color: #f8d7da; 
                border: 1px solid #f5c6cb; 
                color: #721c24; 
            }
            .loading {
                background-color: #cce5ff;
                border: 1px solid #99ccff;
                color: #004085;
            }
            ul { 
                margin: 10px 0; 
                padding-left: 20px; 
            }
            li { 
                margin: 5px 0; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 Generación del Kit2 Inicial</h1>
            
            <div class="info-box">
                <h3>📋 ¿Qué hace este proceso?</h3>
                <ul>
                    <li><strong>Crea los usuarios base:</strong> Mauricio Rivadeneira (X1) y Daniel Rivadeneira (X0)</li>
                    <li><strong>Genera el Kit2 inicial:</strong> El primer kit del sistema con Mauricio como propietario</li>
                    <li><strong>Configura la URL:</strong> El enlace apuntará a corpherejiaeconomica.com</li>
                    <li><strong>Guarda en la base de datos:</strong> Registra todo correctamente para el seguimiento</li>
                </ul>
            </div>

            <div class="warning-box">
                <h3>⚠️ Importante</h3>
                <p><strong>Este kit debe generarse solo una vez y es la base de todo el sistema.</strong></p>
                <p>Una vez generado, Mauricio podrá compartir este PDF y comenzar la cadena de distribución del Kit2.</p>
            </div>
            
            <button onclick="generateKit()">🚀 Generar Kit2 Inicial de Mauricio</button>
            
            <div id="result" class="result"></div>
        </div>
        
        <script>
            async function generateKit() {
                const button = document.querySelector('button');
                const result = document.getElementById('result');
                
                // Mostrar estado de carga
                button.disabled = true;
                button.textContent = '⏳ Generando Kit2 inicial...';
                result.className = 'result loading';
                result.style.display = 'block';
                result.innerHTML = '<p>🔄 Generando Kit2 inicial, por favor espere...</p><p>Este proceso puede tardar unos segundos.</p>';
                
                try {
                    const response = await fetch('/api/admin/generate-initial-kit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.headers.get('content-type')?.includes('application/pdf')) {
                        // Es un PDF, crear enlace de descarga
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Kit2_Mauricio_Rivadeneira_Inicial.pdf';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove();
                        
                        result.className = 'result success';
                        result.innerHTML = 
                            '<h3>✅ ¡Kit2 inicial generado exitosamente!</h3>' +
                            '<p>📄 El PDF se ha descargado automáticamente.</p>' +
                            '<p>🎯 <strong>Próximos pasos:</strong></p>' +
                            '<ul>' +
                            '<li>Mauricio ya puede compartir este Kit2 con sus contactos</li>' +
                            '<li>Cuando alguien haga clic en "QUIERO MI KIT2", irá a corpherejiaeconomica.com</li>' +
                            '<li>Ahí se registrarán y harán las donaciones correspondientes</li>' +
                            '</ul>';
                    } else {
                        const data = await response.json();
                        throw new Error(data.message || 'Error desconocido');
                    }
                } catch (error) {
                    result.className = 'result error';
                    result.innerHTML = 
                        '<h3>❌ Error al generar el Kit2</h3>' +
                        '<p><strong>Detalle del error:</strong> ' + error.message + '</p>' +
                        '<p>💡 <strong>Soluciones posibles:</strong></p>' +
                        '<ul>' +
                        '<li>Verificar que MongoDB esté conectado</li>' +
                        '<li>Revisar que la plantilla HTML exista</li>' +
                        '<li>Comprobar permisos de escritura en la carpeta temp</li>' +
                        '</ul>';
                } finally {
                    button.disabled = false;
                    button.textContent = '🚀 Generar Kit2 Inicial de Mauricio';
                }
            }
        </script>
    </body>
    </html>
  `);
});

// Ruta para generar el Kit2 inicial de Mauricio - POST (lógica)
router.post('/generate-initial-kit', async (req, res) => {
  try {
    await pdfController.generarKit2Inicial(req, res);
  } catch (error) {
    console.error('Error al generar Kit2 inicial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar Kit2 inicial de Mauricio',
      error: error.message
    });
  }
});

module.exports = router;