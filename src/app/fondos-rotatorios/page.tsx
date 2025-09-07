import Link from 'next/link';
import Image from 'next/image';

export default function FondosRotatoriosPage() {
  const fondos = [
    { id: 1, name: 'Inversión Empresarial', href: '/fondos/inversion-empresarial', img: '01_Inversion_Empresarial.png', status: 'Activo' },
    { id: 2, name: 'Editorial y Medios Audiovisuales', href: '/fondos/editorial-medios', img: '02_Editorial_y_Medios.png', status: 'Activo' },
    { id: 3, name: 'Sanación Emocional', href: '/fondos/sanacion-emocional', img: '03_Sanacion_Emocional.png', status: 'En desarrollo' },
    { id: 4, name: 'Vivienda', href: '/fondos/vivienda', img: '04_Vivienda.png', status: 'En desarrollo' },
    { id: 5, name: 'Recreación Social y Hotelera', href: '/fondos/recreacion-hotelera', img: '05_Recreacion_Social.png', status: 'En desarrollo' },
    { id: 6, name: 'Sistemas y Plataformas', href: '/fondos/sistemas-plataformas', img: '06_Sistemas_y_Plataformas.png', status: 'Activo' },
    { id: 7, name: 'Bancario', href: '/fondos/bancario', img: '07_Bancario.png', status: 'En desarrollo' },
    { id: 8, name: 'Proyectos de Ingeniería', href: '/fondos/ingenieria', img: '08_Ingenieria.png', status: 'En desarrollo' },
    { id: 9, name: 'Comercial', href: '/fondos/comercial', img: '09_Comercial.png', status: 'En desarrollo' },
    { id: 10, name: 'Investigación Científica', href: '/fondos/investigacion-cientifica', img: '10_Investigacion_Cientifica.png', status: 'En desarrollo' },
    { id: 11, name: 'Arte y Cultura', href: '/fondos/arte-cultura', img: '11_Arte_y_Cultura.png', status: 'En desarrollo' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Los 11 Fondos Rotatorios CHE</h1>
      <p className="text-lg mb-8">
        Estructura estatutaria de la Corporación Herejía Económica para el desarrollo global
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fondos.map((fondo) => (
          <Link 
            key={fondo.id} 
            href={fondo.href}
            className="group bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="relative w-full h-32 mb-4 overflow-hidden rounded-lg">
                <Image 
                  src={`/images/fondos/${fondo.img}`} 
                  alt={fondo.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-600">#{fondo.id}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  fondo.status === 'Activo' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {fondo.status}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {fondo.name}
              </h3>
              
              <div className="text-blue-600 text-sm font-medium group-hover:underline">
                Ver detalles →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Información General</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Fondos Activos</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Inversión Empresarial</li>
              <li>• Editorial y Medios</li>
              <li>• Sistemas y Plataformas</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">En Desarrollo</h3>
            <p className="text-gray-600">
              8 fondos adicionales en fase de planificación y desarrollo gradual 
              según las necesidades de expansión de CHE.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
