import Image from 'next/image';

export default function InvestigacionCientificaPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/10_Investigacion_Cientifica.png"
            alt="Investigación Científica - CHE Mundo Libre - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Investigación Científica - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10 mx-auto">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Investigación, desarrollo e innovación científica.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Misión</h2>
          <p className="text-gray-600">
            Promover la investigación científica que contribuya al avance del conocimiento 
            y al desarrollo de soluciones innovadoras para los desafíos sociales y económicos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Líneas de Investigación</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Economía experimental y social</li>
            <li>Tecnologías disruptivas</li>
            <li>Sostenibilidad ambiental</li>
            <li>Innovación en salud</li>
            <li>Ciencias sociales aplicadas</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
