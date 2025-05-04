import React from 'react';

const DevelopmentBanner = () => {
  return (
    <div style={{
      backgroundColor: '#ffe97f',
      color: '#856404',
      padding: '8px 15px',
      textAlign: 'center',
      fontSize: '0.9rem',
      borderRadius: '4px',
      margin: '10px 0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <strong>Aviso:</strong> Este proyecto se encuentra en fase de desarrollo. Algunas secciones podrían estar incompletas.
    </div>
  );
};

export default DevelopmentBanner;
