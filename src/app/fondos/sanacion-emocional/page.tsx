import Image from 'next/image';

export default function SanacionEmocionalPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Sanación Emocional - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Bienestar emocional y desarrollo personal (en desarrollo).</p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">En Desarrollo</h3>
        <p className="text-yellow-700">
          Este fondo se encuentra actualmente en fase de desarrollo debido a consideraciones 
          legales y regulatorias específicas del sector de bienestar emocional.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Visión Futura</h2>
          <p className="text-gray-600">
            Desarrollar programas integrales de bienestar emocional que promuevan 
            la salud mental y el crecimiento personal.
          </p>
        </section>
      </div>
    </div>
  );
}
