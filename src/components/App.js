import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home';
import FondosPage from '../pages/FondosPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="fondos" element={<FondosPage />} />
        <Route path="fondos/:fondoId/*" element={<FondosPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Route>
    </Routes>
  );
};

export default App;
