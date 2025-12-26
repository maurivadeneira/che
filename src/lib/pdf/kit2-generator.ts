import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';

interface Kit2Data {
  nombreDueno: string;
  nombreBeneficiario: string;
  nombreInvitador: string;
  codigoUnico: string;
  linkActivacion: string;
  obras?: { titulo: string; autor: string }[];
}

const COLORS = {
  primary: rgb(0.18, 0.42, 0.26),      // Verde oscuro
  secondary: rgb(0.35, 0.28, 0.52),    // Morado
  accent: rgb(0.90, 0.45, 0.10),       // Naranja
  text: rgb(0.15, 0.15, 0.15),         // Casi negro
  white: rgb(1, 1, 1),
  lightGray: rgb(0.95, 0.95, 0.95),
  link: rgb(0.10, 0.40, 0.80),
  red: rgb(0.75, 0.15, 0.15),
  lightGreen: rgb(0.90, 0.96, 0.90),
  lightBlue: rgb(0.90, 0.94, 0.98),
  lightOrange: rgb(1, 0.95, 0.88),
  gold: rgb(0.85, 0.65, 0.12),
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// FUNCIÓN PARA CREAR ENLACES CLICABLES
// FUNCIÓN PARA CREAR ENLACES CLICABLES
async function agregarEnlace(
  page: PDFPage,
  x: number,
  y: number, 
  width: number,
  height: number,
  url: string
) {
  const { PDFName, PDFString, PDFArray, PDFDict, PDFNumber } = await import('pdf-lib');
  
  const context = page.doc.context;
  
  const uriAction = context.obj({
    S: PDFName.of('URI'),
    URI: PDFString.of(url),
  });
  
  const linkAnnot = context.obj({
    Type: PDFName.of('Annot'),
    Subtype: PDFName.of('Link'),
    Rect: context.obj([x, y, x + width, y + height]),
    Border: context.obj([0, 0, 0]),
    A: uriAction,
  });

  const linkRef = context.register(linkAnnot);

  const annots = page.node.get(PDFName.of('Annots'));
  if (annots) {
    const annotsArray = context.lookup(annots) as any;
    annotsArray.push(linkRef);
  } else {
    page.node.set(PDFName.of('Annots'), context.obj([linkRef]));
  }
}

export async function generarKit2PDF(data: Kit2Data): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const fonts = { helvetica, helveticaBold, helveticaOblique };

  // Generar todas las páginas
  generarPortada(pdfDoc, fonts, data);
  await generarPaginaIntroduccion(pdfDoc, fonts, data);
  generarPagina3_JuegoFamiliar(pdfDoc, fonts, data);
  generarPagina4_QueAprenden(pdfDoc, fonts);
  generarPagina5_Capital(pdfDoc, fonts);
  generarPagina6_QueNecesitas(pdfDoc, fonts, data);
  generarPagina7_Tranquilo(pdfDoc, fonts);
  generarPagina8_Personajes1(pdfDoc, fonts);
  generarPagina9_Personajes2(pdfDoc, fonts);
  generarPagina10_MagiaArbol(pdfDoc, fonts);
  generarPagina11_Regla1(pdfDoc, fonts, data);
  generarPagina12_Regla2y3(pdfDoc, fonts);
  generarPagina13_Compartir(pdfDoc, fonts);
  generarPagina14_Matematicas(pdfDoc, fonts);
  generarPagina15_ComoFunciona(pdfDoc, fonts);
  generarPagina16_JuegaInteligente(pdfDoc, fonts);
  generarPagina17_Paciencia(pdfDoc, fonts);
  generarPagina18_Secreto(pdfDoc, fonts);
  generarPagina19_ConversacionPapas(pdfDoc, fonts);
  generarPagina20_NegocioFamiliar(pdfDoc, fonts);
  generarPagina21_MensajePadres(pdfDoc, fonts);
  generarPagina22_Seguridad(pdfDoc, fonts);
  generarPagina23_Advertencia(pdfDoc, fonts);
  await generarPagina24_ListoParaEmpezar(pdfDoc, fonts, data);
  generarPagina25_Despedida(pdfDoc, fonts);
  generarPaginaObras(pdfDoc, fonts, data);

  return await pdfDoc.save();
}

type Fonts = {
  helvetica: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>;
  helveticaBold: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>;
  helveticaOblique: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>;
};

// ==================== PÁGINA 1: PORTADA ====================
function generarPortada(pdfDoc: PDFDocument, fonts: Fonts, data: Kit2Data) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  // Fondo degradado simulado con rectángulos
  page.drawRectangle({
    x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: rgb(0.25, 0.35, 0.55),
  });
  
  // Marco interior
  page.drawRectangle({
    x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50,
    color: rgb(0.30, 0.40, 0.60),
    borderColor: COLORS.gold,
    borderWidth: 3,
  });
  
  // Icono árbol (simulado con texto)
  page.drawText('*', {
    x: 285, y: PAGE_HEIGHT - 180, size: 80, font: fonts.helveticaBold, color: COLORS.white,
  });
  
  // Título principal
  page.drawText('EL ARBOL MAGICO DEL', {
    x: 95, y: PAGE_HEIGHT - 300, size: 40, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('AHORRO', {
    x: 200, y: PAGE_HEIGHT - 360, size: 48, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  // Línea decorativa
  page.drawRectangle({
    x: 100, y: PAGE_HEIGHT - 390, width: PAGE_WIDTH - 200, height: 4,
    color: COLORS.gold,
  });
  
  // Subtítulo
  page.drawText('El Juego Mas Divertido Para Aprender', {
    x: 130, y: PAGE_HEIGHT - 440, size: 20, font: fonts.helvetica, color: COLORS.white,
  });
  page.drawText('Sobre Dinero!', {
    x: 220, y: PAGE_HEIGHT - 470, size: 20, font: fonts.helvetica, color: COLORS.white,
  });
  
  // Lema
  page.drawText('Aprende  -  Ahorra  -  Comparte  -  Gana', {
    x: 140, y: PAGE_HEIGHT - 540, size: 16, font: fonts.helveticaBold, color: COLORS.gold,
  });
  
  // Para toda la familia
  page.drawText('Para toda la familia', {
    x: 225, y: PAGE_HEIGHT - 600, size: 14, font: fonts.helvetica, color: COLORS.white,
  });
  page.drawText('(Hasta los abuelitos pueden jugar!)', {
    x: 185, y: PAGE_HEIGHT - 625, size: 12, font: fonts.helvetica, color: COLORS.white,
  });
  
  // Código único en la portada
  page.drawText(`Codigo: ${data.codigoUnico}`, {
    x: 230, y: 60, size: 12, font: fonts.helveticaBold, color: COLORS.gold,
  });
}

// ==================== PÁGINA 2: INTRODUCCIÓN ====================
async function generarPaginaIntroduccion(pdfDoc: PDFDocument, fonts: Fonts, data: Kit2Data) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  // Título
  page.drawText(`Hola, Soy ${data.nombreDueno}`, {
    x: MARGIN, y: PAGE_HEIGHT - 70, size: 28, font: fonts.helveticaBold, color: COLORS.secondary,
  });
  
  // Caja principal de introducción
  page.drawRectangle({
    x: MARGIN - 10, y: PAGE_HEIGHT - 520, width: CONTENT_WIDTH + 20, height: 420,
    color: COLORS.lightBlue,
    borderColor: COLORS.primary,
    borderWidth: 2,
  });
  
  const introTexts = [
    { text: 'Este es mi Kit2 personalizado, que me permite trabajar y', y: PAGE_HEIGHT - 130, bold: false },
    { text: 'obtener mi inversion, con solo distribuir este documento.', y: PAGE_HEIGHT - 150, bold: false },
    { text: '', y: PAGE_HEIGHT - 170, bold: false },
    { text: 'Y me gustaria que tu tambien pudieras tener uno igual,', y: PAGE_HEIGHT - 190, bold: false },
    { text: 'que te permita trabajar y obtener tus ahorros e inversiones', y: PAGE_HEIGHT - 210, bold: false },
    { text: 'propias.', y: PAGE_HEIGHT - 230, bold: false },
    { text: '', y: PAGE_HEIGHT - 250, bold: false },
    { text: 'Este es un juego muy real. Pero todo juego tiene sus reglas', y: PAGE_HEIGHT - 270, bold: true },
    { text: 'y es bueno que las aprendas para poder jugar.', y: PAGE_HEIGHT - 290, bold: true },
    { text: '', y: PAGE_HEIGHT - 310, bold: false },
    { text: 'Este documento se explica solo, asi que no tendras que', y: PAGE_HEIGHT - 330, bold: false },
    { text: 'aprender muchas cosas, solo aprender a manejarlo.', y: PAGE_HEIGHT - 350, bold: false },
  ];
  
  introTexts.forEach(item => {
    if (item.text) {
      page.drawText(item.text, {
        x: MARGIN + 10, y: item.y, size: 12,
        font: item.bold ? fonts.helveticaBold : fonts.helvetica,
        color: COLORS.text,
      });
    }
  });
  
  // Botón CTA superior
  page.drawRectangle({
    x: MARGIN + 60, y: PAGE_HEIGHT - 430, width: 300, height: 45,
    color: COLORS.primary,
    borderColor: COLORS.gold,
    borderWidth: 2,
  });
  page.drawText('QUIERO MI KIT2 PERSONALIZADO', {
    x: MARGIN + 80, y: PAGE_HEIGHT - 413, size: 14, font: fonts.helveticaBold, color: COLORS.white,
  });
  
  // AGREGAR ENLACE CLICABLE AL BOTÓN
  const urlActivacion = data.linkActivacion || `https://corpherejiaeconomica.com/es/kit2/activar?ref=${data.codigoUnico}`;
  await agregarEnlace(page, MARGIN + 60, PAGE_HEIGHT - 440, 300, 45, urlActivacion);

  // Texto sobre el botón
  page.drawText('Ese recuadro que dice:', {
    x: MARGIN + 10, y: PAGE_HEIGHT - 365, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  
  // Explicación después del botón
  const explicacion = [
    { text: 'Cuando des clic en el, el sistema te guiara para que realices', y: PAGE_HEIGHT - 455 },
    { text: 'tu inversion haciendo dos consignaciones:', y: PAGE_HEIGHT - 475 },
    { text: '', y: PAGE_HEIGHT - 495 },
    { text: `1. Un pago de agradecimiento a: ${data.nombreBeneficiario}`, y: PAGE_HEIGHT - 515, bold: true, color: COLORS.accent },
    { text: '   (Este nombre cambiara en tu Kit2 - ya te explico)', y: PAGE_HEIGHT - 535 },
    { text: '', y: PAGE_HEIGHT - 555 },
    { text: '2. Un pago por lo que compras a la Corporacion:', y: PAGE_HEIGHT - 575 },
    { text: '   - Este Kit2 personalizado a tu nombre', y: PAGE_HEIGHT - 595 },
    { text: '   - Tu herramienta de trabajo', y: PAGE_HEIGHT - 615 },
    { text: '   - Unas obras interesantes incluidas', y: PAGE_HEIGHT - 635 },
  ];
  
  explicacion.forEach(item => {
    page.drawText(item.text, {
      x: MARGIN + 10, y: item.y, size: 11,
      font: item.bold ? fonts.helveticaBold : fonts.helvetica,
      color: item.color || COLORS.text,
    });
  });
  
  // Nota importante al final
  page.drawRectangle({
    x: MARGIN - 10, y: 50, width: CONTENT_WIDTH + 20, height: 80,
    color: COLORS.lightOrange,
    borderColor: COLORS.accent,
    borderWidth: 1,
  });
  
  page.drawText('IMPORTANTE: Al final encontraras otro boton igual.', {
    x: MARGIN, y: 110, size: 11, font: fonts.helveticaBold, color: COLORS.accent,
  });
  page.drawText('Si ya conoces el sistema puedes dar clic al inicio,', {
    x: MARGIN, y: 90, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('pero si no, es mejor que lo leas y entiendas todo primero.', {
    x: MARGIN, y: 70, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
}

// ==================== PÁGINA 3: JUEGO FAMILIAR ====================
function generarPagina3_JuegoFamiliar(pdfDoc: PDFDocument, fonts: Fonts, data: Kit2Data) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('UN JUEGO FAMILIAR REAL', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 22, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  // Caja de seguridad
  page.drawRectangle({
    x: MARGIN - 10, y: PAGE_HEIGHT - 160, width: CONTENT_WIDTH + 20, height: 80,
    color: COLORS.lightGreen,
    borderColor: COLORS.primary,
    borderWidth: 1,
  });
  
  page.drawText('Este documento se mueve solo y nadie lo podra manipular.', {
    x: MARGIN, y: PAGE_HEIGHT - 110, size: 12, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('El sistema es automatico y transparente para todos.', {
    x: MARGIN, y: PAGE_HEIGHT - 135, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  const textos = [
    'Este es un JUEGO FAMILIAR REAL donde todos aprendemos juntos:',
    'los ninos, los papas, los abuelos... TODOS!',
    '',
    'Es un juego para aprender haciendo lo que hacen los adultos',
    'con el dinero. Pero NO es un juego de mentiras.',
    '',
    'Es REAL:',
    '   - Con dinero real',
    '   - Con bancos reales',
    '   - Con decisiones reales',
    '',
    'Por eso lo mejor es empezar con el PEQUENIN DE LA CASA.',
    'Porque los ninos aprenden mas rapido que nosotros.',
    '',
    'Y mientras ellos juegan (con supervision de mama o papa),',
    'toda la familia aprende!',
  ];
  
  let y = PAGE_HEIGHT - 200;
  textos.forEach(texto => {
    const isBold = texto.includes('REAL:') || texto.includes('PEQUENIN');
    page.drawText(texto, {
      x: MARGIN, y, size: 12,
      font: isBold ? fonts.helveticaBold : fonts.helvetica,
      color: COLORS.text,
    });
    y -= 22;
  });
}

// ==================== PÁGINA 4: QUÉ VAN A APRENDER ====================
function generarPagina4_QueAprenden(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Que Van a Aprender?', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('No es solo recibir dinero. Es aprender 3 cosas importantes:', {
    x: MARGIN, y: PAGE_HEIGHT - 100, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  // Caja 1: AHORRAR
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 220, width: CONTENT_WIDTH, height: 100,
    color: COLORS.lightOrange,
    borderColor: COLORS.accent,
    borderWidth: 1,
  });
  page.drawText('1. AHORRAR', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 145, size: 16, font: fonts.helveticaBold, color: COLORS.accent,
  });
  page.drawText('Ahorrar es NO gastar todo lo que tienes.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 170, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Ejemplo: Si recibes $100, gastas $80 y guardas $20 en tu alcancia.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 190, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Asi juntas dinero para cosas mas grandes!', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 210, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  
  // Caja 2: INVERTIR
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 350, width: CONTENT_WIDTH, height: 110,
    color: COLORS.lightBlue,
    borderColor: COLORS.link,
    borderWidth: 1,
  });
  page.drawText('2. INVERTIR', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 265, size: 16, font: fonts.helveticaBold, color: COLORS.link,
  });
  page.drawText('Invertir es usar tu dinero para HACER MAS DINERO.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 290, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Ejemplo: Si usas $35 para entrar al juego,', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 310, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('y despues recibes $250... $35 -> $250 = 7 veces mas dinero!', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 330, size: 11, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  // Caja 3: INCREMENTAR CAPITAL
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 480, width: CONTENT_WIDTH, height: 110,
    color: COLORS.lightGreen,
    borderColor: COLORS.primary,
    borderWidth: 1,
  });
  page.drawText('3. INCREMENTAR TU CAPITAL', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 395, size: 16, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('Capital es el dinero que tienes guardado para hacer cosas grandes.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 420, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Con $250 ahorrados puedes abrir tu propio negocio,', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 440, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('comprar herramientas, o seguir invirtiendo!', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 460, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
}

// ==================== PÁGINA 5: CAPITAL ====================
function generarPagina5_Capital(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Como Crece Tu Capital', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Ejemplo progresivo:', {
    x: MARGIN, y: PAGE_HEIGHT - 100, size: 14, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  const ejemplos = [
    { mes: 'Mes 1:', desc: 'Tienes $0 -> Inviertes $35 para empezar', color: COLORS.text },
    { mes: 'Mes 3:', desc: 'Ya recibiste $30 -> Tu capital es -$5 (casi recuperas)', color: COLORS.text },
    { mes: 'Mes 6:', desc: 'Ya recibiste $100 -> Tu capital es +$65 (ganancia!)', color: COLORS.primary },
    { mes: 'Mes 12:', desc: 'Recibiste $250 -> Tu capital es +$215 (EXITO!)', color: COLORS.accent },
  ];
  
  let y = PAGE_HEIGHT - 140;
  ejemplos.forEach(ej => {
    page.drawText(ej.mes, { x: MARGIN + 20, y, size: 12, font: fonts.helveticaBold, color: ej.color });
    page.drawText(ej.desc, { x: MARGIN + 80, y, size: 12, font: fonts.helvetica, color: ej.color });
    y -= 30;
  });
  
  // Caja resumen
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 380, width: CONTENT_WIDTH, height: 100,
    color: COLORS.lightGreen,
    borderColor: COLORS.primary,
    borderWidth: 2,
  });
  
  page.drawText('En resumen:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 305, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('Aprendes a AHORRAR (no gastar todo),', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 330, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('INVERTIR (hacer que tu dinero crezca),', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 350, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('e INCREMENTAR CAPITAL (tener cada vez mas).', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 370, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
}

// ==================== PÁGINA 6: QUÉ NECESITAS ====================
function generarPagina6_QueNecesitas(pdfDoc: PDFDocument, fonts: Fonts, data: Kit2Data) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Que Necesitas Para Jugar?', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Para jugar necesitas 3 cosas basicas:', {
    x: MARGIN, y: PAGE_HEIGHT - 100, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  // 1. Cuenta bancaria
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 190, width: CONTENT_WIDTH, height: 70,
    color: COLORS.lightOrange, borderColor: COLORS.accent, borderWidth: 1,
  });
  page.drawText('1. CUENTA BANCARIA', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 145, size: 14, font: fonts.helveticaBold, color: COLORS.accent,
  });
  page.drawText('Un lugar donde guardar tu dinero de forma segura.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 168, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Si eres menor: Cuenta conjunta con tus padres.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 185, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  
  // 2. Email
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 280, width: CONTENT_WIDTH, height: 70,
    color: COLORS.lightBlue, borderColor: COLORS.link, borderWidth: 1,
  });
  page.drawText('2. EMAIL', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 235, size: 14, font: fonts.helveticaBold, color: COLORS.link,
  });
  page.drawText('Para recibir tu arbol personalizado y comunicarte.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 258, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Si eres menor: Usa el email de tus padres.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 275, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  
  // 3. Billetera digital
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 370, width: CONTENT_WIDTH, height: 70,
    color: rgb(0.95, 0.90, 0.98), borderColor: COLORS.secondary, borderWidth: 1,
  });
  page.drawText('3. BILLETERA DIGITAL (PayPal, Wise, etc.)', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 325, size: 14, font: fonts.helveticaBold, color: COLORS.secondary,
  });
  page.drawText('Para enviar y recibir dinero digital.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 348, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('La mas practica para este juego.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 365, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  
  // Objeciones
  page.drawText(`"Pero ${data.nombreDueno}, mis papas no saben de PayPal..."`, {
    x: MARGIN, y: PAGE_HEIGHT - 430, size: 12, font: fonts.helveticaOblique, color: COLORS.text,
  });
  page.drawText('"No tengo cuenta de banco..."', {
    x: MARGIN, y: PAGE_HEIGHT - 455, size: 12, font: fonts.helveticaOblique, color: COLORS.text,
  });
  page.drawText('"Esto suena complicado..."', {
    x: MARGIN, y: PAGE_HEIGHT - 480, size: 12, font: fonts.helveticaOblique, color: COLORS.text,
  });
}

// ==================== PÁGINA 7: TRANQUILO ====================
function generarPagina7_Tranquilo(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('TRANQUILO!', {
    x: MARGIN, y: PAGE_HEIGHT - 70, size: 32, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Si tus papas no saben, que tambien aprendan!', {
    x: MARGIN, y: PAGE_HEIGHT - 120, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Este juego es para TODA la familia.', {
    x: MARGIN, y: PAGE_HEIGHT - 145, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Aprenden juntos, juegan juntos, crecen juntos.', {
    x: MARGIN, y: PAGE_HEIGHT - 170, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Si No Sabes Como, Puedes:', {
    x: MARGIN, y: PAGE_HEIGHT - 230, size: 18, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  const opciones = [
    'BUSCAR EN GOOGLE: "Como abrir cuenta PayPal tutorial"',
    'PREGUNTARLE A LA IA: ChatGPT, Claude, etc.',
    'PREGUNTA A OTRAS PERSONAS: Amigos, familiares',
    'VE AL BANCO: Ellos te explican todo',
    'TUTORIALES DE YOUTUBE: Videos paso a paso',
  ];
  
  let y = PAGE_HEIGHT - 270;
  opciones.forEach(op => {
    page.drawText('- ' + op, { x: MARGIN + 20, y, size: 12, font: fonts.helvetica, color: COLORS.text });
    y -= 28;
  });
  
  // Caja motivacional
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 500, width: CONTENT_WIDTH, height: 60,
    color: COLORS.lightGreen, borderColor: COLORS.primary, borderWidth: 2,
  });
  page.drawText('Nadie nace sabiendo.', {
    x: 180, y: PAGE_HEIGHT - 460, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('Todos aprendemos preguntando.', {
    x: 155, y: PAGE_HEIGHT - 485, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
}

// ==================== PÁGINA 8: PERSONAJES 1 ====================
function generarPagina8_Personajes1(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Los Personajes del Arbol Magico', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Para entender el juego, imagina un ARBOL con 4 niveles:', {
    x: MARGIN, y: PAGE_HEIGHT - 100, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  // LA SEMILLA (X0)
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 250, width: CONTENT_WIDTH, height: 130,
    color: rgb(1, 0.98, 0.90), borderColor: rgb(0.55, 0.35, 0.17), borderWidth: 2,
  });
  page.drawText('LA SEMILLA (X0)', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 145, size: 18, font: fonts.helveticaBold, color: rgb(0.55, 0.35, 0.17),
  });
  page.drawText('Nombre: Semillita', { x: MARGIN + 15, y: PAGE_HEIGHT - 175, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Rol: El que planto primero', { x: MARGIN + 15, y: PAGE_HEIGHT - 195, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Poder: Inicio todo el arbol', { x: MARGIN + 15, y: PAGE_HEIGHT - 215, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Recompensa: Recibe de las HOJAS', { x: MARGIN + 15, y: PAGE_HEIGHT - 235, size: 11, font: fonts.helveticaBold, color: COLORS.primary });
  
  // EL TRONCO (X1)
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 420, width: CONTENT_WIDTH, height: 150,
    color: COLORS.lightGreen, borderColor: COLORS.primary, borderWidth: 2,
  });
  page.drawText('EL TRONCO (X1) -> ESE ERES TU!', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 295, size: 18, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('Nombre: Tronquito', { x: MARGIN + 15, y: PAGE_HEIGHT - 325, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Rol: Sostiene todo el arbol', { x: MARGIN + 15, y: PAGE_HEIGHT - 345, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Poder: Hace crecer las ramas', { x: MARGIN + 15, y: PAGE_HEIGHT - 365, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Recompensa: Recibe de las HOJAS', { x: MARGIN + 15, y: PAGE_HEIGHT - 385, size: 11, font: fonts.helveticaBold, color: COLORS.primary });
  page.drawText('Tu eres el Tronco! Tu trabajo es invitar a las Ramas.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 410, size: 11, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  page.drawText('Cuando las Ramas inviten a las Hojas, TU recibiras dinero!', {
    x: MARGIN, y: PAGE_HEIGHT - 470, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
}

// ==================== PÁGINA 9: PERSONAJES 2 ====================
function generarPagina9_Personajes2(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  // LAS RAMAS (X2)
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 170, width: CONTENT_WIDTH, height: 130,
    color: COLORS.lightBlue, borderColor: COLORS.link, borderWidth: 2,
  });
  page.drawText('LAS RAMAS (X2) -> Los que TU invitas', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 65, size: 18, font: fonts.helveticaBold, color: COLORS.link,
  });
  page.drawText('Nombre: Ramitas', { x: MARGIN + 15, y: PAGE_HEIGHT - 95, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Rol: Crecen del tronco', { x: MARGIN + 15, y: PAGE_HEIGHT - 115, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Poder: Pueden invitar a Hojas', { x: MARGIN + 15, y: PAGE_HEIGHT - 135, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Recompensa: Reciben de SUS hojas', { x: MARGIN + 15, y: PAGE_HEIGHT - 155, size: 11, font: fonts.helveticaBold, color: COLORS.link });
  
  // LAS HOJAS (X3)
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 340, width: CONTENT_WIDTH, height: 130,
    color: rgb(0.94, 0.98, 0.92), borderColor: rgb(0.33, 0.55, 0.18), borderWidth: 2,
  });
  page.drawText('LAS HOJAS (X3) -> Los amigos de tus amigos', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 235, size: 18, font: fonts.helveticaBold, color: rgb(0.33, 0.55, 0.18),
  });
  page.drawText('Nombre: Hojitas', { x: MARGIN + 15, y: PAGE_HEIGHT - 265, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Rol: El nivel mas nuevo', { x: MARGIN + 15, y: PAGE_HEIGHT - 285, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Poder: Dan frutos (dinero)', { x: MARGIN + 15, y: PAGE_HEIGHT - 305, size: 11, font: fonts.helvetica, color: COLORS.text });
  page.drawText('Recompensa: Dan plata a Semillita y Tronco', { x: MARGIN + 15, y: PAGE_HEIGHT - 325, size: 11, font: fonts.helveticaBold, color: rgb(0.33, 0.55, 0.18) });
}

// ==================== PÁGINA 10: MAGIA DEL ÁRBOL ====================
function generarPagina10_MagiaArbol(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  // Caja magia
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 280, width: CONTENT_WIDTH, height: 200,
    color: COLORS.lightOrange, borderColor: COLORS.accent, borderWidth: 3,
  });
  
  page.drawText('LA MAGIA DEL ARBOL', {
    x: 180, y: PAGE_HEIGHT - 120, size: 24, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  page.drawText('Cuando las HOJITAS dan frutos (dinero),', {
    x: 140, y: PAGE_HEIGHT - 180, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('esos frutos caen y alimentan a la', {
    x: 160, y: PAGE_HEIGHT - 210, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('SEMILLITA y al TRONCO', {
    x: 195, y: PAGE_HEIGHT - 240, size: 16, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Por que?', {
    x: 270, y: PAGE_HEIGHT - 340, size: 16, font: fonts.helveticaBold, color: COLORS.text,
  });
  page.drawText('Porque Semillita y Tronco trabajaron antes,', {
    x: 140, y: PAGE_HEIGHT - 380, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('y merecen su recompensa!', {
    x: 195, y: PAGE_HEIGHT - 410, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
}

// ==================== PÁGINA 11: REGLA 1 ====================
function generarPagina11_Regla1(pdfDoc: PDFDocument, fonts: Fonts, data: Kit2Data) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Las 3 Reglas del Juego', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  // Caja Regla 1
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 470, width: CONTENT_WIDTH, height: 380,
    color: COLORS.lightOrange, borderColor: COLORS.accent, borderWidth: 2,
  });
  
  page.drawText('REGLA #1: SIEMPRE DAR LAS GRACIAS', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 115, size: 18, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  page.drawText('Cuando alguien te ensena algo valioso, le das las gracias con $10!', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 155, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Pero NO a quien te invito directamente...', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 180, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Sino a quien esta DOS NIVELES ARRIBA de ti.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 205, size: 12, font: fonts.helveticaBold, color: COLORS.text,
  });
  
  // Diagrama - CORREGIDO: Tronco es el DUEÑO del Kit2
  page.drawText(`${data.nombreBeneficiario} (Semillita - X0)`, {
    x: MARGIN + 80, y: PAGE_HEIGHT - 260, size: 14, font: fonts.helveticaBold, color: rgb(0.55, 0.35, 0.17),
  });
  page.drawText('|  invito a...', { x: MARGIN + 100, y: PAGE_HEIGHT - 285, size: 11, font: fonts.helvetica, color: COLORS.text });
  
  page.drawText(`${data.nombreDueno} (Tronco - X1)`, {
    x: MARGIN + 80, y: PAGE_HEIGHT - 320, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('|  te invita a ti...', { x: MARGIN + 100, y: PAGE_HEIGHT - 345, size: 11, font: fonts.helvetica, color: COLORS.text });
  
  page.drawText('TU! (Rama - X2)', {
    x: MARGIN + 80, y: PAGE_HEIGHT - 380, size: 14, font: fonts.helveticaBold, color: COLORS.link,
  });
  
  page.drawText(`TU le das gracias a ${data.nombreBeneficiario} (la Semillita) con $10`, {
    x: MARGIN + 15, y: PAGE_HEIGHT - 425, size: 12, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  page.drawText(`Por que NO a ${data.nombreDueno}? Porque el recibira cuando TUS amigos entren.`, {
    x: MARGIN + 15, y: PAGE_HEIGHT - 455, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
}

// ==================== PÁGINA 12: REGLAS 2 Y 3 ====================
function generarPagina12_Regla2y3(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  // Caja Regla 2
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 300, width: CONTENT_WIDTH, height: 240,
    color: COLORS.lightBlue, borderColor: COLORS.link, borderWidth: 2,
  });
  
  page.drawText('REGLA #2: COMPRAR TU KIT2 PERSONALIZADO', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 85, size: 16, font: fonts.helveticaBold, color: COLORS.link,
  });
  
  page.drawText('Para jugar necesitas tu propio Kit2. Que incluye?', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 120, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  const items = [
    '- Los libros digitales de Herejia Economica',
    '- Todos los articulos en PDF',
    '- Enlaces a las conferencias en video',
    '- Tu Arbol Magico con TU NOMBRE',
    '- Tu codigo unico para invitar a otros',
    '- Derecho a jugar durante 1 ano completo',
  ];
  
  let y = PAGE_HEIGHT - 150;
  items.forEach(item => {
    page.drawText(item, { x: MARGIN + 25, y, size: 11, font: fonts.helvetica, color: COLORS.text });
    y -= 20;
  });
  
  page.drawText('Cuanto cuesta? $25 dolares', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 280, size: 14, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  // Caja Regla 3
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 430, width: CONTENT_WIDTH, height: 110,
    color: COLORS.lightGreen, borderColor: COLORS.primary, borderWidth: 2,
  });
  
  page.drawText('REGLA #3: COMPARTIR TU ARBOL', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 345, size: 16, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Una vez que tienes tu Kit2, es tu turno de compartir!', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 375, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Compartes con amigos, familia, primos... quien tu quieras!', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 400, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
}

// ==================== PÁGINA 13: COMPARTIR ====================
function generarPagina13_Compartir(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Como Funciona Compartir', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Cuando ellos entran (tus Ramas), y luego SUS amigos', {
    x: MARGIN, y: PAGE_HEIGHT - 110, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('entran (las Hojas)...', {
    x: MARGIN, y: PAGE_HEIGHT - 130, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('TU recibes $10 por cada Hoja!', {
    x: MARGIN, y: PAGE_HEIGHT - 170, size: 18, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  // Caja resumen
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 320, width: CONTENT_WIDTH, height: 120,
    color: COLORS.lightGreen, borderColor: COLORS.primary, borderWidth: 2,
  });
  
  page.drawText('Resumen:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 225, size: 16, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('Tu das $10 + $25 = $35 para entrar', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 260, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Luego recibes $10 por cada Hoja que crezca en tu arbol', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 290, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
}

// ==================== PÁGINA 14: MATEMÁTICAS ====================
function generarPagina14_Matematicas(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Las Matematicas del Juego', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('CUANTO PUEDES GANAR?', {
    x: MARGIN, y: PAGE_HEIGHT - 100, size: 14, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  // Ejemplo
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 230, width: CONTENT_WIDTH, height: 110,
    color: COLORS.lightOrange, borderColor: COLORS.accent, borderWidth: 1,
  });
  
  page.drawText('Ejemplo Basico:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 145, size: 14, font: fonts.helveticaBold, color: COLORS.accent,
  });
  page.drawText('Tu invitas a 5 amigos (5 Ramas)', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 170, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Cada uno invita a 5 amigos (5 Hojas cada uno)', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 190, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Total: 5 x 5 = 25 Hojas = 25 x $10 = $250', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 215, size: 12, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  // Tabla
  page.drawText('Tabla de Ahorros Posibles:', {
    x: MARGIN, y: PAGE_HEIGHT - 280, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  const tabla = [
    { inv: '3 amigos', cada: '3 c/u', hojas: '9 Hojas', gana: '$90' },
    { inv: '5 amigos', cada: '5 c/u', hojas: '25 Hojas', gana: '$250' },
    { inv: '10 amigos', cada: '5 c/u', hojas: '50 Hojas', gana: '$500' },
    { inv: '10 amigos', cada: '10 c/u', hojas: '100 Hojas', gana: '$1,000' },
  ];
  
  let y = PAGE_HEIGHT - 320;
  tabla.forEach(row => {
    page.drawText(`${row.inv} -> ${row.cada} -> ${row.hojas} -> ${row.gana}`, {
      x: MARGIN + 20, y, size: 12, font: fonts.helvetica, color: COLORS.text,
    });
    y -= 25;
  });
}

// ==================== PÁGINA 15: CÓMO FUNCIONA ====================
function generarPagina15_ComoFunciona(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Ves como funciona?', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Tu inversion inicial: $35', {
    x: MARGIN, y: PAGE_HEIGHT - 110, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Si logras 25 Hojas: Recibes $250', {
    x: MARGIN, y: PAGE_HEIGHT - 135, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Tu ganancia: $250 - $35 = $215 de utilidad', {
    x: MARGIN, y: PAGE_HEIGHT - 160, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Eso es multiplicar tu dinero por 7!', {
    x: MARGIN, y: PAGE_HEIGHT - 210, size: 18, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  // Tu misión
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 380, width: CONTENT_WIDTH, height: 140,
    color: COLORS.lightGreen, borderColor: COLORS.primary, borderWidth: 2,
  });
  
  page.drawText('Tu Mision de 1 Ano:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 270, size: 18, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('Conseguir 25 Hojas en tu arbol', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 305, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('= $250 en tu alcancia', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 330, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('= Tu primer gran capital!', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 355, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Que vas a hacer con $250? Bicicleta? Videojuegos? Negocio?', {
    x: MARGIN, y: PAGE_HEIGHT - 420, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Tu decides! Es TU plata.', {
    x: MARGIN, y: PAGE_HEIGHT - 450, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
}

// ==================== PÁGINA 16: JUEGA INTELIGENTE ====================
function generarPagina16_JuegaInteligente(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Juega Inteligentemente', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('No se trata de invitar a TODO EL MUNDO.', {
    x: MARGIN, y: PAGE_HEIGHT - 100, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Se trata de invitar a las personas CORRECTAS.', {
    x: MARGIN, y: PAGE_HEIGHT - 125, size: 12, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Las Mejores Personas Para Invitar:', {
    x: MARGIN, y: PAGE_HEIGHT - 170, size: 16, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  const personas = [
    'Familiares cercanos (Papas, tios, primos)',
    'Amigos activos (los que conocen mucha gente)',
    'Emprendedores (personas con negocios)',
    'Maestros/Profesores',
    'Padres de otros ninos',
  ];
  
  let y = PAGE_HEIGHT - 205;
  personas.forEach(p => {
    page.drawText('- ' + p, { x: MARGIN + 20, y, size: 11, font: fonts.helvetica, color: COLORS.text });
    y -= 25;
  });
  
  page.drawText('Como Presentar el Juego:', {
    x: MARGIN, y: PAGE_HEIGHT - 360, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('MAL: "Oye, unete para que YO gane dinero"', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 395, size: 11, font: fonts.helvetica, color: COLORS.red,
  });
  page.drawText('BIEN: "Encontre un juego educativo donde aprendemos', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 420, size: 11, font: fonts.helvetica, color: COLORS.primary,
  });
  page.drawText('       sobre dinero juntos. Quieres jugar?"', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 440, size: 11, font: fonts.helvetica, color: COLORS.primary,
  });
}

// ==================== PÁGINA 17: PACIENCIA ====================
function generarPagina17_Paciencia(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Paciencia y Constancia', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('El juego dura 1 ano completo. No esperes 25 Hojas en 1 semana.', {
    x: MARGIN, y: PAGE_HEIGHT - 110, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('Es normal que:', {
    x: MARGIN, y: PAGE_HEIGHT - 155, size: 14, font: fonts.helveticaBold, color: COLORS.text,
  });
  page.drawText('- Los primeros meses sean lentos', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 185, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('- No todos digan que si', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 210, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('- Algunos tarden en decidirse', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 235, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('La paciencia es parte del aprendizaje!', {
    x: MARGIN, y: PAGE_HEIGHT - 290, size: 16, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  // Caja recuerda
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 420, width: CONTENT_WIDTH, height: 100,
    color: COLORS.lightGreen, borderColor: COLORS.primary, borderWidth: 2,
  });
  
  page.drawText('RECUERDA:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 345, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('No se trata de CANTIDAD, se trata de CALIDAD.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 375, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('5 personas comprometidas que inviten a otras 5 = 25 Hojas = $250', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 400, size: 12, font: fonts.helveticaBold, color: COLORS.primary,
  });
}

// ==================== PÁGINA 18: SECRETO ====================
function generarPagina18_Secreto(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  // Fondo especial
  page.drawRectangle({
    x: 20, y: 20, width: PAGE_WIDTH - 40, height: PAGE_HEIGHT - 40,
    color: COLORS.lightOrange, borderColor: COLORS.gold, borderWidth: 3,
  });
  
  page.drawText('SECRETO SUPER ESPECIAL', {
    x: 130, y: PAGE_HEIGHT - 100, size: 28, font: fonts.helveticaBold, color: COLORS.accent,
  });
  page.drawText('(Solo para ninos inteligentes)', {
    x: 185, y: PAGE_HEIGHT - 135, size: 14, font: fonts.helvetica, color: COLORS.gold,
  });
  
  page.drawText('Oye... quieres saber un secreto?', {
    x: 190, y: PAGE_HEIGHT - 200, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('Ya convenciste a mama y papa de que te ayudaran...', {
    x: MARGIN + 40, y: PAGE_HEIGHT - 260, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Ya tienen cuenta de banco y todo...', {
    x: MARGIN + 40, y: PAGE_HEIGHT - 285, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Ya entienden como funciona el arbol...', {
    x: MARGIN + 40, y: PAGE_HEIGHT - 310, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('Entonces...', {
    x: 270, y: PAGE_HEIGHT - 360, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  
  // Caja del secreto
  page.drawRectangle({
    x: MARGIN + 30, y: PAGE_HEIGHT - 520, width: CONTENT_WIDTH - 60, height: 120,
    color: COLORS.gold, borderColor: COLORS.accent, borderWidth: 2,
  });
  
  page.drawText('AQUI VIENE EL SECRETO:', {
    x: 175, y: PAGE_HEIGHT - 430, size: 18, font: fonts.helveticaBold, color: COLORS.white,
  });
  page.drawText('POR QUE NO LES VENDES TU ARBOL', {
    x: 130, y: PAGE_HEIGHT - 470, size: 16, font: fonts.helveticaBold, color: COLORS.white,
  });
  page.drawText('A ELLOS TAMBIEN?!', {
    x: 210, y: PAGE_HEIGHT - 500, size: 16, font: fonts.helveticaBold, color: COLORS.white,
  });
}

// ==================== PÁGINA 19: CONVERSACIÓN PAPÁS ====================
function generarPagina19_ConversacionPapas(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Imaginate la conversacion:', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 18, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  const conversacion = [
    { quien: 'Tu:', texto: '"Mami, papi, ustedes tambien quieren su propio arbol?"' },
    { quien: 'Ellos:', texto: '"Para que? Ya te ayudamos a ti."' },
    { quien: 'Tu:', texto: '"Pero ustedes tambien pueden ganar! Si invitan a los' },
    { quien: '', texto: 'tios, a sus amigos del trabajo... tambien reciben plata!"' },
    { quien: 'Ellos:', texto: '"Hmm..."' },
    { quien: 'Tu:', texto: '"Ademas, asi podemos ser SOCIOS!"' },
    { quien: 'Ellos:', texto: '"Tienes razon! Eres un genio."' },
  ];
  
  let y = PAGE_HEIGHT - 100;
  conversacion.forEach(linea => {
    if (linea.quien) {
      page.drawText(linea.quien, { x: MARGIN, y, size: 11, font: fonts.helveticaBold, color: COLORS.primary });
    }
    page.drawText(linea.texto, { x: MARGIN + 50, y, size: 11, font: fonts.helvetica, color: COLORS.text });
    y -= 30;
  });
  
  page.drawText('Por Que Funciona:', {
    x: MARGIN, y: PAGE_HEIGHT - 350, size: 16, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  page.drawText('- Tus papas ya entendieron el juego (te ayudaron a ti)', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 385, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('- Ya tienen las herramientas (banco, PayPal, email)', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 410, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('- Conocen a MAS GENTE que tu!', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 435, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('Si ellos invitan a 10 personas, y cada una invita a 5...', {
    x: MARGIN, y: PAGE_HEIGHT - 480, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('ELLOS reciben $500!', {
    x: MARGIN, y: PAGE_HEIGHT - 505, size: 14, font: fonts.helveticaBold, color: COLORS.accent,
  });
}

// ==================== PÁGINA 20: NEGOCIO FAMILIAR ====================
function generarPagina20_NegocioFamiliar(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('RESULTADO FINAL:', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 20, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('- Tu ganas con tus amigos del colegio', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 100, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('- Papa/Mama ganan con sus contactos adultos', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 125, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('- La familia COMPLETA aprende y ahorra junta', {
    x: MARGIN + 20, y: PAGE_HEIGHT - 150, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('ESO SI ES UN NEGOCIO FAMILIAR!', {
    x: MARGIN, y: PAGE_HEIGHT - 210, size: 20, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  // Caja resumen secreto
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 400, width: CONTENT_WIDTH, height: 160,
    color: COLORS.lightOrange, borderColor: COLORS.accent, borderWidth: 2,
  });
  
  page.drawText('Entonces el secreto es:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 275, size: 16, font: fonts.helveticaBold, color: COLORS.accent,
  });
  page.drawText('Primero ayuda a tus papas a entender el juego', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 310, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('ayudandote a TI.', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 330, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Luego, cuando ya lo entienden...', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 360, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Les vendes TU arbol para que ellos TAMBIEN jueguen!', {
    x: MARGIN + 25, y: PAGE_HEIGHT - 385, size: 12, font: fonts.helveticaBold, color: COLORS.primary,
  });
}

// ==================== PÁGINA 21: MENSAJE PADRES ====================
function generarPagina21_MensajePadres(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Mensaje Para Padres y Madres', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Este NO es solo un juego.', {
    x: MARGIN, y: PAGE_HEIGHT - 105, size: 14, font: fonts.helveticaBold, color: COLORS.red,
  });
  page.drawText('Es una herramienta de EDUCACION FINANCIERA REAL para sus hijos.', {
    x: MARGIN, y: PAGE_HEIGHT - 130, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('Lo Que Sus Hijos Aprenderan:', {
    x: MARGIN, y: PAGE_HEIGHT - 175, size: 16, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  // Columna 1
  page.drawText('BANCOS Y CUENTAS', { x: MARGIN, y: PAGE_HEIGHT - 210, size: 12, font: fonts.helveticaBold, color: COLORS.link });
  page.drawText('- Como funcionan las cuentas', { x: MARGIN + 10, y: PAGE_HEIGHT - 230, size: 10, font: fonts.helvetica, color: COLORS.text });
  page.drawText('- Transferencias digitales', { x: MARGIN + 10, y: PAGE_HEIGHT - 245, size: 10, font: fonts.helvetica, color: COLORS.text });
  page.drawText('- PayPal y bancos', { x: MARGIN + 10, y: PAGE_HEIGHT - 260, size: 10, font: fonts.helvetica, color: COLORS.text });
  
  page.drawText('NEGOCIOS Y RED', { x: MARGIN, y: PAGE_HEIGHT - 295, size: 12, font: fonts.helveticaBold, color: COLORS.secondary });
  page.drawText('- Compartir valor', { x: MARGIN + 10, y: PAGE_HEIGHT - 315, size: 10, font: fonts.helvetica, color: COLORS.text });
  page.drawText('- Networking', { x: MARGIN + 10, y: PAGE_HEIGHT - 330, size: 10, font: fonts.helvetica, color: COLORS.text });
  page.drawText('- Ganar-ganar', { x: MARGIN + 10, y: PAGE_HEIGHT - 345, size: 10, font: fonts.helvetica, color: COLORS.text });
  
  // Columna 2
  page.drawText('AHORRO E INVERSION', { x: MARGIN + 270, y: PAGE_HEIGHT - 210, size: 12, font: fonts.helveticaBold, color: COLORS.primary });
  page.drawText('- Inversion inicial', { x: MARGIN + 280, y: PAGE_HEIGHT - 230, size: 10, font: fonts.helvetica, color: COLORS.text });
  page.drawText('- Retorno (ROI)', { x: MARGIN + 280, y: PAGE_HEIGHT - 245, size: 10, font: fonts.helvetica, color: COLORS.text });
  page.drawText('- Paciencia financiera', { x: MARGIN + 280, y: PAGE_HEIGHT - 260, size: 10, font: fonts.helvetica, color: COLORS.text });
  
  page.drawText('ECONOMIA REAL', { x: MARGIN + 270, y: PAGE_HEIGHT - 295, size: 12, font: fonts.helveticaBold, color: COLORS.accent });
  page.drawText('- Circulacion del dinero', { x: MARGIN + 280, y: PAGE_HEIGHT - 315, size: 10, font: fonts.helvetica, color: COLORS.text });
  page.drawText('- Sistemas alternativos', { x: MARGIN + 280, y: PAGE_HEIGHT - 330, size: 10, font: fonts.helvetica, color: COLORS.text });
  page.drawText('- Valor del conocimiento', { x: MARGIN + 280, y: PAGE_HEIGHT - 345, size: 10, font: fonts.helvetica, color: COLORS.text });
}

// ==================== PÁGINA 22: SEGURIDAD ====================
function generarPagina22_Seguridad(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Seguridad Para Menores', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 20, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  const seguridad = [
    '- Cuentas conjuntas padre-hijo obligatorias',
    '- Los padres manejan las transacciones',
    '- Supervision completa del proceso',
    '- Ambiente educativo y controlado',
    '- Sin riesgos para el menor',
  ];
  
  let y = PAGE_HEIGHT - 100;
  seguridad.forEach(item => {
    page.drawText(item, { x: MARGIN + 20, y, size: 12, font: fonts.helvetica, color: COLORS.text });
    y -= 25;
  });
  
  page.drawText('Como Empezar (Paso a Paso):', {
    x: MARGIN, y: PAGE_HEIGHT - 260, size: 18, font: fonts.helveticaBold, color: COLORS.accent,
  });
  
  const pasos = [
    '1. Abrir cuenta bancaria conjunta con su hijo',
    '2. Explicarle el concepto del juego (usar este documento)',
    '3. Hacer la inversion inicial juntos ($10 + $25 = $35)',
    '4. Recibir el Arbol Magico personalizado',
    '5. Ayudarle a compartir con amigos y familiares',
    '6. Ir viendo juntos como crece su alcancia',
    '7. Al final del ano, decidir juntos que hacer con el capital',
  ];
  
  y = PAGE_HEIGHT - 300;
  pasos.forEach(paso => {
    page.drawText(paso, { x: MARGIN + 20, y, size: 11, font: fonts.helvetica, color: COLORS.text });
    y -= 25;
  });
  
  // Meta educativa
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 580, width: CONTENT_WIDTH, height: 70,
    color: COLORS.lightGreen, borderColor: COLORS.primary, borderWidth: 2,
  });
  
  page.drawText('Meta Educativa:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 530, size: 14, font: fonts.helveticaBold, color: COLORS.primary,
  });
  page.drawText('Al final de 1 ano, su hijo habra aprendido mas sobre finanzas', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 555, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('que en 10 anos de colegio tradicional.', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 575, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
}

// ==================== PÁGINA 23: ADVERTENCIA ====================
function generarPagina23_Advertencia(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Y todo mientras se divierte "jugando al banco".', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 14, font: fonts.helvetica, color: COLORS.text,
  });
  
  // Caja advertencia
  page.drawRectangle({
    x: MARGIN, y: PAGE_HEIGHT - 280, width: CONTENT_WIDTH, height: 200,
    color: rgb(1, 0.93, 0.93), borderColor: COLORS.red, borderWidth: 2,
  });
  
  page.drawText('Advertencia Importante:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 105, size: 18, font: fonts.helveticaBold, color: COLORS.red,
  });
  
  page.drawText('La Corporacion Herejia Economica CHE nunca pedira:', {
    x: MARGIN + 15, y: PAGE_HEIGHT - 140, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  page.drawText('X Contrasenas de bancos', { x: MARGIN + 25, y: PAGE_HEIGHT - 170, size: 11, font: fonts.helvetica, color: COLORS.red });
  page.drawText('X Contrasenas de correos', { x: MARGIN + 25, y: PAGE_HEIGHT - 195, size: 11, font: fonts.helvetica, color: COLORS.red });
  page.drawText('X Claves privadas', { x: MARGIN + 25, y: PAGE_HEIGHT - 220, size: 11, font: fonts.helvetica, color: COLORS.red });
  page.drawText('X Informacion sensible personal', { x: MARGIN + 25, y: PAGE_HEIGHT - 245, size: 11, font: fonts.helvetica, color: COLORS.red });
  
  page.drawText('Solo necesitamos:', {
    x: MARGIN, y: PAGE_HEIGHT - 320, size: 14, font: fonts.helveticaBold, color: COLORS.text,
  });
  
  page.drawText('- Cuentas para RECIBIR pagos (no enviar)', { x: MARGIN + 20, y: PAGE_HEIGHT - 350, size: 11, font: fonts.helvetica, color: COLORS.primary });
  page.drawText('- Email para comunicacion', { x: MARGIN + 20, y: PAGE_HEIGHT - 375, size: 11, font: fonts.helvetica, color: COLORS.primary });
  page.drawText('- Contrasena para LA PLATAFORMA (no para bancos)', { x: MARGIN + 20, y: PAGE_HEIGHT - 400, size: 11, font: fonts.helvetica, color: COLORS.primary });
}

// ==================== PÁGINA 24: LISTO PARA EMPEZAR ====================
async function generarPagina24_ListoParaEmpezar(pdfDoc: PDFDocument, fonts: Fonts, data: Kit2Data) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Listo Para Empezar?', {
    x: 170, y: PAGE_HEIGHT - 80, size: 28, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Ya conoces TODO sobre el Arbol Magico del Ahorro:', {
    x: 130, y: PAGE_HEIGHT - 130, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  // [Resto del código de checklist se mantiene igual]
  
  // Modificación del botón y enlace
  page.drawRectangle({
    x: MARGIN + 50, y: PAGE_HEIGHT - 400, width: CONTENT_WIDTH - 100, height: 55,
    color: COLORS.primary, 
    borderColor: COLORS.gold, 
    borderWidth: 3,
  });
  
  page.drawText('QUIERO MI KIT2 PERSONALIZADO', {
    x: MARGIN + 95, y: PAGE_HEIGHT - 380, size: 18, font: fonts.helveticaBold, color: COLORS.white,
  });
  
// AGREGAR ENLACE CLICABLE AL BOTÓN
  const urlActivacion = data.linkActivacion || `https://corpherejiaeconomica.com/es/kit2/activar?ref=${data.codigoUnico}`;
  await agregarEnlace(page, MARGIN + 50, PAGE_HEIGHT - 400, CONTENT_WIDTH - 100, 55, urlActivacion);

  page.drawText('Activación en:', {
    x: 200, y: PAGE_HEIGHT - 450, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  
  // Agregamos un enlace más explícito
  const linkText = data.linkActivacion || 'https://corpherejiaeconomica.com/es/kit2/activar?ref=AMA-MR-001';
  page.drawText(linkText, {
    x: 100, 
    y: PAGE_HEIGHT - 480, 
    size: 11, 
    font: fonts.helveticaBold, 
    color: COLORS.link,
    });
  
  // Footer
  page.drawText('Corporacion Herejia Economica CHE', {
    x: 185, y: PAGE_HEIGHT - 560, size: 14, font: fonts.helveticaBold, color: COLORS.text,
  });
  page.drawText('www.corpherejiaeconomica.com', {
    x: 205, y: PAGE_HEIGHT - 585, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
  page.drawText('Bogota, Colombia', {
    x: 250, y: PAGE_HEIGHT - 610, size: 11, font: fonts.helvetica, color: COLORS.text,
  });
}
// ==================== PÁGINA 25: DESPEDIDA ====================
function generarPagina25_Despedida(pdfDoc: PDFDocument, fonts: Fonts) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Nos vemos en el juego!', {
    x: 200, y: PAGE_HEIGHT - 300, size: 20, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Tu arbol te esta esperando...', {
    x: 200, y: PAGE_HEIGHT - 380, size: 16, font: fonts.helvetica, color: COLORS.text,
  });
}

// ==================== PÁGINA OBRAS ====================
function generarPaginaObras(pdfDoc: PDFDocument, fonts: Fonts, data: Kit2Data) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  page.drawText('Obras Incluidas en Tu Kit2', {
    x: MARGIN, y: PAGE_HEIGHT - 60, size: 24, font: fonts.helveticaBold, color: COLORS.primary,
  });
  
  page.drawText('Al completar tu compra, recibiras los siguientes materiales:', {
    x: MARGIN, y: PAGE_HEIGHT - 100, size: 12, font: fonts.helvetica, color: COLORS.text,
  });
  
  if (data.obras && data.obras.length > 0) {
    let y = PAGE_HEIGHT - 150;
    data.obras.forEach((obra, index) => {
      page.drawText(`${index + 1}. ${obra.titulo}`, {
        x: MARGIN + 20, y, size: 12, font: fonts.helveticaBold, color: COLORS.primary,
      });
      page.drawText(`   Autor: ${obra.autor}`, {
        x: MARGIN + 20, y: y - 18, size: 10, font: fonts.helvetica, color: COLORS.text,
      });
      y -= 50;
    });
  } else {
    page.drawText('- Libros digitales de Herejia Economica', { x: MARGIN + 20, y: PAGE_HEIGHT - 150, size: 12, font: fonts.helvetica, color: COLORS.text });
    page.drawText('- Articulos en PDF', { x: MARGIN + 20, y: PAGE_HEIGHT - 180, size: 12, font: fonts.helvetica, color: COLORS.text });
    page.drawText('- Enlaces a conferencias en video', { x: MARGIN + 20, y: PAGE_HEIGHT - 210, size: 12, font: fonts.helvetica, color: COLORS.text });
    page.drawText('- Tu Arbol Magico personalizado', { x: MARGIN + 20, y: PAGE_HEIGHT - 240, size: 12, font: fonts.helvetica, color: COLORS.text });
  }
  
  // Footer sin código único visible
  page.drawText('Corporacion Herejia Economica CHE', {
    x: 185, y: 100, size: 14, font: fonts.helveticaBold, color: COLORS.text,
  });
  page.drawText('www.corpherejiaeconomica.com', {
    x: 205, y: 75, size: 11, font: fonts.helvetica, color: COLORS.link,
  });
}

export default generarKit2PDF;