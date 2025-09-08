import Image from 'next/image';

export default function SistemasPlataformasPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/06_Sistemas_y_Plataformas.png"
            alt="Sistemas y Plataformas - CHE Mundo Libre - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Sistemas y Plataformas - CHE Mundo Libre</h1>
        <div className="relative h-10 w-10">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-lg mb-8">Desarrollo tecnológico e innovación digital.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Misión</h2>
          <p className="text-gray-600">
            Impulsar la transformación digital y el desarrollo de tecnologías que 
            faciliten la implementación de los principios de la Herejía Económica.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Líneas de Desarrollo</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Plataformas de economía colaborativa</li>
            <li>Sistemas de gestión empresarial</li>
            <li>Aplicaciones fintech</li>
            <li>Infraestructura tecnológica</li>
            <li>Soluciones de automatización</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
