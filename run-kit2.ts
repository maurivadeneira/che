import { writeFileSync } from 'fs';
import { generarKit2PDF } from './src/lib/pdf/kit2-generator';

async function main() {
  const data = {
    nombreDueno: 'Juan Pérez',
    nombreBeneficiario: 'María García',
    nombreInvitador: 'Carlos López',
    codigoUnico: 'ABC123',
    linkActivacion: 'https://example.com/activar?ref=ABC123',
    obras: [
      { titulo: 'Libro de Economía', autor: 'Autor 1' },
      { titulo: 'Teoría del Dinero', autor: 'Autor 2' },
    ],
  };

  try {
    const pdfBuffer = await generarKit2PDF(data);
    writeFileSync('kit2-sample.pdf', pdfBuffer);
    console.log('PDF generado exitosamente: kit2-sample.pdf');
  } catch (error) {
    console.error('Error generando PDF:', error);
  }
}

main();