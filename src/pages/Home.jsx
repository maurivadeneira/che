import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Kit2 de la Herejía Económica</h1>
        <p className="hero-subtitle">
          Una nueva forma de entender la economía y generar oportunidades
        </p>
        <div className="hero-buttons">
          <Link to="/activate" className="btn-primary">
            Activar mi Kit
          </Link>
          <Link to="/learn-more" className="btn-secondary">
            Conocer más
          </Link>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">���</div>
          <h2>Sistema Rotatorio</h2>
          <p>
            El Kit2 funciona como un sistema rotatorio de donaciones que permite
            a los participantes generar oportunidades económicas.
          </p>
        </div>

        <div className="info-card">
          <div className="info-icon">���</div>
          <h2>Contenido Valioso</h2>
          <p>
            Al activar tu Kit2, obtienes acceso a contenido exclusivo que te
            ayudará a entender y aplicar los principios de la Herejía Económica.
          </p>
        </div>

        <div className="info-card">
          <div className="info-icon">���</div>
          <h2>Red Global</h2>
          <p>
            Forma parte de una comunidad global de personas interesadas en
            transformar su relación con la economía y el dinero.
          </p>
        </div>
      </div>

      <div className="cta-section">
        <h2>¿Cómo funciona?</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Recibe una invitación</h3>
            <p>
              Para activar tu Kit2 necesitas recibir una invitación de alguien
              que ya sea parte del sistema.
            </p>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <h3>Realiza donaciones</h3>
            <p>
              Haz donaciones tanto a la Corporación Herejía Económica como a la
              persona que te invitó.
            </p>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <h3>Activa tu Kit</h3>
            <p>
              Una vez realizadas las donaciones, tu Kit2 se activa y puedes
              comenzar a invitar a otros.
            </p>
          </div>

          <div className="step-item">
            <div className="step-number">4</div>
            <h3>Invita y recibe</h3>
            <p>
              Invita a más personas al sistema y recibe donaciones cuando ellos
              activen sus Kits.
            </p>
          </div>
        </div>

        <Link to="/activate" className="btn-primary cta-button">
          Activar mi Kit ahora
        </Link>
      </div>
    </div>
  );
};

export default Home;
