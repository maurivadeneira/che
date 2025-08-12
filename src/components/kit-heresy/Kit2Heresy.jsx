import React from 'react';
import './KitHeresy.css';

const Kit2Heresy = () => (
  <div className="kit-heresy-container">
    <div className="kit-heresy-header">
      <h1 className="kit-title">Kit de la Herejía</h1>
      <h2 className="kit-subtitle">Guía Familiar Sistema Kit2</h2>
    </div>
    
    <div className="pdf-simple-viewer">
      <div className="pdf-info">
        <h3>📚 Documento Completo</h3>
        <p>
          La <strong>Guía Familiar Sistema Kit2</strong> contiene toda la información 
          necesaria para entender y participar en el sistema de la Herejía Económica.
        </p>
      </div>
      
      <div className="pdf-actions-center">
        <a 
          href="/contenido-herejiaecon/articulos/KIT2.pdf" 
          target="_blank"
          rel="noopener noreferrer"
          className="big-pdf-button"
        >
          📄 VER GUÍA COMPLETA PDF
        </a>
        
        <a 
          href="/contenido-herejiaecon/articulos/KIT2.pdf" 
          download="Guia-Familiar-Sistema-Kit2.pdf"
          className="download-button"
        >
          📥 DESCARGAR PDF
        </a>
      </div>
      
      <div className="pdf-instructions">
        <h3>💡 Instrucciones</h3>
        <ul>
          <li>Haz clic en "VER GUÍA COMPLETA PDF" para abrir el documento</li>
          <li>Usa "DESCARGAR PDF" para guardarlo en tu dispositivo</li>
          <li>El PDF se abrirá en una nueva pestaña</li>
          <li>Comparte este conocimiento responsablemente</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Kit2Heresy;