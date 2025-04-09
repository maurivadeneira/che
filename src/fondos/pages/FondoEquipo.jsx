import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CheMediumLogo from '../../components/CheMediumLogo.js';

// Datos ficticios para el equipo según el tipo de fondo
const getEquipoMiembros = (fondoId) => {
  // Miembros base del equipo con roles genéricos
  const miembrosBase = [
    {
      id: 1, 
      nombre: "Carlos Rodríguez", 
      cargo: "Director", 
      biografia: "Profesional con más de 15 años de experiencia en el sector. Dedicado a impulsar iniciativas que generen impacto positivo siguiendo los principios de la Herejía Económica."
    },
    {
      id: 2, 
      nombre: "Ana Gómez", 
      cargo: "Coordinadora de Proyectos", 
      biografia: "Especialista en gestión de proyectos con enfoque en sostenibilidad y desarrollo comunitario. Comprometida con la implementación de soluciones económicas justas."
    },
    {
      id: 3, 
      nombre: "Juan Pérez", 
      cargo: "Especialista Senior", 
      biografia: "Experto con amplia trayectoria en el desarrollo de iniciativas innovadoras. Enfocado en la aplicación práctica de los principios de la Herejía Económica."
    },
    {
      id: 4, 
      nombre: "María López", 
      cargo: "Analista", 
      biografia: "Profesional dedicada al análisis y evaluación de proyectos. Su enfoque meticuloso asegura la viabilidad y sostenibilidad de las iniciativas del fondo."
    },
    {
      id: 5, 
      nombre: "Pedro Martínez", 
      cargo: "Consultor", 
      biografia: "Asesor especializado con experiencia internacional. Aporta una visión global a los proyectos del fondo, manteniendo el enfoque en los principios fundamentales."
    }
  ];
  
  // Adaptar los cargos según el tipo de fondo
  return miembrosBase.map(miembro => {
    let cargoAdaptado = miembro.cargo;
    
    // Personalizar según el fondo
    switch(parseInt(fondoId)) {
      case 1: // Inversión Empresarial
        if (miembro.cargo === "Director") cargoAdaptado = "Director de Inversiones";
        if (miembro.cargo === "Especialista Senior") cargoAdaptado = "Analista de Inversiones Senior";
        if (miembro.cargo === "Analista") cargoAdaptado = "Analista Financiero";
        if (miembro.cargo === "Consultor") cargoAdaptado = "Consultor de Estrategia Empresarial";
        break;
      case 2: // Editorial y Medios
        if (miembro.cargo === "Director") cargoAdaptado = "Director Editorial";
        if (miembro.cargo === "Especialista Senior") cargoAdaptado = "Editor Senior";
        if (miembro.cargo === "Analista") cargoAdaptado = "Productora de Contenidos";
        if (miembro.cargo === "Consultor") cargoAdaptado = "Consultor de Medios Audiovisuales";
        break;
      case 3: // Sanación Emocional
        if (miembro.cargo === "Director") cargoAdaptado = "Director Terapéutico";
        if (miembro.cargo === "Especialista Senior") cargoAdaptado = "Terapeuta Senior";
        if (miembro.cargo === "Analista") cargoAdaptado = "Especialista en Bienestar";
        if (miembro.cargo === "Consultor") cargoAdaptado = "Consultor en Medicina Alternativa";
        break;
      // Puedes añadir más casos según sea necesario
      default:
        cargoAdaptado = `${miembro.cargo} - Fondo ${fondoId}`;
    }
    
    return {
      ...miembro,
      cargo: cargoAdaptado,
      imagenUrl: `/images/placeholder-400x400.svg`, // Imagen placeholder para cada miembro
    };
  });
};

/**
 * Página de equipo de un fondo específico
 */
const FondoEquipo = () => {
  const { id } = useParams();
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Desplazar la página hacia arriba al cargar
    window.scrollTo(0, 0);
    
    // Simulamos carga de datos
    setLoading(true);
    
    // Generamos equipo ficticio para este fondo
    setTimeout(() => {
      setMiembros(getEquipoMiembros(id));
      setLoading(false);
    }, 500);
  }, [id]);

  // Componente de tarjeta de miembro
  const MiembroCard = ({ miembro }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: 'var(--box-shadow)',
      overflow: 'hidden',
      transition: 'transform 0.2s',
    }} className="miembro-card hover:shadow-lg">
      {/* Imagen del miembro */}
      <div style={{ height: '300px', position: 'relative' }}>
        <img 
          src={miembro.imagenUrl} 
          alt={miembro.nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/placeholder-400x400.svg";
          }}
        />
      </div>
      
      {/* Información del miembro */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', color: 'var(--secondary-color)' }}>
          {miembro.nombre}
        </h3>
        
        <p style={{ 
          fontSize: '14px', 
          fontWeight: 'bold',
          color: '#666',
          marginBottom: '15px',
          paddingBottom: '15px',
          borderBottom: '1px solid #eee'
        }}>
          {miembro.cargo}
        </p>
        
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
          {miembro.biografia}
        </p>
        
        {/* Botones de contacto */}
        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px' 
        }}>
          <button style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '16px' }}>📧</span>
          </button>
          <button style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '16px' }}>💼</span>
          </button>
          <button style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '16px' }}>📱</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando miembros del equipo...</p>
      </div>
    );
  }

  return (
    <div className="fondo-equipo fade-in">
      <div style={{ marginBottom: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ 
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'var(--secondary-color)',
            marginBottom: '15px'
          }}>
            Nuestro Equipo
          </h1>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <CheMediumLogo style={{ height: '80px', width: '160px' }} />
          </div>
        </div>
        
        {/* Banner azul con "Imagen en desarrollo" */}
        <div style={{ 
          backgroundColor: '#e6f0ff',
          padding: '30px',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '28px',
            color: '#888',
            fontWeight: 'normal'
          }}>
            Imagen en desarrollo
          </h2>
        </div>
        
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'var(--box-shadow)',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <p style={{ lineHeight: '1.6' }}>
            El equipo del fondo está compuesto por profesionales comprometidos con los principios 
            de la Herejía Económica, dedicados a impulsar proyectos que generen un impacto positivo 
            en la sociedad. Cada miembro aporta su experiencia y visión para desarrollar soluciones 
            innovadoras y sostenibles.
          </p>
        </div>
      </div>
      
      {/* Organigrama simplificado */}
      <div style={{ 
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h2 style={{ 
          fontSize: '22px',
          fontWeight: 'bold',
          color: 'var(--secondary-color)',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Estructura Organizativa
        </h2>
        
        <div style={{ 
          width: '100%',
          maxWidth: '800px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'var(--box-shadow)',
          padding: '25px'
        }}>
          {/* Aquí iría un organigrama más elaborado, por ahora mostramos una versión simple */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              padding: '15px 25px', 
              backgroundColor: 'var(--secondary-color)', 
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textAlign: 'center',
              minWidth: '200px'
            }}>
              Dirección
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px',
              marginBottom: '20px' 
            }}>
              <div style={{ 
                padding: '10px 20px', 
                backgroundColor: '#e6f0ff', 
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                minWidth: '180px'
              }}>
                Coordinación
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px',
              flexWrap: 'wrap' 
            }}>
              <div style={{ 
                padding: '10px 20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                border: '1px solid #dee2e6',
                minWidth: '150px'
              }}>
                Especialistas
              </div>
              <div style={{ 
                padding: '10px 20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                border: '1px solid #dee2e6',
                minWidth: '150px'
              }}>
                Analistas
              </div>
              <div style={{ 
                padding: '10px 20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                border: '1px solid #dee2e6',
                minWidth: '150px'
              }}>
                Consultores
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid de miembros */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px'
      }}>
        {miembros.map(miembro => (
          <MiembroCard key={miembro.id} miembro={miembro} />
        ))}
      </div>
    </div>
  );
};

export default FondoEquipo;
