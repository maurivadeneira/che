import Image from 'next/image';

export default function SistemasPlataformasPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/06_Sistemas_y_Plataformas.png" 
            alt="Sistemas y Plataformas"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Sistemas y Plataformas</h1>
          <p className="text-lg text-gray-600">Desarrollo tecnológico</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Desarrollo Tecnológico</h2>
          <p className="mb-4">
            Creación y mantenimiento de plataformas tecnológicas que soporten
            la infraestructura digital de CHE y sus proyectos.
          </p>
        </div>
      </div>
    </div>
  );
}
