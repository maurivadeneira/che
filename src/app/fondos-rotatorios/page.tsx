// REEMPLAZAR TODO EN: src/app/fondos-rotatorios/page.tsx

import Image from 'next/image';
import Link from 'next/link';

const fondos = [
  { id: 1, name: 'Inversión Empresarial', href: '/fondos/inversion-empresarial', img: '01_Inversion_Empresarial.png', status: 'Activo' },
  { id: 2, name: 'Editorial y Medios Audiovisuales', href: '/fondos/editorial-medios', img: '02_Editorial_y_Medios.png', status: 'Activo' },
  { id: 3, name: 'Sanación Emocional', href: '/fondos/sanacion-emocional', img: '03_Sanacion_Emocional.png', status: 'En desarrollo' },
  { id: 4, name: 'Vivienda', href: '/fondos/vivienda', img: '04_Vivienda.png', status: 'Activo' },
  { id: 5, name: 'Recreación Social y Hotelera', href: '/fondos/recreacion-hotelera', img: '05_Recreacion_Social.png', status: 'En desarrollo' },
  { id: 6, name: 'Sistemas y Plataformas', href: '/fondos/sistemas-plataformas', img: '06_Sistemas_y_Plataformas.png', status: 'En desarrollo' },
  { id: 7, name: 'Bancario', href: '/fondos/bancario', img: '07_Bancario.png', status: 'En desarrollo' },
  { id: 8, name: 'Proyectos de Ingeniería', href: '/fondos/ingenieria', img: '08_Ingenieria.png', status: 'En desarrollo' },
  { id: 9, name: 'Comercial', href: '/fondos/comercial', img: '09_Comercial.png', status: 'En desarrollo' },
  { id: 10, name: 'Investigación Científica', href: '/fondos/investigacion-cientifica', img: '10_Investigacion_Cientifica.png', status: 'En desarrollo' },
  { id: 11, name: 'Arte y Cultura', href: '/fondos/arte-cultura', img: '11_Arte_y_Cultura.png', status: 'En desarrollo' },
];

export default function FondosRotatoriosPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header responsive */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Los 11 Fondos Rotatorios CHE
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            Estructura estatutaria de la Corporación Herejía Económica para el desarrollo global
          </p>
        </div>

        {/* Grid responsive de fondos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {fondos.map((fondo) => (
            <Link key={fondo.id} href={fondo.href}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                {/* Imagen responsive */}
                <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 w-full bg-gray-100">
                  <Image
                    src={`/images/fondos/${fondo.img}`}
                    alt={fondo.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Contenido */}
                <div className="p-3 sm:p-4 md:p-6">
                  {/* Badge de estado */}
                  <div className="flex justify-between items-start mb-2 md:mb-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      #{fondo.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      fondo.status === 'Activo' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {fondo.status}
                    </span>
                  </div>
                  
                  {/* Título */}
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {fondo.name}
                  </h3>
                  
                  {/* Botón */}
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200">
                    Ver detalles
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Información adicional responsive */}
        <div className="mt-8 md:mt-16 bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                Sobre los Fondos Rotatorios
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-3 md:mb-4">
                Los 11 Fondos Rotatorios constituyen la estructura operativa de CHE Mundo Libre, 
                diseñados para impulsar el desarrollo económico y social a nivel global.
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Cada fondo tiene objetivos específicos y opera de manera autónoma, 
                contribuyendo al ecosistema general de la Corporación Herejía Económica.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                Estados de Desarrollo
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center text-sm sm:text-base">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-gray-600">Activo: Operativo y funcionando</span>
                </div>
                <div className="flex items-center text-sm sm:text-base">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                  <span className="text-gray-600">En desarrollo: Fase de estructuración</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}