const Invitation = require("../models/Invitation");
const Kit = require("../models/Kit");
const crypto = require("crypto");

// Crear una nueva invitación
exports.createInvitation = async (req, res) => {
  try {
    const { fromKit, email } = req.body;

    // Verificar si el kit existe
    const kit = await Kit.findById(fromKit);
    if (!kit) {
      return res.status(400).json({ msg: "Kit no encontrado" });
    }

    // Verificar si el kit está activo
    if (!kit.active) {
      return res.status(400).json({ msg: "El kit debe estar activo para enviar invitaciones" });
    }

    // Generar código único para la invitación
    const code = crypto.randomBytes(10).toString("hex");

    // Crear fecha de expiración (30 días desde ahora)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Crear nueva invitación
    const invitation = new Invitation({
      fromKit,
      code,
      email,
      expiresAt
    });

    // Guardar invitación en la base de datos
    await invitation.save();

    res.status(201).json(invitation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Verificar una invitación por código
exports.verifyInvitation = async (req, res) => {
  try {
    const { code } = req.params;

    // Buscar la invitación por código
    const invitation = await Invitation.findOne({ code }).populate({
      path: "fromKit",
      populate: { path: "owner", select: "name email" }
    });

    if (!invitation) {
      return res.status(404).json({ msg: "Invitación no encontrada" });
    }

    // Verificar si la invitación ha expirado
    if (invitation.status === "expired" || new Date() > invitation.expiresAt) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(400).json({ msg: "La invitación ha expirado" });
    }

    // Verificar si la invitación ya fue aceptada
    if (invitation.status === "accepted") {
      return res.status(400).json({ msg: "La invitación ya ha sido aceptada" });
    }

    res.json(invitation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Aceptar una invitación
exports.acceptInvitation = async (req, res) => {
  try {
    const { code } = req.params;
    const { userId } = req.body;

    // Buscar la invitación por código
    const invitation = await Invitation.findOne({ code });

    if (!invitation) {
      return res.status(404).json({ msg: "Invitación no encontrada" });
    }

    // Verificar si la invitación ha expirado
    if (invitation.status === "expired" || new Date() > invitation.expiresAt) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(400).json({ msg: "La invitación ha expirado" });
    }

    // Verificar si la invitación ya fue aceptada
    if (invitation.status === "accepted") {
      return res.status(400).json({ msg: "La invitación ya ha sido aceptada" });
    }

    // Actualizar la invitación
    invitation.status = "accepted";
    invitation.acceptedAt = new Date();
    await invitation.save();

    res.json(invitation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};
