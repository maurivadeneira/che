import React from 'react';
import { Link } from 'react-router-dom';
import CheMiniLogo from '../components/CheMiniLogo.js';
import DevelopmentBanner from '../components/common/DevelopmentBanner.js';

const Home = () => {
  return (
    <div className="home-page fade-in">
      <DevelopmentBanner />
      <section className="hero">
        <div className="hero-content">
          <h1>CHE - Corporación Herejía Económica <CheMiniLogo style={{ height: '30px', width: '60px', verticalAlign: 'middle', marginLeft: '10px' }} /></h1>
          <p>Un proyecto social global para desarrollarlo en el mundo entero</p>
          <Link to="/fondos" className="cta-button">Conoce nuestros Fondos Rotatorios</Link>
        </div>
      </section>
      
      <section className="about-section">
        <h2>Sobre Nosotros <CheMiniLogo style={{ height: '25px', width: '50px', verticalAlign: 'middle', marginLeft: '10px' }} /></h2>
        <p>
          La Corporación Herejía Económica es un proyecto social global que busca promover 
          actividades culturales, cívicas y sociales a favor de la institución, sus integrantes 
          y comunidades asociadas.
        </p>
      </section>
      
      <section className="funds-overview">
        <h2>Nuestros Fondos Rotatorios <CheMiniLogo style={{ height: '25px', width: '50px', verticalAlign: 'middle', marginLeft: '10px' }} /></h2>
        <div className="funds-grid">
          <div className="fund-card">
            <h3>Inversión Empresarial <CheMiniLogo style={{ height: '20px', width: '40px', verticalAlign: 'middle', marginLeft: '8px' }} /></h3>
            <p>Fondo para análisis, estudios, proyectos e inversiones empresariales.</p>
            <Link to="/fondos/1">Más información</Link>
          </div>
          
          <div className="fund-card">
            <h3>Editorial y Medios <CheMiniLogo style={{ height: '20px', width: '40px', verticalAlign: 'middle', marginLeft: '8px' }} /></h3>
            <p>Para la generación de medios, videos, películas, publicaciones y divulgación.</p>
            <Link to="/fondos/2">Más información</Link>
          </div>
          
          <div className="fund-card">
            <h3>Sanación Emocional <CheMiniLogo style={{ height: '20px', width: '40px', verticalAlign: 'middle', marginLeft: '8px' }} /></h3>
            <p>Asistencia social-emocional enmarcada en la medicina alternativa no invasiva.</p>
            <Link to="/fondos/3">Más información</Link>
          </div>
          
          <div className="fund-card">
            <h3>Vivienda <CheMiniLogo style={{ height: '20px', width: '40px', verticalAlign: 'middle', marginLeft: '8px' }} /></h3>
            <p>Destinado a la construcción de vivienda.</p>
            <Link to="/fondos/4">Más información</Link>
          </div>

          <div className="fund-card">
            <h3>Recreación Social y Hotelera <CheMiniLogo style={{ height: '20px', width: '40px', verticalAlign: 'middle', marginLeft: '8px' }} /></h3>
            <p>Enfocado en la creación y construcción de proyectos de recreación y hotelería.</p>
            <Link to="/fondos/5">Más información</Link>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/fondos" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '1rem', transition: 'background-color 0.3s ease' }}>
            Ver todos los fondos rotatorios
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
