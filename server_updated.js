// server.js - Servidor principal para Kit2 Herejía Económica

// Importar dependencias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // Añadido para manejar rutas
const fs = require("fs"); // Añadido para verificar archivos

// Importar la configuración de la base de datos
const connectDB = require("./db");

// Configurar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// 🛡️ CONFIGURACIÓN DE DIRECTORIOS SEGUROS PARA KIT2
const tempDir = path.join(__dirname, 'temp');
const secureDir = path.join(__dirname, 'secure', 'kit2');

// Verificar/crear directorio temp (para compatibilidad con sistema anterior)
if (fs.existsSync(tempDir)) {
  console.log(`✅ Directorio temp existe: ${tempDir}`);
  try {
    fs.accessSync(tempDir, fs.constants.W_OK);
    console.log('✅ El directorio temp es escribible');
  } catch (err) {
    console.error('❌ El directorio temp NO es escribible');
  }
} else {
  console.log(`📁 Creando directorio temp: ${tempDir}`);
  fs.mkdirSync(tempDir, { recursive: true });
}

// Crear directorio seguro para Kit2 (NUEVO SISTEMA DE SEGURIDAD)
if (!fs.existsSync(secureDir)) {
  console.log(`🔒 Creando directorio seguro Kit2: ${secureDir}`);
  fs.mkdirSync(secureDir, { recursive: true });
  console.log('✅ Directorio seguro Kit2 creado exitosamente');
}

// 🚨 ADVERTENCIA DE SEGURIDAD PARA SISTEMA ANTERIOR
console.log('⚠️  ADVERTENCIA DE SEGURIDAD:');
console.log('📁 /temp/ - Sistema anterior (INSEGURO, solo para compatibilidad)');
console.log('🔒 /secure/kit2/ - Nuevo sistema (SEGURO, protegido por tokens)');

// Servir archivos estáticos desde la carpeta temp con configuración explícita para PDF
// ⚠️ ESTE SISTEMA ES INSEGURO - Solo para compatibilidad temporal
app.use('/temp', express.static(path.join(__dirname, 'temp'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      // Agregar header de advertencia de seguridad
      res.setHeader('X-Security-Warning', 'Insecure-Legacy-System');
    }
  }
}));

// Añadir un manejador específico para archivos PDF del sistema anterior
app.get('/temp/:filename', (req, res, next) => {
  if (!req.params.filename.endsWith('.pdf')) {
    return next(); // No es un PDF, continuar con la siguiente ruta
  }
  
  const filePath = path.join(__dirname, 'temp', req.params.filename);
  console.log(`⚠️  DESCARGA INSEGURA solicitada: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    console.log('⚠️  Sirviendo archivo del sistema INSEGURO (temp/)');
    // Agregar header de advertencia
    res.setHeader('X-Security-Level', 'LEGACY-INSECURE');
    return res.sendFile(filePath);
  } else {
    console.error(`❌ ERROR: Archivo PDF no encontrado en ${filePath}`);
    return res.status(404).send('Archivo PDF no encontrado');
  }
});

// 🔒 RUTAS PRINCIPALES DEL SISTEMA
app.use("/api/users", require("./routes/users"));
app.use("/api/kits", require("./routes/kits"));
app.use("/api/invitations", require("./routes/invitations"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/pdfs", require("./routes/pdfs"));
app.use("/api/activacion", require("./routes/activacion"));
app.use("/api/auth", require("./routes/auth"));

// 🛡️ NUEVAS RUTAS SEGURAS PARA KIT2
app.use("/api/kit2", require("./routes/kit2Secure")); // ← NUEVA RUTA SEGURA
app.use("/kit2", require("./routes/kit2Secure")); // ← Para compatibilidad de URLs

// 🔍 RUTA DE VERIFICACIÓN PÚBLICA (acceso directo)
app.use("/verify-kit2", require("./routes/kit2Secure")); // ← Verificación pública

// Ruta para la interfaz de generación de Kit del Autor
app.get('/admin/generar-kit-autor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autor-kit.html'));
});

// 🛡️ RUTA PARA INTERFAZ SEGURA DE KIT2
app.get('/kit2-seguro', (req, res) => {
  console.log('🔒 Acceso a interfaz segura Kit2');
  res.sendFile(path.join(__dirname, 'public', 'kit2-seguro.html'));
});

// Ruta básica con información de seguridad
app.get("/api", (req, res) => {
  res.json({
    message: "API del Sistema Kit2 de Herejía Económica funcionando",
    version: "2.0.0",
    security: {
      kit2System: "ACTIVE",
      securityLevel: "HIGH",
      legacySupport: "DEPRECATED"
    },
    endpoints: {
      secure: {
        generate: "/api/kit2/generate",
        download: "/api/kit2/download/:token",
        verify: "/verify-kit2/:code"
      },
      legacy: {
        temp: "/temp/:filename (⚠️ INSECURE - DEPRECATED)"
      }
    }
  });
});

// 🔧 ENDPOINT DE ESTADO DEL SISTEMA
app.get("/api/system/status", (req, res) => {
  const systemStatus = {
    timestamp: new Date().toISOString(),
    server: "RUNNING",
    database: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
    security: {
      kit2SecureSystem: fs.existsSync(secureDir) ? "ACTIVE" : "INACTIVE",
      legacyTempSystem: fs.existsSync(tempDir) ? "DEPRECATED" : "DISABLED"
    },
    directories: {
      secure: secureDir,
      temp: tempDir + " (DEPRECATED)"
    }
  };
  
  console.log('📊 Estado del sistema consultado:', systemStatus);
  res.json(systemStatus);
});

// Servir archivos estáticos (para React)
app.use(express.static(path.join(__dirname, 'public')));

// Manejar todas las rutas no API con React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔧 LIMPIEZA AUTOMÁTICA DE ARCHIVOS (ejecutar cada hora)
setInterval(async () => {
  try {
    console.log('🧹 Ejecutando limpieza automática de archivos...');
    
    // Importar dinámicamente las utilidades de limpieza
    const { default: SecureDownloadMiddleware } = await import('./src/kit2/security/secureDownloadMiddleware.js');
    const downloadMiddleware = new SecureDownloadMiddleware();
    
    // Limpiar archivos antiguos
    await downloadMiddleware.cleanupOldFiles();
    
    // Limpiar registros expirados en BD
    const { default: Kit2Registry } = await import('./models/Kit2Registry.js');
    await Kit2Registry.cleanupExpired();
    
    console.log('✅ Limpieza automática completada');
  } catch (error) {
    console.error('❌ Error en limpieza automática:', error);
  }
}, 60 * 60 * 1000); // Cada hora

// 🚀 INICIALIZACIÓN DEL SERVIDOR
const PORT = process.env.BACKEND_PORT || 3001;

app.listen(PORT, () => {
  console.log('🚀 ===============================================');
  console.log(`🌟 Servidor Kit2 Herejía Económica iniciado`);
  console.log(`🔗 Puerto: ${PORT}`);
  console.log(`🛡️ Sistema de Seguridad Kit2: ACTIVO`);
  console.log(`📊 Estado: OPERACIONAL`);
  console.log('🚀 ===============================================');
  
  // Mostrar endpoints importantes
  console.log('📋 ENDPOINTS PRINCIPALES:');
  console.log(`🔒 Kit2 Seguro: http://localhost:${PORT}/api/kit2/generate`);
  console.log(`🔍 Verificación: http://localhost:${PORT}/verify-kit2/{codigo}`);
  console.log(`📊 Estado: http://localhost:${PORT}/api/system/status`);
  console.log(`⚠️  Temp (INSEGURO): http://localhost:${PORT}/temp/{archivo}`);
});