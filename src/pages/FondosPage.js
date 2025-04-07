import React from 'react';
import { useParams, Routes, Route } from 'react-router-dom';
import CheMiniLogo from '../components/CheMiniLogo';

// Componentes para cada fondo
const FondoInversionEmpresarial = () => (
  <div>
    <h2>Fondo Rotatorio De Inversión Empresarial <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Fondo dedicado a análisis, estudios, proyectos e inversiones empresariales.</p>
    <p>Este fondo permite a la corporación invertir en nuevos proyectos empresariales, realizar estudios de viabilidad económica y financiera, y desarrollar planes de negocio sustentables.</p>
  </div>
);

const FondoEditorialMedios = () => (
  <div>
    <h2>Fondo Rotatorio Editorial y de Medios Audiovisuales <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Dedicado a la generación de medios, videos, películas, publicaciones y divulgación.</p>
    <p>Este fondo permite crear y difundir contenido audiovisual y editorial que promueva los valores y objetivos de la corporación.</p>
  </div>
);

const FondoSanacionEmocional = () => (
  <div>
    <h2>Sanación Emocional <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Para la asistencia social-emocional enmarcada en la medicina alternativa de medios no invasivos.</p>
    <p>Este fondo promueve prácticas de sanación emocional a través de terapias alternativas no invasivas, contribuyendo al bienestar integral de las personas.</p>
  </div>
);

const FondoVivienda = () => (
  <div>
    <h2>Vivienda <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Destinado a la construcción de vivienda.</p>
    <p>Este fondo facilita el acceso a viviendas dignas y económicas a través de diferentes proyectos de construcción y desarrollo inmobiliario.</p>
  </div>
);

const FondoRecreacionHotelera = () => (
  <div>
    <h2>Fondo Rotatorio de Recreación Social y Hotelera <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Para la creación y construcción de proyectos de recreación y hotelería.</p>
    <p>Este fondo desarrolla espacios de esparcimiento, turismo y recreación que fomentan el bienestar y la integración social.</p>
  </div>
);

const FondoSistemasPlataformas = () => (
  <div>
    <h2>Fondo rotatorio de Sistemas y plataformas <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Para la generación de plataformas y software de sistemas y empresarial.</p>
    <p>Este fondo impulsa el desarrollo tecnológico mediante la creación de software y plataformas que optimizan procesos y facilitan la gestión empresarial.</p>
  </div>
);

const FondoBancario = () => (
  <div>
    <h2>Fondo rotatorio Bancario <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Dedicado a operaciones financieras y bancarias.</p>
    <p>Este fondo facilita transacciones financieras y servicios bancarios adaptados a las necesidades de la comunidad y los proyectos de la corporación.</p>
  </div>
);

const FondoProyectosIngenieria = () => (
  <div>
    <h2>Fondo rotatorio de Proyectos de Ingeniería <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Para la elaboración de proyectos y construcciones de ingeniería de todo tipo.</p>
    <p>Este fondo apoya la creación y ejecución de proyectos de ingeniería civil, eléctrica, mecánica y otras ramas, contribuyendo al desarrollo de infraestructuras.</p>
  </div>
);

const FondoComercial = () => (
  <div>
    <h2>Fondo Rotatorio Comercial <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Para la compra venta y distribución de todo tipo de productos.</p>
    <p>Este fondo facilita la comercialización y distribución de productos diversos, generando redes comerciales que beneficien a productores y consumidores.</p>
  </div>
);

const FondoInvestigacionCientifica = () => (
  <div>
    <h2>Fondo rotatorio para la investigación científica <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Dedicado a la investigación científica en diversas áreas.</p>
    <p>Este fondo promueve la investigación y el desarrollo científico en campos diversos que contribuyan al bienestar social y al avance del conocimiento.</p>
  </div>
);

const FondoArteCultura = () => (
  <div>
    <h2>Fondo Rotatorio para el desarrollo del Arte y la Cultura <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>Para el fomento y desarrollo de expresiones artísticas y culturales.</p>
    <p>Este fondo apoya iniciativas artísticas y culturales que enriquezcan la experiencia humana y preserven el patrimonio cultural.</p>
  </div>
);

// Listado general de fondos
const FondosList = () => (
  <div className="fondos-list">
    <h2>Fondos Rotatorios Permanentes <CheMiniLogo style={{ height: '30px', width: '60px' }} /></h2>
    <p>La Corporación CHE cuenta con los siguientes fondos rotatorios permanentes para el desarrollo de sus actividades:</p>
    
    <div className="fondos-grid">
      <div className="fondo-item">
        <h3>1. Inversión Empresarial</h3>
        <p>Análisis, estudios, proyectos e inversiones empresariales.</p>
      </div>
      <div className="fondo-item">
        <h3>2. Editorial y Medios</h3>
        <p>Generación de medios, videos, películas y publicaciones.</p>
      </div>
      <div className="fondo-item">
        <h3>3. Sanación Emocional</h3>
        <p>Asistencia social-emocional con medicina alternativa no invasiva.</p>
      </div>
      <div className="fondo-item">
        <h3>4. Vivienda</h3>
        <p>Construcción de vivienda.</p>
      </div>
      <div className="fondo-item">
        <h3>5. Recreación y Hotelería</h3>
        <p>Proyectos de recreación social y hotelería.</p>
      </div>
      <div className="fondo-item">
        <h3>6. Sistemas y Plataformas</h3>
        <p>Desarrollo de plataformas y software empresarial.</p>
      </div>
      <div className="fondo-item">
        <h3>7. Bancario</h3>
        <p>Operaciones financieras y bancarias.</p>
      </div>
      <div className="fondo-item">
        <h3>8. Proyectos de Ingeniería</h3>
        <p>Elaboración de proyectos y construcciones de ingeniería.</p>
      </div>
      <div className="fondo-item">
        <h3>9. Comercial</h3>
        <p>Compra, venta y distribución de productos.</p>
      </div>
      <div className="fondo-item">
        <h3>10. Investigación Científica</h3>
        <p>Apoyo a la investigación científica.</p>
      </div>
      <div className="fondo-item">
        <h3>11. Arte y Cultura</h3>
        <p>Desarrollo de expresiones artísticas y culturales.</p>
      </div>
    </div>
  </div>
);

// Componente principal
const FondosPage = () => {
  const { fondoId } = useParams();
  
  // Si no hay un fondo específico seleccionado, mostrar el listado general
  if (!fondoId) {
    return <FondosList />;
  }
  
  // Router para los fondos específicos
  return (
    <Routes>
      <Route path="/" element={
        <>
          {fondoId === 'inversion-empresarial' && <FondoInversionEmpresarial />}
          {fondoId === 'editorial-medios' && <FondoEditorialMedios />}
          {fondoId === 'sanacion-emocional' && <FondoSanacionEmocional />}
          {fondoId === 'vivienda' && <FondoVivienda />}
          {fondoId === 'recreacion-hotelera' && <FondoRecreacionHotelera />}
          {fondoId === 'sistemas-plataformas' && <FondoSistemasPlataformas />}
          {fondoId === 'bancario' && <FondoBancario />}
          {fondoId === 'proyectos-ingenieria' && <FondoProyectosIngenieria />}
          {fondoId === 'comercial' && <FondoComercial />}
          {fondoId === 'investigacion-cientifica' && <FondoInvestigacionCientifica />}
          {fondoId === 'arte-cultura' && <FondoArteCultura />}
        </>
      } />
    </Routes>
  );
};

export default FondosPage;
