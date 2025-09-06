import Image from 'next/image';

export default function InversionEmpresarialPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/01_Inversion_Empresarial.png" 
            alt="Inversión Empresarial"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Inversión Empresarial</h1>
          <p className="text-lg text-gray-600">Proyectos de inversión y emprendimiento</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Descripción del Fondo</h2>
          <p className="mb-4">
            El Fondo de Inversión Empresarial de CHE está dedicado a apoyar proyectos 
            de emprendimiento que alineen con la visión de libertad económica global.
          </p>
          
          <h3 className="text-xl font-semibold mb-2">Objetivos:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Financiar startups innovadoras</li>
            <li>Apoyar emprendimientos sociales</li>
            <li>Crear redes de colaboración empresarial</li>
            <li>Fomentar la economía alternativa</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
