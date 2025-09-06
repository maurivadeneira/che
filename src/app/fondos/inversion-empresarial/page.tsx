import Image from 'next/image';

export default function InversionEmpresarialPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Inversión Empresarial - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Proyectos de inversión y emprendimiento para el desarrollo económico.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Objetivo del Fondo</h2>
          <p className="text-gray-600">
            Facilitar el acceso a capital de inversión para emprendedores y empresas que buscan 
            expandir sus operaciones o desarrollar nuevos proyectos innovadores.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Tipos de Inversión</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Capital semilla para startups</li>
            <li>Expansión de empresas existentes</li>
            <li>Proyectos de innovación tecnológica</li>
            <li>Inversiones en economía sostenible</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Proceso de Aplicación</h2>
          <p className="text-gray-600">
            Los interesados pueden presentar sus propuestas de inversión a través de nuestro 
            portal en línea, donde serán evaluadas por nuestro equipo de expertos.
          </p>
        </section>
      </div>
    </div>
  );
}
