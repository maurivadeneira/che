import Image from 'next/image';

export default function RecreacionHoteleraPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/05_Recreacion_Social.png" 
            alt="Recreación Social y Hotelera"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Recreación Social y Hotelera</h1>
          <p className="text-lg text-gray-600">Turismo y entretenimiento</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Proyectos de Recreación</h2>
          <p className="mb-4">
            Desarrollo de proyectos turísticos y de entretenimiento que fomenten
            la recreación social y generen oportunidades económicas.
          </p>
        </div>
      </div>
    </div>
  );
}
