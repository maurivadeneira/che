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

// ========== NUEVOS ENDPOINTS PARA EL DASHBOARD ADMIN ==========

// Mock data temporal para el dashboard (puedes reemplazar con MongoDB después)
const mockKits = [
  {
    _id: "668e5fecfcf2e3d6708bbb5c",
    beneficiario: {
      nombre: "Daniel Rivadeneira",
      email: "daniel@example.com",
      telefono: "+1234567890",
      pais: "Ecuador",
      userId: "user_daniel_123"
    },
    donaciones: {
      beneficiario: { estado: "pendiente", monto: 7, tipo: "beneficiario" },
      corporacion: { estado: "pendiente", monto: 20, tipo: "corporacion" }
    },
    estadoGeneral: "pendiente",
    fechaCreacion: new Date("2024-07-09"),
    montoTotal: 27,
    estadisticas: {
      descargas: 0,
      ultimoAcceso: null
    },
    ipRegistro: "192.168.1.100"
  },
  {
    _id: "668e5fecfcf2e3d6708bbb5d", 
    beneficiario: {
      nombre: "María González",
      email: "maria@example.com",
      telefono: "+1234567891",
      pais: "Colombia",
      userId: "user_maria_456"
    },
    donaciones: {
      beneficiario: { estado: "confirmado", monto: 7, tipo: "beneficiario" },
      corporacion: { estado: "confirmado", monto: 20, tipo: "corporacion" }
    },
    estadoGeneral: "aprobado",
    fechaCreacion: new Date("2024-07-08"),
    montoTotal: 27,
    estadisticas: {
      descargas: 5,
      ultimoAcceso: new Date("2024-07-10")
    },
    ipRegistro: "192.168.1.101"
  },
  {
    _id: "668e5fecfcf2e3d6708bbb5e",
    beneficiario: {
      nombre: "Carlos Mendoza", 
      email: "carlos@example.com",
      telefono: "+1234567892",
      pais: "Perú",
      userId: "user_carlos_789"
    },
    donaciones: {
      beneficiario: { estado: "rechazado", monto: 7, tipo: "beneficiario" },
      corporacion: { estado: "pendiente", monto: 20, tipo: "corporacion" }
    },
    estadoGeneral: "rechazado",
    fechaCreacion: new Date("2024-07-07"),
    montoTotal: 27,
    estadisticas: {
      descargas: 0,
      ultimoAcceso: null
    },
    ipRegistro: "192.168.1.102"
  }
];

// GET /api/admin/kits - Lista de todos los kits para el dashboard
router.get('/kits', (req, res) => {
  try {
    console.log('📊 Dashboard: Solicitando lista de kits');
    
    // Calcular estadísticas en tiempo real
    const stats = {
      pendiente: mockKits.filter(k => k.estadoGeneral === 'pendiente').length,
      aprobado: mockKits.filter(k => k.estadoGeneral === 'aprobado').length,
      rechazado: mockKits.filter(k => k.estadoGeneral === 'rechazado').length,
      ingresoTotal: mockKits
        .filter(k => k.estadoGeneral === 'aprobado')
        .reduce((total, k) => total + k.montoTotal, 0)
    };
    
    console.log('📊 Estadísticas calculadas:', stats);
    
    res.json({
      kits: mockKits,
      stats
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo kits:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener la lista de kits'
    });
  }
});

// POST /api/admin/kits/:kitId/aprobar - Aprobar un kit
router.post('/kits/:kitId/aprobar', (req, res) => {
  try {
    const { kitId } = req.params;
    console.log(`✅ Aprobando kit: ${kitId}`);
    
    // Buscar el kit en los datos mock
    const kitIndex = mockKits.findIndex(k => k._id === kitId);
    
    if (kitIndex === -1) {
      return res.status(404).json({
        error: 'Kit no encontrado'
      });
    }
    
    // Actualizar estado
    mockKits[kitIndex].estadoGeneral = 'aprobado';
    mockKits[kitIndex].donaciones.beneficiario.estado = 'confirmado';
    mockKits[kitIndex].donaciones.corporacion.estado = 'confirmado';
    mockKits[kitIndex].fechaActivacion = new Date();
    
    console.log(`✅ Kit ${kitId} aprobado exitosamente`);
    
    res.json({
      message: 'Kit aprobado exitosamente',
      kit: {
        id: kitId,
        estado: 'aprobado',
        fechaActivacion: new Date()
      }
    });
    
  } catch (error) {
    console.error('❌ Error aprobando kit:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al aprobar el kit'
    });
  }
});

// POST /api/admin/kits/:kitId/rechazar - Rechazar un kit
router.post('/kits/:kitId/rechazar', (req, res) => {
  try {
    const { kitId } = req.params;
    const { motivo } = req.body;
    console.log(`❌ Rechazando kit: ${kitId}, motivo: ${motivo}`);
    
    // Buscar el kit en los datos mock
    const kitIndex = mockKits.findIndex(k => k._id === kitId);
    
    if (kitIndex === -1) {
      return res.status(404).json({
        error: 'Kit no encontrado'
      });
    }
    
    // Actualizar estado
    mockKits[kitIndex].estadoGeneral = 'rechazado';
    mockKits[kitIndex].donaciones.beneficiario.estado = 'rechazado';
    mockKits[kitIndex].donaciones.corporacion.estado = 'rechazado';
    mockKits[kitIndex].motivoRechazo = motivo;
    mockKits[kitIndex].fechaRechazo = new Date();
    
    console.log(`❌ Kit ${kitId} rechazado exitosamente`);
    
    res.json({
      message: 'Kit rechazado',
      kit: {
        id: kitId,
        estado: 'rechazado',
        motivo
      }
    });
    
  } catch (error) {
    console.error('❌ Error rechazando kit:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al rechazar el kit'
    });
  }
});

// GET /api/admin/stats - Estadísticas generales del sistema
router.get('/stats', (req, res) => {
  try {
    console.log('📊 Generando estadísticas del sistema');
    
    const stats = {
      kits: {
        total: mockKits.length,
        activos: mockKits.filter(k => k.estadoGeneral === 'aprobado').length,
        ultimos30Dias: mockKits.length, // Simplificado para demo
        tasaConversion: mockKits.length > 0 ? 
          (mockKits.filter(k => k.estadoGeneral === 'aprobado').length / mockKits.length * 100).toFixed(1) : 0
      },
      descargas: {
        total: mockKits.reduce((total, k) => total + k.estadisticas.descargas, 0),
        ultimos7Dias: 2, // Simplificado para demo
        promedioPorKit: mockKits.length > 0 ? 
          (mockKits.reduce((total, k) => total + k.estadisticas.descargas, 0) / mockKits.length).toFixed(1) : 0
      },
      financiero: {
        ingresosTotales: mockKits
          .filter(k => k.estadoGeneral === 'aprobado')
          .reduce((total, k) => total + k.montoTotal, 0),
        ingresoPromedioPorKit: 27
      },
      geografico: [
        { _id: "Ecuador", count: 1 },
        { _id: "Colombia", count: 1 },
        { _id: "Perú", count: 1 }
      ]
    };
    
    console.log('📊 Estadísticas generadas:', stats);
    
    res.json(stats);
    
  } catch (error) {
    console.error('❌ Error generando estadísticas:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener estadísticas'
    });
  }
});

// GET /api/admin/kits/:kitId - Detalles de un kit específico
router.get('/kits/:kitId', (req, res) => {
  try {
    const { kitId } = req.params;
    console.log(`🔍 Obteniendo detalles del kit: ${kitId}`);
    
    const kit = mockKits.find(k => k._id === kitId);
    
    if (!kit) {
      return res.status(404).json({
        error: 'Kit no encontrado'
      });
    }
    
    // Simular historial de descargas
    const historialDescargas = [
      {
        obraKey: 'libro1',
        fechaDescarga: new Date('2024-07-09T10:30:00'),
        ip: kit.ipRegistro
      },
      {
        obraKey: 'articulo_1',
        fechaDescarga: new Date('2024-07-09T11:15:00'),
        ip: kit.ipRegistro
      }
    ];
    
    const estadisticas = {
      totalDescargas: historialDescargas.length,
      descargasPorObra: {
        'libro1': 1,
        'articulo_1': 1
      },
      ultimoAcceso: historialDescargas[0]?.fechaDescarga,
      ipsUnicas: 1
    };
    
    res.json({
      kit,
      estadisticas,
      historialDescargas
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo detalles del kit:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener detalles del kit'
    });
  }
});

// ========== FIN DE ENDPOINTS DASHBOARD ==========

module.exports = router;