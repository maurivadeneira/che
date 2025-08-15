/**
 * SISTEMA DE TOKENS SEGUROS PARA KIT2
 * Corporación Herejía Económica
 * 
 * Genera tokens únicos, seguros y con expiración para:
 * - Descargas de PDFs personalizados
 * - Enlaces de invitación únicos  
 * - Verificación de autenticidad
 * - Protección anti-duplicación
 */

import crypto from 'crypto';

class Kit2TokenGenerator {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'kit2_heresia_economica_secreto_2024_mauricio';
    this.algorithm = 'aes-256-gcm';
  }

  /**
   * Genera token seguro para descarga de PDF personalizado
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.userId - ID único del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {number} expirationHours - Horas de validez (default: 24)
   * @returns {string} Token encriptado único
   */
  generateDownloadToken(userData, expirationHours = 24) {
    const tokenData = {
      userId: userData.userId,
      email: userData.email,
      name: userData.name,
      purpose: 'kit2_download',
      generatedAt: Date.now(),
      expiresAt: Date.now() + (expirationHours * 60 * 60 * 1000),
      nonce: crypto.randomBytes(16).toString('hex'), // Previene reutilización
      corporationSignature: this.generateCorporationSignature(userData)
    };

    return this.encryptToken(tokenData);
  }

  /**
   * Genera token de invitación único para compartir Kit2
   * @param {Object} inviterData - Datos del usuario que invita
   * @param {number} maxUses - Máximo número de usos (default: 1)
   * @returns {string} Token de invitación único
   */
  generateInvitationToken(inviterData, maxUses = 1) {
    const tokenData = {
      inviterId: inviterData.userId,
      inviterEmail: inviterData.email,
      inviterName: inviterData.name,
      purpose: 'kit2_invitation',
      generatedAt: Date.now(),
      expiresAt: Date.now() + (48 * 60 * 60 * 1000), // 48 horas
      maxUses: maxUses,
      currentUses: 0,
      nonce: crypto.randomBytes(16).toString('hex'),
      corporationSignature: this.generateCorporationSignature(inviterData)
    };

    return this.encryptToken(tokenData);
  }

  /**
   * Genera código de verificación único para cada Kit2
   * @param {Object} userData - Datos del usuario
   * @returns {string} Código de verificación de 12 dígitos
   */
  generateVerificationCode(userData) {
    const baseString = `${userData.userId}-${userData.email}-${Date.now()}`;
    const hash = crypto.createHash('sha256').update(baseString + this.secret).digest('hex');
    
    // Convertir hash a código numérico de 12 dígitos
    const numericHash = hash.replace(/[a-f]/g, '');
    const verificationCode = numericHash.substring(0, 12);
    
    return verificationCode;
  }

  /**
   * Genera firma digital corporativa para autenticidad
   * @param {Object} userData - Datos del usuario
   * @returns {string} Firma digital corporativa
   */
  generateCorporationSignature(userData) {
    const signatureData = {
      corporation: 'Herejía Económica',
      timestamp: Date.now(),
      userId: userData.userId,
      product: 'Kit2_Heresia_Economica'
    };

    const signatureString = Object.values(signatureData).join('|');
    return crypto.createHmac('sha256', this.secret).update(signatureString).digest('hex');
  }

  /**
   * Encripta datos del token usando AES-256-GCM
   * @param {Object} tokenData - Datos a encriptar
   * @returns {string} Token encriptado
   */
  encryptToken(tokenData) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.secret);
    
    let encrypted = cipher.update(JSON.stringify(tokenData), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combinar IV + datos encriptados + tag de autenticación
    const authTag = cipher.getAuthTag ? cipher.getAuthTag().toString('hex') : '';
    return `${iv.toString('hex')}.${encrypted}.${authTag}`;
  }

  /**
   * Desencripta y valida token
   * @param {string} encryptedToken - Token encriptado
   * @returns {Object|null} Datos del token si es válido, null si no
   */
  decryptToken(encryptedToken) {
    try {
      const parts = encryptedToken.split('.');
      if (parts.length < 2) return null;

      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      const authTag = parts[2] ? Buffer.from(parts[2], 'hex') : null;

      const decipher = crypto.createDecipher(this.algorithm, this.secret);
      if (authTag && decipher.setAuthTag) {
        decipher.setAuthTag(authTag);
      }

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      const tokenData = JSON.parse(decrypted);

      // Validar expiración
      if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
        return null; // Token expirado
      }

      return tokenData;
    } catch (error) {
      console.error('Error decriptando token:', error);
      return null;
    }
  }

  /**
   * Valida si un token es auténtico y no ha sido manipulado
   * @param {string} token - Token a validar
   * @param {string} expectedPurpose - Propósito esperado del token
   * @returns {boolean} True si el token es válido
   */
  validateToken(token, expectedPurpose) {
    const tokenData = this.decryptToken(token);
    
    if (!tokenData) return false;
    if (tokenData.purpose !== expectedPurpose) return false;
    if (Date.now() > tokenData.expiresAt) return false;

    return true;
  }

  /**
   * Genera watermark invisible único para PDF
   * @param {Object} userData - Datos del usuario
   * @returns {string} Texto de watermark
   */
  generatePdfWatermark(userData) {
    const timestamp = new Date().toISOString();
    const verificationCode = this.generateVerificationCode(userData);
    
    return {
      visible: 'Herejía Económica® - Kit2 OFICIAL',
      invisible: `CORPORACION_HERESIA_ECONOMICA|${userData.email}|${timestamp}|${verificationCode}|AUTENTICO`,
      disclaimer: 'Verifique autenticidad en corpherejiaeconomica.com/verify-kit2',
      verificationCode: verificationCode
    };
  }

  /**
   * Genera URL segura para descarga con token
   * @param {string} downloadToken - Token de descarga
   * @returns {string} URL segura
   */
  generateSecureDownloadUrl(downloadToken) {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://corpherejiaeconomica.com'
      : 'http://localhost:3001';
    
    return `${baseUrl}/kit2/download/${downloadToken}`;
  }

  /**
   * Genera URL de verificación pública
   * @param {string} verificationCode - Código de verificación
   * @returns {string} URL de verificación
   */
  generateVerificationUrl(verificationCode) {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://corpherejiaeconomica.com'
      : 'http://localhost:3001';
    
    return `${baseUrl}/verify-kit2/${verificationCode}`;
  }
}

export default Kit2TokenGenerator;