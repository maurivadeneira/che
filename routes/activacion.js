// routes/activacion.js - REFORMADO: Compras Kit2 Herejía Económica
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Kit = require('../models/Kit');
const PdfPersonalizado = require('../models/PdfPersonalizado');

// Ruta para registrar un nuevo usuario desde el Kit2
router.post('/registrar', async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      pais,
      banco,
      tipoCuenta,
      numeroCuenta,
      numeroDocumento,
      tipoDocumento,
      kitReferencia
    } = req.body;

    console.log('📝 Registrando nuevo usuario:', { nombre, email, kitReferencia });

    // Validar datos requeridos
    if (!nombre || !email || !telefono || !banco || !numeroCuenta || !numeroDocumento) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos marcados con * son obligatorios'
      });
    }

    // Verificar si el usuario ya existe
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este correo electrónico ya está registrado. Use otro correo o contacte soporte.'
      });
    }

    // Buscar el kit de referencia para obtener el receptor de comisión
    const kitReferencia_doc = await Kit.findById(kitReferencia);
    if (!kitReferencia_doc) {
      return res.status(404).json({
        success: false,
        message: 'Kit de referencia no encontrado. Verifique el enlace.'
      });
    }

    // Obtener datos del referente (propietario del kit que compartió)
    const referente = await User.findOne({ email: kitReferencia_doc.clientEmail });
    if (!referente) {
      return res.status(404).json({
        success: false,
        message: 'Referente no encontrado en el sistema.'
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      name: nombre,
      email,
      phone: telefono,
      password: "kit2temp" + Date.now().toString().slice(-6), // ✅ PASSWORD TEMPORAL AGREGADO
      bankAccount: {
        bank: banco,
        accountType: tipoCuenta,
        accountNumber: numeroCuenta
      },
      // Campos adicionales
      pais,
      numeroDocumento,
      tipoDocumento,
      role: 'user'
    });

    await nuevoUsuario.save();
    console.log('✅ Usuario creado:', nuevoUsuario._id);

    // Preparar datos de compra
    const purchaseData = {
      usuarioId: nuevoUsuario._id,

      // Comisión voluntaria al receptor de la red (segundo nivel)
      receptorComision: {
        nombre: kitReferencia_doc.commissionRecipient.name,
        banco: kitReferencia_doc.commissionRecipient.bankAccounts[0].bankName,
        tipoCuenta: kitReferencia_doc.commissionRecipient.bankAccounts[0].accountType,
        numeroCuenta: kitReferencia_doc.commissionRecipient.bankAccounts[0].accountNumber
      },
      comisionRed: 7, // USD $7 - Comisión voluntaria

      // Compra del Kit2 a la corporación
      corporacion: {
        nombre: 'Corporación Herejía Económica',
        titular: 'Mauricio Rivadeneira (Tesorero Temporal)',
        banco: 'Banco de Colombia', // Aquí pondrás tu banco
        tipoCuenta: 'Ahorros', // Tu tipo de cuenta
        numeroCuenta: 'Por actualizar' // Aquí pondrás tu número de cuenta
      },
      compraKit2: 20, // USD $20 - Compra producto digital

      // Información del referente (quien recibirá comisiones cuando este usuario invite a otros)
      referente: {
        nombre: referente.name,
        email: referente.email,
        banco: referente.bankAccount.bank,
        tipoCuenta: referente.bankAccount.accountType,
        numeroCuenta: referente.bankAccount.accountNumber
      }
    };

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      purchaseData
    });

  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta para confirmar compra y generar kit personalizado
router.post('/confirmar-compra', async (req, res) => {
  try {
    const { usuarioId, kitReferencia } = req.body;

    console.log('💰 Confirmando compra para usuario:', usuarioId);

    // Buscar el usuario
    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Buscar el kit de referencia
    const kitRef = await Kit.findById(kitReferencia);
    if (!kitRef) {
      return res.status(404).json({
        success: false,
        message: 'Kit de referencia no encontrado'
      });
    }

    // Buscar el referente (propietario del kit original)
    const referente = await User.findOne({ email: kitRef.clientEmail });

    // En una implementación real, aquí verificarías los pagos
    // Por ahora, simulamos que la compra fue confirmada

    console.log('✅ Simulando confirmación de compra...');

    // Crear nuevo kit para el usuario
    const nuevoKit = new Kit({
      clientName: usuario.name,
      clientEmail: usuario.email,
      clientPhone: usuario.phone,
      bankAccounts: [{
        bankName: usuario.bankAccount.bank,
        accountNumber: usuario.bankAccount.accountNumber,
        accountType: usuario.bankAccount.accountType,
        primary: true
      }],
      // El receptor de comisión de este nuevo kit será el referente (segundo nivel)
      commissionRecipient: {
        name: referente.name,
        bankAccounts: [{
          bankName: referente.bankAccount.bank,
          accountNumber: referente.bankAccount.accountNumber,
          accountType: referente.bankAccount.accountType,
          primary: true
        }]
      },
      isInitialKit: false,
      status: 'pending' // Pendiente hasta que se genere el PDF
    });

    await nuevoKit.save();
    console.log('✅ Nuevo kit creado:', nuevoKit._id);

    // Aquí se generaría el PDF personalizado del usuario
    // Por ahora, simulamos el proceso

    // Actualizar el kit como activo
    nuevoKit.status = 'active';
    nuevoKit.activatedAt = new Date();
    await nuevoKit.save();

    // En una implementación completa, aquí:
    // 1. Generarías el PDF personalizado del usuario
    // 2. Enviarías por email el PDF + material digital
    // 3. Notificarías al referente sobre la nueva activación

    console.log('🎉 Proceso de activación completado para:', usuario.name);

    res.json({
      success: true,
      message: 'Compra confirmada y Kit2 personalizado en proceso',
      data: {
        usuarioId: usuario._id,
        kitId: nuevoKit._id,
        mensaje: 'En las próximas 24 horas recibirá su Kit2 personalizado y todo el material digital por correo electrónico.'
      }
    });

  } catch (error) {
    console.error('❌ Error al confirmar compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta para obtener información de un kit (opcional)
router.get('/kit-info/:kitId', async (req, res) => {
  try {
    const { kitId } = req.params;

    const kit = await Kit.findById(kitId);
    if (!kit) {
      return res.status(404).json({
        success: false,
        message: 'Kit no encontrado'
      });
    }

    // Devolver información básica (sin datos sensibles)
    res.json({
      success: true,
      data: {
        propietario: kit.clientName,
        activo: kit.status === 'active',
        fechaCreacion: kit.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener info del kit:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;