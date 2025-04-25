import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CheMiniLogo from '../../components/CheMiniLogo.js';
import CheMediumLogo from '../../components/CheMediumLogo.js';
import FondosSvgCollection from '../../components/FondosSvgCollection';
import FullImageViewer from '../components/FullImageViewer';
import '../components/fondos.css';

// Datos de los fondos (esto podría venir de un contexto o API)
const fondosData = [
  {
    id: 1,
    titulo: "Fondo Rotatorio De Inversión Empresarial",
    descripcion: "Dedicado al análisis, estudios, proyectos e inversiones empresariales. Busca fomentar el desarrollo de nuevas empresas y fortalecer las existentes siguiendo los principios de la Herejía Económica, generando oportunidades de crecimiento económico sostenible.",
    imagenDesc: "Equipo diverso de profesionales analizando proyectos de inversión en una oficina moderna con gráficos de crecimiento",
    detalles: [
      "Análisis de viabilidad de proyectos empresariales",
      "Inversión en start-ups con alto potencial de crecimiento",
      "Fortalecimiento de empresas existentes mediante asesoría y capital",
      "Promoción de modelos empresariales basados en principios de la Herejía Económica",
      "Desarrollo de ecosistemas empresariales sostenibles"
    ],
    proyectos: [
      { nombre: "Incubadora de Empresas CHE", estado: "En desarrollo" },
      { nombre: "Fondo de Capital Semilla", estado: "Activo" },
      { nombre: "Red de Mentores Empresariales", estado: "Planificación" }
    ]
  },
  // El resto de fondos serían añadidos aquí...
];

/**
 * Página principal/inicio de un fondo específico
 */
const FondoInicio = () => {
  const { id } = useParams();
  const [fondo, setFondo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Desplazar la página hacia arriba al cargar
    window.scrollTo(0, 0);
    
    // Simulamos una carga de datos
    setLoading(true);
    
    // Datos correctos para cada fondo
    const fondosCompletos = [
      {
        id: 1,
        titulo: "Fondo Rotatorio De Inversión Empresarial",
        descripcion: "Dedicado al análisis, estudios, proyectos e inversiones empresariales. Busca fomentar el desarrollo de nuevas empresas y fortalecer las existentes siguiendo los principios de la Herejía Económica, generando oportunidades de crecimiento económico sostenible.",
        detalles: [
          "Análisis de viabilidad de proyectos empresariales",
          "Inversión en start-ups con alto potencial de crecimiento",
          "Fortalecimiento de empresas existentes mediante asesoría y capital",
          "Promoción de modelos empresariales basados en principios de la Herejía Económica",
          "Desarrollo de ecosistemas empresariales sostenibles"
        ],
        proyectos: [
          { nombre: "Incubadora de Empresas CHE", estado: "En desarrollo" },
          { nombre: "Fondo de Capital Semilla", estado: "Activo" },
          { nombre: "Red de Mentores Empresariales", estado: "Planificación" }
        ]
      },
      {
        id: 2,
        titulo: "Fondo Rotatorio Editorial y de Medios Audiovisuales",
        descripcion: "Enfocado en la generación de medios, videos, películas, publicaciones y divulgación de las ideas de la Herejía Económica. Promueve la creación de contenido educativo e informativo accesible para todos los públicos.",
        detalles: [
          "Producción de material audiovisual sobre principios económicos",
          "Publicación de libros y artículos sobre Herejía Económica",
          "Desarrollo de plataformas digitales para divulgación",
          "Creación de documentales y series educativas",
          "Gestión de canales de comunicación multimedia"
        ],
        proyectos: [
          { nombre: "Serie Documental 'Libertad Económica'", estado: "En producción" },
          { nombre: "Revista Digital Mensual", estado: "Activo" },
          { nombre: "Canal de YouTube Educativo", estado: "Activo" }
        ]
      },
      {
        id: 3,
        titulo: "Fondo Rotatorio de Sanación Emocional",
        descripcion: "Orientado a la asistencia social-emocional enmarcada en la medicina alternativa de medios no invasivos. Busca el bienestar integral de las personas como base para su libertad económica.",
        detalles: [
          "Programas de terapia emocional mediante técnicas alternativas",
          "Talleres de sanación grupal e individual",
          "Formación de terapeutas en metodologías de sanación holística",
          "Investigación de técnicas innovadoras no invasivas",
          "Centros de bienestar integral para la comunidad"
        ],
        proyectos: [
          { nombre: "Centro de Bienestar Integral CHE", estado: "En desarrollo" },
          { nombre: "Programa de Formación de Terapeutas", estado: "Planificación" },
          { nombre: "Talleres Comunitarios de Sanación", estado: "Activo" }
        ]
      },
      // ... resto de fondos
    ];
    
    // Buscar el fondo por ID
    const fondoEncontrado = fondosCompletos.find(f => f.id === parseInt(id));
    
    if (fondoEncontrado) {
      setFondo(fondoEncontrado);
    } else {
      // Títulos para los fondos del 4 al 11
      const titulosFondos = {
        4: "Fondo Rotatorio de Vivienda",
        5: "Fondo Rotatorio de Recreación Social y Hotelera",
        6: "Fondo Rotatorio de Sistemas y Plataformas",
        7: "Fondo Rotatorio Bancario",
        8: "Fondo Rotatorio de Proyectos de Ingeniería",
        9: "Fondo Rotatorio Comercial",
        10: "Fondo Rotatorio para la Investigación Científica",
        11: "Fondo Rotatorio para el Desarrollo del Arte y la Cultura"
      };
      
      // Crear un fondo temporal con información básica pero con el título correcto
      setFondo({
        id: parseInt(id),
        titulo: titulosFondos[id] || `Fondo Rotatorio #${id}`,
        descripcion: "Información del fondo en desarrollo.",
        detalles: ["Detalle 1", "Detalle 2", "Detalle 3"],
        proyectos: [
          { nombre: "Proyecto 1", estado: "En desarrollo" },
          { nombre: "Proyecto 2", estado: "Planificación" }
        ]
      });
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando información del fondo...</p>
      </div>
    );
  }

  return (
    <div className="fondo-inicio fade-in">
      {/* Encabezado con título y logo */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '30px',
        maxWidth: '1200px',
        margin: '0 auto 30px auto',
        padding: '0 20px'
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'var(--secondary-color)',
          marginBottom: '20px'
        }}>
          {fondo.titulo}
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
      
      {/* Banner con imagen del fondo - Ahora a ancho completo */}
      {/* Banner con imagen del fondo - usando el nuevo componente de imagen completa */}
      <FullImageViewer 
        imageId={fondo.id}
        alt={`Imagen representativa de ${fondo.titulo}`}
      />
      
      {/* Secciones de contenido - con ancho máximo para mejor legibilidad */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Columna principal */}
        <div>
          {/* Misión y visión */}
          <section style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'var(--box-shadow)',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: 'bold',
              color: 'var(--secondary-color)',
              marginBottom: '15px'
            }}>
              Nuestra Misión
            </h2>
            <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
              {fondo.descripcion}
            </p>
            
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: 'bold',
              color: 'var(--secondary-color)',
              marginBottom: '15px',
              marginTop: '30px'
            }}>
              Visión
            </h2>
            <p style={{ lineHeight: '1.6' }}>
              Ser un referente en el desarrollo de soluciones económicas alternativas 
              que promuevan la libertad financiera y el bienestar integral de las personas 
              y comunidades, siguiendo los principios de la Herejía Económica.
            </p>
          </section>
          
          {/* Áreas de enfoque */}
          <section style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'var(--box-shadow)',
            padding: '25px'
          }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: 'bold',
              color: 'var(--secondary-color)',
              marginBottom: '20px'
            }}>
              Áreas de Enfoque
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {fondo.detalles.map((detalle, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '15px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ 
                    color: 'var(--secondary-color)',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    fontSize: '16px'
                  }}>
                    Área {index + 1}
                  </div>
                  <p style={{ fontSize: '14px' }}>{detalle}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        {/* Columna lateral */}
        <div>
          {/* Proyectos destacados */}
          <section style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'var(--box-shadow)',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'var(--secondary-color)',
              marginBottom: '15px'
            }}>
              Proyectos Destacados
            </h2>
            
            <div>
              {fondo.proyectos.map((proyecto, index) => (
                <div key={index} style={{ 
                  padding: '12px 0',
                  borderBottom: index < fondo.proyectos.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div style={{ 
                    fontWeight: 'bold',
                    marginBottom: '5px'
                  }}>
                    {proyecto.nombre}
                  </div>
                  <div>
                    <span style={{
                      display: 'inline-block', 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: proyecto.estado === 'Activo' ? '#d4edda' : 
                                      proyecto.estado === 'En desarrollo' ? '#cce5ff' : '#fff3cd',
                      color: proyecto.estado === 'Activo' ? '#155724' : 
                             proyecto.estado === 'En desarrollo' ? '#004085' : '#856404'
                    }}>
                      {proyecto.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Contacto rápido */}
          <section style={{ 
            backgroundColor: '#e6f0ff',
            borderRadius: '8px',
            boxShadow: 'var(--box-shadow)',
            padding: '20px'
          }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'var(--secondary-color)',
              marginBottom: '15px'
            }}>
              Contacto Rápido
            </h2>
            
            <form>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <textarea 
                  placeholder="Tu mensaje" 
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>
              <button style={{
                backgroundColor: 'var(--secondary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}>
                Enviar Mensaje
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FondoInicio;
