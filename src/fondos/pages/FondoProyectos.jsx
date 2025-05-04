import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CheMediumLogo from '../../components/CheMediumLogo.jsx';

// Datos ficticios para proyectos extendidos
const getProyectosExtendidos = (fondoId) => {
  // Base de proyectos según el fondo
  const proyectosBase = [
    { id: 1, nombre: "Proyecto Alpha", estado: "Activo", porcentaje: 75 },
    { id: 2, nombre: "Iniciativa Beta", estado: "En desarrollo", porcentaje: 45 },
    { id: 3, nombre: "Programa Gamma", estado: "Planificación", porcentaje: 15 },
    { id: 4, nombre: "Proyecto Delta", estado: "Activo", porcentaje: 90 },
    { id: 5, nombre: "Iniciativa Epsilon", estado: "En desarrollo", porcentaje: 30 }
  ];
  
  // Adaptar los nombres según el tipo de fondo
  return proyectosBase.map(proyecto => {
    let nombreAdaptado = proyecto.nombre;
    let descripcion = "Proyecto en desarrollo bajo los principios de la Herejía Económica.";
    let imagenUrl = `/contenido-herejiaecon/imagenesfondos/placeholder.svg`;
    
    // Personalizar según el fondo
    switch(parseInt(fondoId)) {
      case 1: // Inversión Empresarial
        nombreAdaptado = proyecto.nombre.replace("Proyecto", "Inversión").replace("Iniciativa", "Startup").replace("Programa", "Incubadora");
        descripcion = "Proyecto de inversión empresarial siguiendo principios de economía sostenible y justa.";
        break;
      case 2: // Editorial y Medios
        nombreAdaptado = proyecto.nombre.replace("Proyecto", "Publicación").replace("Iniciativa", "Serie").replace("Programa", "Canal");
        descripcion = "Proyecto editorial para la difusión de ideas económicas alternativas.";
        break;
      case 3: // Sanación Emocional
        nombreAdaptado = proyecto.nombre.replace("Proyecto", "Terapia").replace("Iniciativa", "Técnica").replace("Programa", "Centro");
        descripcion = "Proyecto de bienestar integral enfocado en la sanación emocional no invasiva.";
        break;
      // Puedes añadir más casos según sea necesario
      default:
        nombreAdaptado = `${proyecto.nombre} - Fondo ${fondoId}`;
    }
    
    return {
      ...proyecto,
      nombre: nombreAdaptado,
      descripcion,
      imagenUrl,
      // Generar fechas aleatorias para inicio y fin
      fechaInicio: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      fechaFin: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      // Asignar inversión aleatoria
      inversion: `$${(Math.random() * 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      // Asignar responsable
      responsable: ["Juan Pérez", "María López", "Carlos Rodríguez", "Ana Gómez", "Pedro Martínez"][Math.floor(Math.random() * 5)]
    };
  });
};

/**
 * Página de proyectos de un fondo específico
 */
const FondoProyectos = () => {
  const { id } = useParams();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  
  useEffect(() => {
    // Desplazar la página hacia arriba al cargar
    window.scrollTo(0, 0);
    
    // Simulamos carga de datos
    setLoading(true);
    
    // Generamos proyectos ficticios para este fondo
    setTimeout(() => {
      setProyectos(getProyectosExtendidos(id));
      setLoading(false);
    }, 500);
  }, [id]);
  
  // Filtrar proyectos según el estado seleccionado
  const proyectosFiltrados = filtro === 'todos' 
    ? proyectos 
    : proyectos.filter(p => p.estado.toLowerCase() === filtro.toLowerCase());

  // Componente de tarjeta de proyecto
  const ProyectoCard = ({ proyecto }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: 'var(--box-shadow)',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }} className="proyecto-card">
      {/* Imagen del proyecto */}
      <div style={{ height: '180px', position: 'relative' }}>
        <img 
          src={proyecto.imagenUrl} 
          alt={proyecto.nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/contenido-herejiaecon/imagenesfondos/placeholder.svg";
          }}
        />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px 10px',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '12px',
          backgroundColor: proyecto.estado === 'Activo' ? '#d4edda' : 
                          proyecto.estado === 'En desarrollo' ? '#cce5ff' : '#fff3cd',
          color: proyecto.estado === 'Activo' ? '#155724' : 
                proyecto.estado === 'En desarrollo' ? '#004085' : '#856404'
        }}>
          {proyecto.estado}
        </div>
      </div>
      
      {/* Contenido del proyecto */}
      <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--secondary-color)' }}>
          {proyecto.nombre}
        </h3>
        
        <p style={{ fontSize: '14px', marginBottom: '15px', flex: '1' }}>
          {proyecto.descripcion}
        </p>
        
        {/* Barra de progreso */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Progreso</span>
            <span style={{ fontSize: '12px' }}>{proyecto.porcentaje}%</span>
          </div>
          <div style={{ 
            height: '8px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '4px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              height: '100%', 
              width: `${proyecto.porcentaje}%`, 
              backgroundColor: 'var(--primary-color)',
              borderRadius: '4px'
            }}></div>
          </div>
        </div>
        
        {/* Detalles del proyecto */}
        <div style={{ fontSize: '12px', color: '#666' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Inicio:</span>
            <span>{proyecto.fechaInicio}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Finalización:</span>
            <span>{proyecto.fechaFin}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Inversión:</span>
            <span>{proyecto.inversion}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Responsable:</span>
            <span>{proyecto.responsable}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="fondo-proyectos fade-in">
      <div style={{ marginBottom: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ 
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'var(--secondary-color)',
            marginBottom: '15px'
          }}>
            Proyectos
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
        
        {/* Filtros */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'var(--box-shadow)',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Filtrar por estado:</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setFiltro('todos')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: filtro === 'todos' ? 'var(--secondary-color)' : '#f8f9fa',
                color: filtro === 'todos' ? 'white' : '#333',
                fontWeight: filtro === 'todos' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              Todos
            </button>
            <button 
              onClick={() => setFiltro('activo')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: filtro === 'activo' ? '#28a745' : '#f8f9fa',
                color: filtro === 'activo' ? 'white' : '#333',
                fontWeight: filtro === 'activo' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              Activos
            </button>
            <button 
              onClick={() => setFiltro('en desarrollo')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: filtro === 'en desarrollo' ? '#007bff' : '#f8f9fa',
                color: filtro === 'en desarrollo' ? 'white' : '#333',
                fontWeight: filtro === 'en desarrollo' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              En Desarrollo
            </button>
            <button 
              onClick={() => setFiltro('planificación')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: filtro === 'planificación' ? '#ffc107' : '#f8f9fa',
                color: filtro === 'planificación' ? 'white' : '#333',
                fontWeight: filtro === 'planificación' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              Planificación
            </button>
          </div>
        </div>
        
        {/* Resultados */}
        <div>
          <p style={{ marginBottom: '15px' }}>
            Mostrando {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''}
            {filtro !== 'todos' ? ` en estado "${filtro}"` : ''}
          </p>
        </div>
      </div>
      
      {/* Grid de proyectos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '25px'
      }}>
        {proyectosFiltrados.map(proyecto => (
          <ProyectoCard key={proyecto.id} proyecto={proyecto} />
        ))}
        
        {proyectosFiltrados.length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1', 
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <p>No hay proyectos que coincidan con el filtro seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FondoProyectos;
