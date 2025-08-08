const express = require("express");
const router = express.Router();
const kitController = require("../controllers/kitController");
const auth = require("../middleware/auth");

// @route   POST api/kits
// @desc    Crear un nuevo kit
// @access  Private
router.post("/", auth, kitController.createKit);

// @route   GET api/kits/:id
// @desc    Obtener un kit por ID
// @access  Private
router.get("/:id", auth, kitController.getKitById);

// @route   GET api/kits/owner/:userId
// @desc    Obtener kits por propietario
// @access  Private
router.get("/owner/:userId", auth, kitController.getKitsByOwner);

// @route   PUT api/kits/activate/:id
// @desc    Activar un kit
// @access  Private
router.put("/activate/:id", auth, kitController.activateKit);

module.exports = router;
