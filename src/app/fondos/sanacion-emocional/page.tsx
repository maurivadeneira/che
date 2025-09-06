import Image from 'next/image';

export default function SanacionEmocionalPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/03_Sanacion_Emocional.png" 
            alt="Sanación Emocional"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Sanación Emocional</h1>
          <p className="text-lg text-gray-600">Bienestar emocional y desarrollo personal</p>
        </div>
        
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold">En desarrollo: </strong>
          <span>Este fondo está en fase de planificación y desarrollo. Próximamente disponible.</span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Proyectos de Bienestar</h2>
          <p className="mb-4">
            El Fondo de Sanación Emocional se enfocará en proyectos que promuevan
            el bienestar emocional, el desarrollo personal y la salud mental
            de los miembros de la comunidad CHE.
          </p>
          
          <h3 className="text-xl font-semibold mb-2">Objetivos planeados:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Programas de desarrollo personal</li>
            <li>Talleres de bienestar emocional</li>
            <li>Apoyo comunitario y redes de soporte</li>
            <li>Recursos educativos sobre salud mental</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
