/**
 * MIDDLEWARE DE DESCARGA SEGURA PARA KIT2
 * Corporación Herejía Económica
 * 
 * Reemplaza el sistema inseguro /temp/ con descargas protegidas por token
 * Valida autenticidad, controla acceso y registra actividad
 */

import fs from 'fs';
import path from 'path';
import Kit2TokenGenerator from '../security/tokenGenerator.js';
import Kit2VerificationSystem from '../verification/verificationSystem.js';

class SecureDownloadMiddleware {
  constructor() {
    this.tokenGenerator = new Kit2TokenGenerator();
    this.verificationSystem = new Kit2VerificationSystem();
    this.secureDirectory = path.join(process.cwd(), 'secure', 'kit2');
    this.maxDownloadAttempts = 3;
    this.downloadTracking = new Map(); // En producción usar Redis o DB
  }

  /**
   * Middleware principal para descargas seguras
   * Reemplaza la ruta insegura /temp/:filename
   */
  async handleSecureDownload(req, res, next) {
    try {
      const { downloadToken } = req.params;
      const userIP = req.ip;
      const userAgent = req.get('User-Agent');

      // Log de intento de descarga
      console.log(`Intento de descarga: Token=${downloadToken.substring(0, 10)}... IP=${userIP}`);

      // Validar formato del token
      if (!downloadToken || downloadToken.length < 20) {
        return this.sendSecurityResponse(res, 400, 'INVALID_TOKEN', {
          message: 'Token de descarga inválido',
          warning: 'El enlace puede estar corrupto o ser falso'
        });
      }

      // Validar token y extraer datos
      const tokenData = this.tokenGenerator.decryptToken(downloadToken);
      
      if (!tokenData) {
        return this.sendSecurityResponse(res, 401, 'TOKEN_DECRYPT_ERROR', {
          message: 'Token no se pudo desencriptar',
          warning: 'Token inválido o manipulado'
        });
      }

      // Verificar propósito del token
      if (tokenData.purpose !== 'kit2_download') {
        return this.sendSecurityResponse(res, 403, 'INVALID_PURPOSE', {
          message: 'Token no autorizado para descarga',
          warning: 'Este token no es para descargar Kit2'
        });
      }

      // Verificar expiración
      if (Date.now() > tokenData.expiresAt) {
        return this.sendSecurityResponse(res, 410, 'TOKEN_EXPIRED', {
          message: 'Token de descarga expirado',
          expiredAt: new Date(tokenData.expiresAt).toISOString(),
          solution: 'Solicite un nuevo enlace de descarga'
        });
      }

      // Verificar límites de descarga
      const downloadKey = `${tokenData.userId}_${tokenData.nonce}`;
      const downloadCount = this.downloadTracking.get(downloadKey) || 0;
      
      if (downloadCount >= this.maxDownloadAttempts) {
        return this.sendSecurityResponse(res, 429, 'DOWNLOAD_LIMIT_EXCEEDED', {
          message: 'Límite de descargas excedido',
          maxAttempts: this.maxDownloadAttempts,
          solution: 'Contacte soporte para nuevo enlace'
        });
      }

      // Buscar archivo seguro
      const secureFile = await this.findSecureFile(tokenData);
      
      if (!secureFile) {
        return this.sendSecurityResponse(res, 404, 'FILE_NOT_FOUND', {
          message: 'Archivo no encontrado o removido',
          warning: 'El archivo puede haber sido eliminado por seguridad'
        });
      }

      // Verificar integridad del archivo
      const fileIntegrity = await this.verifyFileIntegrity(secureFile.path, tokenData);
      
      if (!fileIntegrity.valid) {
        return this.sendSecurityResponse(res, 412, 'FILE_INTEGRITY_FAILED', {
          message: 'Archivo comprometido detectado',
          warning: 'El archivo ha sido modificado y no es seguro',
          action: 'Reportar a seguridad@corpherejiaeconomica.com'
        });
      }

      // Registrar descarga exitosa
      this.downloadTracking.set(downloadKey, downloadCount + 1);
      await this.logSecureDownload(tokenData, userIP, userAgent, 'SUCCESS');

      // Configurar headers de seguridad para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${secureFile.safeName}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Download-Options', 'noopen');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Headers personalizados de seguridad
      res.setHeader('X-Kit2-Authentic', 'true');
      res.setHeader('X-Kit2-Corporation', 'Heresia-Economica');
      res.setHeader('X-Kit2-Download-ID', tokenData.nonce);

      // Enviar archivo de forma segura
      const fileStream = fs.createReadStream(secureFile.path);
      
      fileStream.on('error', (error) => {
        console.error('Error enviando archivo:', error);
        res.status(500).json({ error: 'Error enviando archivo' });
      });

      fileStream.pipe(res);

    } catch (error) {
      console.error('Error en descarga segura:', error);
      await this.logSecureDownload(null, req.ip, req.get('User-Agent'), 'ERROR', error.message);
      
      return this.sendSecurityResponse(res, 500, 'DOWNLOAD_ERROR', {
        message: 'Error interno del servidor',
        warning: 'No se pudo completar la descarga segura'
      });
    }
  }

  /**
   * Busca archivo seguro correspondiente al token
   */
  async findSecureFile(tokenData) {
    try {
      // Buscar archivos que coincidan con el usuario y timestamp
      const files = fs.readdirSync(this.secureDirectory);
      const userFiles = files.filter(file => 
        file.includes(tokenData.userId) && 
        file.endsWith('.pdf')
      );

      if (userFiles.length === 0) return null;

      // Tomar el archivo más reciente para este usuario
      const mostRecentFile = userFiles
        .map(file => ({
          name: file,
          path: path.join(this.secureDirectory, file),
          stats: fs.statSync(path.join(this.secureDirectory, file))
        }))
        .sort((a, b) => b.stats.mtime - a.stats.mtime)[0];

      return {
        path: mostRecentFile.path,
        originalName: mostRecentFile.name,
        safeName: `Kit2_Heresia_Economica_${tokenData.userId.substring(0, 8)}.pdf`
      };

    } catch (error) {
      console.error('Error buscando archivo seguro:', error);
      return null;
    }
  }

  /**
   * Verifica integridad del archivo PDF
   */
  async verifyFileIntegrity(filePath, tokenData) {
    try {
      // Verificar que el archivo existe y no está corrupto
      const stats = fs.statSync(filePath);
      
      if (stats.size < 1000) { // PDF muy pequeño, posiblemente corrupto
        return { valid: false, reason: 'Archivo demasiado pequeño' };
      }

      // Leer headers del PDF para verificar formato
      const buffer = Buffer.alloc(10);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 10, 0);
      fs.closeSync(fd);

      if (!buffer.toString().startsWith('%PDF-')) {
        return { valid: false, reason: 'No es un archivo PDF válido' };
      }

      // Verificar que el archivo no es muy antiguo (más de 48 horas)
      const maxAge = 48 * 60 * 60 * 1000;
      if (Date.now() - stats.mtime.getTime() > maxAge) {
        return { valid: false, reason: 'Archivo demasiado antiguo' };
      }

      return { valid: true };

    } catch (error) {
      console.error('Error verificando integridad:', error);
      return { valid: false, reason: error.message };
    }
  }

  /**
   * Envía respuesta de seguridad estructurada
   */
  sendSecurityResponse(res, statusCode, errorCode, data) {
    res.status(statusCode).json({
      success: false,
      error: errorCode,
      timestamp: new Date().toISOString(),
      corporationSecurity: 'Corporación Herejía Económica',
      securityContact: 'seguridad@corpherejiaeconomica.com',
      ...data
    });
  }

  /**
   * Registra actividad de descarga para auditoría
   */
  async logSecureDownload(tokenData, userIP, userAgent, status, errorMessage = null) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        userId: tokenData?.userId || 'unknown',
        userEmail: tokenData?.email || 'unknown',
        status: status,
        userIP: userIP,
        userAgent: userAgent,
        tokenNonce: tokenData?.nonce || 'unknown',
        error: errorMessage
      };

      // En producción, guardar en base de datos
      console.log('Log de descarga segura:', logEntry);

      // TODO: Integrar con sistema de logs corporativo
      // await DownloadLog.create(logEntry);

    } catch (error) {
      console.error('Error registrando log de descarga:', error);
    }
  }

  /**
   * Middleware para verificación pública de Kit2
   */
  async handlePublicVerification(req, res) {
    try {
      const { verificationCode } = req.params;
      
      // Usar el sistema de verificación
      const result = await this.verificationSystem.verifyKit2Authenticity(verificationCode);
      
      // Agregar headers de seguridad
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('X-Verification-System', 'Corporacion-Heresia-Economica');
      
      res.json(result);

    } catch (error) {
      console.error('Error en verificación pública:', error);
      res.status(500).json({
        error: 'Error del sistema de verificación',
        message: 'No se pudo completar la verificación'
      });
    }
  }

  /**
   * Cleanup de archivos antiguos (ejecutar periódicamente)
   */
  async cleanupOldFiles() {
    try {
      const files = fs.readdirSync(this.secureDirectory);
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.secureDirectory, file);
        const stats = fs.statSync(filePath);
        
        if (Date.now() - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      console.log(`Cleanup completado: ${deletedCount} archivos eliminados`);

    } catch (error) {
      console.error('Error en cleanup:', error);
    }
  }
}

export default SecureDownloadMiddleware;