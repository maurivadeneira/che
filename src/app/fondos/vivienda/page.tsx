import Image from 'next/image';

export default function ViviendaPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/04_Vivienda.png" 
            alt="Vivienda"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Vivienda</h1>
          <p className="text-lg text-gray-600">Proyectos habitacionales</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Proyectos de Vivienda</h2>
          <p className="mb-4">
            El Fondo de Vivienda CHE se enfoca en desarrollar proyectos habitacionales
            accesibles y sostenibles que promuevan la libertad económica.
          </p>
        </div>
      </div>
    </div>
  );
}
