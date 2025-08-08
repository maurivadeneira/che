// Archivo: src/components/PaymentConfirmation.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentConfirmation.css';

const PaymentConfirmation = ({ paymentData, kit, user, onComplete }) => {
  const [corporationPaymentProof, setCorporationPaymentProof] = useState(null);
  const [referrerPaymentProof, setReferrerPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState({
    corporation: null,
    referrer: null
  });
  
  // Obtener métodos de pago disponibles
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        // Obtener métodos de pago de la corporación
        const corpResponse = await axios.get('/api/payment-methods/corporation');
        
        // Obtener métodos de pago del referente
        const refResponse = await axios.get(`/api/payment-methods/${kit.beneficiaryId}`);
        
        if (corpResponse.data.success && refResponse.data.success) {
          setPaymentMethods({
            corporation: corpResponse.data.data,
            referrer: refResponse.data.data
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Error al cargar métodos de pago');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchPaymentMethods();
  }, [kit.beneficiaryId]);
  
  // Manejar subida de comprobantes
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Formato de archivo no soportado. Use JPG, PNG, GIF o PDF.');
      return;
    }
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB');
      return;
    }
    
    if (type === 'corporation') {
      setCorporationPaymentProof(file);
    } else {
      setReferrerPaymentProof(file);
    }
  };
  
  // Enviar comprobantes
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!corporationPaymentProof || !referrerPaymentProof) {
      setError('Debe subir ambos comprobantes de pago');
      return;
    }
    
    try {
      setLoading(true);
      
      // Subir comprobantes
      const formData = new FormData();
      formData.append('corporationProof', corporationPaymentProof);
      formData.append('referrerProof', referrerPaymentProof);
      formData.append('kitId', kit._id);
      formData.append('userId', user._id);
      formData.append('currency', paymentData.payment.currency);
      
      const response = await axios.post('/api/payment/confirm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        onComplete();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error al enviar comprobantes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar métodos de pago según moneda y tipo seleccionados
  const filterPaymentMethods = (methods, type) => {
    if (!methods) return [];
    
    const currency = paymentData.payment.currency;
    const paymentMethod = paymentData.payment.paymentMethod;
    
    return methods.filter(method => {
      // Si es método de cripto, mostrar solo direcciones de la misma cripto
      if (['BTC', 'USDT', 'USDC'].includes(currency)) {
        return method.type === 'crypto' && method.cryptoCurrency === currency;
      }
      
      // Para métodos fiduciarios, filtrar por tipo
      if (paymentMethod === 'bank_transfer') {
        return method.type === 'bank_account';
      } else if (paymentMethod === 'paypal') {
        return method.type === 'paypal';
      } else if (paymentMethod === 'credit_card') {
        return method.type === 'card_payment';
      } else if (paymentMethod === 'cash') {
        return method.type === 'cash';
      } else {
        return true; // Mostrar todos para otros métodos
      }
    });
  };
  
  if (loading && (!paymentMethods.corporation || !paymentMethods.referrer)) {
    return <div className="loading">Cargando métodos de pago...</div>;
  }
  
  const corporationMethods = filterPaymentMethods(paymentMethods.corporation, 'corporation');
  const referrerMethods = filterPaymentMethods(paymentMethods.referrer, 'referrer');
  
  return (
    <div className="payment-confirmation">
      <h2>Realizar Donaciones</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="donation-info">
        <div className="donation-card">
          <h3>Donación a la Corporación</h3>
          <p className="donation-amount">{paymentData.corporationDonation}</p>
          
          <div className="payment-methods-list">
            <h4>Métodos de Pago Disponibles:</h4>
            {corporationMethods.length > 0 ? (
              corporationMethods.map((method, index) => (
                <div key={index} className="payment-method-item">
                  {method.type === 'bank_account' && (
                    <>
                      <p><strong>Banco:</strong> {method.bankName}</p>
                      <p><strong>Titular:</strong> {method.accountHolderName}</p>
                      <p><strong>Número de Cuenta:</strong> {method.accountNumber}</p>
                      <p><strong>Tipo de Cuenta:</strong> {method.accountType}</p>
                    </>
                  )}
                  
                  {method.type === 'paypal' && (
                    <p><strong>Email PayPal:</strong> {method.email}</p>
                  )}
                  
                  {method.type === 'crypto' && (
                    <>
                      <p><strong>Dirección {method.cryptoCurrency}:</strong> {method.address}</p>
                      {method.network && <p><strong>Red:</strong> {method.network}</p>}
                    </>
                  )}
                  
                  {method.type === 'card_payment' && (
                    <>
                      <p><strong>Plataforma de pago:</strong> {method.platform}</p>
                      <p><strong>Enlace de pago:</strong> <a href={method.paymentLink} target="_blank" rel="noopener noreferrer">{method.paymentLink}</a></p>
                    </>
                  )}
                  
                  {method.type === 'cash' && (
                    <p><strong>Instrucciones:</strong> {method.instructions}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-methods">No hay métodos de pago disponibles para la moneda y tipo seleccionados.</p>
            )}
          </div>
          
          <div className="proof-upload">
            <label>
              Comprobante de Pago:
              <input 
                type="file" 
                onChange={(e) => handleFileChange(e, 'corporation')} 
                accept=".jpg,.jpeg,.png,.gif,.pdf"
              />
            </label>
            {corporationPaymentProof && (
              <p className="file-selected">
                Archivo seleccionado: {corporationPaymentProof.name}
              </p>
            )}
          </div>
        </div>
        
        <div className="donation-card">
          <h3>Donación al Referente</h3>
          <p className="donation-amount">{paymentData.referrerDonation}</p>
          
          <div className="payment-methods-list">
            <h4>Métodos de Pago Disponibles:</h4>
            {referrerMethods.length > 0 ? (
              referrerMethods.map((method, index) => (
                <div key={index} className="payment-method-item">
                  {method.type === 'bank_account' && (
                    <>
                      <p><strong>Banco:</strong> {method.bankName}</p>
                      <p><strong>Titular:</strong> {method.accountHolderName}</p>
                      <p><strong>Número de Cuenta:</strong> {method.accountNumber}</p>
                      <p><strong>Tipo de Cuenta:</strong> {method.accountType}</p>
                    </>
                  )}
                  
                  {method.type === 'paypal' && (
                    <p><strong>Email PayPal:</strong> {method.email}</p>
                  )}
                  
                  {method.type === 'crypto' && (
                    <>
                      <p><strong>Dirección {method.cryptoCurrency}:</strong> {method.address}</p>
                      {method.network && <p><strong>Red:</strong> {method.network}</p>}
                    </>
                  )}
                  
                  {method.type === 'card_payment' && (
                    <>
                      <p><strong>Plataforma de pago:</strong> {method.platform}</p>
                      <p><strong>Enlace de pago:</strong> <a href={method.paymentLink} target="_blank" rel="noopener noreferrer">{method.paymentLink}</a></p>
                    </>
                  )}
                  
                  {method.type === 'cash' && (
                    <p><strong>Instrucciones:</strong> {method.instructions}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-methods">No hay métodos de pago disponibles para la moneda y tipo seleccionados.</p>
            )}
          </div>
          
          <div className="proof-upload">
            <label>
              Comprobante de Pago:
              <input 
                type="file" 
                onChange={(e) => handleFileChange(e, 'referrer')} 
                accept=".jpg,.jpeg,.png,.gif,.pdf"
              />
            </label>
            {referrerPaymentProof && (
              <p className="file-selected">
                Archivo seleccionado: {referrerPaymentProof.name}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="confirmation-actions">
        <button 
          onClick={handleSubmit} 
          className="submit-button" 
          disabled={loading || !corporationPaymentProof || !referrerPaymentProof}
        >
          {loading ? 'Enviando...' : 'Confirmar Donaciones'}
        </button>
      </div>
      
      <div className="payment-instructions">
        <h3>Instrucciones:</h3>
        <ol>
          <li>Realice las donaciones utilizando los métodos de pago mostrados arriba.</li>
          <li>Asegúrese de incluir el ID del Kit ({kit.kitId}) como referencia en sus pagos.</li>
          <li>Suba los comprobantes de ambas donaciones.</li>
          <li>Una vez verificados los pagos, recibirá su Kit2 activo en su correo electrónico.</li>
        </ol>
      </div>
    </div>
  );
};

export default PaymentConfirmation;