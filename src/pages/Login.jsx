import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [step, setStep] = useState(1); // Para reset: 1=email, 2=password
  
  // Estados para login
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  // Estados para reset
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Handle changes para login
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Handle changes para reset
  const handleResetChange = e => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
    if (error) setError("");
    if (message) setMessage("");
  };

  // Login submit - CORREGIDO
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", formData);
      
      console.log('📥 Respuesta del servidor:', res.data);

      if (res.data.success) {
        // CORREGIDO: Guardar TANTO el token COMO el usuario
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        console.log('✅ Login exitoso:', res.data.user.name);
        console.log('🔑 Token guardado:', res.data.token ? 'SÍ' : 'NO');
        
        navigate("/mi-cuenta");
      } else {
        setError(res.data.message || "Error al iniciar sesión");
      }
      
    } catch (err) {
      console.error("❌ Error en login:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Email o contraseña incorrectos");
      } else if (err.response?.status === 500) {
        setError("Error del servidor. Inténtalo más tarde.");
      } else {
        setError("Error de conexión. Verifica tu internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset: Verificar email
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    
    if (!resetData.email) {
      setError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetData.email
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo({ name: data.userName });
        setStep(2);
        setMessage(`Perfecto, ${data.userName}. Ahora puedes crear una nueva contraseña.`);
      } else {
        setError(data.message || 'Email no encontrado');
      }
    } catch (error) {
      console.error('Error al verificar email:', error);
      setError('Error de conexión. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  // Reset: Cambiar password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!resetData.newPassword || !resetData.confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (resetData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetData.email,
          newPassword: resetData.newPassword,
          confirmPassword: resetData.confirmPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setTimeout(() => {
          // Volver a login
          setShowReset(false);
          setStep(1);
          setResetData({ email: "", newPassword: "", confirmPassword: "" });
          setMessage("");
          setUserInfo(null);
        }, 2000);
      } else {
        setError(data.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar password:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar reset
  const showResetForm = () => {
    setShowReset(true);
    setError("");
    setMessage("");
    setStep(1);
  };

  // Volver a login
  const backToLogin = () => {
    setShowReset(false);
    setStep(1);
    setError("");
    setMessage("");
    setResetData({ email: "", newPassword: "", confirmPassword: "" });
    setUserInfo(null);
  };

  // Volver al paso 1 del reset
  const backToStep1 = () => {
    setStep(1);
    setUserInfo(null);
    setMessage('');
    setError('');
    setResetData(prev => ({
      ...prev,
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* LOGIN FORM */}
        {!showReset && (
          <>
            <h2>Iniciar Sesión</h2>
            <p className="auth-subtitle">Accede a tu cuenta de Kit2 Herejía Económica</p>
            
            {error && (
              <div className="auth-error">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary auth-button"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>

            <div className="auth-links">
              <button 
                type="button"
                onClick={showResetForm}
                className="forgot-password-link"
                style={{background: 'none', border: 'none', cursor: 'pointer'}}
              >
                ¿Olvidaste tu contraseña?
              </button>
              <p>
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
              </p>
            </div>
          </>
        )}

        {/* RESET FORM */}
        {showReset && (
          <>
            <h2>
              {step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
            </h2>
            <p className="auth-subtitle">
              {step === 1 
                ? 'Ingresa tu email para verificar tu cuenta'
                : `Hola ${userInfo?.name}, crea tu nueva contraseña`
              }
            </p>

            {/* Mostrar mensajes */}
            {message && (
              <div className="message success-message" style={{
                backgroundColor: '#f0fff4',
                color: '#38a169',
                border: '1px solid #9ae6b4',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            {error && (
              <div className="auth-error">
                <p>{error}</p>
              </div>
            )}

            {/* Paso 1: Verificar Email */}
            {step === 1 && (
              <form onSubmit={handleCheckEmail} className="auth-form">
                <div className="form-group">
                  <label htmlFor="resetEmail">Email</label>
                  <input
                    type="email"
                    id="resetEmail"
                    name="email"
                    value={resetData.email}
                    onChange={handleResetChange}
                    placeholder="tu@email.com"
                    disabled={loading}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary auth-button"
                  disabled={loading}
                >
                  {loading ? 'Verificando...' : 'Verificar Email'}
                </button>
              </form>
            )}

            {/* Paso 2: Nueva Contraseña */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={resetData.newPassword}
                    onChange={handleResetChange}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={resetData.confirmPassword}
                    onChange={handleResetChange}
                    placeholder="Repite la contraseña"
                    disabled={loading}
                    required
                  />
                </div>

                <div style={{display: 'flex', gap: '12px', marginTop: '10px'}}>
                  <button 
                    type="button" 
                    onClick={backToStep1}
                    disabled={loading}
                    style={{
                      flex: 1,
                      background: '#f7fafc',
                      color: '#4a5568',
                      border: '2px solid #e2e8f0',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ← Volver
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn-primary auth-button"
                    disabled={loading}
                    style={{flex: 2, margin: 0}}
                  >
                    {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </form>
            )}

            {/* Link volver al login */}
            <div className="auth-links">
              <button 
                type="button"
                onClick={backToLogin}
                className="forgot-password-link"
                style={{background: 'none', border: 'none', cursor: 'pointer'}}
              >
                ← Volver al Login
              </button>
              <p>
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;