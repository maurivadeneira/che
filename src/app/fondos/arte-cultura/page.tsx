import Image from 'next/image';

export default function ArteCulturaPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Arte y Cultura - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Manifestaciones artísticas y desarrollo cultural.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Visión</h2>
          <p className="text-gray-600">
            Fomentar la creatividad, preservar el patrimonio cultural y promover 
            manifestaciones artísticas que enriquezcan el tejido social.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Programas</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Apoyo a artistas emergentes</li>
            <li>Preservación del patrimonio cultural</li>
            <li>Festivales y eventos culturales</li>
            <li>Espacios culturales comunitarios</li>
            <li>Educación artística</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
