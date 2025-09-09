import Image from 'next/image';

export default function BancarioPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/07_Bancario.png"
            alt="Bancario - CHE Mundo Libre - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Bancario - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10 mx-auto">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Servicios financieros alternativos y banca ética.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Visión</h2>
          <p className="text-gray-600">
            Desarrollar servicios financieros que apoyen los principios de la economía libre 
            y faciliten el acceso a recursos financieros de manera justa y transparente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Servicios</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Microcréditos para emprendedores</li>
            <li>Banca comunitaria</li>
            <li>Servicios de ahorro colaborativo</li>
            <li>Financiamiento de proyectos sociales</li>
            <li>Educación financiera</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
