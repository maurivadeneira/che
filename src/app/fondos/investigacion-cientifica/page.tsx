import Image from 'next/image';

export default function InvestigacionCientificaPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/images/fondos/10_Investigacion_Cientifica.png" 
            alt="Investigación Científica"
            width={400}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-6 mb-4">Investigación Científica</h1>
          <p className="text-lg text-gray-600">Investigación y desarrollo</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Investigación y Desarrollo</h2>
          <p className="mb-4">
            Proyectos de investigación científica que aporten nuevos conocimientos
            y soluciones innovadoras a los desafíos económicos globales.
          </p>
        </div>
      </div>
    </div>
  );
}
