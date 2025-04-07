import React from 'react';

const Header = () => {
  return (
    <header className="header flex items-center justify-between p-4">
      <div className="logo-container">
        <a href="/" className="flex items-center">
          <img 
            src="/images/logo.png" 
            alt="CHE - Corporación Herejía Económica" 
            className="logo h-12 w-auto object-contain"
            style={{
              maxHeight: '80px',
              maxWidth: '200px'
            }}
          />
        </a>
      </div>
      <nav className="main-nav">
        <ul className="flex space-x-4">
          <li><a href="/" className="text-white hover:text-gray-200">Inicio</a></li>
          <li><a href="/fondos" className="text-white hover:text-gray-200">Fondos Rotatorios</a></li>
          <li><a href="/about" className="text-white hover:text-gray-200">Nosotros</a></li>
          <li><a href="/contact" className="text-white hover:text-gray-200">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
