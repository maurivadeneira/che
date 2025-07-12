// Archivo: routes/admin.js
// API endpoints para el dashboard de administración Kit2

const express = require('express');
const router = express.Router();
const Kit = require('../models/Kit');
const Descarga = require('../models/Descarga');
const nodemailer = require('nodemailer');

// Middleware de autenticación admin (básico)
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const adminToken = process.env.ADMIN_TOKEN || 'admin-secret-token';
  
  if (token !== adminToken) {
    return res.status(401).json({
      error: 'No autorizado',
      message: 'Token de administrador requerido'
    });
  }
  
  next();
}

// Dashboard principal - renderizar HTML
router.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-dashboard.html'));
});

// API: Obtener todos los kits con estadísticas
router.get('/kits', requireAuth, async (req, res) => {
  try {
    const kits = await Kit.find()
      .sort({ fechaCreacion: -1 })
      .populate('descargas', 'fechaDescarga obraKey')
      .lean();
    
    // Procesar datos para el dashboard
    const kitsConEstado = await Promise.all(kits.map(async (kit) => {
      // Determinar estado general del kit
      const donacionBeneficiario = kit.donaciones.find(d => d.tipo === 'beneficiario');
      const donacionCorporacion = kit.donaciones.find(d => d.tipo === 'corporacion');
      
      let estadoGeneral = 'pendiente';
      if (donacionBeneficiario?.estado === 'confirmado' && donacionCorporacion?.estado === 'confirmado') {
        estadoGeneral = 'aprobado';
      } else if (donacionBeneficiario?.estado === 'rechazado' || donacionCorporacion?.estado === 'rechazado') {
        estadoGeneral = 'rechazado';
      }
      
      // Contar descargas
      const totalDescargas = await Descarga.countDocuments({ kitId: kit._id });
      const ultimaDescarga = await Descarga.findOne({ kitId: kit._id }).sort({ fechaDescarga: -1 });
      
      return {
        ...kit,
        estadoGeneral,
        donaciones: {
          beneficiario: donacionBeneficiario || { estado: 'pendiente', monto: 0 },
          corporacion: donacionCorporacion || { estado: 'pendiente', monto: 0 }
        },
        estadisticas: {
          descargas: totalDescargas,
          ultimoAcceso: ultimaDescarga?.fechaDescarga,
        },
        montoTotal: (donacionBeneficiario?.monto || 0) + (donacionCorporacion?.monto || 0),
        fechaExpiracion: new Date(kit.fechaCreacion.getTime() + (365 * 24 * 60 * 60 * 1000)),
        url: `${process.env.BASE_URL}/kit?id=${kit._id}`
      };
    }));
    
    // Calcular estadísticas generales
    const stats = {
      pendiente: kitsConEstado.filter(k => k.estadoGeneral === 'pendiente').length,
      aprobado: kitsConEstado.filter(k => k.estadoGeneral === 'aprobado').length,
      rechazado: kitsConEstado.filter(k => k.estadoGeneral === 'rechazado').length,
      ingresoTotal: kitsConEstado
        .filter(k => k.estadoGeneral === 'aprobado')
        .reduce((total, k) => total + k.montoTotal, 0)
    };
    
    res.json({
      kits: kitsConEstado,
      stats
    });
    
  } catch (error) {
    console.error('Error obteniendo kits:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener la lista de kits'
    });
  }
});

// API: Aprobar un kit (confirmar ambas donaciones)
router.post('/kits/:kitId/aprobar', requireAuth, async (req, res) => {
  try {
    const { kitId } = req.params;
    
    const kit = await Kit.findById(kitId);
    if (!kit) {
      return res.status(404).json({
        error: 'Kit no encontrado'
      });
    }
    
    // Actualizar estado de ambas donaciones
    kit.donaciones.forEach(donacion => {
      if (donacion.estado === 'pendiente') {
        donacion.estado = 'confirmado';
        donacion.fechaConfirmacion = new Date();
        donacion.confirmadoPor = req.admin?.id || 'admin';
      }
    });
    
    // Activar el kit
    kit.fechaActivacion = new Date();
    kit.estado = 'activo';
    
    await kit.save();
    
    // Enviar email de confirmación
    await enviarEmailAprobacion(kit);
    
    res.json({
      message: 'Kit aprobado exitosamente',
      kit: {
        id: kit._id,
        estado: 'aprobado',
        fechaActivacion: kit.fechaActivacion
      }
    });
    
  } catch (error) {
    console.error('Error aprobando kit:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al aprobar el kit'
    });
  }
});

// API: Rechazar un kit
router.post('/kits/:kitId/rechazar', requireAuth, async (req, res) => {
  try {
    const { kitId } = req.params;
    const { motivo } = req.body;
    
    const kit = await Kit.findById(kitId);
    if (!kit) {
      return res.status(404).json({
        error: 'Kit no encontrado'
      });
    }
    
    // Actualizar estado de donaciones
    kit.donaciones.forEach(donacion => {
      if (donacion.estado === 'pendiente') {
        donacion.estado = 'rechazado';
        donacion.fechaRechazo = new Date();
        donacion.motivoRechazo = motivo;
        donacion.rechazadoPor = req.admin?.id || 'admin';
      }
    });
    
    kit.estado = 'rechazado';
    
    await kit.save();
    
    // Enviar email de rechazo
    await enviarEmailRechazo(kit, motivo);
    
    res.json({
      message: 'Kit rechazado',
      kit: {
        id: kit._id,
        estado: 'rechazado',
        motivo
      }
    });
    
  } catch (error) {
    console.error('Error rechazando kit:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al rechazar el kit'
    });
  }
});

// API: Obtener detalles de un kit específico
router.get('/kits/:kitId', requireAuth, async (req, res) => {
  try {
    const { kitId } = req.params;
    
    const kit = await Kit.findById(kitId).lean();
    if (!kit) {
      return res.status(404).json({
        error: 'Kit no encontrado'
      });
    }
    
    // Obtener historial de descargas
    const descargas = await Descarga.find({ kitId })
      .sort({ fechaDescarga: -1 })
      .limit(50);
    
    // Estadísticas detalladas
    const estadisticas = {
      totalDescargas: descargas.length,
      descargasPorObra: {},
      ultimoAcceso: descargas[0]?.fechaDescarga,
      ipsUnicas: [...new Set(descargas.map(d => d.ip))].length
    };
    
    // Contar descargas por obra
    descargas.forEach(descarga => {
      estadisticas.descargasPorObra[descarga.obraKey] = 
        (estadisticas.descargasPorObra[descarga.obraKey] || 0) + 1;
    });
    
    res.json({
      kit,
      estadisticas,
      historialDescargas: descargas
    });
    
  } catch (error) {
    console.error('Error obteniendo detalles del kit:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener detalles del kit'
    });
  }
});

// API: Estadísticas generales del sistema
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const ahora = new Date();
    const hace30Dias = new Date(ahora.getTime() - (30 * 24 * 60 * 60 * 1000));
    const hace7Dias = new Date(ahora.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    // Estadísticas de kits
    const totalKits = await Kit.countDocuments();
    const kitsActivos = await Kit.countDocuments({ estado: 'activo' });
    const kitsUltimos30Dias = await Kit.countDocuments({ 
      fechaCreacion: { $gte: hace30Dias }
    });
    
    // Estadísticas de descargas
    const totalDescargas = await Descarga.countDocuments();
    const descargasUltimos7Dias = await Descarga.countDocuments({
      fechaDescarga: { $gte: hace7Dias }
    });
    
    // Ingresos por período
    const kitsAprobados = await Kit.find({ estado: 'activo' });
    const ingresosTotales = kitsAprobados.reduce((total, kit) => {
      return total + kit.donaciones.reduce((sum, donacion) => {
        return donacion.estado === 'confirmado' ? sum + donacion.monto : sum;
      }, 0);
    }, 0);
    
    // Estadísticas por país
    const kitisPorPais = await Kit.aggregate([
      { $group: { _id: '$beneficiario.pais', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      kits: {
        total: totalKits,
        activos: kitsActivos,
        ultimos30Dias: kitsUltimos30Dias,
        tasaConversion: totalKits > 0 ? (kitsActivos / totalKits * 100).toFixed(1) : 0
      },
      descargas: {
        total: totalDescargas,
        ultimos7Dias: descargasUltimos7Dias,
        promedioPorKit: kitsActivos > 0 ? (totalDescargas / kitsActivos).toFixed(1) : 0
      },
      financiero: {
        ingresosTotales,
        ingresoPromedioPorKit: kitsActivos > 0 ? (ingresosTotales / kitsActivos).toFixed(2) : 0
      },
      geografico: kitisPorPais
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener estadísticas'
    });
  }
});

// API: Buscar kits
router.get('/search', requireAuth, async (req, res) => {
  try {
    const { q, status, dateFrom, dateTo, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Filtro de texto
    if (q) {
      query.$or = [
        { 'beneficiario.nombre': { $regex: q, $options: 'i' } },
        { 'beneficiario.email': { $regex: q, $options: 'i' } },
        { _id: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filtro de fechas
    if (dateFrom || dateTo) {
      query.fechaCreacion = {};
      if (dateFrom) query.fechaCreacion.$gte = new Date(dateFrom);
      if (dateTo) query.fechaCreacion.$lte = new Date(dateTo);
    }
    
    const skip = (page - 1) * limit;
    
    const kits = await Kit.find(query)
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Kit.countDocuments(query);
    
    res.json({
      kits,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error buscando kits:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error en la búsqueda'
    });
  }
});

// FUNCIONES AUXILIARES

// Configurar transporter de email
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Enviar email de aprobación
async function enviarEmailAprobacion(kit) {
  try {
    const enlaceKit = `${process.env.BASE_URL}/kit-content/${kit._id}/${kit.beneficiario.userId}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@corpherejiaeconomica.com',
      to: kit.beneficiario.email,
      subject: '🎉 ¡Tu Kit2 de La Herejía Económica ha sido aprobado!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0055a4; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 15px 25px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Kit2 Aprobado!</h1>
            </div>
            <div class="content">
              <h2>¡Hola ${kit.beneficiario.nombre}!</h2>
              <p>Nos complace informarte que tu Kit2 de La Herejía Económica ha sido <strong>aprobado</strong> y está listo para usar.</p>
              
              <p>Ya puedes acceder a todo el contenido digital:</p>
              <ul>
                <li>📚 5 Libros completos</li>
                <li>📄 8+ Artículos especializados</li>
                <li>🎥 Videos y conferencias</li>
                <li>💰 Valor total: +$2,000 USD</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${enlaceKit}" class="button">
                  🚀 ACCEDER A MI KIT2
                </a>
              </div>
              
              <p><strong>Importante:</strong> Tu Kit2 tiene vigencia de 1 año desde hoy.</p>
              
              <p>¡Gracias por ser parte de La Herejía Económica!</p>
            </div>
            <div class="footer">
              <p>La Herejía Económica - Transformando el mundo económico</p>
              <p><a href="https://corpherejiaeconomica.com">corpherejiaeconomica.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email de aprobación enviado a ${kit.beneficiario.email}`);
    
  } catch (error) {
    console.error('Error enviando email de aprobación:', error);
    // No lanzar error para no afectar la aprobación
  }
}

// Enviar email de rechazo
async function enviarEmailRechazo(kit, motivo) {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@corpherejiaeconomica.com',
      to: kit.beneficiario.email,
      subject: '❌ Estado de tu Kit2 - La Herejía Económica',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Estado de tu Kit2</h1>
            </div>
            <div class="content">
              <h2>Hola ${kit.beneficiario.nombre},</h2>
              <p>Lamentamos informarte que tu solicitud de Kit2 no pudo ser procesada en este momento.</p>
              
              ${motivo ? `<p><strong>Motivo:</strong> ${motivo}</p>` : ''}
              
              <p>Si tienes alguna pregunta o deseas obtener más información, no dudes en contactarnos.</p>
              
              <p>Gracias por tu interés en La Herejía Económica.</p>
            </div>
            <div class="footer">
              <p>La Herejía Económica</p>
              <p><a href="https://corpherejiaeconomica.com">corpherejiaeconomica.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email de rechazo enviado a ${kit.beneficiario.email}`);
    
  } catch (error) {
    console.error('Error enviando email de rechazo:', error);
  }
}

module.exports = router;