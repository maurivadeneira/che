import Image from 'next/image';

export default function ViviendaPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Vivienda - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Proyectos habitacionales y desarrollo urbano sostenible.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Objetivo</h2>
          <p className="text-gray-600">
            Facilitar el acceso a vivienda digna y promover el desarrollo de proyectos 
            habitacionales sostenibles y accesibles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Programas</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Vivienda de interés social</li>
            <li>Proyectos de vivienda sostenible</li>
            <li>Mejoramiento de barrios</li>
            <li>Financiamiento para primera vivienda</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
