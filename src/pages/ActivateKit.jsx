import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ActivateKit.css";

const ActivateKit = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invitationData, setInvitationData] = useState(null);
  
  // Estados para datos de usuario
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bankInfo: {
      bank: "",
      accountType: "",
      accountNumber: ""
    }
  });

  // Estados para datos de donación
  const [donationForm, setDonationForm] = useState({
    corporationProof: null,
    referrerProof: null
  });

  // Verificar código de invitación al cargar el componente
  useEffect(() => {
    const verifyInvitation = async () => {
      try {
        const res = await axios.get(`/api/invitations/verify/${code}`);
        setInvitationData(res.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.msg || "Código de invitación inválido o expirado");
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      verifyInvitation();
    } else {
      setLoading(false);
      setError("No se proporcionó código de invitación");
    }
  }, [code]);

  // Manejar cambios en el formulario de usuario
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUserForm({
        ...userForm,
        [parent]: {
          ...userForm[parent],
          [child]: value
        }
      });
    } else {
      setUserForm({
        ...userForm,
        [name]: value
      });
    }
  };

  // Manejar cambios en el formulario de donación
  const handleDonationFormChange = (e) => {
    const { name, files } = e.target;
    setDonationForm({
      ...donationForm,
      [name]: files[0]
    });
  };

  // Registrar usuario
  const registerUser = async () => {
    // Validación básica
    if (userForm.password !== userForm.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const userData = {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        phone: userForm.phone,
        bankAccount: userForm.bankInfo
      };
      
      const res = await axios.post("/api/users", userData);
      
      // Guardar token en localStorage
      localStorage.setItem("token", res.data.token);
      
      // Avanzar al siguiente paso
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Enviar comprobantes de donación
  const submitDonationProofs = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append("corporationProof", donationForm.corporationProof);
      formData.append("referrerProof", donationForm.referrerProof);
      formData.append("invitationCode", code);
      
      // Configurar headers para enviar token
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": localStorage.getItem("token")
        }
      };
      
      const res = await axios.post("/api/donations", formData, config);
      
      // Activación completada
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.msg || "Error al enviar comprobantes");
    } finally {
      setLoading(false);
    }
  };

  // Si está cargando, mostrar spinner
  if (loading && step === 1) {
    return (
      <div className="activate-loading">
        <div className="spinner"></div>
        <p>Verificando código de invitación...</p>
      </div>
    );
  }

  // Si hay error y no hay datos de invitación, mostrar error
  if (error && !invitationData && step === 1) {
    return (
      <div className="activate-error-container">
        <div className="activate-error-icon">!</div>
        <h2>Error de Invitación</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate("/")} 
          className="btn-primary"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Renderizar el paso actual
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="activate-step registration-step">
            <h2>Registro de Usuario</h2>
            <p>Completa tus datos para activar tu Kit2:</p>
            
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="name"
                value={userForm.name}
                onChange={handleUserFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={userForm.confirmPassword}
                onChange={handleUserFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="phone"
                value={userForm.phone}
                onChange={handleUserFormChange}
              />
            </div>
            
            <h3>Información Bancaria</h3>
            <p>Necesaria para recibir donaciones:</p>
            
            <div className="form-group">
              <label>Banco</label>
              <input
                type="text"
                name="bankInfo.bank"
                value={userForm.bankInfo.bank}
                onChange={handleUserFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tipo de Cuenta</label>
              <select
                name="bankInfo.accountType"
                value={userForm.bankInfo.accountType}
                onChange={handleUserFormChange}
                required
              >
                <option value="">Selecciona...</option>
                <option value="ahorro">Ahorro</option>
                <option value="corriente">Corriente</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Número de Cuenta</label>
              <input
                type="text"
                name="bankInfo.accountNumber"
                value={userForm.bankInfo.accountNumber}
                onChange={handleUserFormChange}
                required
              />
            </div>
            
            <button 
              className="btn-primary" 
              onClick={registerUser}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Continuar"}
            </button>
          </div>
        );
        
      case 2:
        return (
          <div className="activate-step donation-step">
            <h2>Donaciones para Activar Kit</h2>
            
            {invitationData && (
              <div className="donation-info">
                <h3>Información de Donaciones</h3>
                
                <div className="donation-card corporation">
                  <h4>Donación a la Corporación</h4>
                  <p>Monto: ${invitationData.corporationDonation || "20"}</p>
                  <p>Datos de la cuenta:</p>
                  <ul>
                    <li>Banco: Bancolombia</li>
                    <li>Tipo: Cuenta Corriente</li>
                    <li>Número: 123-456-789</li>
                    <li>Titular: Corporación Herejía Económica</li>
                  </ul>
                  
                  <div className="form-group">
                    <label>Comprobante de Pago</label>
                    <input
                      type="file"
                      name="corporationProof"
                      onChange={handleDonationFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="donation-card referrer">
                  <h4>Donación al Referente</h4>
                  <p>Monto: ${invitationData.referrerDonation || "7"}</p>
                  <p>Datos de la cuenta:</p>
                  <ul>
                    <li>Banco: {invitationData.referrerBank || "Banco de ejemplo"}</li>
                    <li>Tipo: {invitationData.referrerAccountType || "Cuenta Ahorro"}</li>
                    <li>Número: {invitationData.referrerAccountNumber || "987-654-321"}</li>
                    <li>Titular: {invitationData.referrerName || "Nombre del Referente"}</li>
                  </ul>
                  
                  <div className="form-group">
                    <label>Comprobante de Pago</label>
                    <input
                      type="file"
                      name="referrerProof"
                      onChange={handleDonationFormChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            <button 
              className="btn-primary" 
              onClick={submitDonationProofs}
              disabled={loading || !donationForm.corporationProof || !donationForm.referrerProof}
            >
              {loading ? "Enviando..." : "Activar Kit"}
            </button>
          </div>
        );
        
      case 3:
        return (
          <div className="activate-step success-step">
            <div className="success-icon">✓</div>
            <h2>¡Kit Activado Exitosamente!</h2>
            <p>Tu Kit2 de la Herejía Económica ha sido activado.</p>
            <p>Ya puedes acceder a todos los materiales y comenzar a invitar a otros.</p>
            
            <button 
              onClick={() => navigate("/dashboard")} 
              className="btn-primary"
            >
              Ir al Dashboard
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Renderizar mensaje de error
  const renderError = () => {
    if (!error || (!invitationData && step === 1)) return null;
    
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => setError("")}>×</button>
      </div>
    );
  };

  return (
    <div className="activate-container">
      <div className="activate-header">
        <h1>Kit2 de la Herejía Económica</h1>
        <p>Proceso de Activación</p>
      </div>
      
      {renderError()}
      
      <div className="activate-content">
        <div className="steps-indicator">
          <div className={`step-item ${step >= 1 ? "active" : ""}`}>1. Registro</div>
          <div className={`step-item ${step >= 2 ? "active" : ""}`}>2. Donaciones</div>
          <div className={`step-item ${step >= 3 ? "active" : ""}`}>3. Activación</div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default ActivateKit;
