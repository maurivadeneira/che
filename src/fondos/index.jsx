import React from 'react';
import { Link } from 'react-router-dom';
import CheMiniLogo from '../components/CheMiniLogo.js';
import DevelopmentBanner from '../components/common/DevelopmentBanner.js';
import FondosSvgCollection from '../components/FondosSvgCollection';
import ListImageViewer from './components/ListImageViewer';
import './components/fondos.css';

// Componente para un Fondo Rotatorio individual
const FondoRotatorio = ({ titulo, descripcion, imagenDesc, id }) => {
  return (
    <div className="fund-card" style={{ border: '1px solid #e0e0e0', borderRadius: 'var(--border-radius)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Primer contenedor: Título y minilogo */}
      <div style={{ backgroundColor: 'var(--light-color)', padding: '15px', borderBottom: '1px solid #e0e0e0' }}>
        <h3 style={{ color: 'var(--secondary-color)', marginBottom: '5px', textAlign: 'center' }}>
          <div>{titulo}</div>
          <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'center' }}>
            <CheMiniLogo style={{ height: '20px', width: '40px', verticalAlign: 'middle' }} />
          </div>
        </h3>
      </div>
      
      {/* Segundo contenedor: Imagen usando ListImageViewer */}
      <ListImageViewer 
        imageId={id}
        alt={`Imagen representativa de ${titulo}`}
        className="fondo-image-container"
      />
      
      {/* Tercer contenedor: Objetivos */}
      <div style={{ padding: '15px', backgroundColor: 'white', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '10px', color: 'var(--secondary-color)' }}>Objetivos:</h4>
        <p style={{ fontSize: '0.9rem', marginBottom: '15px', flexGrow: 1 }}>{descripcion}</p>
        
        <div style={{ marginTop: 'auto', textAlign: 'right' }}>
          <Link 
            to={`/fondos/${id}/inicio`} 
            className="cta-button"
            style={{ display: 'inline-block', padding: '8px 15px', backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            Ver más detalles →
          </Link>
        </div>
      </div>
    </div>
  );
};

// Componente principal que contiene todos los fondos
const FondosRotatoriosCHE = () => {
  // Datos de todos los fondos
  const fondos = [
    {
      id: 1,
      titulo: "Fondo Rotatorio De Inversión Empresarial",
      descripcion: "Dedicado al análisis, estudios, proyectos e inversiones empresariales. Busca fomentar el desarrollo de nuevas empresas y fortalecer las existentes siguiendo los principios de la Herejía Económica, generando oportunidades de crecimiento económico sostenible.",
      imagenDesc: "Equipo diverso de profesionales analizando proyectos de inversión en una oficina moderna con gráficos de crecimiento"
    },
    {
      id: 2,
      titulo: "Fondo Rotatorio Editorial y de Medios Audiovisuales",
      descripcion: "Enfocado en la generación de medios, videos, películas, publicaciones y divulgación de las ideas de la Herejía Económica. Promueve la creación de contenido educativo e informativo accesible para todos los públicos.",
      imagenDesc: "Estudio de producción audiovisual con personas trabajando en edición de videos y diseño editorial"
    },
    {
      id: 3,
      titulo: "Fondo Rotatorio de Sanación Emocional",
      descripcion: "Orientado a la asistencia social-emocional enmarcada en la medicina alternativa de medios no invasivos. Busca el bienestar integral de las personas como base para su libertad económica.",
      imagenDesc: "Espacio tranquilo de terapia con profesionales atendiendo a personas en un ambiente natural y relajante"
    },
    {
      id: 4,
      titulo: "Fondo Rotatorio de Vivienda",
      descripcion: "Destinado a la construcción de vivienda accesible y de calidad. Promueve soluciones habitacionales innovadoras que permitan a las personas acceder a un hogar digno como parte fundamental de su desarrollo.",
      imagenDesc: "Proyecto de viviendas sostenibles con arquitectos y trabajadores construyendo en comunidad"
    },
    {
      id: 5,
      titulo: "Fondo Rotatorio de Recreación Social y Hotelera",
      descripcion: "Enfocado en la creación y construcción de proyectos de recreación y hotelería. Busca desarrollar espacios de descanso y esparcimiento que generen bienestar y nuevas oportunidades económicas.",
      imagenDesc: "Complejo turístico sostenible con familias disfrutando de actividades recreativas en un entorno natural"
    },
    {
      id: 6,
      titulo: "Fondo Rotatorio de Sistemas y Plataformas",
      descripcion: "Dedicado a la generación de plataformas y software de sistemas y empresarial. Impulsa el desarrollo tecnológico como herramienta fundamental para la libertad económica en la era digital.",
      imagenDesc: "Equipo diverso de programadores y diseñadores trabajando en el desarrollo de plataformas digitales innovadoras"
    },
    {
      id: 7,
      titulo: "Fondo Rotatorio Bancario",
      descripcion: "Orientado a crear soluciones financieras inclusivas. Busca desarrollar alternativas al sistema bancario tradicional que permitan el acceso a servicios financieros para todos.",
      imagenDesc: "Oficina moderna con asesores financieros atendiendo a clientes diversos y pantallas mostrando sistemas bancarios alternativos"
    },
    {
      id: 8,
      titulo: "Fondo Rotatorio de Proyectos de Ingeniería",
      descripcion: "Destinado a la elaboración de proyectos y construcciones de ingeniería de todo tipo. Promueve soluciones innovadoras a problemas de infraestructura y desarrollo sostenible.",
      imagenDesc: "Ingenieros de diversas especialidades colaborando en el diseño de infraestructuras sostenibles con planos y maquetas"
    },
    {
      id: 9,
      titulo: "Fondo Rotatorio Comercial",
      descripcion: "Enfocado en la compra venta y distribución de todo tipo de productos. Busca crear redes de comercio justo y eficiente que beneficien tanto a productores como a consumidores.",
      imagenDesc: "Centro de distribución comercial con personas de diferentes culturas intercambiando productos locales e internacionales"
    },
    {
      id: 10,
      titulo: "Fondo Rotatorio para la Investigación Científica",
      descripcion: "Dedicado al apoyo de la investigación científica en diversas áreas. Promueve el avance del conocimiento como base para el desarrollo económico y social.",
      imagenDesc: "Laboratorio de investigación con científicos diversos trabajando en proyectos innovadores con equipos modernos"
    },
    {
      id: 11,
      titulo: "Fondo Rotatorio para el Desarrollo del Arte y la Cultura",
      descripcion: "Orientado a promover expresiones artísticas y culturales. Busca fomentar la creatividad y preservar la identidad cultural como elementos esenciales del desarrollo humano integral.",
      imagenDesc: "Espacio cultural vibrante con artistas de distintas disciplinas creando y exhibiendo sus obras ante un público diverso"
    }
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <DevelopmentBanner />
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--secondary-color)', fontSize: '1.8rem' }}>
        <div>Fondos Rotatorios C.H.E. MUNDO LIBRE</div>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <CheMiniLogo style={{ height: '30px', width: '60px', verticalAlign: 'middle' }} />
        </div>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '30px', overflow: 'visible' }}>
        {fondos.map(fondo => (
          <FondoRotatorio 
            key={fondo.id}
            id={fondo.id}
            titulo={fondo.titulo}
            descripcion={fondo.descripcion}
            imagenDesc={fondo.imagenDesc}
          />
        ))}
      </div>
    </div>
  );
};

export default FondosRotatoriosCHE;
