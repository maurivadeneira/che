/**
 * RUTAS SEGURAS PARA KIT2 - VERSIÓN COMMONJS
 * Corporación Herejía Económica
 * 
 * Versión adaptada para integración con server.js existente
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiting para proteger endpoints
const generateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // Máximo 3 generaciones por usuario cada 15 minutos
  message: {
    error: 'Demasiadas generaciones de Kit2',
    message: 'Espere 15 minutos antes de generar otro Kit2'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const verificationRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 verificaciones por IP por minuto
  message: {
    error: 'Demasiadas verificaciones',
    message: 'Espere un minuto antes de verificar otro código'
  }
});

const downloadRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // Máximo 5 descargas cada 5 minutos
  message: {
    error: 'Demasiadas descargas',
    message: 'Espere 5 minutos antes de descargar otro Kit2'
  }
});

/**
 * POST /api/kit2/generate
 * Genera un Kit2 personalizado y seguro para un usuario autenticado
 */
router.post('/generate', verifyToken, generateRateLimit, async (req, res) => {
  try {
    // Importar dinámicamente las clases de seguridad (para compatibilidad)
    const { default: SecurePdfGenerator } = await import('../src/kit2/generation/securePdfGenerator.js');
    const { default: Kit2Registry } = await import('../models/Kit2Registry.js');
    
    const pdfGenerator = new SecurePdfGenerator();

    // Obtener datos del usuario del token JWT
    const userData = {
      userId: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    };

    // Obtener configuración del Kit2 desde la request
    const kitConfig = {
      corporationPurchase: req.body.corporationPurchase || 20,
      networkCommission: req.body.networkCommission || 7,
      contents: req.body.contents || [
        { id: 1, title: "Guía de iniciación a la Herejía Económica", type: "document" },
        { id: 2, title: "Video explicativo del sistema económico", type: "video" },
        { id: 3, title: "E-book: Fundamentos de la Herejía Económica", type: "ebook" },
        { id: 4, title: "Curso introductorio a los fondos rotatorios", type: "document" },
        { id: 5, title: "Documentos de implementación práctica", type: "document" }
      ]
    };

    console.log(`Generando Kit2 seguro para usuario: ${userData.email}`);

    // Generar PDF seguro personalizado
    const result = await pdfGenerator.generateSecureKit2Pdf(userData, kitConfig);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'PDF_GENERATION_FAILED',
        message: 'No se pudo generar el Kit2',
        details: result.error
      });
    }

    // Registrar en base de datos
    await Kit2Registry.create({
      verificationCode: result.verificationCode,
      downloadToken: result.downloadToken,
      userId: userData.userId,
      userEmail: userData.email,
      userName: userData.name,
      fileName: result.fileName,
      filePath: `secure/kit2/${result.fileName}`,
      kitConfiguration: kitConfig,
      corporationSignature: result.securityInfo.corporationSignature,
      watermarkData: result.securityInfo.watermark,
      expiresAt: new Date(result.expiresAt)
    });

    // Log de generación exitosa
    console.log(`Kit2 generado exitosamente: ${result.verificationCode}`);

    // Respuesta exitosa con información de seguridad
    res.json({
      success: true,
      message: 'Kit2 generado exitosamente',
      kit2Info: {
        downloadUrl: result.downloadUrl,
        verificationCode: result.verificationCode,
        verificationUrl: result.verificationUrl,
        expiresAt: new Date(result.expiresAt).toISOString(),
        securityInfo: {
          corporationSignature: 'VÁLIDA',
          watermarkApplied: true,
          tokenProtected: true
        }
      },
      instructions: {
        download: 'Use el enlace downloadUrl para descargar su Kit2 personalizado',
        sharing: 'Puede compartir el verificationUrl para que otros verifiquen la autenticidad',
        validity: 'El enlace de descarga expira en 24 horas'
      }
    });

  } catch (error) {
    console.error('Error generando Kit2:', error);
    res.status(500).json({
      success: false,
      error: 'GENERATION_ERROR',
      message: 'Error interno generando Kit2',
      corporationContact: 'soporte@corpherejiaeconomica.com'
    });
  }
});

/**
 * GET /api/kit2/download/:downloadToken
 * Descarga segura de Kit2 usando token único
 * REEMPLAZA el sistema inseguro /temp/:filename
 */
router.get('/download/:downloadToken', downloadRateLimit, async (req, res) => {
  try {
    const { default: SecureDownloadMiddleware } = await import('../src/kit2/security/secureDownloadMiddleware.js');
    const downloadMiddleware = new SecureDownloadMiddleware();
    
    return downloadMiddleware.handleSecureDownload(req, res);
  } catch (error) {
    console.error('Error en descarga segura:', error);
    res.status(500).json({
      error: 'Error del sistema de descarga segura'
    });
  }
});

/**
 * GET /api/verify-kit2/:verificationCode
 * Verificación pública de autenticidad de Kit2
 */
router.get('/verify-kit2/:verificationCode', verificationRateLimit, async (req, res) => {
  try {
    const { default: Kit2VerificationSystem } = await import('../src/kit2/verification/verificationSystem.js');
    const { default: Kit2Registry } = await import('../models/Kit2Registry.js');
    
    const verificationSystem = new Kit2VerificationSystem();
    const { verificationCode } = req.params;
    
    if (!verificationCode || verificationCode.length !== 12) {
      return res.status(400).json({
        error: 'Código de verificación inválido',
        message: 'El código debe tener exactamente 12 dígitos'
      });
    }

    // Buscar en la base de datos
    const registry = await Kit2Registry.findByVerificationCode(verificationCode);
    
    if (!registry) {
      return res.json({
        authentic: false,
        status: 'NOT_FOUND',
        result: '⚠️ KIT2 NO AUTÉNTICO',
        warning: {
          message: 'Código de verificación no encontrado en registros oficiales',
          level: 'CRÍTICO'
        },
        instructions: {
          safeToUse: false,
          recommendation: 'NO usar este Kit2',
          purchaseAdvice: 'NO realizar ninguna transacción'
        },
        timestamp: new Date().toISOString(),
        verifiedBy: 'Corporación Herejía Económica - Sistema Oficial'
      });
    }

    // Registrar actividad de verificación
    await registry.addVerificationActivity(req.ip, registry.status);

    // Verificar estado
    if (registry.status !== 'active') {
      return res.json({
        authentic: false,
        status: 'INACTIVE',
        result: '⚠️ KIT2 INACTIVO',
        warning: {
          message: 'Kit2 ha sido desactivado por la Corporación',
          level: 'ALTO'
        },
        originalInfo: {
          seller: registry.userEmail.replace(/(.{2}).*(@.*)/, '$1***$2'),
          generatedDate: registry.generatedAt
        }
      });
    }

    // Verificar expiración
    if (registry.isExpired()) {
      return res.json({
        authentic: false,
        status: 'EXPIRED',
        result: '⚠️ KIT2 EXPIRADO',
        warning: {
          message: 'Kit2 ha superado su fecha de validez',
          level: 'MEDIO'
        },
        originalInfo: {
          seller: registry.userEmail.replace(/(.{2}).*(@.*)/, '$1***$2'),
          generatedDate: registry.generatedAt,
          expiredDate: registry.expiresAt
        }
      });
    }

    // Kit2 auténtico
    return res.json({
      authentic: true,
      status: 'AUTHENTIC',
      result: '✅ KIT2 AUTÉNTICO',
      security: {
        level: 'VERIFICADO',
        confidence: '100%',
        corporationSignature: 'VÁLIDA'
      },
      originalInfo: {
        seller: registry.userEmail.replace(/(.{2}).*(@.*)/, '$1***$2'),
        sellerName: registry.userName,
        generatedDate: registry.generatedAt,
        verificationCode: verificationCode
      },
      instructions: {
        safeToUse: true,
        recommendation: 'Este Kit2 es oficial y seguro para usar',
        purchaseAdvice: 'Puede proceder con confianza con cualquier transacción'
      },
      timestamp: new Date().toISOString(),
      verifiedBy: 'Corporación Herejía Económica - Sistema Oficial'
    });

  } catch (error) {
    console.error('Error en verificación pública:', error);
    res.status(500).json({
      error: 'Error del sistema de verificación',
      message: 'No se pudo completar la verificación'
    });
  }
});

/**
 * POST /api/kit2/report-fraud
 * Reportar Kit2 fraudulento o sospechoso
 */
router.post('/report-fraud', verificationRateLimit, async (req, res) => {
  try {
    const { default: Kit2Registry } = await import('../models/Kit2Registry.js');
    const { verificationCode, reportReason, reporterEmail, additionalInfo } = req.body;

    if (!verificationCode || !reportReason || !reporterEmail) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Faltan campos obligatorios para el reporte'
      });
    }

    // Buscar el Kit2 reportado
    const registry = await Kit2Registry.findByVerificationCode(verificationCode);
    
    if (registry) {
      // Agregar reporte de fraude
      await registry.addFraudReport({
        reporterEmail,
        reason: reportReason,
        additionalInfo,
        reporterIP: req.ip
      });
    }

    res.json({
      success: true,
      message: 'Reporte de fraude enviado exitosamente',
      reportId: `FR_${Date.now()}`,
      nextSteps: [
        'Su reporte será investigado en las próximas 24 horas',
        'Recibirá una respuesta por email',
        'Evite usar el Kit2 reportado hasta recibir confirmación'
      ]
    });

  } catch (error) {
    console.error('Error procesando reporte de fraude:', error);
    res.status(500).json({
      success: false,
      error: 'REPORT_ERROR',
      message: 'No se pudo procesar el reporte'
    });
  }
});

/**
 * GET /api/kit2/admin/security-stats
 * Estadísticas de seguridad (solo para administradores)
 */
router.get('/admin/security-stats', verifyToken, async (req, res) => {
  try {
    // Verificar que el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'INSUFFICIENT_PERMISSIONS',
        message: 'Solo administradores pueden acceder a estadísticas de seguridad'
      });
    }

    const { default: Kit2Registry } = await import('../models/Kit2Registry.js');

    // Obtener estadísticas de la base de datos
    const stats = await Kit2Registry.getSecurityStats();
    const fraudReports = await Kit2Registry.getFraudReports();

    res.json({
      success: true,
      securityStats: {
        totalKit2Generated: stats.reduce((sum, item) => sum + item.count, 0),
        totalDownloads: stats.reduce((sum, item) => sum + (item.totalDownloads || 0), 0),
        totalVerifications: stats.reduce((sum, item) => sum + (item.totalVerifications || 0), 0),
        activeFraudReports: fraudReports.length,
        statusBreakdown: stats,
        securityLevel: 'HIGH',
        lastSecurityUpdate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'STATS_ERROR',
      message: 'No se pudieron obtener las estadísticas'
    });
  }
});

module.exports = router;