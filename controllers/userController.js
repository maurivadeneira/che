const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, bankAccount } = req.body;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // Crear nuevo usuario CON EL NUEVO ESQUEMA
    user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'user',
      // Mantener compatibilidad con tu estructura actual
      phone: phone || { countryCode: '+57', number: '', verified: false },
      // Adaptar bankAccount al nuevo esquema
      paymentAccounts: {
        bankAccounts: bankAccount ? [{
          bankName: bankAccount.bank || '',
          accountType: bankAccount.accountType || 'savings',
          accountNumber: bankAccount.accountNumber || '',
          holderName: name,
          currency: 'USD',
          country: 'CO',
          isDefault: true,
          verified: false
        }] : []
      }
    });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Guardar usuario en la base de datos
    await user.save();

    console.log('✅ Usuario registrado:', user.name);

    // Crear token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        
        // RESPUESTA COMPATIBLE CON FRONTEND
        res.status(201).json({
          success: true,
          message: 'Usuario registrado exitosamente',
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            bankAccount: user.paymentAccounts?.bankAccounts?.[0] || null,
            role: user.role
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Iniciar sesión de usuario - CORREGIDO PARA COMPATIBILIDAD
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Intento de login:', { email });

    // Verificar si el usuario existe
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Credenciales inválidas" 
      });
    }

    // Verificar contraseña - ADAPTADO para manejar contraseñas no hasheadas
    let isMatch = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      // Contraseña hasheada
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Contraseña en texto plano (temporal)
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Credenciales inválidas" 
      });
    }

    // Crear token JWT - MANTENER TU FORMATO EXACTO
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    };

    // Actualizar último login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        
        console.log('✅ Login exitoso para:', user.name);
        
        // RESPUESTA COMPATIBLE CON FRONTEND
        res.json({
          success: true,
          message: 'Login exitoso',
          token,
          user: {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            // Mantener compatibilidad
            bankAccount: user.paymentAccounts?.bankAccounts?.[0] || null,
            paypalEmail: user.paymentAccounts?.paypal?.[0]?.email || null
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

// Obtener usuario actual - MANTENER TU LÓGICA
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// ===== FUNCIONES DE DASHBOARD ADAPTADAS AL NUEVO ESQUEMA =====

// Obtener dashboard completo del usuario - CORREGIDO
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('📊 Obteniendo dashboard para:', req.user.name || 'usuario');
    
    // Obtener información del usuario con el nuevo esquema
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // ADAPTADO: Usar datos del nuevo esquema kit2
    const kit2Data = user.kit2 || {};
    const stats = kit2Data.stats || {
      totalPurchases: 0,
      totalInvited: 0,
      totalDonationsReceived: 0,
      totalValueGenerated: 0,
      activeKitsCount: 0,
      digitalWorksOwned: 0
    };

    // SIMULAR datos temporales para compatibilidad
    const mockKits = kit2Data.personalizedKits || [];
    const mockDonationsReceived = kit2Data.donationsReceived || [];
    const mockDonationsSent = [];

    // Estadísticas generales ADAPTADAS
    const dashboardStats = {
      totalKits: mockKits.length,
      activeKits: mockKits.filter(kit => 
        kit.status === 'active' && new Date(kit.validUntil) > new Date()
      ).length,
      totalDonationsSent: 0,
      totalDonationsReceived: stats.totalDonationsReceived || 0,
      referralCount: kit2Data.directInvites?.length || 0,
      // Nuevas estadísticas del esquema Kit2
      totalPurchases: stats.totalPurchases,
      totalInvited: stats.totalInvited,
      digitalWorksOwned: stats.digitalWorksOwned
    };

    // RESPUESTA COMPATIBLE CON TU FRONTEND ACTUAL
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone?.number || user.phone || null,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        // Compatibilidad con estructura anterior
        bankAccount: user.paymentAccounts?.bankAccounts?.[0] || null,
        paypalEmail: user.paymentAccounts?.paypal?.[0]?.email || null,
        pais: user.pais || null,
        numeroDocumento: user.numeroDocumento || null,
        tipoDocumento: user.tipoDocumento || null
      },
      // DATOS SIMULADOS PARA COMPATIBILIDAD
      kits: mockKits,
      donationsSent: mockDonationsSent,
      donationsReceived: mockDonationsReceived,
      stats: dashboardStats,
      // Nuevos datos del esquema Kit2 para futuras implementaciones
      kit2: {
        level: kit2Data.level,
        personalizedKits: kit2Data.personalizedKits || [],
        purchaseHistory: kit2Data.purchaseHistory || [],
        directInvites: kit2Data.directInvites || [],
        stats: stats
      },
      paymentAccounts: user.paymentAccounts || {},
      digitalWorks: user.digitalWorks || {}
    });
    
  } catch (err) {
    console.error('❌ Error en getUserDashboard:', err.message);
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

// Actualizar información personal del usuario - ADAPTADO
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, pais, numeroDocumento, tipoDocumento } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Actualizar campos permitidos
    if (name) user.name = name;
    if (phone) {
      // ADAPTADO: Actualizar estructura de teléfono del nuevo esquema
      if (typeof phone === 'string') {
        user.phone = { ...user.phone, number: phone };
      } else {
        user.phone = { ...user.phone, ...phone };
      }
    }
    if (pais) user.pais = pais;
    if (numeroDocumento) user.numeroDocumento = numeroDocumento;
    if (tipoDocumento) user.tipoDocumento = tipoDocumento;

    user.updatedAt = new Date();
    await user.save();

    res.json({ 
      msg: "Perfil actualizado exitosamente",
      user: await User.findById(userId).select("-password")
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Actualizar información bancaria - ADAPTADO AL NUEVO ESQUEMA
exports.updateBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bank, accountType, accountNumber, holderName } = req.body;
    
    if (!bank || !accountNumber) {
      return res.status(400).json({ msg: "Banco y número de cuenta son requeridos" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // ADAPTADO: Usar nueva estructura paymentAccounts
    const newBankAccount = {
      bankName: bank,
      accountType: accountType || 'savings',
      accountNumber,
      holderName: holderName || user.name,
      currency: 'USD',
      country: 'CO',
      isDefault: true,
      verified: false
    };

    // Inicializar paymentAccounts si no existe
    if (!user.paymentAccounts) {
      user.paymentAccounts = {};
    }
    if (!user.paymentAccounts.bankAccounts) {
      user.paymentAccounts.bankAccounts = [];
    }

    // Reemplazar cuenta bancaria (solo una por ahora)
    user.paymentAccounts.bankAccounts = [newBankAccount];
    user.updatedAt = new Date();

    await user.save();

    res.json({ 
      msg: "Información bancaria actualizada exitosamente",
      bankAccount: {
        bank: newBankAccount.bankName,
        accountType: newBankAccount.accountType,
        accountNumber: newBankAccount.accountNumber
      }
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Agregar método de pago digital - ADAPTADO AL NUEVO ESQUEMA
exports.addDigitalPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, identifier, name } = req.body;
    
    if (!type || !identifier) {
      return res.status(400).json({ msg: "Tipo e identificador son requeridos" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // ADAPTADO: Usar nueva estructura paymentAccounts
    if (!user.paymentAccounts) {
      user.paymentAccounts = {};
    }

    if (type === 'paypal') {
      if (!user.paymentAccounts.paypal) {
        user.paymentAccounts.paypal = [];
      }
      user.paymentAccounts.paypal = [{
        email: identifier,
        alias: name || 'Principal',
        isDefault: true,
        verified: false,
        addedDate: new Date()
      }];
    } else if (type === 'nequi') {
      if (!user.paymentAccounts.nequi) {
        user.paymentAccounts.nequi = [];
      }
      user.paymentAccounts.nequi = [{
        phone: identifier,
        alias: name || 'Principal',
        isDefault: true,
        verified: false
      }];
    }

    user.updatedAt = new Date();
    await user.save();

    res.json({ 
      msg: `${type.toUpperCase()} agregado exitosamente`,
      user: await User.findById(userId).select("-password")
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Obtener historial de kits del usuario - ADAPTADO AL NUEVO ESQUEMA
exports.getUserKits = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // ADAPTADO: Usar kit2.personalizedKits en lugar de modelo Kit separado
    const userKits = user.kit2?.personalizedKits || [];
    const purchaseHistory = user.kit2?.purchaseHistory || [];

    res.json({
      personalizedKits: userKits,
      purchaseHistory: purchaseHistory,
      // Mantener compatibilidad con frontend anterior
      kits: userKits
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Obtener historial de donaciones del usuario - ADAPTADO AL NUEVO ESQUEMA
exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // ADAPTADO: Usar kit2.donationsReceived y calcular desde purchaseHistory
    const received = user.kit2?.donationsReceived || [];
    
    // Las donaciones "enviadas" se pueden calcular desde purchaseHistory
    const sent = user.kit2?.purchaseHistory?.map(purchase => ({
      _id: purchase.purchaseId,
      amount: purchase.payments?.toBenefactor?.amount || 0,
      toUser: purchase.fromAuthor,
      status: purchase.payments?.toBenefactor?.status || 'pending',
      createdAt: purchase.purchaseDate,
      relatedKit: purchase.purchaseId
    })) || [];

    res.json({
      sent,
      received,
      summary: {
        totalSent: sent.reduce((sum, d) => sum + (d.amount || 0), 0),
        totalReceived: received.reduce((sum, d) => sum + (d.amount || 0), 0),
        pendingSent: sent.filter(d => d.status === 'pending').length,
        pendingReceived: received.filter(d => d.status === 'pending').length
      }
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Cambiar contraseña del usuario - MANTENER TU LÓGICA
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Contraseña actual y nueva son requeridas" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Verificar contraseña actual - ADAPTADO para manejar no hasheadas
    let isMatch = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(currentPassword, user.password);
    } else {
      isMatch = currentPassword === user.password;
    }

    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña actual incorrecta" });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // ADAPTADO: Actualizar campo de seguridad del nuevo esquema
    if (!user.security) user.security = {};
    user.security.lastPasswordReset = new Date();
    user.updatedAt = new Date();

    await user.save();

    res.json({ msg: "Contraseña actualizada exitosamente" });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Obtener todos los métodos de pago del usuario - ADAPTADO AL NUEVO ESQUEMA
exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const paymentMethods = [];
    const accounts = user.paymentAccounts || {};
    
    // ADAPTADO: Cuentas bancarias del nuevo esquema
    if (accounts.bankAccounts && accounts.bankAccounts.length > 0) {
      accounts.bankAccounts.forEach(bank => {
        paymentMethods.push({
          type: 'bank',
          name: `${bank.bankName} - ${bank.accountType}`,
          identifier: bank.accountNumber,
          details: bank
        });
      });
    }
    
    // ADAPTADO: PayPal del nuevo esquema
    if (accounts.paypal && accounts.paypal.length > 0) {
      accounts.paypal.forEach(paypal => {
        paymentMethods.push({
          type: 'paypal',
          name: `PayPal - ${paypal.alias}`,
          identifier: paypal.email,
          details: paypal
        });
      });
    }
    
    // ADAPTADO: Nequi del nuevo esquema
    if (accounts.nequi && accounts.nequi.length > 0) {
      accounts.nequi.forEach(nequi => {
        paymentMethods.push({
          type: 'nequi',
          name: `Nequi - ${nequi.alias}`,
          identifier: nequi.phone,
          details: nequi
        });
      });
    }

    // Mantener compatibilidad con estructura anterior
    const legacyBankAccount = accounts.bankAccounts?.[0] ? {
      bank: accounts.bankAccounts[0].bankName,
      accountType: accounts.bankAccounts[0].accountType,
      accountNumber: accounts.bankAccounts[0].accountNumber
    } : null;
    
    const legacyPaypalEmail = accounts.paypal?.[0]?.email || null;

    res.json({
      paymentMethods,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone?.number || user.phone,
        bankAccount: legacyBankAccount, // Compatibilidad
        paypalEmail: legacyPaypalEmail // Compatibilidad
      },
      // Nueva estructura
      paymentAccounts: accounts
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};