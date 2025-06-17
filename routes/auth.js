// routes/auth.js - Sistema de autenticación con JWT
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // AGREGADO

// Función para generar JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'tu_jwt_secret_aqui', 
    { expiresIn: '30d' }
  );
};

// Ruta para login CON JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Intento de login:', { email });

    // Validar datos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    let passwordMatch = false;
    
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      passwordMatch = password === user.password;
    }

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    // GENERAR TOKEN JWT
    const token = generateToken(user._id);

    console.log('✅ Login exitoso para:', user.name);

    // Actualizar último login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    res.json({
      success: true,
      message: 'Login exitoso',
      token, // AGREGAR TOKEN A LA RESPUESTA
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta para verificar si un email existe
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('📧 Verificando email:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es obligatorio'
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No existe una cuenta con este email'
      });
    }

    res.json({
      success: true,
      message: 'Email encontrado',
      userExists: true,
      userName: user.name
    });

  } catch (error) {
    console.error('❌ Error al verificar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para reset de password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    console.log('🔄 Reset de password para:', email);

    // Validaciones
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No existe una cuenta con este email'
      });
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      'security.lastPasswordReset': new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Password actualizado para:', user.name);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.'
    });

  } catch (error) {
    console.error('❌ Error al reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta para registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    console.log('📝 Intento de registro:', { name, email });

    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Hashear contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    // Generar token
    const token = generateToken(newUser._id);

    console.log('✅ Usuario registrado:', newUser.name);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;