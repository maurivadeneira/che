import React from 'react';
import CheMiniLogo from '../components/CheMiniLogo.js';

const AboutPage = () => {
  return (
    <div className="about-page">
      <h2>Sobre Nosotros <CheMiniLogo style={{ height: '25px', width: '50px' }} /></h2>
      
      <div className="mission-section">
        <h3>Nuestra Misión <CheMiniLogo style={{ height: '20px', width: '40px' }} /></h3>
        <p>
          La CORPORACION HEREJIA ECONOMICA (C.H.E. MUNDO LIBRE) tiene por objeto divulgar y 
          hacer realidad las ideas económicas de la "HEREJIA ECONOMICA", teoría económica basada 
          en las investigaciones juiciosas y científicas del profesor Mauricio Rivadeneira Mora, 
          físico y economista, tendientes a lograr que todas las personas y países sean económicamente libres.
        </p>
        <p>
          Buscamos un mundo donde la humanidad pase a un estadio superior, y no tenga que seguir 
          luchando por la sobrevivencia, sino que pueda enfocarse en su desarrollo integral como seres 
          humanos.
        </p>
      </div>
      
      <div className="quote">
        "Un mundo donde la humanidad pase a un estadio superior, y no tenga que seguir luchando por la sobrevivencia."
      </div>
      
      <div className="vision-section">
        <h3>Nuestros Objetivos <CheMiniLogo style={{ height: '20px', width: '40px' }} /></h3>
        <p>
          La CORPORACION HEREJIA ECONOMICA (C.H.E. MUNDO LIBRE) tiene como objetivo promover la libertad 
          económica de los individuos y países, según se desprende de las tesis de la teoría HEREJIA ECONOMICA 
          escrita por Mauricio Rivadeneira Mora.
        </p>
        <p>
          Para el cumplimiento de su objetivo se ejecutarán procesos que permitan a los individuos generar 
          ingresos, se crearán empresas, se generarán procesos educativos que permitan conocer el sistema 
          empresarial, se promoverá la educación virtual y presencial, y toda actividad lícita y 
          preferentemente de tecnología limpia según lo permita el desarrollo de la tecnología, tendientes 
          a mejorar el statu quo de los individuos.
        </p>
        <p>
          Promoveremos el arte y la cultura y la investigación científica. Para el desarrollo de su objeto 
          también podrá hacer uso del mercadeo multinivel, y comercialización y mercadeo en red.
        </p>
      </div>
      
      <div className="activities-section">
        <h3>Nuestras Actividades <CheMiniLogo style={{ height: '20px', width: '40px' }} /></h3>
        <p>Entre nuestras actividades principales se encuentran:</p>
        <ul>
          <li>Promover actividades que permitan mantener o aumentar el patrimonio de la Corporación.</li>
          <li>Velar porque los ingresos de la corporación se mantengan, y las ideas de la HEREJIA ECONOMICA se difundan simultáneamente.</li>
          <li>Conformar fondos rotatorios que permitan desarrollar actividades propias de la Corporación.</li>
          <li>Integrar comités de estudio e investigación, de carácter permanente.</li>
          <li>Realizar Congresos, Foros y Seminarios para actualizar, discutir, evaluar y presentar conclusiones sobre los diferentes temas.</li>
          <li>Promover la educación superior del nivel tecnológico y profesional.</li>
          <li>Crear entidades de carácter asistencial-social para el servicio de sus integrantes y de los sectores sociales.</li>
          <li>Promover actividades culturales, cívicas y sociales a favor de la institución y de sus integrantes, y de las comunidades.</li>
        </ul>
      </div>
      
      <div className="values-section">
        <h3>Nuestros Fondos Rotatorios <CheMiniLogo style={{ height: '20px', width: '40px' }} /></h3>
        <p>
          La Corporación ha establecido fondos rotatorios permanentes que son la base para el desarrollo 
          de sus actividades y objetivos. Cada uno de estos fondos está diseñado para abordar un área 
          específica que contribuye a nuestra misión global.
        </p>
        <p>
          A través de estos fondos, canalizamos recursos, conocimientos y esfuerzos para generar un impacto 
          positivo en la sociedad y avanzar hacia un mundo donde la libertad económica sea una realidad para todos.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
