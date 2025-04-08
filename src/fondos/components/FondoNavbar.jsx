import React from 'react';
import { Link } from 'react-router-dom';
import CheMiniLogo from '../../components/CheMiniLogo.js';
import CheMediumLogo from '../../components/CheMediumLogo.js';

/**
 * Barra de navegación específica para cada fondo
 * Muestra opciones de navegación propias del fondo y un enlace para volver a la corporación
 */
const FondoNavbar = ({ fondoId, fondoNombre }) => {
  return (
    <nav className="fondo-navbar" style={{
      backgroundColor: 'var(--secondary-color)',
      color: 'white',
      padding: '10px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo y nombre del fondo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CheMediumLogo style={{ height: '40px', width: '80px' }} />
          <div style={{ marginLeft: '15px' }}>
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              margin: 0
            }}>
              {fondoNombre}
            </h1>
          </div>
        </div>

        {/* Menú de navegación del fondo */}
        <div className="fondo-menu" style={{ display: 'flex', gap: '20px' }}>
          <Link to={`/fondos/${fondoId}/inicio`} style={{ color: 'white', textDecoration: 'none' }}>
            Inicio
          </Link>
          <Link to={`/fondos/${fondoId}/proyectos`} style={{ color: 'white', textDecoration: 'none' }}>
            Proyectos
          </Link>
          <Link to={`/fondos/${fondoId}/equipo`} style={{ color: 'white', textDecoration: 'none' }}>
            Equipo
          </Link>
          <Link to={`/fondos/${fondoId}/contacto`} style={{ color: 'white', textDecoration: 'none' }}>
            Contacto
          </Link>
        </div>

        {/* Enlace para volver a la corporación */}
        <Link to="/" style={{ 
          color: 'white', 
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px'
        }}>
          <span style={{ marginRight: '5px' }}>Volver a CHE</span>
          <CheMiniLogo style={{ height: '16px', width: '32px' }} />
        </Link>
      </div>
    </nav>
  );
};

export default FondoNavbar;
