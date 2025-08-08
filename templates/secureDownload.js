// Archivo: routes/secureDownload.js
// Sistema completo de descarga segura para obras digitales

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { verificarTokenDescarga, obrasDigitalesCompletas } = require('../utils/obrasDigitalesData');
const Kit = require('../models/Kit'); // Modelo MongoDB del Kit

// Middleware para verificar estado de pago del Kit
async function verificarPagoKit(req, res, next) {
  try {
    const { kitId, userId } = req.params;
    
    // Buscar el kit en la base de datos
    const kit = await Kit.findOne({ 
      _id: kitId, 
      'beneficiario.userId': userId 
    });
    
    if (!kit) {
      return res.status(404).json({
        error: 'Kit no encontrado',
        message: 'No se encontró un kit válido para este usuario'
      });
    }
    
    // Verificar que ambas donaciones estén confirmadas
    const donacionBeneficiario = kit.donaciones.find(d => d.tipo === 'beneficiario');
    const donacionCorporacion = kit.donaciones.find(d => d.tipo === 'corporacion');
    
    const pagoCompleto = donacionBeneficiario?.estado === 'confirmado' && 
                        donacionCorporacion?.estado === 'confirmado';
    
    if (!pagoCompleto) {
      return res.status(402).json({
        error: 'Pago incompleto',
        message: 'Debe completar ambas donaciones antes de acceder al contenido',
        estadoPago: {
          beneficiario: donacionBeneficiario?.estado || 'pendiente',
          corporacion: donacionCorporacion?.estado || 'pendiente'
        }
      });
    }
    
    // Verificar vigencia del kit (1 año)
    const fechaActivacion = kit.fechaActivacion || kit.fechaCreacion;
    const fechaExpiracion = new Date(fechaActivacion);
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);
    
    if (new Date() > fechaExpiracion) {
      return res.status(410).json({
        error: 'Kit expirado',
        message: 'El Kit2 ha expirado. La vigencia es de 1 año desde la activación.',
        fechaExpiracion: fechaExpiracion.toISOString()
      });
    }
    
    req.kit = kit;
    next();
    
  } catch (error) {
    console.error('Error verificando pago del kit:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al verificar el estado del kit'
    });
  }
}

// Endpoint principal para descarga segura
router.get('/secure-download/:kitId/:userId/:obraKey', verificarPagoKit, async (req, res) => {
  try {
    const { kitId, userId, obraKey } = req.params;
    const { token } = req.query;
    
    // Verificar token de descarga
    if (!verificarTokenDescarga(token, kitId, userId, obraKey)) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El enlace de descarga ha expirado o es inválido'
      });
    }
    
    // Determinar la obra solicitada
    const obra = obtenerObraPorKey(obraKey);
    if (!obra) {
      return res.status(404).json({
        error: 'Obra no encontrada',
        message: 'La obra solicitada no existe en el Kit2'
      });
    }
    
    // Generar la ruta al archivo
    const rutaArchivo = obtenerRutaArchivo(obra);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(rutaArchivo)) {
      console.error(`Archivo no encontrado: ${rutaArchivo}`);
      return res.status(404).json({
        error: 'Archivo no disponible',
        message: 'El archivo solicitado no está disponible temporalmente'
      });
    }
    
    // Registrar la descarga
    await registrarDescarga(kitId, userId, obraKey, req.ip);
    
    // Configurar headers para descarga
    res.setHeader('Content-Disposition', `attachment; filename="${obra.titulo}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    
    // Enviar el archivo
    res.sendFile(rutaArchivo);
    
  } catch (error) {
    console.error('Error en descarga segura:', error);
    res.status(500).json({
      error: 'Error de descarga',
      message: 'Error interno al procesar la descarga'
    });
  }
});

// Endpoint para obtener la lista de obras disponibles (después del pago)
router.get('/kit-content/:kitId/:userId', verificarPagoKit, async (req, res) => {
  try {
    const { kitId, userId } = req.params;
    const kit = req.kit;
    
    // Generar enlaces seguros para todas las obras
    const enlacesSegiros = require('../utils/obrasDigitalesData').crearEnlacesSegurosDcescarga(kitId, userId);
    
    // Estructurar respuesta con obras y enlaces
    const contenidoCompleto = {
      kit: {
        id: kit._id,
        estado: 'activo',
        fechaActivacion: kit.fechaActivacion,
        vigenciaHasta: new Date(kit.fechaActivacion.getTime() + (365 * 24 * 60 * 60 * 1000))
      },
      obras: {
        libros: Object.keys(obrasDigitalesCompletas.libros).map(key => ({
          ...obrasDigitalesCompletas.libros[key],
          enlaceDescarga: enlacesSegiros[key]
        })),
        articulos: obrasDigitalesCompletas.articulos.map((articulo, index) => ({
          ...articulo,
          enlaceDescarga: enlacesSegiros[`articulo_${index + 1}`]
        })),
        videos: obrasDigitalesCompletas.videos.map((video, index) => ({
          ...video,
          enlaceDescarga: enlacesSegiros[`video_${index + 1}`]
        }))
      },
      estadisticas: {
        totalObras: require('../utils/obrasDigitalesData').calcularTotalObras(),
        valorTotal: require('../utils/obrasDigitalesData').calcularValorTotal(),
        descargasRealizadas: await contarDescargasKit(kitId)
      }
    };
    
    res.json(contenidoCompleto);
    
  } catch (error) {
    console.error('Error obteniendo contenido del kit:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener el contenido del kit'
    });
  }
});

// Endpoint para verificar estado de pagos
router.get('/payment-status/:kitId', async (req, res) => {
  try {
    const { kitId } = req.params;
    
    const kit = await Kit.findById(kitId);
    if (!kit) {
      return res.status(404).json({
        error: 'Kit no encontrado'
      });
    }
    
    const donacionBeneficiario = kit.donaciones.find(d => d.tipo === 'beneficiario');
    const donacionCorporacion = kit.donaciones.find(d => d.tipo === 'corporacion');
    
    const estadoPago = {
      kitId: kit._id,
      estado: 'verificando',
      donaciones: {
        beneficiario: {
          estado: donacionBeneficiario?.estado || 'pendiente',
          monto: donacionBeneficiario?.monto,
          fechaEnvio: donacionBeneficiario?.fechaEnvio,
          metodoPago: donacionBeneficiario?.metodoPago
        },
        corporacion: {
          estado: donacionCorporacion?.estado || 'pendiente', 
          monto: donacionCorporacion?.monto,
          fechaEnvio: donacionCorporacion?.fechaEnvio,
          metodoPago: donacionCorporacion?.metodoPago
        }
      },
      pagoCompleto: donacionBeneficiario?.estado === 'confirmado' && 
                   donacionCorporacion?.estado === 'confirmado',
      vigente: new Date() <= new Date(kit.fechaCreacion.getTime() + (365 * 24 * 60 * 60 * 1000))
    };
    
    res.json(estadoPago);
    
  } catch (error) {
    console.error('Error verificando estado de pago:', error);
    res.status(500).json({
      error: 'Error interno'
    });
  }
});

// FUNCIONES AUXILIARES

function obtenerObraPorKey(obraKey) {
  // Buscar en libros
  if (obrasDigitalesCompletas.libros[obraKey]) {
    return obrasDigitalesCompletas.libros[obraKey];
  }
  
  // Buscar en artículos
  const articuloIndex = parseInt(obraKey.replace('articulo_', '')) - 1;
  if (articuloIndex >= 0 && articuloIndex < obrasDigitalesCompletas.articulos.length) {
    return obrasDigitalesCompletas.articulos[articuloIndex];
  }
  
  // Buscar en videos
  const videoIndex = parseInt(obraKey.replace('video_', '')) - 1;
  if (videoIndex >= 0 && videoIndex < obrasDigitalesCompletas.videos.length) {
    return obrasDigitalesCompletas.videos[videoIndex];
  }
  
  return null;
}

function obtenerRutaArchivo(obra) {
  // Extraer el nombre del archivo de la URL
  const url = new URL(obra.url);
  const fileName = path.basename(url.pathname);
  
  // Determinar la carpeta basada en la categoría
  let carpeta = '';
  switch (obra.categoria) {
    case 'libro':
      carpeta = 'libros';
      break;
    case 'articulo':
      carpeta = 'articulos';
      break;
    case 'video':
      carpeta = 'videos';
      break;
    default:
      carpeta = 'otros';
  }
  
  // Ruta completa al archivo
  return path.join(process.cwd(), 'storage', 'obras', carpeta, fileName);
}

async function registrarDescarga(kitId, userId, obraKey, ip) {
  try {
    const Descarga = require('../models/Descarga');
    
    const nuevaDescarga = new Descarga({
      kitId,
      userId,
      obraKey,
      ip,
      fechaDescarga: new Date(),
      userAgent: req.headers['user-agent'] || 'Unknown'
    });
    
    await nuevaDescarga.save();
  } catch (error) {
    console.error('Error registrando descarga:', error);
    // No detener el proceso de descarga por error de logging
  }
}

async function contarDescargasKit(kitId) {
  try {
    const Descarga = require('../models/Descarga');
    return await Descarga.countDocuments({ kitId });
  } catch (error) {
    console.error('Error contando descargas:', error);
    return 0;
  }
}

module.exports = router;