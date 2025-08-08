import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [kits, setKits] = useState([]);
  const [invitations, setInvitations] = useState([]);
  
  // Obtener datos del usuario y sus kits
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener token del almacenamiento local
        const token = localStorage.getItem("token");
        
        if (!token) {
          // Redireccionar a la página de login si no hay token
          window.location.href = "/login";
          return;
        }
        
        // Configurar headers con el token
        const config = {
          headers: {
            "x-auth-token": token
          }
        };
        
        // Obtener datos del usuario
        const userRes = await axios.get("/api/users/me", config);
        setUser(userRes.data);
        
        // Obtener kits del usuario
        const kitsRes = await axios.get(`/api/kits/owner/${userRes.data._id}`, config);
        setKits(kitsRes.data);
        
        // Obtener invitaciones relacionadas con los kits del usuario
        if (kitsRes.data.length > 0) {
          const invitationsPromises = kitsRes.data.map(kit => 
            axios.get(`/api/invitations/kit/${kit._id}`, config)
          );
          
          const invitationsRes = await Promise.all(invitationsPromises);
          const allInvitations = invitationsRes.flatMap(res => res.data);
          setInvitations(allInvitations);
        }
      } catch (err) {
        setError("Error al cargar datos. Por favor, inicia sesión nuevamente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Generar una nueva invitación
  const generateInvitation = async (kitId) => {
    try {
      // Configurar headers con el token
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token")
        }
      };
      
      // Crear invitación
      const res = await axios.post("/api/invitations", { fromKit: kitId }, config);
      
      // Actualizar la lista de invitaciones
      setInvitations([...invitations, res.data]);
    } catch (err) {
      setError(err.response?.data?.msg || "Error al generar invitación");
    }
  };

  // Copiar código de invitación al portapapeles
  const copyInvitationLink = (code) => {
    const invitationLink = `${window.location.origin}/activate/${code}`;
    navigator.clipboard.writeText(invitationLink);
    alert("¡Enlace de invitación copiado al portapapeles!");
  };

  // Renderizar estado de carga
  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Control</h1>
        {user && <p>Bienvenido, {user.name}</p>}
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}
      
      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>Información de Usuario</h2>
          
          {user && (
            <>
              <div className="info-item">
                <span className="label">Nombre:</span>
                <span className="value">{user.name}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Teléfono:</span>
                <span className="value">{user.phone || "No especificado"}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Rol:</span>
                <span className="value">{user.role}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="kits-section">
          <h2>Mis Kits</h2>
          
          {kits.length === 0 ? (
            <p className="empty-message">No tienes kits activos. Activa uno a través de una invitación.</p>
          ) : (
            <div className="kits-list">
              {kits.map(kit => (
                <div key={kit._id} className="kit-card">
                  <div className="kit-header">
                    <h3>{kit.type}</h3>
                    <span className={`kit-status ${kit.active ? "active" : "inactive"}`}>
                      {kit.active ? "Activo" : "Pendiente"}
                    </span>
                  </div>
                  
                  <div className="kit-details">
                    <div className="info-item">
                      <span className="label">Nivel:</span>
                      <span className="value">{kit.level}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="label">Código:</span>
                      <span className="value">{kit.invitationCode}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="label">Fecha de creación:</span>
                      <span className="value">{new Date(kit.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {kit.active && (
                    <div className="kit-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => generateInvitation(kit._id)}
                      >
                        Generar Invitación
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="invitations-section">
          <h2>Mis Invitaciones</h2>
          
          {invitations.length === 0 ? (
            <p className="empty-message">No has generado invitaciones aún.</p>
          ) : (
            <table className="invitations-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Fecha de creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map(invitation => (
                  <tr key={invitation._id}>
                    <td>{invitation.code}</td>
                    <td>{invitation.email || "No especificado"}</td>
                    <td>
                      <span className={`status-badge ${invitation.status}`}>
                        {invitation.status === "pending" && "Pendiente"}
                        {invitation.status === "sent" && "Enviada"}
                        {invitation.status === "accepted" && "Aceptada"}
                        {invitation.status === "expired" && "Expirada"}
                      </span>
                    </td>
                    <td>{new Date(invitation.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn-link"
                        onClick={() => copyInvitationLink(invitation.code)}
                      >
                        Copiar enlace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
