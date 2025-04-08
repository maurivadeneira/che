import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import FondosRotatoriosCHE from './index';
import FondoLayout from './components/FondoLayout';
import FondoInicio from './pages/FondoInicio';
import FondoProyectos from './pages/FondoProyectos';
import FondoEquipo from './pages/FondoEquipo';
import FondoContacto from './pages/FondoContacto';

// Componente de redirección para la ruta simple del fondo a la página de inicio
const RedirectToFondoInicio = () => {
  const { id } = useParams();
  return <Navigate to={`/fondos/${id}/inicio`} replace />;
};

/**
 * Configuración de rutas para los fondos
 * Incluye:
 * - Vista general de todos los fondos
 * - Nuevo sistema de navegación por fondo con múltiples páginas
 */
const FondosRoutes = () => {
  return (
    <Routes>
      {/* Vista general de todos los fondos */}
      <Route index element={<FondosRotatoriosCHE />} />
      
      {/* Redirección para rutas simples de fondos */}
      <Route path=":id" element={<RedirectToFondoInicio />} />
      
      {/* Nueva estructura de fondo con múltiples páginas */}
      <Route path=":id/*" element={<FondoLayout />}>
        <Route path="inicio" element={<FondoInicio />} />
        <Route path="proyectos" element={<FondoProyectos />} />
        <Route path="equipo" element={<FondoEquipo />} />
        <Route path="contacto" element={<FondoContacto />} />
        <Route index element={<FondoInicio />} />
      </Route>
    </Routes>
  );
};

export default FondosRoutes;
