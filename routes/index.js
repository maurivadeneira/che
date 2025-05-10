import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Kit2Activation from '../components/Kit2Activation';
import PaymentPreferencesForm from '../components/PaymentPreferencesForm';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas (requieren autenticación) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Ruta para el proceso de activación del Kit2 */}
      <Route path="/activate-kit/:invitationId" element={
        <ProtectedRoute>
          <Kit2Activation />
        </ProtectedRoute>
      } />
      
      {/* Ruta para configurar preferencias de pago */}
      <Route path="/payment-preferences" element={
        <ProtectedRoute>
          <PaymentPreferencesForm />
        </ProtectedRoute>
      } />
      
      {/* Ruta 404 para cualquier otra URL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;