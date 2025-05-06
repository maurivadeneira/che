const User = require("../models/User");
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
