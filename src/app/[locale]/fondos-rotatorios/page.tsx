'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/TranslationProvider';

export default function FondosRotatoriosPage({ params: { locale } }: { params: { locale: string } }) {
  const { t } = useTranslation();

  const fondos = [
    { id: 1, nameKey: 'business', href: `/${locale}/fondos/inversion-empresarial`, img: '01_Inversion_Empresarial.png', status: 'active' },
    { id: 2, nameKey: 'editorial', href: `/${locale}/fondos/editorial-medios`, img: '02_Editorial_y_Medios.png', status: 'active' },
    { id: 3, nameKey: 'healing', href: `/${locale}/fondos/sanacion-emocional`, img: '03_Sanacion_Emocional.png', status: 'development' },
    { id: 4, nameKey: 'housing', href: `/${locale}/fondos/vivienda`, img: '04_Vivienda.png', status: 'active' },
    { id: 5, nameKey: 'recreation', href: `/${locale}/fondos/recreacion-hotelera`, img: '05_Recreacion_Social.png', status: 'development' },
    { id: 6, nameKey: 'systems', href: `/${locale}/fondos/sistemas-plataformas`, img: '06_Sistemas_y_Plataformas.png', status: 'development' },
    { id: 7, nameKey: 'banking', href: `/${locale}/fondos/bancario`, img: '07_Bancario.png', status: 'development' },
    { id: 8, nameKey: 'engineering', href: `/${locale}/fondos/ingenieria`, img: '08_Ingenieria.png', status: 'development' },
    { id: 9, nameKey: 'commercial', href: `/${locale}/fondos/comercial`, img: '09_Comercial.png', status: 'development' },
    { id: 10, nameKey: 'research', href: `/${locale}/fondos/investigacion-cientifica`, img: '10_Investigacion_Cientifica.png', status: 'development' },
    { id: 11, nameKey: 'culture', href: `/${locale}/fondos/arte-cultura`, img: '11_Arte_y_Cultura.png', status: 'development' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            {t('funds.title')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            {t('funds.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {fondos.map((fondo) => (
            <Link key={fondo.id} href={fondo.href}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 w-full bg-gray-100">
                  <Image
                    src={`/images/fondos/${fondo.img}`}
                    alt={t(`funds.items.${fondo.nameKey}`)}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex justify-between items-start mb-2 md:mb-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      #{fondo.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      fondo.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {t(`funds.status.${fondo.status}`)}
                    </span>
                  </div>
                  
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {t(`funds.items.${fondo.nameKey}`)}
                  </h3>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200">
                    {t('funds.viewDetails')}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
