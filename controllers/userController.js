const User = require("../models/User");
const Kit = require("../models/Kit");
const Donation = require("../models/Donation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, bankAccount } = req.body;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // Crear nuevo usuario
    user = new User({
      name,
      email,
      password,
      phone,
      bankAccount
    });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Guardar usuario en la base de datos
    await user.save();

    // Responder con el usuario creado (sin la contraseña)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bankAccount: user.bankAccount,
      role: user.role
    };

    res.status(201).json(userResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Iniciar sesión de usuario
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    // Crear token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Obtener usuario actual
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// ===== NUEVAS FUNCIONES DE DASHBOARD =====

// Obtener dashboard completo del usuario
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener información del usuario
    const user = await User.findById(userId).select("-password");
    
    // Obtener kits del usuario
    const userKits = await Kit.find({ clientEmail: user.email });
    
    // Obtener donaciones enviadas
    const donationsSent = await Donation.find({ fromUser: userId }).populate('toUser', 'name email');
    
    // Obtener donaciones recibidas
    const donationsReceived = await Donation.find({ toUser: userId }).populate('fromUser', 'name email');
    
    // Estadísticas generales
    const stats = {
      totalKits: userKits.length,
      activeKits: userKits.filter(kit => kit.status === 'active').length,
      totalDonationsSent: donationsSent.reduce((sum, donation) => sum + donation.amount, 0),
      totalDonationsReceived: donationsReceived.reduce((sum, donation) => sum + donation.amount, 0),
      referralCount: userKits.filter(kit => !kit.isInitialKit).length
    };

    res.json({
      user,
      kits: userKits,
      donationsSent,
      donationsReceived,
      stats
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Actualizar información personal del usuario
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
    if (phone) user.phone = phone;
    if (pais) user.pais = pais;
    if (numeroDocumento) user.numeroDocumento = numeroDocumento;
    if (tipoDocumento) user.tipoDocumento = tipoDocumento;

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

// Actualizar información bancaria
exports.updateBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bank, accountType, accountNumber } = req.body;
    
    if (!bank || !accountNumber) {
      return res.status(400).json({ msg: "Banco y número de cuenta son requeridos" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Actualizar cuenta bancaria
    user.bankAccount = {
      bank,
      accountType: accountType || 'Ahorros',
      accountNumber
    };

    await user.save();

    res.json({ 
      msg: "Información bancaria actualizada exitosamente",
      bankAccount: user.bankAccount
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Agregar método de pago digital (PayPal, Nequi, etc.)
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

    // Para compatibilidad con modelo simple, actualizamos paypalEmail si es PayPal
    if (type === 'paypal') {
      user.paypalEmail = identifier;
    }

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

// Obtener historial de kits del usuario
exports.getUserKits = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const userKits = await Kit.find({ clientEmail: user.email })
      .populate('donationRecipient.name')
      .sort({ createdAt: -1 });

    res.json(userKits);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Obtener historial de donaciones del usuario
exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Donaciones enviadas
    const sent = await Donation.find({ fromUser: userId })
      .populate('toUser', 'name email')
      .populate('relatedKit', 'clientName')
      .sort({ createdAt: -1 });
    
    // Donaciones recibidas
    const received = await Donation.find({ toUser: userId })
      .populate('fromUser', 'name email')
      .populate('relatedKit', 'clientName')
      .sort({ createdAt: -1 });

    res.json({
      sent,
      received,
      summary: {
        totalSent: sent.reduce((sum, d) => sum + d.amount, 0),
        totalReceived: received.reduce((sum, d) => sum + d.amount, 0),
        pendingSent: sent.filter(d => d.status === 'pending').length,
        pendingReceived: received.filter(d => d.status === 'pending').length
      }
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Cambiar contraseña del usuario
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

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña actual incorrecta" });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: "Contraseña actualizada exitosamente" });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Obtener todos los métodos de pago del usuario (para mostrar opciones)
exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const paymentMethods = [];
    
    // Cuenta bancaria
    if (user.bankAccount && user.bankAccount.bank && user.bankAccount.accountNumber) {
      paymentMethods.push({
        type: 'bank',
        name: `${user.bankAccount.bank} - ${user.bankAccount.accountType}`,
        identifier: user.bankAccount.accountNumber,
        details: user.bankAccount
      });
    }
    
    // PayPal
    if (user.paypalEmail) {
      paymentMethods.push({
        type: 'paypal',
        name: 'PayPal',
        identifier: user.paypalEmail,
        details: { email: user.paypalEmail }
      });
    }
    
    // Nequi (usando el teléfono si existe)
    if (user.phone && user.phone !== 'Por definir') {
      paymentMethods.push({
        type: 'nequi',
        name: 'Nequi',
        identifier: user.phone,
        details: { phone: user.phone }
      });
    }

    res.json({
      paymentMethods,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        bankAccount: user.bankAccount,
        paypalEmail: user.paypalEmail
      }
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};