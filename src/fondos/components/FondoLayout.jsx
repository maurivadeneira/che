import React from 'react';
import { Outlet } from 'react-router-dom';
import FondoNavbar from './FondoNavbar';
import CheMiniLogo from '../../components/CheMiniLogo.js';
import { useParams } from 'react-router-dom';

// Datos de los fondos (esto podría venir de un contexto o API)
const fondosInfo = [
  { id: 1, nombre: "Fondo Rotatorio De Inversión Empresarial" },
  { id: 2, nombre: "Fondo Rotatorio Editorial y de Medios Audiovisuales" },
  { id: 3, nombre: "Fondo Rotatorio de Sanación Emocional" },
  { id: 4, nombre: "Fondo Rotatorio de Vivienda" },
  { id: 5, nombre: "Fondo Rotatorio de Recreación Social y Hotelera" },
  { id: 6, nombre: "Fondo Rotatorio de Sistemas y Plataformas" },
  { id: 7, nombre: "Fondo Rotatorio Bancario" },
  { id: 8, nombre: "Fondo Rotatorio de Proyectos de Ingeniería" },
  { id: 9, nombre: "Fondo Rotatorio Comercial" },
  { id: 10, nombre: "Fondo Rotatorio para la Investigación Científica" },
  { id: 11, nombre: "Fondo Rotatorio para el Desarrollo del Arte y la Cultura" }
];

/**
 * Layout principal para las páginas de los fondos
 * Incluye la barra de navegación específica y el contenido
 */
const FondoLayout = () => {
  const { id } = useParams();
  const fondoId = parseInt(id);
  
  // Buscar el fondo por ID
  const fondo = fondosInfo.find(f => f.id === fondoId) || { 
    id: fondoId, 
    nombre: "Fondo Rotatorio" 
  };

  return (
    <div className="fondo-layout">
      {/* Barra de navegación específica del fondo */}
      <FondoNavbar fondoId={fondo.id} fondoNombre={fondo.nombre} />
      
      {/* Contenido específico de la página */}
      <div className="fondo-content" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px' 
      }}>
        <Outlet />
      </div>
      
      {/* Footer específico del fondo */}
      <footer style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px 0', 
        marginTop: '40px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          textAlign: 'center',
          color: '#666',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <p style={{ marginBottom: '10px' }}>&copy; {new Date().getFullYear()} {fondo.nombre}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheMiniLogo style={{ height: '20px', width: '40px', marginRight: '5px' }} />
            <span>Mundo Libre</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FondoLayout;
