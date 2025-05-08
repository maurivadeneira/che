// adminController.js
const Kit = require('../models/Kit');
const { generatePDF } = require('./pdfController');

// Obtener todos los kits para administración
exports.getAllKits = async (req, res) => {
  try {
    const kits = await Kit.find().sort({ createdAt: -1 });
    res.json({ success: true, kits });
  } catch (error) {
    console.error('Error al obtener kits:', error);
    res.status(500).json({ success: false, message: 'Error al obtener kits', error: error.message });
  }
};

// Crear un nuevo kit
exports.createKit = async (req, res) => {
  try {
    const kitData = req.body;
    
    // Validar datos mínimos
    if (!kitData.clientName || !kitData.clientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Datos del cliente incompletos'
      });
    }
    
    // Primero generar el PDF
    const pdfResult = await generatePDF(req, res);
    
    // Si la generación del PDF fue exitosa y no se envió respuesta ya
    if (pdfResult && pdfResult.success && !res.headersSent) {
      // Crear un nuevo kit en la base de datos
      const newKit = new Kit({
        clientName: kitData.clientName,
        clientEmail: kitData.clientEmail,
        clientPhone: kitData.clientPhone,
        paymentInfo: kitData.paymentInfo,
        donationRecipient: kitData.donationRecipient,
        isInitialKit: kitData.isInitialKit || false,
        corporationDonation: kitData.corporationDonation || 20,
        referrerDonation: kitData.referrerDonation || 7,
        kitValidityDays: kitData.kitValidityDays || 365,
        isTestVersion: kitData.isTestVersion || false,
        pdfUrl: pdfResult.pdfUrl,
        createdAt: new Date()
      });
      
      const savedKit = await newKit.save();
      
      return res.json({
        success: true,
        message: 'Kit creado exitosamente',
        kit: savedKit,
        pdfUrl: pdfResult.pdfUrl
      });
    }
  } catch (error) {
    console.error('Error al crear kit:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al crear kit', 
        error: error.message 
      });
    }
  }
};

// Actualizar un kit existente
exports.updateKit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedKit = await Kit.findByIdAndUpdate(
      id, 
      updateData,
      { new: true }
    );
    
    if (!updatedKit) {
      return res.status(404).json({
        success: false,
        message: 'Kit no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Kit actualizado exitosamente',
      kit: updatedKit
    });
    
  } catch (error) {
    console.error('Error al actualizar kit:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar kit',
      error: error.message
    });
  }
};

// Eliminar un kit
exports.deleteKit = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedKit = await Kit.findByIdAndDelete(id);
    
    if (!deletedKit) {
      return res.status(404).json({
        success: false,
        message: 'Kit no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Kit eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar kit:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar kit',
      error: error.message
    });
  }
};

module.exports = exports;