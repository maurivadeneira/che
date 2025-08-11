import React, { useState } from 'react';
import './KitHeresy.css';

const KitHeresy = () => {
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const handlePdfLoad = () => {
    setPdfLoaded(true);
    setPdfError(false);
  };

  const handlePdfError = () => {
    setPdfLoaded(false);
    setPdfError(true);
  };

  return (
    <div className="kit-heresy-container">
      {/* Header con título */}
      <div className="kit-heresy-header">
        <h1 className="kit-title">Kit de la Herejía</h1>
        <h2 className="kit-subtitle">Guía Familiar Sistema Kit2</h2>
        
        {/* Botón de descarga como respaldo */}
        <div className="pdf-actions">
          <a 
            href="/temp/Guia-Familiar-Sistema-Kit2.pdf" 
            download="Guia-Familiar-Sistema-Kit2.pdf"
            className="download-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            📥 Descargar PDF
          </a>
        </div>
      </div>

      {/* Estado de carga */}
      {!pdfLoaded && !pdfError && (
        <div className="pdf-loading">
          <div className="loading-spinner"></div>
          <p>Cargando documento...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {pdfError && (
        <div className="pdf-error">
          <h3>❌ Error al cargar el PDF</h3>
          <p>No se pudo mostrar el documento en el navegador.</p>
          <p>
            <strong>Solución:</strong> 
            <a 
              href="/temp/Guia-Familiar-Sistema-Kit2.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="error-download-link"
            >
              Haz clic aquí para abrir el PDF directamente
            </a>
          </p>
        </div>
      )}

      {/* Visor PDF */}
      <div className="pdf-viewer-container">
        <iframe
          src="/temp/Guia-Familiar-Sistema-Kit2.pdf"
          className="pdf-iframe"
          title="Guía Familiar Sistema Kit2"
          onLoad={handlePdfLoad}
          onError={handlePdfError}
          width="100%"
          height="800px"
          style={{
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: pdfError ? 'none' : 'block'
          }}
        />
      </div>

      {/* Información adicional */}
      <div className="kit-info-footer">
        <div className="info-card">
          <h3>📚 Sobre este documento</h3>
          <p>
            La <strong>Guía Familiar Sistema Kit2</strong> contiene toda la información 
            necesaria para entender y participar en el sistema de la Herejía Económica.
          </p>
          <p>
            Este documento es parte integral del Kit de la Herejía y está diseñado 
            para ser estudiado en familia.
          </p>
        </div>

        <div className="info-card">
          <h3>💡 Instrucciones de uso</h3>
          <ul>
            <li>Utiliza los controles del visor para navegar por el documento</li>
            <li>Puedes hacer zoom para una mejor lectura</li>
            <li>Descarga el PDF para acceso sin conexión</li>
            <li>Comparte este conocimiento responsablemente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KitHeresy;