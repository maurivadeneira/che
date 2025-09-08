import Image from 'next/image';

export default function IngenieriaPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/08_Ingenieria.png"
            alt="Proyectos de Ingeniería - CHE Mundo Libre - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Proyectos de Ingeniería - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Infraestructura, construcción y desarrollo técnico.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Objetivo</h2>
          <p className="text-gray-600">
            Ejecutar proyectos de ingeniería que contribuyan al desarrollo sostenible 
            y mejoren la calidad de vida de las comunidades.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Especialidades</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Ingeniería civil y construcción</li>
            <li>Infraestructura sostenible</li>
            <li>Proyectos de energías renovables</li>
            <li>Sistemas de agua y saneamiento</li>
            <li>Infraestructura tecnológica</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
