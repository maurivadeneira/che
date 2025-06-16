import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { email, password } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar error al escribir
    if (error) setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ CORREGIDO: Usar la ruta de auth que acabamos de crear
      const res = await axios.post("/api/auth/login", formData);
      
      if (res.data.success) {
        // Guardar información del usuario (sin token por ahora)
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // ✅ REDIRIGIR: Al dashboard o página principal
        navigate("/mi-cuenta");
        
        console.log("✅ Login exitoso:", res.data.user.name);
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

  return (
    <div className="auth-container">
      <div className="auth-card">
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
              value={email}
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
              value={password}
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
          {/* ✅ CORREGIDO: Link al reset que acabamos de crear */}
          <Link to="/reset-password" className="forgot-password-link">
            ¿Olvidaste tu contraseña?
          </Link>
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;