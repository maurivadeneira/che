const Kit = require("../models/Kit");
const User = require("../models/User");
const crypto = require("crypto");

// Crear un nuevo kit
exports.createKit = async (req, res) => {
  try {
    const { owner, type, level, parentKit, maxInvitations } = req.body;

    // Verificar si el usuario existe
    const userExists = await User.findById(owner);
    if (!userExists) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    // Generar código de invitación único
    const invitationCode = crypto.randomBytes(8).toString("hex");

    // Crear nuevo kit
    const kit = new Kit({
      owner,
      type,
      level,
      parentKit,
      invitationCode,
      maxInvitations: maxInvitations || 6,
      active: false
    });

    // Guardar kit en la base de datos
    await kit.save();

    res.status(201).json(kit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Obtener un kit por su ID
exports.getKitById = async (req, res) => {
  try {
    const kit = await Kit.findById(req.params.id).populate("owner", "name email");
    
    if (!kit) {
      return res.status(404).json({ msg: "Kit no encontrado" });
    }

    res.json(kit);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Kit no encontrado" });
    }
    res.status(500).send("Error del servidor");
  }
};

// Obtener kits por propietario
exports.getKitsByOwner = async (req, res) => {
  try {
    const kits = await Kit.find({ owner: req.params.userId });
    res.json(kits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Activar un kit
exports.activateKit = async (req, res) => {
  try {
    const kit = await Kit.findById(req.params.id);
    
    if (!kit) {
      return res.status(404).json({ msg: "Kit no encontrado" });
    }

    // Verificar si el usuario es el propietario del kit
    if (kit.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    kit.active = true;
    await kit.save();

    res.json(kit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};
