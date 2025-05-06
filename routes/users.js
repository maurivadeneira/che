const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// @route   POST api/users
// @desc    Registrar un usuario
// @access  Public
router.post("/", userController.registerUser);

// @route   POST api/users/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post("/login", userController.loginUser);

// @route   GET api/users/me
// @desc    Obtener usuario actual
// @access  Private
router.get("/me", auth, userController.getCurrentUser);

module.exports = router;
