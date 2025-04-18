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
      {['CUESTIONANDOLAFÍSICA', 'CUESTIONANDOTEORÍA', 'ECONOMIAvsCIENCIA', 'ExtraterrestresDialogo'].map((doc, index) => (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3>{doc}</h3>
          <p>Diálogo con la inteligencia artificial sobre temas de frontera.</p>
          <button style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Ver documento
          </button>
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
      {['Conferencia 1', 'Conferencia 2', 'Kit de Herejía Económica', 'Presentación del Autor'].map((conf, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '15px', borderBottom: '1px solid #eee' }}>
          <h3>{conf}</h3>
          <p>Fecha: {new Date().toLocaleDateString()}</p>
          <button style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Ver detalles
          </button>
          <button style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Ver video
          </button>
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
      {['COMPROBADO', 'DOS PROBLEMAS FUNDAMENTALES', 'ECONOMIA MUNDIAL SOS', 'EL AHORRO EN COLOMBIA', 'EL PROBLEMA DE LA INFLACIÓN', 'EL PROBLEMA DEL DEFICIT', 'Reflexiones'].map((art, index) => (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3>{art}</h3>
          <p>Artículo sobre economía y herejía económica.</p>
          <button style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Leer artículo
          </button>
        </div>
      ))}
    </div>
    
    <h2 style={{ marginTop: '40px' }}>Libros</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
      {['LIBRO PRIMERO TEORÍA ECONÓMICA', 'Análisis Comprehensivo', 'Comentario al libro Primero', 'LIBRO SEGUNDO HEREJIA ECONOMICA', 'Presentación al LIBRO segundo'].map((libro, index) => (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3>{libro}</h3>
          <p>Libro sobre la teoría de la herejía económica.</p>
          <button style={{ backgroundColor: '#9b59b6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Ver libro
          </button>
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
