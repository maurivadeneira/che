import Image from 'next/image';
import { LogoInstitucional } from '@/components/common/LogoInstitucional';

export default function SanacionEmocionalPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/03_Sanacion_Emocional.png"
            alt="Sanación Emocional - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Sanación Emocional - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10">
          <Image src="/images/che-mini-logo.svg" alt="CHE" fill className="object-contain" />
        </div>
      </div>
      
      <p className="text-lg mb-8">Bienestar emocional (en desarrollo).</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Estado Actual</h2>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">
              <strong>En Desarrollo:</strong> Este fondo está siendo estructurado y desarrollado gradualmente.
            </p>
          </div>
        </section>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <LogoInstitucional size="lg" />
      </div>
    </div>
  );
}
