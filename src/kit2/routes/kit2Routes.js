/**
 * RUTAS SEGURAS PARA KIT2
 * Corporación Herejía Económica
 * 
 * Define todas las rutas protegidas para:
 * - Generación segura de Kit2
 * - Descargas protegidas por token
 * - Verificación pública de autenticidad
 * - Administración de seguridad
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import SecurePdfGenerator from '../generation/securePdfGenerator.js';
import SecureDownloadMiddleware from '../security/secureDownloadMiddleware.js';
import Kit2VerificationSystem from '../verification/verificationSystem.js';
import { verifyToken } from '../../middleware/auth.js'; // Middleware existente

const router = express.Router();

// Inicializar servicios de seguridad
const pdfGenerator = new SecurePdfGenerator();
const downloadMiddleware = new SecureDownloadMiddleware();
const verificationSystem = new Kit2VerificationSystem();

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
 * POST /kit2/generate
 * Genera un Kit2 personalizado y seguro para un usuario autenticado
 */
router.post('/generate', verifyToken, generateRateLimit, async (req, res) => {
  try {
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
 * GET /kit2/download/:downloadToken
 * Descarga segura de Kit2 usando token único
 * REEMPLAZA el sistema inseguro /temp/:filename
 */
router.get('/download/:downloadToken', downloadRateLimit, (req, res, next) => {
  downloadMiddleware.handleSecureDownload(req, res, next);
});

/**
 * GET /verify-kit2/:verificationCode
 * Verificación pública de autenticidad de Kit2
 * Endpoint público para que cualquiera verifique un Kit2
 */
router.get('/verify-kit2/:verificationCode', verificationRateLimit, (req, res) => {
  downloadMiddleware.handlePublicVerification(req, res);
});

/**
 * GET /kit2/status/:verificationCode
 * Obtiene estado detallado de un Kit2 (para usuarios autenticados)
 */
router.get('/status/:verificationCode', verifyToken, async (req, res) => {
  try {
    const { verificationCode } = req.params;
    const userId = req.user.id;

    // Verificar que el usuario tiene derecho a ver este Kit2
    const verificationResult = await verificationSystem.verifyKit2Authenticity(verificationCode);
    
    if (!verificationResult.authentic) {
      return res.status(404).json({
        success: false,
        error: 'KIT2_NOT_FOUND',
        message: 'Kit2 no encontrado o no auténtico'
      });
    }

    // TODO: Verificar propiedad del Kit2 vs usuario actual
    
    res.json({
      success: true,
      kit2Status: {
        verificationCode: verificationCode,
        authentic: verificationResult.authentic,
        status: verificationResult.status,
        security: verificationResult.security,
        originalInfo: verificationResult.originalInfo
      }
    });

  } catch (error) {
    console.error('Error obteniendo status:', error);
    res.status(500).json({
      success: false,
      error: 'STATUS_ERROR',
      message: 'No se pudo obtener el estado del Kit2'
    });
  }
});

/**
 * POST /kit2/report-fraud
 * Reportar Kit2 fraudulento o sospechoso
 */
router.post('/report-fraud', verificationRateLimit, async (req, res) => {
  try {
    const { verificationCode, reportReason, reporterEmail, additionalInfo } = req.body;

    if (!verificationCode || !reportReason || !reporterEmail) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Faltan campos obligatorios para el reporte'
      });
    }

    // Crear reporte de fraude
    const fraudReport = {
      reportId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      verificationCode: verificationCode,
      reason: reportReason,
      reporterEmail: reporterEmail,
      additionalInfo: additionalInfo || '',
      status: 'PENDING_REVIEW',
      ip: req.ip
    };

    // TODO: Guardar en base de datos y notificar al equipo de seguridad
    console.log('Reporte de fraude recibido:', fraudReport);

    res.json({
      success: true,
      message: 'Reporte de fraude enviado exitosamente',
      reportId: fraudReport.reportId,
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
 * GET /kit2/admin/security-stats
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

    // TODO: Obtener estadísticas reales de la base de datos
    const stats = {
      totalKit2Generated: 0,
      totalVerifications: 0,
      activeFraudReports: 0,
      securityLevel: 'HIGH',
      lastSecurityUpdate: new Date().toISOString()
    };

    res.json({
      success: true,
      securityStats: stats
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

/**
 * Middleware de error para rutas Kit2
 */
router.use((error, req, res, next) => {
  console.error('Error en rutas Kit2:', error);
  
  res.status(500).json({
    success: false,
    error: 'KIT2_ROUTE_ERROR',
    message: 'Error en el sistema Kit2',
    timestamp: new Date().toISOString(),
    corporationContact: 'soporte@corpherejiaeconomica.com'
  });
});

export default router;