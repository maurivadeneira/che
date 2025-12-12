import PDFDocument from 'pdfkit';

interface Kit2Data {
  nombreDueno: string;
  nombreBeneficiario: string;
  nombreInvitador: string;
  codigoUnico: string;
  linkActivacion: string;
  obras?: { titulo: string; autor: string }[];
}

const COLORS = {
  primary: '#4A7C59',
  secondary: '#6B5B95',
  accent: '#F4A460',
  text: '#333333',
  white: '#FFFFFF',
  link: '#1E90FF',
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

export async function generarKit2PDF(data: Kit2Data): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true,
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      generarPortada(doc);
      generarPagina2(doc, data);
      generarPagina3(doc);
      generarPagina4(doc);
      generarPagina5(doc, data);
      generarPagina6(doc);
      generarPagina7(doc);
      generarPagina8(doc);
      generarPagina9(doc);
      generarPagina10(doc, data);
      generarPagina11(doc);
      generarPagina12(doc);
      generarPagina13(doc);
      generarPagina14(doc);
      generarPagina15(doc);
      generarPagina16(doc);
      generarPagina17(doc);
      generarPagina18(doc);
      generarPagina19(doc);
      generarPagina20(doc);
      generarPagina21(doc);
      generarPagina22(doc);
      generarPagina23(doc, data);
      generarPagina24(doc);
      generarPaginaObras(doc, data);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function generarPortada(doc: PDFKit.PDFDocument) {
  doc.rect(30, 30, PAGE_WIDTH - 60, PAGE_HEIGHT - 60).fill('#6B5B95');
  
  doc.fontSize(36).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('EL ARBOL MAGICO DEL', 0, 280, { align: 'center' })
     .text('AHORRO', 0, 330, { align: 'center' });
  
  doc.moveTo(150, 380).lineTo(PAGE_WIDTH - 150, 380)
     .strokeColor(COLORS.primary).lineWidth(3).stroke();
  
  doc.fontSize(18).fillColor(COLORS.white).font('Helvetica')
     .text('El Juego Mas Divertido Para Aprender Sobre', 0, 420, { align: 'center' })
     .text('Dinero!', 0, 445, { align: 'center' });
  
  doc.fontSize(14).text('Aprende - Ahorra - Comparte - Gana', 0, 500, { align: 'center' });
  doc.fontSize(12).text('Para toda la familia', 0, 550, { align: 'center' })
     .text('(Hasta los abuelitos pueden jugar!)', 0, 570, { align: 'center' });
  
  doc.addPage();
}

function generarPagina2(doc: PDFKit.PDFDocument, data: Kit2Data) {
  doc.fontSize(28).fillColor(COLORS.secondary).font('Helvetica-Bold')
     .text(`Hola, Soy ${data.nombreDueno}`, MARGIN, 80);
  
  doc.roundedRect(MARGIN, 130, CONTENT_WIDTH, 180, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  
  doc.fontSize(18).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('UN JUEGO FAMILIAR REAL', MARGIN + 20, 150);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Este es un JUEGO FAMILIAR REAL donde todos aprendemos juntos:', MARGIN + 20, 185, { width: CONTENT_WIDTH - 40 })
     .text('los ninos, los papas, los abuelos... TODOS!', MARGIN + 20, 205, { width: CONTENT_WIDTH - 40 })
     .text('Es un juego para aprender haciendo lo que hacen los adultos con el dinero.', MARGIN + 20, 235, { width: CONTENT_WIDTH - 40 })
     .text('Pero NO es un juego de mentiras.', MARGIN + 20, 260, { width: CONTENT_WIDTH - 40 });
  
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold').text('Es REAL:', MARGIN, 340);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Con dinero real', MARGIN + 20, 365)
     .text('Con bancos reales', MARGIN + 20, 385)
     .text('Con decisiones reales', MARGIN + 20, 405);
  
  doc.fontSize(12)
     .text('Por eso lo mejor es empezar con el PEQUENIN DE LA CASA. Por que?', MARGIN, 450, { width: CONTENT_WIDTH })
     .text('Porque los ninos aprenden mas rapido que nosotros.', MARGIN, 480, { width: CONTENT_WIDTH })
     .text('Y mientras ellos juegan (con supervision de mama o papa), toda la familia aprende!', MARGIN, 510, { width: CONTENT_WIDTH });
  
  doc.addPage();
}

function generarPagina3(doc: PDFKit.PDFDocument) {
  doc.fontSize(24).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('Que Van a Aprender?', MARGIN, 50);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('No es solo recibir dinero. Es aprender 3 cosas importantes:', MARGIN, 90, { width: CONTENT_WIDTH });
  
  doc.roundedRect(MARGIN, 120, CONTENT_WIDTH, 140, 8).fillAndStroke('#FFF3E0', '#FF9800');
  doc.fontSize(16).fillColor('#E65100').font('Helvetica-Bold').text('1. AHORRAR', MARGIN + 15, 135);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Ahorrar es NO gastar todo lo que tienes.', MARGIN + 15, 160, { width: CONTENT_WIDTH - 30 })
     .text('Ejemplo: Si recibes $100, no gastas los $100. Gastas $80 y guardas $20.', MARGIN + 15, 180, { width: CONTENT_WIDTH - 30 })
     .text('Por que es importante? Porque asi juntas dinero para cosas mas grandes!', MARGIN + 15, 210, { width: CONTENT_WIDTH - 30 });
  
  doc.roundedRect(MARGIN, 280, CONTENT_WIDTH, 140, 8).fillAndStroke('#E3F2FD', '#2196F3');
  doc.fontSize(16).fillColor('#1565C0').font('Helvetica-Bold').text('2. INVERTIR', MARGIN + 15, 295);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Invertir es usar tu dinero para HACER MAS DINERO.', MARGIN + 15, 320, { width: CONTENT_WIDTH - 30 })
     .text('Ejemplo: Si usas $35 para entrar al juego, y despues recibes $250...', MARGIN + 15, 340, { width: CONTENT_WIDTH - 30 })
     .text('$35 -> $250 = 7 veces mas dinero!', MARGIN + 15, 385, { width: CONTENT_WIDTH - 30 });
  
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('3. INCREMENTAR TU CAPITAL', MARGIN, 450);
  
  doc.addPage();
}

function generarPagina4(doc: PDFKit.PDFDocument) {
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Capital es el dinero que tienes guardado para hacer cosas grandes.', MARGIN, 50, { width: CONTENT_WIDTH });
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Ejemplo progresivo:', MARGIN, 90);
  
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Mes 1: Tienes $0 de capital -> Inviertes $35 para empezar', MARGIN + 20, 115)
     .text('Mes 3: Ya recibiste $30 -> Tu capital es -$5 (casi recuperas)', MARGIN + 20, 135)
     .text('Mes 6: Ya recibiste $100 -> Tu capital es +$65 (ganancia!)', MARGIN + 20, 155)
     .text('Mes 12: Recibiste $250 -> Tu capital es +$215 (EXITO!)', MARGIN + 20, 175);
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Por que es importante?', MARGIN, 220);
  
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Porque con $250 ahorrados puedes:', MARGIN, 245)
     .text('- Abrir tu propio negocio', MARGIN + 20, 265)
     .text('- Comprar algo que te ayude a ganar mas', MARGIN + 20, 285)
     .text('- Seguir jugando y hacer crecer aun mas tu capital', MARGIN + 20, 305);
  
  doc.roundedRect(MARGIN, 350, CONTENT_WIDTH, 100, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('En resumen:', MARGIN + 20, 370);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Aprendes a AHORRAR (no gastar todo),', MARGIN + 20, 395)
     .text('INVERTIR (hacer que tu dinero crezca),', MARGIN + 20, 415)
     .text('e INCREMENTAR CAPITAL (tener cada vez mas).', MARGIN + 20, 435);
  
  doc.addPage();
}

function generarPagina5(doc: PDFKit.PDFDocument, data: Kit2Data) {
  doc.fontSize(24).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('Que Necesitas Para Jugar?', MARGIN, 50);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Para jugar necesitas 3 cosas basicas:', MARGIN, 90);
  
  doc.roundedRect(MARGIN, 120, CONTENT_WIDTH, 70, 8).fillAndStroke('#FFF8E1', '#FFC107');
  doc.fontSize(14).fillColor('#F57F17').font('Helvetica-Bold').text('1. CUENTA BANCARIA', MARGIN + 15, 135);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Un lugar donde guardar tu dinero de forma segura.', MARGIN + 15, 158)
     .text('Si eres menor de 18 anos: Cuenta conjunta con tus padres.', MARGIN + 15, 175);
  
  doc.roundedRect(MARGIN, 200, CONTENT_WIDTH, 60, 8).fillAndStroke('#E3F2FD', '#2196F3');
  doc.fontSize(14).fillColor('#1565C0').font('Helvetica-Bold').text('2. EMAIL', MARGIN + 15, 215);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Para recibir tu arbol personalizado y comunicarte.', MARGIN + 15, 238);
  
  doc.roundedRect(MARGIN, 270, CONTENT_WIDTH, 70, 8).fillAndStroke('#F3E5F5', '#9C27B0');
  doc.fontSize(14).fillColor('#6A1B9A').font('Helvetica-Bold').text('3. BILLETERA DIGITAL (PayPal, Wise, etc.)', MARGIN + 15, 285);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Para enviar y recibir dinero digital.', MARGIN + 15, 308);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica-Oblique')
     .text(`"Pero ${data.nombreDueno}, mis papas no saben de PayPal..."`, MARGIN, 380)
     .text('"No tengo cuenta de banco..."', MARGIN, 400)
     .text('"Esto suena complicado..."', MARGIN, 420);
  
  doc.addPage();
}

function generarPagina6(doc: PDFKit.PDFDocument) {
  doc.fontSize(28).fillColor(COLORS.primary).font('Helvetica-Bold').text('TRANQUILO!', MARGIN, 50);
  
  doc.fontSize(14).fillColor(COLORS.text).font('Helvetica')
     .text('Si tus papas no saben, que tambien aprendan!', MARGIN, 100)
     .text('Este juego es para TODA la familia.', MARGIN, 125)
     .text('Aprenden juntos, juegan juntos, crecen juntos.', MARGIN, 150);
  
  doc.fontSize(18).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('Si No Sabes Como, Puedes:', MARGIN, 200);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('BUSCAR EN GOOGLE: "Como abrir cuenta PayPal tutorial"', MARGIN + 20, 240)
     .text('PREGUNTARLE A LA IA: ChatGPT, Claude, etc.', MARGIN + 20, 270)
     .text('PREGUNTA A OTRAS PERSONAS: Amigos, familiares, vecinos', MARGIN + 20, 300)
     .text('VE AL BANCO: Ellos te explican todo', MARGIN + 20, 330)
     .text('TUTORIALES DE YOUTUBE: Videos paso a paso', MARGIN + 20, 360);
  
  doc.roundedRect(MARGIN, 420, CONTENT_WIDTH, 60, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('Nadie nace sabiendo. Todos aprendemos preguntando.', MARGIN + 20, 442, { align: 'center', width: CONTENT_WIDTH - 40 });
  
  doc.addPage();
}

function generarPagina7(doc: PDFKit.PDFDocument) {
  doc.fontSize(24).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('Los Personajes del Arbol Magico', MARGIN, 50);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Para entender el juego, imagina un ARBOL con 4 niveles:', MARGIN, 90);
  
  doc.roundedRect(MARGIN, 120, CONTENT_WIDTH, 130, 10).fillAndStroke('#FFF8E1', '#795548');
  doc.fontSize(16).fillColor('#5D4037').font('Helvetica-Bold').text('LA SEMILLA (X0)', MARGIN + 15, 135);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Nombre:          Semillita', MARGIN + 15, 165)
     .text('Rol:             El que planto primero', MARGIN + 15, 182)
     .text('Poder:           Inicio todo el arbol', MARGIN + 15, 199)
     .text('Recompensa:      Recibe de las HOJAS', MARGIN + 15, 216);
  
  doc.roundedRect(MARGIN, 270, CONTENT_WIDTH, 130, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold').text('EL TRONCO (X1) -> ESE ERES TU!', MARGIN + 15, 285);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Nombre:          Tronquito', MARGIN + 15, 315)
     .text('Rol:             Sostiene todo el arbol', MARGIN + 15, 332)
     .text('Poder:           Hace crecer las ramas', MARGIN + 15, 349)
     .text('Recompensa:      Recibe de las HOJAS', MARGIN + 15, 366);
  
  doc.fontSize(12).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('Tu eres el Tronco! Tu trabajo es invitar a las Ramas.', MARGIN, 420)
     .text('Cuando las Ramas inviten a las Hojas, TU recibiras dinero!', MARGIN, 440);
  
  doc.addPage();
}

function generarPagina8(doc: PDFKit.PDFDocument) {
  doc.roundedRect(MARGIN, 50, CONTENT_WIDTH, 130, 10).fillAndStroke('#E3F2FD', '#2196F3');
  doc.fontSize(16).fillColor('#1565C0').font('Helvetica-Bold').text('LAS RAMAS (X2) -> Los que TU invitas', MARGIN + 15, 65);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Nombre:          Ramitas', MARGIN + 15, 95)
     .text('Rol:             Crecen del tronco', MARGIN + 15, 112)
     .text('Poder:           Pueden invitar a Hojas', MARGIN + 15, 129)
     .text('Recompensa:      Reciben de SUS hojas', MARGIN + 15, 146);
  
  doc.roundedRect(MARGIN, 200, CONTENT_WIDTH, 130, 10).fillAndStroke('#F1F8E9', '#8BC34A');
  doc.fontSize(16).fillColor('#558B2F').font('Helvetica-Bold').text('LAS HOJAS (X3) -> Los amigos de tus amigos', MARGIN + 15, 215);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Nombre:          Hojitas', MARGIN + 15, 245)
     .text('Rol:             El nivel mas nuevo', MARGIN + 15, 262)
     .text('Poder:           Dan frutos (dinero)', MARGIN + 15, 279)
     .text('Recompensa:      Dan plata a Semillita y Tronco', MARGIN + 15, 296);
  
  doc.roundedRect(MARGIN, 360, CONTENT_WIDTH, 120, 10).fillAndStroke('#FFF3E0', '#FF9800');
  doc.fontSize(18).fillColor('#E65100').font('Helvetica-Bold')
     .text('LA MAGIA DEL ARBOL', MARGIN + 15, 380, { align: 'center', width: CONTENT_WIDTH - 30 });
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Cuando las HOJITAS dan frutos (dinero),', MARGIN + 15, 420, { align: 'center', width: CONTENT_WIDTH - 30 })
     .text('esos frutos caen y alimentan a la SEMILLITA y al TRONCO', MARGIN + 15, 440, { align: 'center', width: CONTENT_WIDTH - 30 });
  
  doc.addPage();
}

function generarPagina9(doc: PDFKit.PDFDocument) {
  doc.fontSize(14).fillColor(COLORS.text).font('Helvetica')
     .text('Por que? Porque Semillita y Tronco trabajaron antes,', MARGIN, 100, { align: 'center', width: CONTENT_WIDTH })
     .text('y merecen su recompensa!', MARGIN, 125, { align: 'center', width: CONTENT_WIDTH });
  
  doc.addPage();
}

function generarPagina10(doc: PDFKit.PDFDocument, data: Kit2Data) {
  doc.fontSize(24).fillColor(COLORS.primary).font('Helvetica-Bold').text('Las 3 Reglas del Juego', MARGIN, 50);
  
  doc.roundedRect(MARGIN, 90, CONTENT_WIDTH, 280, 10).fillAndStroke('#FFF3E0', '#FF9800');
  doc.fontSize(18).fillColor('#E65100').font('Helvetica-Bold').text('REGLA #1: SIEMPRE DAR LAS GRACIAS', MARGIN + 15, 110);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Cuando alguien te ensena algo valioso, le das las gracias con $10!', MARGIN + 15, 145)
     .text('Pero NO a quien te invito directamente...', MARGIN + 15, 165)
     .text('Sino a quien esta DOS NIVELES ARRIBA de ti.', MARGIN + 15, 185);
  
  doc.fontSize(14).fillColor('#795548').font('Helvetica-Bold')
     .text(`${data.nombreBeneficiario} (Semillita - X0)`, MARGIN + 60, 220);
  
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('|', MARGIN + 100, 240)
     .text('invito a...', MARGIN + 110, 250)
     .text('|', MARGIN + 100, 265);
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text(`${data.nombreInvitador} (Tronco - X1)`, MARGIN + 60, 285);
  
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('|', MARGIN + 100, 305)
     .text('te invita a ti...', MARGIN + 110, 315)
     .text('|', MARGIN + 100, 330);
  
  doc.fontSize(14).fillColor('#2196F3').font('Helvetica-Bold').text('TU! (Rama - X2)', MARGIN + 60, 350);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text(`TU le das gracias a ${data.nombreBeneficiario} (la Semillita) con $10`, MARGIN, 400);
  
  doc.fontSize(11)
     .text(`Por que NO a ${data.nombreInvitador} que te invito?`, MARGIN, 440)
     .text(`Porque ${data.nombreInvitador} recibira cuando TUS amigos entren.`, MARGIN, 460)
     .text('Asi todos reciben en su momento.', MARGIN, 480);
  
  doc.addPage();
}

function generarPagina11(doc: PDFKit.PDFDocument) {
  doc.roundedRect(MARGIN, 50, CONTENT_WIDTH, 220, 10).fillAndStroke('#E3F2FD', '#2196F3');
  doc.fontSize(18).fillColor('#1565C0').font('Helvetica-Bold').text('REGLA #2: COMPRAR TU KIT2 PERSONALIZADO', MARGIN + 15, 70);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica').text('Para jugar necesitas tu propio Kit2.', MARGIN + 15, 105);
  
  doc.fontSize(14).fillColor('#1565C0').font('Helvetica-Bold').text('Que incluye tu Kit2?', MARGIN + 15, 130);
  
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('- Los libros digitales completos de Herejia Economica', MARGIN + 25, 150)
     .text('- Todos los articulos en PDF', MARGIN + 25, 167)
     .text('- Enlaces a las conferencias en video', MARGIN + 25, 184)
     .text('- Tu Arbol Magico con TU NOMBRE', MARGIN + 25, 201)
     .text('- Tu codigo unico para invitar a otros', MARGIN + 25, 218)
     .text('- Derecho a jugar durante 1 ano completo', MARGIN + 25, 235);
  
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold').text('Cuanto cuesta?', MARGIN, 290);
  doc.fontSize(24).fillColor('#E65100').text('$25 dolares', MARGIN, 320);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Se lo pagas a: Corporacion Herejia Economica', MARGIN, 360)
     .text('(Ellos crearon el juego y mantienen el sistema)', MARGIN, 380);
  
  doc.fontSize(18).fillColor(COLORS.primary).font('Helvetica-Bold').text('REGLA #3: COMPARTIR TU ARBOL', MARGIN, 430);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Una vez que tienes tu Kit2, es tu turno de compartir!', MARGIN, 460);
  
  doc.addPage();
}

function generarPagina12(doc: PDFKit.PDFDocument) {
  doc.fontSize(14).fillColor(COLORS.text).font('Helvetica').text('Compartes tu Arbol Magico con:', MARGIN, 50);
  
  doc.fontSize(12)
     .text('- Tus amigos', MARGIN + 20, 80)
     .text('- Tu familia', MARGIN + 20, 100)
     .text('- Tus primos', MARGIN + 20, 120)
     .text('- Quien tu quieras!', MARGIN + 20, 140);
  
  doc.fontSize(12)
     .text('Cuando ellos entran (tus Ramas), y luego SUS amigos entran (las Hojas)...', MARGIN, 180)
     .text('TU recibes $10 por cada Hoja!', MARGIN, 200);
  
  doc.roundedRect(MARGIN, 240, CONTENT_WIDTH, 100, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold').text('Resumen:', MARGIN + 20, 260);
  doc.fontSize(14).fillColor(COLORS.text).font('Helvetica')
     .text('Tu das $10 + $25 = $35 para entrar', MARGIN + 20, 290)
     .text('Luego recibes $10 por cada Hoja que crezca en tu arbol', MARGIN + 20, 315);
  
  doc.addPage();
}

function generarPagina13(doc: PDFKit.PDFDocument) {
  doc.fontSize(24).fillColor(COLORS.primary).font('Helvetica-Bold').text('Las Matematicas del Juego', MARGIN, 50);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Ahora viene la parte divertida: CUANTO PUEDES GANAR?', MARGIN, 90);
  
  doc.roundedRect(MARGIN, 120, CONTENT_WIDTH, 140, 10).fillAndStroke('#FFF8E1', '#FFC107');
  doc.fontSize(16).fillColor('#F57F17').font('Helvetica-Bold').text('Ejemplo Basico:', MARGIN + 15, 140);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Tu invitas a 5 amigos (5 Ramas)', MARGIN + 15, 170)
     .text('Cada uno invita a 5 amigos (5 Hojas cada uno)', MARGIN + 15, 190)
     .text('Total de Hojas: 5 x 5 = 25 Hojas', MARGIN + 15, 210);
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Cuanto dinero recibes?', MARGIN + 15, 235);
  doc.fontSize(12).fillColor('#E65100').text('25 Hojas x $10 cada una = $250', MARGIN + 15, 255);
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Tabla de Ahorros Posibles:', MARGIN, 290);
  
  const tableTop = 320;
  doc.fontSize(10).fillColor(COLORS.text).font('Helvetica-Bold')
     .text('Si invitas a:', MARGIN, tableTop)
     .text('Cada uno invita a:', MARGIN + 100, tableTop)
     .text('Hojas totales:', MARGIN + 230, tableTop)
     .text('Tu recibes:', MARGIN + 330, tableTop);
  
  doc.font('Helvetica');
  const rows = [
    ['3 amigos', '3 amigos c/u', '9 Hojas', '$90'],
    ['5 amigos', '5 amigos c/u', '25 Hojas', '$250'],
    ['10 amigos', '5 amigos c/u', '50 Hojas', '$500'],
    ['10 amigos', '10 amigos c/u', '100 Hojas', '$1,000'],
  ];
  
  rows.forEach((row, i) => {
    const y = tableTop + 25 + (i * 20);
    doc.text(row[0] || '', MARGIN, y).text(row[1] || '', MARGIN + 100, y).text(row[2] || '', MARGIN + 230, y).text(row[3] || '', MARGIN + 330, y);
  });
  
  doc.addPage();
}

function generarPagina14(doc: PDFKit.PDFDocument) {
  doc.fontSize(20).fillColor(COLORS.primary).font('Helvetica-Bold').text('Ves como funciona?', MARGIN, 50);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Tu inversion inicial: $35', MARGIN, 90)
     .text('Si logras 25 Hojas: Recibes $250', MARGIN, 110)
     .text('Tu ganancia: $250 - $35 = $215 de utilidad', MARGIN, 130);
  
  doc.fontSize(16).fillColor('#E65100').font('Helvetica-Bold').text('Eso es multiplicar tu dinero por 7!', MARGIN, 160);
  
  doc.roundedRect(MARGIN, 200, CONTENT_WIDTH, 140, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  doc.fontSize(18).fillColor(COLORS.primary).font('Helvetica-Bold').text('Tu Mision de 1 Ano:', MARGIN + 15, 220);
  doc.fontSize(14).fillColor(COLORS.text).font('Helvetica')
     .text('Conseguir 25 Hojas en tu arbol', MARGIN + 15, 255)
     .text('= $250 en tu alcancia', MARGIN + 15, 280)
     .text('= Tu primer gran capital!', MARGIN + 15, 305);
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Que vas a hacer con $250?', MARGIN, 370);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Bicicleta nueva?', MARGIN + 20, 400)
     .text('Videojuegos?', MARGIN + 20, 420)
     .text('Ahorrar para algo mas grande?', MARGIN + 20, 440)
     .text('Abrir tu primer negocio?', MARGIN + 20, 460);
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Tu decides! Es TU plata.', MARGIN, 500);
  
  doc.addPage();
}

function generarPagina15(doc: PDFKit.PDFDocument) {
  doc.fontSize(24).fillColor(COLORS.primary).font('Helvetica-Bold').text('Juega Inteligentemente', MARGIN, 50);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('No se trata de invitar a TODO EL MUNDO.', MARGIN, 90)
     .text('Se trata de invitar a las personas CORRECTAS.', MARGIN, 110);
  
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold').text('Las Mejores Personas Para Invitar:', MARGIN, 150);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('- Familiares cercanos - Papas, tios, primos', MARGIN + 15, 180)
     .text('- Amigos activos - Los que siempre estan en contacto', MARGIN + 15, 200)
     .text('- Emprendedores - Personas que ya tienen negocios', MARGIN + 15, 220)
     .text('- Maestros/Profesores - Ellos pueden compartir con sus alumnos', MARGIN + 15, 240)
     .text('- Padres de otros ninos - Los papas de tus amigos del colegio', MARGIN + 15, 260);
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Como Presentar el Juego:', MARGIN, 300);
  doc.fontSize(11).fillColor('#C62828').text('MAL: "Oye, unete a esto para que yo gane dinero"', MARGIN + 15, 330);
  doc.fillColor(COLORS.primary).text('BIEN: "Oye, encontre un juego educativo genial donde aprendemos', MARGIN + 15, 355)
     .text('sobre bancos, ahorro e inversion. Quieres que juguemos juntos?"', MARGIN + 15, 370);
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Como Compartir tu Arbol:', MARGIN, 410);
  doc.roundedRect(MARGIN, 435, CONTENT_WIDTH, 120, 8).fillAndStroke('#F5F5F5', '#CCCCCC');
  doc.fontSize(10).fillColor(COLORS.text).font('Helvetica')
     .text('Hola!', MARGIN + 15, 450)
     .text('Estoy jugando al Arbol Magico del Ahorro y es super interesante!', MARGIN + 15, 465)
     .text('Aprendes sobre bancos, inversion, y como funciona el dinero de verdad.', MARGIN + 15, 480)
     .text('Todo mientras ahorras para tu primer capital.', MARGIN + 15, 495)
     .text('Quieres jugar conmigo?', MARGIN + 15, 515)
     .text('[Link con tu codigo unico]', MARGIN + 15, 530);
  
  doc.addPage();
}

function generarPagina16(doc: PDFKit.PDFDocument) {
  doc.fontSize(18).fillColor(COLORS.primary).font('Helvetica-Bold').text('Paciencia y Constancia:', MARGIN, 50);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('El juego dura 1 ano completo. No esperes tener 25 Hojas en 1 semana.', MARGIN, 90);
  
  doc.text('Es normal que:', MARGIN, 130)
     .text('- Los primeros meses sean lentos', MARGIN + 20, 155)
     .text('- No todos los que invites digan que si', MARGIN + 20, 175)
     .text('- Algunos tarden en decidirse', MARGIN + 20, 195);
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('La paciencia es parte del aprendizaje!', MARGIN, 240);
  
  doc.roundedRect(MARGIN, 290, CONTENT_WIDTH, 80, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('RECUERDA:', MARGIN + 15, 310);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('No se trata de CANTIDAD, se trata de CALIDAD.', MARGIN + 15, 335)
     .text('5 personas comprometidas que inviten a otras 5 = 25 Hojas = $250', MARGIN + 15, 355);
  
  doc.addPage();
}

function generarPagina17(doc: PDFKit.PDFDocument) {
  doc.roundedRect(30, 30, PAGE_WIDTH - 60, PAGE_HEIGHT - 60, 15).fill('#FFF8E1');
  
  doc.fontSize(24).fillColor('#E65100').font('Helvetica-Bold')
     .text('SECRETO SUPER ESPECIAL', MARGIN, 110, { align: 'center', width: CONTENT_WIDTH });
  doc.fontSize(14).fillColor('#FF8F00').font('Helvetica')
     .text('(Solo para ninos inteligentes)', MARGIN, 145, { align: 'center', width: CONTENT_WIDTH });
  
  doc.fontSize(12).fillColor(COLORS.text).text('Oye... quieres saber un secreto?', MARGIN, 190, { align: 'center', width: CONTENT_WIDTH });
  
  doc.roundedRect(MARGIN + 20, 220, CONTENT_WIDTH - 40, 100, 8).fillAndStroke('#FFFFFF', '#FFE082');
  doc.fontSize(11).fillColor(COLORS.text)
     .text('Ya convenciste a mama y papa de que te ayudaran a empezar el juego, verdad?', MARGIN + 35, 240)
     .text('Ya tienen cuenta de banco y todo...', MARGIN + 35, 265)
     .text('Ya entienden como funciona el arbol...', MARGIN + 35, 290);
  
  doc.text('Entonces...', MARGIN + 35, 335);
  
  doc.roundedRect(MARGIN + 20, 360, CONTENT_WIDTH - 40, 100, 8).fillAndStroke('#FFB300', '#FF8F00');
  doc.fontSize(18).fillColor(COLORS.white).font('Helvetica-Bold')
     .text('AQUI VIENE EL SECRETO:', MARGIN + 35, 380, { align: 'center', width: CONTENT_WIDTH - 70 });
  doc.fontSize(16)
     .text('POR QUE NO LES VENDES', MARGIN + 35, 415, { align: 'center', width: CONTENT_WIDTH - 70 })
     .text('TU ARBOL A ELLOS TAMBIEN?!', MARGIN + 35, 440, { align: 'center', width: CONTENT_WIDTH - 70 });
  
  doc.addPage();
}

function generarPagina18(doc: PDFKit.PDFDocument) {
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Imaginate la conversacion:', MARGIN, 50);
  
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Tu: "Mami, papi, ustedes tambien quieren su propio arbol?"', MARGIN, 80)
     .text('Ellos: "Para que? Ya te ayudamos a ti."', MARGIN, 105)
     .text('Tu: "Pero ustedes tambien pueden ganar! Miren: si invitan a los tios,', MARGIN, 130)
     .text('a los abuelitos, a sus amigos del trabajo... tambien reciben plata!"', MARGIN, 150)
     .text('Ellos: "Hmm..."', MARGIN, 175)
     .text('Tu: "Ademas, asi podemos ser SOCIOS. Yo invito a mis amigos,', MARGIN, 200)
     .text('ustedes invitan a sus amigos, y todos ganamos!"', MARGIN, 220)
     .text('Ellos: "Tienes razon! Eres un genio."', MARGIN, 245);
  
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold').text('Por Que Funciona:', MARGIN, 290);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('- Tus papas ya entendieron el juego (te ayudaron a ti)', MARGIN + 15, 320)
     .text('- Ya tienen las herramientas (banco, PayPal, email)', MARGIN + 15, 340)
     .text('- Conocen a MAS GENTE que tu (adultos, companeros de trabajo, familia)', MARGIN + 15, 360);
  
  doc.text('Si ellos invitan a 10 personas, y cada una invita a 5...', MARGIN, 400)
     .text('ELLOS reciben $500!', MARGIN, 420);
  
  doc.text('Y si TU eres una de sus Ramas... cuando TUS Hojas entren, ellos', MARGIN, 455)
     .text('TAMBIEN ganan', MARGIN, 475);
  
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold').text('RESULTADO FINAL:', MARGIN, 520);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica').text('- Tu ganas con tus amigos del colegio', MARGIN + 15, 550);
  
  doc.addPage();
}

function generarPagina19(doc: PDFKit.PDFDocument) {
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('- Papa/Mama ganan con sus contactos adultos', MARGIN + 15, 50)
     .text('- La familia COMPLETA aprende y ahorra junta', MARGIN + 15, 70);
  
  doc.fontSize(16).fillColor('#E65100').font('Helvetica-Bold').text('ESO SI ES UN NEGOCIO FAMILIAR!', MARGIN, 110);
  
  doc.roundedRect(MARGIN, 150, CONTENT_WIDTH, 120, 10).fillAndStroke('#FFF8E1', '#FF9800');
  doc.fontSize(14).fillColor('#E65100').font('Helvetica-Bold').text('Entonces el secreto es:', MARGIN + 15, 175);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Primero ayuda a tus papas a entender el juego ayudandote a TI.', MARGIN + 15, 205)
     .text('Luego, cuando ya lo entienden...', MARGIN + 15, 230)
     .text('Les vendes TU arbol para que ellos TAMBIEN jueguen!', MARGIN + 15, 255);
  
  doc.addPage();
}

function generarPagina20(doc: PDFKit.PDFDocument) {
  doc.fontSize(24).fillColor(COLORS.primary).font('Helvetica-Bold').text('Mensaje Para Padres y Madres', MARGIN, 50);
  
  doc.fontSize(14).fillColor('#C62828').font('Helvetica-Bold').text('Este NO es solo un juego.', MARGIN, 100);
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Es una herramienta de EDUCACION FINANCIERA REAL para sus hijos.', MARGIN, 125);
  
  doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold').text('Lo Que Sus Hijos Aprenderan:', MARGIN, 165);
  
  doc.fontSize(12).fillColor('#1565C0').font('Helvetica-Bold').text('BANCOS Y CUENTAS', MARGIN, 200);
  doc.fontSize(10).fillColor(COLORS.text).font('Helvetica')
     .text('- Como funcionan las cuentas bancarias', MARGIN + 10, 220)
     .text('- Transferencias y pagos digitales', MARGIN + 10, 235)
     .text('- PayPal y bancos internacionales', MARGIN + 10, 250)
     .text('- Seguridad financiera basica', MARGIN + 10, 265);
  
  doc.fontSize(12).fillColor('#2E7D32').font('Helvetica-Bold').text('AHORRO E INVERSION', MARGIN + 260, 200);
  doc.fontSize(10).fillColor(COLORS.text).font('Helvetica')
     .text('- Concepto de inversion inicial ($35)', MARGIN + 270, 220)
     .text('- Retorno sobre inversion (ROI)', MARGIN + 270, 235)
     .text('- Paciencia financiera (1 ano)', MARGIN + 270, 250)
     .text('- Capital vs. flujo de caja', MARGIN + 270, 265);
  
  doc.fontSize(12).fillColor('#6A1B9A').font('Helvetica-Bold').text('NEGOCIOS Y RED', MARGIN, 300);
  doc.fontSize(10).fillColor(COLORS.text).font('Helvetica')
     .text('- Como compartir valor con otros', MARGIN + 10, 320)
     .text('- Networking desde temprana edad', MARGIN + 10, 335)
     .text('- Ganar-ganar en los negocios', MARGIN + 10, 350)
     .text('- Etica en las transacciones', MARGIN + 10, 365);
  
  doc.fontSize(12).fillColor('#E65100').font('Helvetica-Bold').text('ECONOMIA REAL', MARGIN + 260, 300);
  doc.fontSize(10).fillColor(COLORS.text).font('Helvetica')
     .text('- Circulacion del dinero', MARGIN + 270, 320)
     .text('- Sistemas economicos alternativos', MARGIN + 270, 335)
     .text('- Valor del conocimiento', MARGIN + 270, 350)
     .text('- Distribucion equitativa', MARGIN + 270, 365);
  
  doc.addPage();
}

function generarPagina21(doc: PDFKit.PDFDocument) {
  doc.fontSize(18).fillColor(COLORS.primary).font('Helvetica-Bold').text('Seguridad Para Menores:', MARGIN, 50);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('- Cuentas conjuntas padre-hijo obligatorias', MARGIN + 15, 85)
     .text('- Los padres manejan las transacciones', MARGIN + 15, 105)
     .text('- Supervision completa del proceso', MARGIN + 15, 125)
     .text('- Ambiente educativo y controlado', MARGIN + 15, 145)
     .text('- Sin riesgos para el menor', MARGIN + 15, 165);
  
  doc.fontSize(18).fillColor(COLORS.primary).font('Helvetica-Bold').text('Como Empezar (Paso a Paso):', MARGIN, 210);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('1. Abrir cuenta bancaria conjunta con su hijo', MARGIN + 15, 245)
     .text('2. Explicarle el concepto del juego (usar este documento)', MARGIN + 15, 265)
     .text('3. Hacer la inversion inicial juntos ($10 + $25 = $35)', MARGIN + 15, 285)
     .text('4. Recibir el Arbol Magico personalizado', MARGIN + 15, 305)
     .text('5. Ayudarle a compartir con amigos y familiares', MARGIN + 15, 325)
     .text('6. Ir viendo juntos como crece su alcancia', MARGIN + 15, 345)
     .text('7. Al final del ano, decidir juntos que hacer con el capital', MARGIN + 15, 365);
  
  doc.roundedRect(MARGIN, 400, CONTENT_WIDTH, 80, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Meta Educativa:', MARGIN + 15, 420);
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Al final de 1 ano, su hijo habra aprendido mas sobre finanzas,', MARGIN + 15, 445)
     .text('negocios y economia que en 10 anos de colegio tradicional.', MARGIN + 15, 460);
  
  doc.addPage();
}

function generarPagina22(doc: PDFKit.PDFDocument) {
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Y todo mientras se divierte "jugando al banco".', MARGIN, 50);
  
  doc.roundedRect(MARGIN, 90, CONTENT_WIDTH, 180, 10).fillAndStroke('#FFEBEE', '#C62828');
  doc.fontSize(16).fillColor('#C62828').font('Helvetica-Bold').text('Advertencia Importante:', MARGIN + 15, 115);
  
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('La Corporacion Herejia Economica CHE nunca pedira:', MARGIN + 15, 145);
  
  doc.fillColor('#C62828')
     .text('X Contrasenas de bancos', MARGIN + 25, 170)
     .text('X Contrasenas de correos', MARGIN + 25, 188)
     .text('X Claves privadas', MARGIN + 25, 206)
     .text('X Informacion sensible personal', MARGIN + 25, 224);
  
  doc.fontSize(12).fillColor(COLORS.text).text('Solo necesitamos:', MARGIN, 290);
  doc.fontSize(11).fillColor(COLORS.primary)
     .text('- Cuentas para RECIBIR pagos (no enviar)', MARGIN + 15, 315)
     .text('- Email para comunicacion', MARGIN + 15, 335)
     .text('- Contrasena para LA PLATAFORMA (no para bancos)', MARGIN + 15, 355);
  
  doc.addPage();
}

function generarPagina23(doc: PDFKit.PDFDocument, data: Kit2Data) {
  doc.fontSize(28).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('Listo Para Empezar?', MARGIN, 110, { align: 'center', width: CONTENT_WIDTH });
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Ya conoces TODO sobre el Arbol Magico del Ahorro:', MARGIN, 160, { align: 'center', width: CONTENT_WIDTH });
  
  doc.roundedRect(MARGIN + 50, 190, CONTENT_WIDTH - 100, 160, 10).fillAndStroke('#E8F5E9', COLORS.primary);
  doc.fontSize(11).fillColor(COLORS.text)
     .text('- Como funciona el arbol', MARGIN + 70, 215, { align: 'center', width: CONTENT_WIDTH - 140 })
     .text('- Los 4 personajes (Semillita, Tronco, Ramas, Hojas)', MARGIN + 70, 240, { align: 'center', width: CONTENT_WIDTH - 140 })
     .text('- Las 3 reglas del juego', MARGIN + 70, 265, { align: 'center', width: CONTENT_WIDTH - 140 })
     .text('- Cuanto puedes ganar', MARGIN + 70, 290, { align: 'center', width: CONTENT_WIDTH - 140 })
     .text('- Como jugar inteligentemente', MARGIN + 70, 315, { align: 'center', width: CONTENT_WIDTH - 140 })
     .text('- El secreto especial', MARGIN + 70, 340, { align: 'center', width: CONTENT_WIDTH - 140 });
  
  doc.roundedRect(MARGIN + 50, 390, CONTENT_WIDTH - 100, 50, 25).fillAndStroke(COLORS.primary, COLORS.primary);
  doc.fontSize(16).fillColor(COLORS.white).font('Helvetica-Bold')
     .text('QUIERO MI KIT2 PERSONALIZADO', MARGIN + 50, 405, { align: 'center', width: CONTENT_WIDTH - 100, link: data.linkActivacion });
  
  doc.fontSize(11).fillColor(COLORS.text).font('Helvetica')
     .text('Haz clic en el link que te compartieron', MARGIN, 465, { align: 'center', width: CONTENT_WIDTH })
     .text('o escanea el codigo QR para comenzar', MARGIN, 485, { align: 'center', width: CONTENT_WIDTH });
  
  doc.fontSize(10).fillColor(COLORS.link).text(data.linkActivacion, MARGIN, 520, { align: 'center', width: CONTENT_WIDTH, link: data.linkActivacion });
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica-Bold')
     .text('Corporacion Herejia Economica CHE', MARGIN, 580, { align: 'center', width: CONTENT_WIDTH });
  doc.fontSize(10).font('Helvetica')
     .text('www.corpherejiaeconomica.com', MARGIN, 600, { align: 'center', width: CONTENT_WIDTH })
     .text('Bogota, Colombia', MARGIN, 620, { align: 'center', width: CONTENT_WIDTH });
  
  doc.addPage();
}

function generarPagina24(doc: PDFKit.PDFDocument) {
  doc.fontSize(16).fillColor(COLORS.text).font('Helvetica')
     .text('Nos vemos en el juego!', MARGIN, 200, { align: 'center', width: CONTENT_WIDTH });
  doc.fontSize(14).text('Tu arbol te esta esperando...', MARGIN, 330, { align: 'center', width: CONTENT_WIDTH });
  
  doc.addPage();
}

function generarPaginaObras(doc: PDFKit.PDFDocument, data: Kit2Data) {
  doc.fontSize(24).fillColor(COLORS.primary).font('Helvetica-Bold')
     .text('Obras Incluidas en Tu Kit2', MARGIN, 50);
  
  doc.fontSize(12).fillColor(COLORS.text).font('Helvetica')
     .text('Al completar tu compra, recibiras los siguientes materiales:', MARGIN, 100);
  
  if (data.obras && data.obras.length > 0) {
    let yPos = 140;
    data.obras.forEach((obra, index) => {
      doc.roundedRect(MARGIN, yPos, CONTENT_WIDTH, 50, 5).fillAndStroke('#F5F5F5', '#CCCCCC');
      doc.fontSize(12).fillColor(COLORS.primary).font('Helvetica-Bold')
         .text(`${index + 1}. ${obra.titulo}`, MARGIN + 15, yPos + 12);
      doc.fontSize(10).fillColor(COLORS.text).font('Helvetica')
         .text(`Autor: ${obra.autor}`, MARGIN + 15, yPos + 32);
      yPos += 60;
    });
  } else {
    doc.fontSize(12).fillColor(COLORS.text)
       .text('- Libros digitales de Herejia Economica', MARGIN + 20, 140)
       .text('- Articulos en PDF', MARGIN + 20, 165)
       .text('- Enlaces a conferencias en video', MARGIN + 20, 190)
       .text('- Tu Arbol Magico personalizado', MARGIN + 20, 215);
  }
  
  doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold').text('Tu Codigo Unico:', MARGIN, 500);
  doc.roundedRect(MARGIN, 520, CONTENT_WIDTH, 40, 8).fillAndStroke('#E3F2FD', '#2196F3');
  doc.fontSize(20).fillColor('#1565C0').font('Helvetica-Bold')
     .text(data.codigoUnico, MARGIN, 530, { align: 'center', width: CONTENT_WIDTH });
  
  doc.fontSize(10).fillColor(COLORS.text).font('Helvetica')
     .text('Guarda este codigo. Es tu identificador unico en el sistema.', MARGIN, 580, { align: 'center', width: CONTENT_WIDTH });
}

export default generarKit2PDF;