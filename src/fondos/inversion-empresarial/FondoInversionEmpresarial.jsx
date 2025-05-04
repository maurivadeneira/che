import React from 'react';

const FondoInversionEmpresarial = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white p-8 text-center">
        <h1 className="text-3xl font-bold">Fondo Rotatorio de Inversión Empresarial</h1>
      </header>
      
      <main className="flex-grow flex p-8 gap-8">
        <div className="flex-1 flex justify-center items-center">
          <img 
            src="/fondos-rotatorios-imagenes.svg#svgView(viewBox(0,0,600,300))" 
            alt="Fondo de Inversión Empresarial" 
            className="max-w-full rounded-lg shadow-lg"
          />
        </div>
        
        <div className="flex-1 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Descripción del Fondo</h2>
          <p className="mb-4 text-gray-600">
            El Fondo Rotatorio de Inversión Empresarial de la Corporación Herejía Económica 
            tiene como objetivo fundamental analizar, estudiar y desarrollar proyectos 
            empresariales innovadores que promuevan la libertad económica.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Objetivos Principales:</h3>
          <ul className="list-disc list-inside mb-4 text-gray-600">
            <li>Identificar oportunidades de inversión estratégicas</li>
            <li>Realizar estudios de viabilidad empresarial</li>
            <li>Impulsar proyectos que generen valor económico y social</li>
            <li>Fomentar la innovación y el emprendimiento</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Líneas de Acción:</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Análisis de mercados emergentes</li>
            <li>Evaluación de proyectos de inversión</li>
            <li>Desarrollo de estrategias de crecimiento empresarial</li>
            <li>Apoyo a emprendimientos con potencial transformador</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default FondoInversionEmpresarial;