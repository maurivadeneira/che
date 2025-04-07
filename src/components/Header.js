import React from 'react';
// Usar logo desde la carpeta public
const logoPath = '/images/logo.png';

const Header = () => {
  return (
    <header style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 20px', 
      backgroundColor: '#000'
    }}>
      <div style={{
        display: 'flex', 
        alignItems: 'center'
      }}>
        <img 
          src={logoPath}
          alt="CHE - Corporación Herejía Económica" 
          style={{
            maxHeight: '120px', 
            maxWidth: '250px', 
            objectFit: 'contain'
          }}
        />
      </div>
      <nav>
        <ul style={{
          display: 'flex', 
          listStyle: 'none', 
          gap: '15px', 
          color: 'white'
        }}>
          <li><a href="/" style={{color: 'white', textDecoration: 'none'}}>Inicio</a></li>
          <li><a href="/fondos" style={{color: 'white', textDecoration: 'none'}}>Fondos Rotatorios</a></li>
          <li><a href="/about" style={{color: 'white', textDecoration: 'none'}}>Nosotros</a></li>
          <li><a href="/contact" style={{color: 'white', textDecoration: 'none'}}>Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
