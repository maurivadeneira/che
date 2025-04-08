import React from 'react';
import { NavLink } from 'react-router-dom';

const fondos = [
  { id: '1', name: 'Inversión Empresarial' },
  { id: '2', name: 'Editorial y Medios Audiovisuales' },
  { id: '3', name: 'Sanación Emocional' },
  { id: '4', name: 'Vivienda' },
  { id: '5', name: 'Recreación Social y Hotelera' },
  { id: '6', name: 'Sistemas y Plataformas' },
  { id: '7', name: 'Bancario' },
  { id: '8', name: 'Proyectos de Ingeniería' },
  { id: '9', name: 'Comercial' },
  { id: '10', name: 'Investigación Científica' },
  { id: '11', name: 'Arte y Cultura' },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Fondos Rotatorios</h3>
      <nav className="sidebar-nav">
        <ul>
          {fondos.map((fondo) => (
            <li key={fondo.id}>
              <NavLink 
                to={`/fondos/${fondo.id}`}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {fondo.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
