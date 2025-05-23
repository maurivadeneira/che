const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// ===== RUTAS PÚBLICAS =====

// @route   POST api/users
// @desc    Registrar un usuario
// @access  Public
router.post("/", userController.registerUser);

// @route   POST api/users/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post("/login", userController.loginUser);

// ===== RUTAS PROTEGIDAS (requieren autenticación) =====

// @route   GET api/users/me
// @desc    Obtener usuario actual
// @access  Private
router.get("/me", auth, userController.getCurrentUser);

// @route   GET api/users/dashboard
// @desc    Obtener dashboard completo del usuario
// @access  Private
router.get("/dashboard", auth, userController.getUserDashboard);

// @route   PUT api/users/profile
// @desc    Actualizar información personal del usuario
// @access  Private
router.put("/profile", auth, userController.updateUserProfile);

// @route   PUT api/users/bank-account
// @desc    Actualizar información bancaria
// @access  Private
router.put("/bank-account", auth, userController.updateBankAccount);

// @route   POST api/users/digital-payment
// @desc    Agregar método de pago digital (PayPal, Nequi, etc.)
// @access  Private
router.post("/digital-payment", auth, userController.addDigitalPayment);

// @route   GET api/users/kits
// @desc    Obtener historial de kits del usuario
// @access  Private
router.get("/kits", auth, userController.getUserKits);

// @route   GET api/users/donations
// @desc    Obtener historial de donaciones del usuario
// @access  Private
router.get("/donations", auth, userController.getUserDonations);

// @route   PUT api/users/change-password
// @desc    Cambiar contraseña del usuario
// @access  Private
router.put("/change-password", auth, userController.changePassword);

// @route   GET api/users/payment-methods
// @desc    Obtener todos los métodos de pago del usuario
// @access  Private
router.get("/payment-methods", auth, userController.getPaymentMethods);

module.exports = router;