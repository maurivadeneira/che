import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>CHE - Corporación Herejía Económica</h1>
        </Link>
      </div>
      <nav className="main-nav">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/fondos">Fondos Rotatorios</Link></li>
          <li><Link to="/about">Nosotros</Link></li>
          <li><Link to="/contact">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
