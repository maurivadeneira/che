import Image from 'next/image';
import { LogoInstitucional } from '@/components/common/LogoInstitucional';

export default function ViviendaPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <div className="relative h-80 w-full rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/04_Vivienda.png"
            alt="Vivienda - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Vivienda - CHE Mundo Libre</h1>
        <div className="flex justify-center mt-2">
          <div className="relative h-10 w-10">
            <Image
              src="/images/che-mini-logo.svg"
              alt="CHE"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <p className="text-lg">Soluciones habitacionales sostenibles (en desarrollo).</p>
      </div>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Estado Actual</h2>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">
              <strong>En Desarrollo:</strong> Este fondo está en planificación.
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
