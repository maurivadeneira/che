import React from 'react';
import { Link } from 'react-router-dom';
import CheMiniLogo from './CheMiniLogo.jsx';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CHE - Corporación Herejía Económica <CheMiniLogo style={{ height: '20px', width: '40px' }} /></h3>
          <p>Un proyecto social global, para desarrollarlo en el mundo entero, en cada país que sea permitido.</p>
        </div>
        <div className="footer-section">
          <h3>Enlaces Rápidos <CheMiniLogo style={{ height: '20px', width: '40px' }} /></h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/fondos">Fondos Rotatorios</Link></li>
            <li><Link to="/about">Sobre Nosotros</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Fondos Principales <CheMiniLogo style={{ height: '20px', width: '40px' }} /></h3>
          <ul>
            <li><Link to="/fondos/inversion-empresarial">Inversión Empresarial</Link></li>
            <li><Link to="/fondos/editorial-medios">Editorial y Medios</Link></li>
            <li><Link to="/fondos/investigacion-cientifica">Investigación Científica</Link></li>
            <li><Link to="/fondos/arte-cultura">Arte y Cultura</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contacto <CheMiniLogo style={{ height: '20px', width: '40px' }} /></h3>
          <p>Email: info@corporacionche.org</p>
          <p>Teléfono: +57 123 456 7890</p>
          <p>Dirección: Av. Siempre Viva 123, Ciudad Ejemplo</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} CHE - Corporación Herejía Económica <CheMiniLogo style={{ height: '16px', width: '32px', verticalAlign: 'middle' }} />. Todos los derechos reservados.</p>
        <p>Desarrollado por Mauricio Rivadeneira Mora</p>
      </div>
    </footer>
  );
};

export default Footer;
