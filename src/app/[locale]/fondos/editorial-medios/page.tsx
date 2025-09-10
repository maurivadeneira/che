import Image from 'next/image';
import { LogoInstitucional } from '@/components/common/LogoInstitucional';

export default function EditorialMediosPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/02_Editorial_y_Medios.png"
            alt="Editorial y Medios Audiovisuales - CHE Mundo Libre"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Editorial y Medios Audiovisuales - CHE Mundo Libre</h1>
        <div className="flex justify-center mt-2">
        <div className="relative h-10 w-10">
          <Image src="/images/che-mini-logo.svg" alt="CHE" fill className="object-contain" />
        </div>
        </div>
      </div>
      
      <p className="text-lg mb-8">Publicaciones y contenido multimedia para la difusión del conocimiento.</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Misión</h2>
          <p className="text-gray-600">
            Promover la creación, producción y distribución de contenido editorial y audiovisual 
            que contribuya al desarrollo intelectual y cultural de la sociedad.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Servicios</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Publicación de libros y artículos académicos</li>
            <li>Producción de contenido audiovisual educativo</li>
            <li>Plataformas digitales de distribución</li>
            <li>Apoyo a autores independientes</li>
          </ul>
        </section>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <LogoInstitucional size="lg" />
      </div>
    </div>
  );
}
