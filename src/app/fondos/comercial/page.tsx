import Image from 'next/image';

export default function ComercialPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/09_Comercial.png"
            alt="Comercial - CHE Mundo Libre - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Comercial - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Actividades comerciales y desarrollo de mercados.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Propósito</h2>
          <p className="text-gray-600">
            Facilitar el desarrollo de actividades comerciales que promuevan 
            el intercambio justo y el crecimiento económico equitativo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Áreas de Acción</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Comercio justo y sostenible</li>
            <li>Desarrollo de mercados locales</li>
            <li>Comercio electrónico</li>
            <li>Cadenas de suministro éticas</li>
            <li>Cooperativas comerciales</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
