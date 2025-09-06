import Image from 'next/image';

export default function IngenieriaPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/08_Ingenieria.png" 
            alt="Proyectos de Ingeniería"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Proyectos de Ingeniería</h1>
          <p className="text-lg text-gray-600">Infraestructura y construcción</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Infraestructura</h2>
          <p className="mb-4">
            Proyectos de ingeniería e infraestructura que apoyen el desarrollo
            sostenible y la implementación de tecnologías limpias.
          </p>
        </div>
      </div>
    </div>
  );
}
