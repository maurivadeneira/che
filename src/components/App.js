import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout.js';
import Home from '../pages/Home.js';
import FondosPage from '../pages/FondosPage.js';
import AboutPage from '../pages/AboutPage.js';
import ContactPage from '../pages/.js';

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
