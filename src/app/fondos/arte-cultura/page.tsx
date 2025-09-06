import Image from 'next/image';

export default function ArteCulturaPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/11_Arte_y_Cultura.png" 
            alt="Arte y Cultura"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Arte y Cultura</h1>
          <p className="text-lg text-gray-600">Manifestaciones artísticas y culturales</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Proyectos Culturales</h2>
          <p className="mb-4">
            Promoción y desarrollo de manifestaciones artísticas y culturales
            que enriquezcan la propuesta social de CHE.
          </p>
        </div>
      </div>
    </div>
  );
}
