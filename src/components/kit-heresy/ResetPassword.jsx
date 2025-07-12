import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: verificar email, 2: cambiar password
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar mensajes al escribir
    if (error) setError('');
    if (message) setMessage('');
  };

  // Paso 1: Verificar email
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
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
          email: formData.email
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

  // Paso 2: Cambiar password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.newPassword.length < 6) {
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
          email: formData.email,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        // Limpiar formulario
        setFormData({
          email: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Opcional: redirigir al login después de unos segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
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

  // Volver al paso 1
  const handleBackToStep1 = () => {
    setStep(1);
    setUserInfo(null);
    setMessage('');
    setError('');
    setFormData(prev => ({
      ...prev,
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-header">
          <h2>
            {step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
          </h2>
          <p className="reset-subtitle">
            {step === 1 
              ? 'Ingresa tu email para verificar tu cuenta'
              : `Hola ${userInfo?.name}, crea tu nueva contraseña`
            }
          </p>
        </div>

        {/* Mostrar mensajes */}
        {message && (
          <div className="message success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {/* Paso 1: Verificar Email */}
        {step === 1 && (
          <form onSubmit={handleCheckEmail} className="reset-form">
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

            <button 
              type="submit" 
              className="reset-button"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Verificar Email'}
            </button>
          </form>
        )}

        {/* Paso 2: Nueva Contraseña */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="reset-form">
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
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
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                disabled={loading}
                required
              />
            </div>

            <div className="reset-buttons">
              <button 
                type="button" 
                className="back-button"
                onClick={handleBackToStep1}
                disabled={loading}
              >
                ← Volver
              </button>
              
              <button 
                type="submit" 
                className="reset-button"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>
        )}

        {/* Links de navegación */}
        <div className="reset-links">
          <Link to="/login" className="link">
            ← Volver al Login
          </Link>
          <Link to="/register" className="link">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;