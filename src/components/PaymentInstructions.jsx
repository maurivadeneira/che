import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { formatCurrency } from '../utils/currencyFormatter';
import axios from 'axios';

const PaymentInstructions = ({ 
  paymentData, 
  onPaymentComplete, 
  onError 
}) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // Cambiar esta constante por la URL base de tu API
  const API_BASE_URL = '/api';

  useEffect(() => {
    // Si hay montos sugeridos, seleccionar el segundo por defecto
    if (paymentData?.suggestedAmounts && paymentData.suggestedAmounts.length > 1) {
      setSelectedAmount(paymentData.suggestedAmounts[1]);
    }
  }, [paymentData]);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const toggleQRCode = () => {
    setShowQRCode((prev) => !prev);
  };

  const getDisplayAmount = () => {
    if (selectedAmount) {
      return selectedAmount.formatted;
    } else if (customAmount) {
      // Aquí deberías aplicar la lógica de formateo según la moneda
      return `${customAmount} ${paymentData.currency}`;
    }
    return null;
  };

  const handleCreateTransaction = async () => {
    try {
      // Verificar que hay un monto seleccionado
      if (!selectedAmount && !customAmount) {
        throw new Error('Por favor selecciona un monto para la donación');
      }

      const amount = selectedAmount ? selectedAmount.value : parseFloat(customAmount);
      
      // Verificar que el monto es válido
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Por favor ingresa un monto válido');
      }

      // Crear la transacción
      const response = await axios.post(`${API_BASE_URL}/transactions`, {
        recipientId: paymentData.userId,
        amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
      });

      setTransactionData(response.data.data);
    } catch (error) {
      if (onError) {
        onError(error.response?.data?.message || error.message);
      }
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile || !transactionData) {
      if (onError) {
        onError('Por favor selecciona un archivo de comprobante');
      }
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('receipt', receiptFile);

      await axios.post(
        `${API_BASE_URL}/transactions/${transactionData.transactionId}/receipt`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Notificar que el proceso se ha completado
      if (onPaymentComplete) {
        onPaymentComplete(transactionData.transactionId);
      }
    } catch (error) {
      if (onError) {
        onError(error.response?.data?.message || error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Hola, aquí están mis instrucciones de pago para la donación: \n\n`;
    const instructionsText = paymentData.instructions.join('\n');
    const amountText = getDisplayAmount() ? `Monto sugerido: ${getDisplayAmount()}` : '';
    
    const fullMessage = `${message}${instructionsText}\n\n${amountText}`;
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(fullMessage);
    
    // Abrir WhatsApp
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const renderQrCodeIfNeeded = () => {
    if (!paymentData.qrCodeData || !showQRCode) {
      return null;
    }

    return (
      <div className="qr-code-container">
        <QRCode value={paymentData.qrCodeData} size={128} />
        <p className="qr-code-note">Escanea este código con tu aplicación de wallet</p>
      </div>
    );
  };

  if (!paymentData) {
    return <div className="loading">Cargando instrucciones de pago...</div>;
  }

  return (
    <div className="payment-instructions">
      <h2>Instrucciones de Pago</h2>
      
      <div className="payment-method-info">
        <p>
          <strong>Método:</strong> {
            {
              'bank': 'Transferencia Bancaria',
              'paypal': 'PayPal',
              'crypto': 'Criptomoneda',
              'other': 'Otro método'
            }[paymentData.paymentMethod]
          }
        </p>
        <p><strong>Moneda:</strong> {paymentData.currency}</p>
      </div>
      
      <div className="suggested-amounts">
        <h3>Montos sugeridos</h3>
        <div className="amount-buttons">
          {paymentData.suggestedAmounts.map((amount, index) => (
            <button
              key={index}
              className={`amount-button ${selectedAmount === amount ? 'selected' : ''}`}
              onClick={() => handleAmountSelect(amount)}
            >
              {amount.formatted}
            </button>
          ))}
          <div className="custom-amount">
            <input
              type="number"
              placeholder="Monto personalizado"
              value={customAmount}
              onChange={handleCustomAmountChange}
              min="0"
              step="any"
            />
            <span className="currency-symbol">{paymentData.currency}</span>
          </div>
        </div>
      </div>
      
      <div className="instructions-container">
        <h3>Cómo realizar el pago</h3>
        <ul className="instructions-list">
          {paymentData.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
        
        {paymentData.qrCodeData && (
          <button 
            className="toggle-qr-button" 
            onClick={toggleQRCode}
          >
            {showQRCode ? 'Ocultar código QR' : 'Mostrar código QR'}
          </button>
        )}
        
        {renderQrCodeIfNeeded()}
        
        <div className="share-options">
          <button className="share-whatsapp" onClick={shareViaWhatsApp}>
            Compartir por WhatsApp
          </button>
        </div>
      </div>
      
      {!transactionData ? (
        <div className="create-transaction">
          <p className="donation-note">
            Por favor, recuerda que tu donación es de libre asignación por parte de la Corporación para sus actividades educativas y de investigación.
          </p>
          <button 
            className="create-transaction-button"
            onClick={handleCreateTransaction}
            disabled={!selectedAmount && !customAmount}
          >
            Confirmar Donación {getDisplayAmount() ? `de ${getDisplayAmount()}` : ''}
          </button>
        </div>
      ) : (
        <div className="upload-receipt">
          <h3>Subir comprobante de pago</h3>
          <p>Por favor sube un comprobante de tu donación:</p>
          
          <input
            type="file"
            id="receipt"
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
          
          <button
            className="upload-button"
            onClick={handleUploadReceipt}
            disabled={!receiptFile || isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Subir Comprobante'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentInstructions;