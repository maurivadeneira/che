const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Controladores
const paymentController = require('../controllers/paymentController');
const kitController = require('../controllers/kitController');
const invitationController = require('../controllers/invitationController');

// Middlewares
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Configuración de almacenamiento para comprobantes de pago
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../public/uploads/receipts');
    
    // Crear directorio si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (ext && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif) o PDF'));
    }
  }
});

// Rutas para pagos y donaciones
router.post('/payment-preferences', authMiddleware, paymentController.savePaymentPreferences);
router.get('/exchange-rates', paymentController.getExchangeRates);
router.post('/transactions', authMiddleware, paymentController.createTransaction);
router.post('/transactions/:transactionId/receipt', authMiddleware, upload.single('receipt'), paymentController.uploadReceipt);
router.post('/transactions/:transactionId/verify', authMiddleware, adminMiddleware, paymentController.verifyTransaction);
router.get('/payment-instructions/:userId', paymentController.getPaymentInstructions);

// Rutas para el Kit
router.get('/kit/:kitId', kitController.getKitById);
router.get('/user/:userId/kit', kitController.getKitByUser);
router.post('/activate-kit', authMiddleware, kitController.activateKit);

// Rutas para invitaciones
router.post('/invitations', authMiddleware, invitationController.createInvitation);
router.get('/invitations/:invitationId', invitationController.getInvitationById);
router.post('/invitations/:invitationId/accept', authMiddleware, invitationController.acceptInvitation);

module.exports = router;