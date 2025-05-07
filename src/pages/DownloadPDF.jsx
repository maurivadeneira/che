import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DownloadPDF = () => {
  const { filename } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el archivo existe
    const checkFile = async () => {
      try {
        const response = await fetch(`/temp/${filename}`);
        
        if (response.ok) {
          // Archivo encontrado, redirigir a él
          window.location.href = `/temp/${filename}`;
          setLoading(false);
        } else {
          // Archivo no encontrado
          setError('El archivo solicitado no existe o ha expirado.');
          setLoading(false);
        }
      } catch (err) {
        setError('Error al acceder al archivo.');
        setLoading(false);
      }
    };
    
    if (filename) {
      checkFile();
    } else {
      setError('Nombre de archivo no especificado.');
      setLoading(false);
    }
  }, [filename]);

  return (
    <div className="download-container">
      <h1>Descarga de Kit2</h1>
      
      {loading && <p>Preparando descarga...</p>}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      )}
      
      <p>Si la descarga no comienza automáticamente, <a href={`/temp/${filename}`}>haga clic aquí</a>.</p>
    </div>
  );
};

export default DownloadPDF;
