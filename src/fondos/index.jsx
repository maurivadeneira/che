import React from 'react';
import { Link } from 'react-router-dom';

// Componente para un Fondo Rotatorio individual
const FondoRotatorio = ({ titulo, descripcion, imagenDesc, id }) => {
  // Minilogo para "CHE MUNDO LIBRE"
  const MiniLogo = () => (
    <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-1">
      CHE
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-lg shadow-md m-2 overflow-hidden flex-1 flex flex-col max-w-md hover:shadow-lg transition-shadow duration-300">
      {/* Primer contenedor: Título y minilogo */}
      <div className="bg-blue-100 p-4 border-b border-gray-300">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-blue-800">{titulo}</h3>
          <span className="text-blue-800 mx-1">(</span>
          <div className="flex items-center">
            <MiniLogo />
            <span className="text-xs font-bold text-blue-800">MUNDO LIBRE</span>
          </div>
          <span className="text-blue-800 ml-1">)</span>
        </div>
      </div>
      
      {/* Segundo contenedor: Imagen (placeholder) */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={`/images/fondos/fondo-${id}.jpg`} 
          alt={`Imagen representativa de ${titulo}`} 
          className="w-full h-full object-cover"
          title={imagenDesc}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/placeholder-400x200.jpg";
          }}
        />
      </div>
      
      {/* Tercer contenedor: Objetivos */}
      <div className="p-4 bg-white flex-grow">
        <h4 className="font-semibold mb-2 text-gray-700">Objetivos:</h4>
        <p className="text-sm text-gray-600 mb-4">{descripcion}</p>
        
        <div className="flex justify-end items-center mt-auto">
          <Link 
            to={`/fondos/${id}`} 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">Fondos Rotatorios C.H.E. MUNDO LIBRE</h1>
      <div className="flex flex-wrap justify-center">
        {fondos.map(fondo => (
          <div key={fondo.id} className="w-full md:w-1/2 p-2">
            <FondoRotatorio 
              id={fondo.id}
              titulo={fondo.titulo}
              descripcion={fondo.descripcion}
              imagenDesc={fondo.imagenDesc}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FondosRotatoriosCHE;
