// routes/auth.js - Sistema de autenticación y reset de password
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Ruta para login (si no existe ya)
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

    // Verificar contraseña (asumiendo que algunas pueden no estar hasheadas)
    let passwordMatch = false;
    
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      // Contraseña hasheada con bcrypt
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Contraseña en texto plano (temporales)
      passwordMatch = password === user.password;
    }

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    console.log('✅ Login exitoso para:', user.name);

    res.json({
      success: true,
      message: 'Login exitoso',
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

// Ruta para cambiar password (cuando el usuario está logueado)
router.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;

    console.log('🔐 Cambio de password para:', email);

    // Validaciones
    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas nuevas no coinciden'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    let currentPasswordMatch = false;
    
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      currentPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    } else {
      currentPasswordMatch = currentPassword === user.password;
    }

    if (!currentPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      updatedAt: new Date()
    });

    console.log('✅ Password cambiado para:', user.name);

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al cambiar password:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;