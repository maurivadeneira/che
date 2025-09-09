import Image from 'next/image';

export default function RecreacionHoteleraPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/05_Recreacion_Social.png"
            alt="Recreación Social y Hotelera - CHE Mundo Libre - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Recreación Social y Hotelera - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10 mx-auto">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Turismo, entretenimiento y desarrollo de espacios recreativos.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Enfoque</h2>
          <p className="text-gray-600">
            Promover el desarrollo de la industria turística y recreativa, generando 
            espacios de esparcimiento que contribuyan al bienestar social y económico.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Áreas de Inversión</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Desarrollo hotelero y turístico</li>
            <li>Centros recreativos y deportivos</li>
            <li>Turismo ecológico y sostenible</li>
            <li>Eventos culturales y sociales</li>
            <li>Infraestructura recreativa comunitaria</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
