import React, { useState, useEffect } from 'react';

const ObjetivoKit2Page = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Intentar cargar el archivo de texto
        const response = await fetch('/ContenidoProyChe/contenido-herejiaecon/kit2.documento/kit2delaHerejia.txt');
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el documento');
        }
        
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error cargando el documento:', err);
        setError(err.message);
        // Contenido fallback si no se puede cargar el archivo
        setContent(`# GUÍA FAMILIAR DEL SISTEMA KIT2

**CORPORACIÓN HEREJÍA ECONÓMICA**  
Sistema de Distribución de Obras Digitales y Educación Financiera Familiar  
*"Donde las familias se conectan, aprenden y prosperan juntas"*

---

## ÍNDICE DE CONTENIDOS

1. [¿Qué es el Sistema Kit2?](#que-es)
2. [Cómo Funciona el Sistema](#como-funciona)
3. [Educación Financiera Familiar](#educacion-financiera)
4. [Beneficios para Toda la Familia](#beneficios)
5. [Transparencia y Legalidad](#transparencia)
6. [Ejemplos Prácticos](#ejemplos)
7. [Preguntas Frecuentes](#preguntas)
8. [Cómo Empezar](#como-empezar)

---

## 1. ¿QUÉ ES EL SISTEMA KIT2? {#que-es}

### Una Revolución en Educación Financiera Familiar

Kit2 es un potente sistema innovador que combina tres elementos poderosos:

**📚 Distribución de Obras Digitales de Calidad**

**💡 Educación Financiera Intergeneracional**

**🌍 Red Global de Familias Conectadas**

Nota: Este es contenido de respaldo. El archivo original se cargará automáticamente cuando esté disponible.`);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Función para formatear el texto markdown básico
  const formatContent = (text) => {
    if (!text) return '';
    
    return text
      // Títulos principales
      .replace(/^# (.+)$/gm, '<h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin: 30px 0 20px 0; font-size: 2.5em;">$1</h1>')
      
      // Títulos secundarios
      .replace(/^## (.+)$/gm, '<h2 style="color: #7c3aed; margin: 25px 0 15px 0; font-size: 1.8em; border-left: 4px solid #7c3aed; padding-left: 15px;">$1</h2>')
      
      // Títulos terciarios
      .replace(/^### (.+)$/gm, '<h3 style="color: #059669; margin: 20px 0 10px 0; font-size: 1.4em;">$1</h3>')
      
      // Negrita
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #dc2626; font-weight: bold;">$1</strong>')
      
      // Cursiva
      .replace(/\*(.+?)\*/g, '<em style="color: #7c2d12; font-style: italic;">$1</em>')
      
      // Enlaces con ID
      .replace(/\[(.+?)\]\(#(.+?)\)/g, '<a href="#$2" style="color: #2563eb; text-decoration: none; border-bottom: 1px dotted #2563eb;">$1</a>')
      
      // Listas con viñetas
      .replace(/^- (.+)$/gm, '<li style="margin: 8px 0; padding-left: 10px; border-left: 2px solid #f59e0b;">$1</li>')
      
      // Líneas horizontales
      .replace(/^---$/gm, '<hr style="border: none; height: 2px; background: linear-gradient(to right, #2563eb, #7c3aed, #059669); margin: 30px 0; border-radius: 1px;" />')
      
      // Emojis destacados
      .replace(/^(\*\*📚.*?\*\*)$/gm, '<div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #2563eb;">$1</div>')
      .replace(/^(\*\*💡.*?\*\*)$/gm, '<div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #f59e0b;">$1</div>')
      .replace(/^(\*\*🌍.*?\*\*)$/gm, '<div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #059669;">$1</div>')
      
      // Párrafos
      .replace(/\n\n/g, '</p><p style="line-height: 1.8; margin: 15px 0; color: #374151; text-align: justify;">')
      
      // Centrar texto con asteriscos
      .replace(/^\*(.+?)\*$/gm, '<div style="text-align: center; font-style: italic; color: #6b7280; margin: 20px 0; font-size: 1.1em; background: #f9fafb; padding: 15px; border-radius: 8px;">$1</div>');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h3 style={{ color: '#374151', margin: 0 }}>Cargando Objetivo Kit2...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .content-container {
            animation: fadeInUp 0.8s ease-out;
          }
          
          .content-container h1:first-child {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin-bottom: 40px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        `}
      </style>
      
      <div className="content-container" style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(10px)'
      }}>
        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#dc2626'
          }}>
            <strong>⚠️ Nota:</strong> {error}. Mostrando contenido de respaldo.
          </div>
        )}
        
        <div 
          style={{ 
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#374151'
          }}
          dangerouslySetInnerHTML={{ 
            __html: `<p style="line-height: 1.8; margin: 15px 0; color: #374151; text-align: justify;">${formatContent(content)}</p>` 
          }} 
        />
        
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          borderRadius: '15px',
          border: '2px solid #0ea5e9',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#0c4a6e', margin: '0 0 15px 0' }}>
            🎯 ¡Objetivo Kit2 en Funcionamiento!
          </h3>
          <p style={{ color: '#075985', margin: 0, fontSize: '14px' }}>
            Esta página muestra tu contenido de Kit2 desde: <br/>
            <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
              /ContenidoProyChe/contenido-herejiaecon/kit2.documento/kit2delaHerejia.txt
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ObjetivoKit2Page;
