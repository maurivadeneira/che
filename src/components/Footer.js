import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CHE - Corporación Herejía Económica</h3>
          <p>Un proyecto social global, para desarrollarlo en el mundo entero, en cada país que sea permitido.</p>
        </div>
        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="/fondos">Fondos Rotatorios</a></li>
            <li><a href="/about">Sobre Nosotros</a></li>
            <li><a href="/contact">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Email: info@che.org</p>
          <p>Teléfono: +123 456 7890</p>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; {year} CHE - Corporación Herejía Económica. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
