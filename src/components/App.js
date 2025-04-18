import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout.js';
import Home from '../pages/Home.js';
import FondosRoutes from '../fondos/routes.jsx';
import AboutPage from '../pages/AboutPage.js';
import ContactPage from '../pages/ContactPage.js';

// Importar páginas provisionales para las nuevas secciones
const HerejiaIAPage = () => (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1>Herejías con IA</h1>
    <p>Esta sección contiene diálogos profundos en todos los campos con la inteligencia artificial.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
      {[
        {title: 'CUESTIONANDO LA FÍSICA', file: '/documentos/herejias-ia/CUESTIONANDO_LA_FISICA.pdf'},
        {title: 'CUESTIONANDO TEORÍA DEL BIG BANG', file: '/documentos/herejias-ia/CUESTIONANDO_BIG_BANG.pdf'}
      ].map((doc, index) => (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3>{doc.title}</h3>
          <p>Diálogo con la inteligencia artificial sobre temas de frontera.</p>
          <a href={doc.file} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}>
            Ver documento
          </a>
        </div>
      ))}
    </div>
  </div>
);

const ConferenciasPage = () => (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1>Conferencias</h1>
    <p>Conferencias y presentaciones sobre Herejía Económica y otros temas de interés.</p>
    <div style={{ marginTop: '30px' }}>
      {[
        {title: 'Conferencia 1', url: 'https://youtu.be/y6oPSjHh_Ug', details: 'Conferencia introductoria a la Herejía Económica'},
        {title: 'Conferencia 2', url: 'https://youtu.be/UvSKBh4DcPE', details: 'Fundamentos de la Herejía Económica'},
        {title: 'Kit de Herejía Económica', url: 'https://youtu.be/CkZmKIy4SuU', details: 'Herramientas para el análisis económico alternativo'},
        {title: 'Presentación del Autor', url: 'https://youtu.be/CkZmKIy4SuU', details: 'Biografía y trayectoria del autor'}
      ].map((conf, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '15px', borderBottom: '1px solid #eee' }}>
          <h3>{conf.title}</h3>
          <p>{conf.details}</p>
          <p>Fecha: {new Date().toLocaleDateString()}</p>
          <a href={conf.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}>
            Ver video
          </a>
        </div>
      ))}
    </div>
  </div>
);

const BibliotecaPage = () => (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1>Biblioteca</h1>
    <p>Colección de artículos, libros y documentos sobre Herejía Económica.</p>
    
    <h2 style={{ marginTop: '30px' }}>Artículos</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
      {[
        {title: 'COMPROBADO', file: '/documentos/articulos/COMPROBADO.pdf'},
        {title: 'DOS PROBLEMAS FUNDAMENTALES', file: '/documentos/articulos/DOS_PROBLEMAS_FUNDAMENTALES.pdf'}
      ].map((art, index) => (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3>{art.title}</h3>
          <p>Artículo sobre economía y herejía económica.</p>
          <a href={art.file} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}>
            Leer artículo
          </a>
        </div>
      ))}
    </div>
    
    <h2 style={{ marginTop: '40px' }}>Libros</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
      {[
        {title: 'Análisis Comprehensivo', file: '/documentos/libros/AnalisisComprehensivo.pdf'},
        {title: 'LIBRO SEGUNDO HEREJIA ECONOMICA', file: '/documentos/libros/LIBRO_SEGUNDO.pdf'}
      ].map((libro, index) => (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3>{libro.title}</h3>
          <p>Libro sobre la teoría de la herejía económica.</p>
          <a href={libro.file} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#9b59b6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}>
            Ver libro
          </a>
        </div>
      ))}
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="herejias-ia" element={<HerejiaIAPage />} />
        <Route path="conferencias" element={<ConferenciasPage />} />
        <Route path="biblioteca" element={<BibliotecaPage />} />
        <Route path="fondos/*" element={<FondosRoutes />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Route>
    </Routes>
  );
};

export default App;
