/**
 * SISTEMA DE VERIFICACIÓN PÚBLICA PARA KIT2
 * Corporación Herejía Económica
 * 
 * Permite verificar públicamente la autenticidad de cualquier Kit2
 * Protege contra falsificaciones y suplantación
 * Proporciona información de seguridad a usuarios
 */

import Kit2TokenGenerator from '../security/tokenGenerator.js';

class Kit2VerificationSystem {
  constructor() {
    this.tokenGenerator = new Kit2TokenGenerator();
    this.corporationInfo = {
      name: 'Corporación Herejía Económica',
      website: 'corpherejiaeconomica.com',
      email: 'contacto@corpherejiaeconomica.com',
      securityEmail: 'seguridad@corpherejiaeconomica.com'
    };
  }

  /**
   * Verifica la autenticidad de un Kit2 usando su código de verificación
   * @param {string} verificationCode - Código de verificación del Kit2
   * @returns {Promise<Object>} Resultado de la verificación
   */
  async verifyKit2Authenticity(verificationCode) {
    try {
      // Buscar en la base de datos el registro del Kit2
      const registryRecord = await this.findKit2Registry(verificationCode);

      if (!registryRecord) {
        return this.createVerificationResponse(false, 'NOT_FOUND', {
          message: 'Código de verificación no encontrado',
          warning: 'Este Kit2 NO es auténtico o el código es inválido',
          action: 'No proceder con ninguna transacción'
        });
      }

      // Verificar si el registro está activo
      if (registryRecord.status !== 'active') {
        return this.createVerificationResponse(false, 'INACTIVE', {
          message: 'Kit2 inactivo o revocado',
          warning: 'Este Kit2 ha sido desactivado por la Corporación',
          action: 'Contactar a seguridad@corpherejiaeconomica.com'
        });
      }

      // Verificar si no ha expirado
      if (new Date() > registryRecord.expiresAt) {
        return this.createVerificationResponse(false, 'EXPIRED', {
          message: 'Kit2 expirado',
          warning: 'Este Kit2 ha superado su fecha de validez',
          originalDate: registryRecord.generatedAt,
          expiredDate: registryRecord.expiresAt
        });
      }

      // Verificar firma corporativa
      const expectedSignature = this.tokenGenerator.generateCorporationSignature({
        userId: registryRecord.userId,
        email: registryRecord.userEmail
      });

      if (registryRecord.corporationSignature !== expectedSignature) {
        return this.createVerificationResponse(false, 'INVALID_SIGNATURE', {
          message: 'Firma corporativa inválida',
          warning: 'Este Kit2 ha sido alterado o es una falsificación',
          action: 'REPORTAR INMEDIATAMENTE a seguridad@corpherejiaeconomica.com'
        });
      }

      // Kit2 auténtico - crear respuesta positiva
      return this.createVerificationResponse(true, 'AUTHENTIC', {
        message: 'Kit2 AUTÉNTICO y verificado',
        originalSeller: registryRecord.userName,
        sellerEmail: registryRecord.userEmail, // Solo primeras letras por privacidad
        generatedDate: registryRecord.generatedAt,
        verificationCode: verificationCode,
        corporationConfirmed: 'Corporación Herejía Económica OFICIAL'
      });

    } catch (error) {
      console.error('Error en verificación:', error);
      return this.createVerificationResponse(false, 'ERROR', {
        message: 'Error del sistema de verificación',
        warning: 'No se pudo verificar el Kit2',
        action: 'Contactar soporte técnico'
      });
    }
  }

  /**
   * Crea respuesta estándar de verificación
   * @param {boolean} isAuthentic - Si el Kit2 es auténtico
   * @param {string} status - Estado de la verificación
   * @param {Object} data - Datos adicionales
   * @returns {Object} Respuesta estructurada
   */
  createVerificationResponse(isAuthentic, status, data) {
    const baseResponse = {
      authentic: isAuthentic,
      status: status,
      timestamp: new Date().toISOString(),
      verifiedBy: 'Corporación Herejía Económica - Sistema Oficial',
      corporationWebsite: this.corporationInfo.website,
      securityContact: this.corporationInfo.securityEmail
    };

    if (isAuthentic) {
      return {
        ...baseResponse,
        result: '✅ KIT2 AUTÉNTICO',
        security: {
          level: 'VERIFICADO',
          confidence: '100%',
          corporationSignature: 'VÁLIDA'
        },
        originalInfo: {
          seller: this.maskEmail(data.sellerEmail),
          sellerName: data.originalSeller,
          generatedDate: data.generatedDate,
          verificationCode: data.verificationCode
        },
        message: data.message,
        instructions: {
          safeToUse: true,
          recommendation: 'Este Kit2 es oficial y seguro para usar',
          purchaseAdvice: 'Puede proceder con confianza con cualquier transacción'
        }
      };
    } else {
      return {
        ...baseResponse,
        result: '⚠️ KIT2 NO AUTÉNTICO',
        security: {
          level: 'RIESGO ALTO',
          confidence: '0%',
          corporationSignature: 'INVÁLIDA'
        },
        warning: {
          level: 'CRÍTICO',
          message: data.warning,
          action: data.action || 'No usar este Kit2'
        },
        fraudInfo: {
          possibleFraud: true,
          reportTo: this.corporationInfo.securityEmail,
          reportSubject: `Reporte Kit2 Fraudulento - Código: ${data.verificationCode || 'N/A'}`
        },
        instructions: {
          safeToUse: false,
          recommendation: 'NO usar este Kit2',
          purchaseAdvice: 'NO realizar ninguna transacción'
        }
      };
    }
  }

  /**
   * Busca registro del Kit2 en la base de datos
   * @param {string} verificationCode - Código a buscar
   * @returns {Promise<Object|null>} Registro encontrado o null
   */
  async findKit2Registry(verificationCode) {
    try {
      // TODO: Integrar con la base de datos real
      // Por ahora, simulamos con un array en memoria
      
      // En producción, esto sería algo como:
      // const Kit2Registry = require('../../models/Kit2Registry');
      // return await Kit2Registry.findOne({ verificationCode: verificationCode });

      // Simulación para testing
      const mockRegistry = [
        {
          userId: 'user123',
          userEmail: 'maurivadeneira@yahoo.es',
          userName: 'Mauricio Rivadeneira',
          verificationCode: '123456789012',
          generatedAt: new Date('2024-12-01'),
          expiresAt: new Date('2025-12-01'),
          status: 'active',
          corporationSignature: 'valid_signature_hash'
        }
      ];

      return mockRegistry.find(record => record.verificationCode === verificationCode) || null;

    } catch (error) {
      console.error('Error buscando registro:', error);
      return null;
    }
  }

  /**
   * Enmascara email para privacidad
   * @param {string} email - Email a enmascarar
   * @returns {string} Email enmascarado
   */
  maskEmail(email) {
    if (!email) return 'N/A';
    
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
    return `${maskedUsername}@${domain}`;
  }

  /**
   * Genera reporte de seguridad para administradores
   * @param {string} verificationCode - Código verificado
   * @param {Object} verificationResult - Resultado de verificación
   * @returns {Object} Reporte de seguridad
   */
  generateSecurityReport(verificationCode, verificationResult) {
    return {
      reportId: this.tokenGenerator.generateVerificationCode({ userId: 'security', email: 'security@corpherejiaeconomica.com' }),
      timestamp: new Date().toISOString(),
      verificationCode: verificationCode,
      result: verificationResult,
      securityLevel: verificationResult.authentic ? 'LOW_RISK' : 'HIGH_RISK',
      actionRequired: !verificationResult.authentic,
      recommendedActions: verificationResult.authentic 
        ? ['Monitor normal usage']
        : ['Investigate fraud', 'Block if necessary', 'Alert security team']
    };
  }

  /**
   * API endpoint para verificación pública
   * Express route handler
   */
  async handlePublicVerification(req, res) {
    try {
      const { verificationCode } = req.params;
      
      if (!verificationCode || verificationCode.length !== 12) {
        return res.status(400).json({
          error: 'Código de verificación inválido',
          message: 'El código debe tener exactamente 12 dígitos'
        });
      }

      const verificationResult = await this.verifyKit2Authenticity(verificationCode);
      const securityReport = this.generateSecurityReport(verificationCode, verificationResult);

      // Log para auditoría
      console.log('Verificación realizada:', {
        code: verificationCode,
        result: verificationResult.authentic,
        timestamp: new Date().toISOString(),
        ip: req.ip
      });

      res.json(verificationResult);

    } catch (error) {
      console.error('Error en endpoint de verificación:', error);
      res.status(500).json({
        error: 'Error del servidor',
        message: 'No se pudo completar la verificación'
      });
    }
  }
}

export default Kit2VerificationSystem;