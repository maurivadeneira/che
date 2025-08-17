import React, { useState, useEffect } from 'react';

const ObjetivoKit2Page = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Contenido de la guía Kit2
    setContent(`# GUÍA FAMILIAR DEL SISTEMA KIT2

**CORPORACIÓN HEREJÍA ECONÓMICA**  
Sistema de Distribución de Obras Digitales y Educación Financiera Familiar  
*"Donde las familias se conectan, aprenden y prosperan juntas"*

---

## ÍNDICE DE CONTENIDOS

1. ¿Qué es el Sistema Kit2?
2. Cómo Funciona el Sistema
3. Educación Financiera Familiar
4. Beneficios para Toda la Familia
5. Transparencia y Legalidad
6. Ejemplos Prácticos
7. Preguntas Frecuentes
8. Cómo Empezar

---

## 1. ¿QUÉ ES EL SISTEMA KIT2?

### Una Revolución en Educación Financiera Familiar

Kit2 es un potente sistema innovador que combina tres elementos poderosos:

**📚 Distribución de Obras Digitales de Calidad**

**💡 Educación Financiera Intergeneracional**

**🌍 Red Global de Familias Conectadas**`);
    setLoading(false);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ 
          color: '#2563eb', 
          textAlign: 'center',
          borderBottom: '3px solid #2563eb',
          paddingBottom: '10px',
          marginBottom: '30px'
        }}>
          🎯 OBJETIVO KIT2
        </h1>
        
        <div style={{ 
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#374151',
          whiteSpace: 'pre-line'
        }}>
          {content}
        </div>
        
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#0c4a6e' }}>
            🎉 ¡Página Objetivo Kit2 Funcionando!
          </h3>
          <p style={{ color: '#075985' }}>
            ¡Después de 2 meses, finalmente tienes tu página nueva!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ObjetivoKit2Page;
