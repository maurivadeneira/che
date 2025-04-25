import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CheMiniLogo from '../components/CheMiniLogo.js';
import DevelopmentBanner from '../components/common/DevelopmentBanner.js';

// Datos de todos los fondos (estos datos podrían venir de una API en el futuro)
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
  {
    id: 2,
    titulo: "Fondo Rotatorio Editorial y de Medios Audiovisuales",
    descripcion: "Enfocado en la generación de medios, videos, películas, publicaciones y divulgación de las ideas de la Herejía Económica. Promueve la creación de contenido educativo e informativo accesible para todos los públicos.",
    imagenDesc: "Estudio de producción audiovisual con personas trabajando en edición de videos y diseño editorial",
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
    imagenDesc: "Espacio tranquilo de terapia con profesionales atendiendo a personas en un ambiente natural y relajante",
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
  {
    id: 4,
    titulo: "Fondo Rotatorio de Vivienda",
    descripcion: "Destinado a la construcción de vivienda accesible y de calidad. Promueve soluciones habitacionales innovadoras que permitan a las personas acceder a un hogar digno como parte fundamental de su desarrollo.",
    imagenDesc: "Proyecto de viviendas sostenibles con arquitectos y trabajadores construyendo en comunidad",
    detalles: [
      "Desarrollo de proyectos habitacionales accesibles",
      "Implementación de tecnologías sostenibles en la construcción",
      "Programas comunitarios de autogestión de vivienda",
      "Diseño de soluciones habitacionales innovadoras",
      "Asesoría para acceso a vivienda propia"
    ],
    proyectos: [
      { nombre: "Ecobarrio CHE", estado: "Planificación" },
      { nombre: "Viviendas Modulares Sostenibles", estado: "En desarrollo" },
      { nombre: "Programa de Autoconstrucción Comunitaria", estado: "Activo" }
    ]
  },
  {
    id: 5,
    titulo: "Fondo Rotatorio de Recreación Social y Hotelera",
    descripcion: "Enfocado en la creación y construcción de proyectos de recreación y hotelería. Busca desarrollar espacios de descanso y esparcimiento que generen bienestar y nuevas oportunidades económicas.",
    imagenDesc: "Complejo turístico sostenible con familias disfrutando de actividades recreativas en un entorno natural",
    detalles: [
      "Desarrollo de complejos turísticos sostenibles",
      "Creación de espacios recreativos comunitarios",
      "Implementación de modelos hoteleros alternativos",
      "Programas de turismo social inclusivo",
      "Formación en gestión hotelera y turística sostenible"
    ],
    proyectos: [
      { nombre: "Red de Ecohoteles CHE", estado: "En desarrollo" },
      { nombre: "Parques Recreativos Comunitarios", estado: "Planificación" },
      { nombre: "Programa de Turismo Rural Comunitario", estado: "Activo" }
    ]
  },
  {
    id: 6,
    titulo: "Fondo Rotatorio de Sistemas y Plataformas",
    descripcion: "Dedicado a la generación de plataformas y software de sistemas y empresarial. Impulsa el desarrollo tecnológico como herramienta fundamental para la libertad económica en la era digital.",
    imagenDesc: "Equipo diverso de programadores y diseñadores trabajando en el desarrollo de plataformas digitales innovadoras",
    detalles: [
      "Desarrollo de plataformas digitales para emprendimiento",
      "Creación de software de gestión empresarial accesible",
      "Implementación de soluciones tecnológicas para la economía colaborativa",
      "Formación en desarrollo de sistemas y aplicaciones",
      "Innovación en tecnologías para la inclusión digital"
    ],
    proyectos: [
      { nombre: "Plataforma de Economía Colaborativa CHE", estado: "En desarrollo" },
      { nombre: "Software Libre de Gestión Empresarial", estado: "Activo" },
      { nombre: "Academia de Desarrollo Tecnológico", estado: "Planificación" }
    ]
  },
  {
    id: 7,
    titulo: "Fondo Rotatorio Bancario",
    descripcion: "Orientado a crear soluciones financieras inclusivas. Busca desarrollar alternativas al sistema bancario tradicional que permitan el acceso a servicios financieros para todos.",
    imagenDesc: "Oficina moderna con asesores financieros atendiendo a clientes diversos y pantallas mostrando sistemas bancarios alternativos",
    detalles: [
      "Desarrollo de sistemas de microcrédito comunitario",
      "Implementación de monedas complementarias locales",
      "Creación de cooperativas de ahorro y crédito",
      "Programas de educación financiera inclusiva",
      "Plataformas de financiación colectiva para proyectos sociales"
    ],
    proyectos: [
      { nombre: "Red de Banca Comunitaria CHE", estado: "En desarrollo" },
      { nombre: "Sistema de Monedas Complementarias", estado: "Planificación" },
      { nombre: "Plataforma de Microcréditos Sociales", estado: "Activo" }
    ]
  },
  {
    id: 8,
    titulo: "Fondo Rotatorio de Proyectos de Ingeniería",
    descripcion: "Destinado a la elaboración de proyectos y construcciones de ingeniería de todo tipo. Promueve soluciones innovadoras a problemas de infraestructura y desarrollo sostenible.",
    imagenDesc: "Ingenieros de diversas especialidades colaborando en el diseño de infraestructuras sostenibles con planos y maquetas",
    detalles: [
      "Diseño y construcción de infraestructuras sostenibles",
      "Desarrollo de soluciones innovadoras de ingeniería",
      "Implementación de tecnologías limpias en proyectos constructivos",
      "Formación en ingeniería aplicada a la sostenibilidad",
      "Consultoría para proyectos de ingeniería social"
    ],
    proyectos: [
      { nombre: "Centro de Innovación en Ingeniería Sostenible", estado: "Planificación" },
      { nombre: "Programa de Infraestructuras Comunitarias", estado: "En desarrollo" },
      { nombre: "Laboratorio de Soluciones Técnicas Apropiadas", estado: "Activo" }
    ]
  },
  {
    id: 9,
    titulo: "Fondo Rotatorio Comercial",
    descripcion: "Enfocado en la compra venta y distribución de todo tipo de productos. Busca crear redes de comercio justo y eficiente que beneficien tanto a productores como a consumidores.",
    imagenDesc: "Centro de distribución comercial con personas de diferentes culturas intercambiando productos locales e internacionales",
    detalles: [
      "Desarrollo de redes de comercio justo y directo",
      "Implementación de sistemas de distribución eficientes",
      "Creación de mercados locales y comunitarios",
      "Apoyo a productores para acceso a mercados",
      "Plataformas digitales para comercio sin intermediarios"
    ],
    proyectos: [
      { nombre: "Red de Mercados Comunitarios CHE", estado: "Activo" },
      { nombre: "Plataforma Digital de Comercio Directo", estado: "En desarrollo" },
      { nombre: "Programa de Fortalecimiento a Productores", estado: "Planificación" }
    ]
  },
  {
    id: 10,
    titulo: "Fondo Rotatorio para la Investigación Científica",
    descripcion: "Dedicado al apoyo de la investigación científica en diversas áreas. Promueve el avance del conocimiento como base para el desarrollo económico y social.",
    imagenDesc: "Laboratorio de investigación con científicos diversos trabajando en proyectos innovadores con equipos modernos",
    detalles: [
      "Financiación de proyectos de investigación aplicada",
      "Desarrollo de centros de investigación comunitarios",
      "Programas de ciencia ciudadana y participativa",
      "Becas para investigadores en áreas estratégicas",
      "Divulgación científica para la transformación social"
    ],
    proyectos: [
      { nombre: "Centro de Investigación Social Aplicada", estado: "En desarrollo" },
      { nombre: "Programa de Ciencia Ciudadana", estado: "Activo" },
      { nombre: "Red de Laboratorios Comunitarios", estado: "Planificación" }
    ]
  },
  {
    id: 11,
    titulo: "Fondo Rotatorio para el Desarrollo del Arte y la Cultura",
    descripcion: "Orientado a promover expresiones artísticas y culturales. Busca fomentar la creatividad y preservar la identidad cultural como elementos esenciales del desarrollo humano integral.",
    imagenDesc: "Espacio cultural vibrante con artistas de distintas disciplinas creando y exhibiendo sus obras ante un público diverso",
    detalles: [
      "Creación de centros culturales comunitarios",
      "Apoyo a artistas locales y expresiones tradicionales",
      "Programas de formación artística incluyente",
      "Desarrollo de festivales y eventos culturales",
      "Preservación del patrimonio cultural inmaterial"
    ],
    proyectos: [
      { nombre: "Red de Centros Culturales CHE", estado: "En desarrollo" },
      { nombre: "Festival Itinerante de Artes Integradas", estado: "Activo" },
      { nombre: "Escuela de Formación Artística Comunitaria", estado: "Planificación" }
    ]
  }
];

const FondoDetalle = () => {
  const { id } = useParams();
  const [fondo, setFondo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos una carga de datos
    setLoading(true);
    
    // Buscar el fondo por ID
    const fondoEncontrado = fondosData.find(f => f.id === parseInt(id));
    
    if (fondoEncontrado) {
      setFondo(fondoEncontrado);
    }
    
    setLoading(false);
  }, [id]);

  // Minilogo para "CHE MUNDO LIBRE"
  const MiniLogo = () => (
    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
      CHE
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando información del fondo...</p>
      </div>
    );
  }

  if (!fondo) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', padding: '15px', borderRadius: '4px' }}>
          <p>No se encontró información para el fondo solicitado.</p>
          <Link to="/fondos" style={{ color: '#0056b3', textDecoration: 'underline', display: 'inline-block', marginTop: '10px' }}>
            Volver a todos los fondos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <DevelopmentBanner />
      {/* Encabezado */}
      <div style={{ marginBottom: '25px' }}>
        <Link to="/fondos" style={{ color: 'var(--secondary-color)', marginBottom: '15px', display: 'inline-block' }}>
          ← Volver a todos los fondos
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary-color)', textAlign: 'center', width: '100%' }}>
            <div>{fondo.titulo}</div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
              <CheMiniLogo style={{ height: '30px', width: '60px', verticalAlign: 'middle' }} />
            </div>
          </h1>
        </div>
      </div>

      {/* Imagen principal */}
      <div className="img-container" style={{ marginBottom: '25px', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--box-shadow)' }}>
        <img 
          src={`/images/fondos/fondo-${fondo.id}.png`} 
          alt={`Imagen representativa de ${fondo.titulo}`}
          style={{ width: '100%', height: '250px', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => {
            // Si falla la carga de PNG, intenta con SVG
            e.target.src = `/images/fondos/fondo-${fondo.id}.svg`;
            e.target.onerror = (e2) => {
              // Si también falla SVG, carga el placeholder
              e2.target.onerror = null;
              e2.target.src = "/images/placeholder-400x200.svg";
            };
          }}
        />
      </div>

      {/* Descripción general */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--box-shadow)', padding: '20px', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: 'var(--secondary-color)' }}>Descripción General</h2>
        <p style={{ color: '#333' }}>{fondo.descripcion}</p>
      </div>

      {/* Detalles del fondo */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--box-shadow)', padding: '20px', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: 'var(--secondary-color)' }}>Áreas de Actividad</h2>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: '#333' }}>
          {fondo.detalles.map((detalle, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>{detalle}</li>
          ))}
        </ul>
      </div>

      {/* Proyectos actuales */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--box-shadow)', padding: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: 'var(--secondary-color)' }}>Proyectos Actuales</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '100%', backgroundColor: 'white', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#e6f0ff' }}>
              <tr>
                <th style={{ padding: '10px 15px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Nombre del Proyecto</th>
                <th style={{ padding: '10px 15px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {fondo.proyectos.map((proyecto, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd' }}>{proyecto.nombre}</td>
                  <td style={{ padding: '10px 15px', borderBottom: '1px solid #ddd' }}>
                    <span 
                      style={{
                        display: 'inline-block', 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: proyecto.estado === 'Activo' ? '#d4edda' : 
                                        proyecto.estado === 'En desarrollo' ? '#cce5ff' : '#fff3cd',
                        color: proyecto.estado === 'Activo' ? '#155724' : 
                               proyecto.estado === 'En desarrollo' ? '#004085' : '#856404'
                      }}
                    >
                      {proyecto.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de contacto */}
      <div style={{ backgroundColor: '#e6f0ff', borderRadius: '8px', boxShadow: 'var(--box-shadow)', padding: '20px', marginTop: '25px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: 'var(--secondary-color)' }}>¿Interesado en participar?</h2>
        <p style={{ color: '#333', marginBottom: '15px' }}>
          Si estás interesado en contribuir o participar en este fondo, puedes contactarnos para obtener más información.
        </p>
        <button style={{ 
          backgroundColor: 'var(--secondary-color)', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '4px', 
          border: 'none',
          cursor: 'pointer' 
        }}>
          Contactar
        </button>
      </div>
    </div>
  );
};

export default FondoDetalle;
