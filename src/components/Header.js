import React from 'react';

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
        <div>
          <img 
            src="/images/logo.png" 
            alt="CHE - Corporación Herejía Económica" 
            style={{
              maxHeight: '120px', 
              maxWidth: '250px', 
              objectFit: 'contain',
              border: '2px solid red' // Añadimos un borde rojo para verificar
            }}
            onError={(e) => {
              console.error('Error loading image', e);
              e.target.style.display = 'none';
            }}
          />
          <p style={{color: 'white'}}>Debug: Logo check</p>
        </div>
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
