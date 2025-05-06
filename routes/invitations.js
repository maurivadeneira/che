const express = require("express");
const router = express.Router();
const invitationController = require("../controllers/invitationController");
const auth = require("../middleware/auth");

// @route   POST api/invitations
// @desc    Crear una nueva invitación
// @access  Private
router.post("/", auth, invitationController.createInvitation);

// @route   GET api/invitations/verify/:code
// @desc    Verificar una invitación por código
// @access  Public
router.get("/verify/:code", invitationController.verifyInvitation);

// @route   PUT api/invitations/accept/:code
// @desc    Aceptar una invitación
// @access  Private
router.put("/accept/:code", auth, invitationController.acceptInvitation);

module.exports = router;
