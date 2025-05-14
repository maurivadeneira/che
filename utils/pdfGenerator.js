// Archivo: utils/pdfGenerator.js
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');

/**
 * Crea un PDF a partir de una plantilla Handlebars
 * @param {string} templateName - Nombre de la plantilla (sin extensión)
 * @param {object} data - Datos para la plantilla
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
async function createPdf(templateName, data) {
  try {
    // Ruta de la plantilla
    const templatePath = path.join(__dirname, '../templates', `${templateName}.handlebars`);
    
    // Verificar si existe la plantilla
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Plantilla no encontrada: ${templatePath}`);
    }
    
    // Leer la plantilla
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    
    // Compilar la plantilla con Handlebars
    const template = Handlebars.compile(templateSource);
    
    // Registrar helpers de Handlebars
    Handlebars.registerHelper('eq', function(a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    });
    
    // Agregar logo si está disponible
    let logoBase64 = '';
    try {
      const logoPath = path.join(__dirname, '../public/logo.png');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = logoBuffer.toString('base64');
      }
    } catch (err) {
      console.warn('No se pudo cargar el logo:', err.message);
    }
    
    // Renderizar la plantilla con los datos
    const html = template({
      ...data,
      logoBase64
    });
    
    // Generar PDF con Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html);
    
    // Obtener el PDF como buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error al crear PDF:', error);
    throw error;
  }
}

module.exports = {
  createPdf
};