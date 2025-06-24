/**
 * GENERADOR DE PDFs SEGUROS PARA KIT2
 * Corporación Herejía Económica
 * 
 * Genera PDFs personalizados, seguros y verificables con:
 * - Watermarks únicos por usuario
 * - Firmas digitales corporativas
 * - Códigos de verificación
 * - Protección anti-copia
 * - Enlaces seguros personalizados
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import Kit2TokenGenerator from '../security/tokenGenerator.js';

class SecurePdfGenerator {
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
   * Genera PDF Kit2 personalizado y seguro
   * @param {Object} userData - Datos del usuario
   * @param {Object} kitContent - Contenido del Kit2
   * @returns {Promise<Object>} Información del PDF generado
   */
  async generateSecureKit2Pdf(userData, kitContent) {
    try {
      // Generar elementos de seguridad únicos
      const watermarkData = this.tokenGenerator.generatePdfWatermark(userData);
      const verificationCode = watermarkData.verificationCode;
      const downloadToken = this.tokenGenerator.generateDownloadToken(userData, 24);
      
      // Crear documento PDF
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Kit2 Herejía Económica - ${userData.name}`,
          Author: 'Corporación Herejía Económica',
          Subject: 'Kit2 Personalizado de la Herejía Económica',
          Keywords: 'Kit2, Herejía Económica, Oficial, Verificado',
          Creator: 'Corporación Herejía Económica - Sistema Seguro',
          Producer: `Kit2 Generator v2.0 - ${verificationCode}`
        }
      });

      // Agregar watermark invisible en metadatos
      doc.info.CustomProperty = watermarkData.invisible;

      // Header corporativo con seguridad
      await this.addSecureHeader(doc, userData, verificationCode);

      // Contenido principal del Kit2
      await this.addKit2Content(doc, userData, kitContent);

      // Información de seguridad y verificación
      await this.addSecuritySection(doc, userData, verificationCode);

      // Footer corporativo
      await this.addSecureFooter(doc, watermarkData);

      // Generar archivo con nombre único y seguro
      const fileName = `kit2_${userData.userId}_${Date.now()}_${verificationCode.substring(0, 6)}.pdf`;
      const secureDirectory = path.join(process.cwd(), 'secure', 'kit2');
      
      // Crear directorio seguro si no existe
      if (!fs.existsSync(secureDirectory)) {
        fs.mkdirSync(secureDirectory, { recursive: true });
      }

      const filePath = path.join(secureDirectory, fileName);

      // Guardar PDF
      await new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        doc.end();
        
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      // Registrar en base de datos para verificación
      await this.registerKit2InDatabase(userData, verificationCode, downloadToken, fileName);

      return {
        success: true,
        fileName: fileName,
        downloadToken: downloadToken,
        verificationCode: verificationCode,
        downloadUrl: this.tokenGenerator.generateSecureDownloadUrl(downloadToken),
        verificationUrl: this.tokenGenerator.generateVerificationUrl(verificationCode),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
        securityInfo: {
          watermark: watermarkData.visible,
          corporationSignature: this.tokenGenerator.generateCorporationSignature(userData)
        }
      };

    } catch (error) {
      console.error('Error generando PDF seguro:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Agrega header corporativo con elementos de seguridad
   */
  async addSecureHeader(doc, userData, verificationCode) {
    // Logo corporativo (placeholder)
    doc.fontSize(20)
       .fillColor('#B22222')
       .text('CORPORACIÓN HEREJÍA ECONÓMICA', 50, 50, { align: 'center' });

    doc.fontSize(16)
       .fillColor('#000000')
       .text('Kit2 de la Herejía Económica - OFICIAL', 50, 80, { align: 'center' });

    // Información de seguridad en el header
    doc.fontSize(10)
       .fillColor('#666666')
       .text(`DOCUMENTO OFICIAL PERSONALIZADO PARA: ${userData.name.toUpperCase()}`, 50, 110, { align: 'center' });

    doc.text(`EMAIL AUTORIZADO: ${userData.email}`, 50, 125, { align: 'center' });
    doc.text(`CÓDIGO DE VERIFICACIÓN: ${verificationCode}`, 50, 140, { align: 'center' });
    doc.text(`GENERADO: ${new Date().toLocaleString('es-ES')}`, 50, 155, { align: 'center' });

    // Línea separadora
    doc.moveTo(50, 175).lineTo(550, 175).stroke('#B22222');

    // QR Code para verificación
    const qrCodeUrl = this.tokenGenerator.generateVerificationUrl(verificationCode);
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
    const qrCodeImage = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    
    doc.image(qrCodeImage, 470, 45, { width: 80, height: 80 });
    doc.fontSize(8)
       .text('Verificar autenticidad', 470, 130, { width: 80, align: 'center' });
  }

  /**
   * Agrega contenido principal del Kit2
   */
  async addKit2Content(doc, userData, kitContent) {
    let currentY = 200;

    // Título personalizado
    doc.fontSize(18)
       .fillColor('#B22222')
       .text('KIT2 PERSONALIZADO DE LA HEREJÍA ECONÓMICA', 50, currentY);

    currentY += 40;

    // Información personalizada del usuario
    doc.fontSize(14)
       .fillColor('#000000')
       .text('INFORMACIÓN DEL TITULAR:', 50, currentY);

    currentY += 20;

    doc.fontSize(12)
       .text(`Nombre: ${userData.name}`, 70, currentY);
    currentY += 15;
    doc.text(`Email: ${userData.email}`, 70, currentY);
    currentY += 15;
    doc.text(`Fecha de Activación: ${new Date().toLocaleDateString('es-ES')}`, 70, currentY);
    currentY += 15;
    doc.text(`ID de Usuario: ${userData.userId}`, 70, currentY);

    currentY += 30;

    // Contenido del Kit2
    doc.fontSize(14)
       .fillColor('#B22222')
       .text('CONTENIDO DE SU KIT2:', 50, currentY);

    currentY += 25;

    // Lista de contenidos
    if (kitContent && kitContent.contents) {
      kitContent.contents.forEach((item, index) => {
        doc.fontSize(11)
           .fillColor('#000000')
           .text(`${index + 1}. ${item.title}`, 70, currentY);
        currentY += 15;
      });
    }

    // Información de precios personalizados
    currentY += 20;
    doc.fontSize(14)
       .fillColor('#B22222')
       .text('INFORMACIÓN DE PAGOS:', 50, currentY);

    currentY += 20;
    doc.fontSize(11)
       .fillColor('#000000')
       .text(`• Compra a la Corporación: US$${kitContent?.corporationPurchase || '20'}`, 70, currentY);
    currentY += 15;
    doc.text(`• Comisión de Red: US$${kitContent?.networkCommission || '7'}`, 70, currentY);

    // Enlaces personalizados seguros
    currentY += 30;
    doc.fontSize(12)
       .fillColor('#B22222')
       .text('ENLACES SEGUROS PERSONALIZADOS:', 50, currentY);

    currentY += 20;
    const secureDownloadUrl = this.tokenGenerator.generateSecureDownloadUrl('USER_TOKEN');
    doc.fontSize(10)
       .fillColor('#0066CC')
       .text(`Verificación: corpherejiaeconomica.com/verify-kit2/${verificationCode}`, 70, currentY);
    currentY += 15;
    doc.text(`Portal de Compra: corpherejiaeconomica.com/kit2/comprar/${userData.userId}`, 70, currentY);
  }

  /**
   * Agrega sección de seguridad y advertencias
   */
  async addSecuritySection(doc, userData, verificationCode) {
    let currentY = 600;

    // Cuadro de seguridad
    doc.rect(50, currentY, 500, 120)
       .fillAndStroke('#F5F5F5', '#B22222');

    currentY += 15;

    doc.fontSize(12)
       .fillColor('#B22222')
       .text('⚠️ ADVERTENCIA DE SEGURIDAD ⚠️', 60, currentY, { align: 'center', width: 480 });

    currentY += 20;

    doc.fontSize(10)
       .fillColor('#000000')
       .text('Este documento es ÚNICO y PERSONALIZADO para el usuario indicado.', 60, currentY, { width: 480 });

    currentY += 15;
    doc.text('Cualquier copia, modificación o uso no autorizado constituye una violación.', 60, currentY, { width: 480 });

    currentY += 15;
    doc.text(`Verifique la autenticidad en: corpherejiaeconomica.com/verify-kit2/${verificationCode}`, 60, currentY, { width: 480 });

    currentY += 15;
    doc.text('Reporte copias no autorizadas a: seguridad@corpherejiaeconomica.com', 60, currentY, { width: 480 });
  }

  /**
   * Agrega footer corporativo con watermarks
   */
  async addSecureFooter(doc, watermarkData) {
    const footerY = 750;

    // Línea separadora
    doc.moveTo(50, footerY).lineTo(550, footerY).stroke('#B22222');

    // Footer corporativo
    doc.fontSize(10)
       .fillColor('#666666')
       .text(watermarkData.visible, 50, footerY + 10, { align: 'center' });

    doc.fontSize(8)
       .text(watermarkData.disclaimer, 50, footerY + 25, { align: 'center' });

    doc.text('© 2024 Corporación Herejía Económica - Todos los derechos reservados', 50, footerY + 40, { align: 'center' });

    // Watermark invisible (en posición específica para detección)
    doc.fontSize(6)
       .fillColor('#FFFFFF')
       .text(watermarkData.invisible, 51, 51);
  }

  /**
   * Registra el Kit2 en la base de datos para verificación
   */
  async registerKit2InDatabase(userData, verificationCode, downloadToken, fileName) {
    try {
      // Aquí se integrará con la base de datos existente
      const registryData = {
        userId: userData.userId,
        userEmail: userData.email,
        userName: userData.name,
        verificationCode: verificationCode,
        downloadToken: downloadToken,
        fileName: fileName,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        status: 'active',
        corporationSignature: this.tokenGenerator.generateCorporationSignature(userData),
        purpose: 'kit2_official_download'
      };

      // TODO: Integrar con models/Contract.js o crear nuevo model Kit2Registry
      console.log('Registrando Kit2 en BD:', registryData);
      
      return registryData;
    } catch (error) {
      console.error('Error registrando Kit2 en BD:', error);
      throw error;
    }
  }
}

export default SecurePdfGenerator;