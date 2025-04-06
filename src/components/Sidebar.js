import React from 'react';
import { NavLink } from 'react-router-dom';

const fondos = [
  { id: 'inversion-empresarial', name: 'Inversión Empresarial' },
  { id: 'editorial-medios', name: 'Editorial y Medios Audiovisuales' },
  { id: 'sanacion-emocional', name: 'Sanación Emocional' },
  { id: 'vivienda', name: 'Vivienda' },
  { id: 'recreacion-hotelera', name: 'Recreación Social y Hotelera' },
  { id: 'sistemas-plataformas', name: 'Sistemas y Plataformas' },
  { id: 'bancario', name: 'Bancario' },
  { id: 'proyectos-ingenieria', name: 'Proyectos de Ingeniería' },
  { id: 'comercial', name: 'Comercial' },
  { id: 'investigacion-cientifica', name: 'Investigación Científica' },
  { id: 'arte-cultura', name: 'Arte y Cultura' },
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
