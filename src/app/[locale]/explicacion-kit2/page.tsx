'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/providers/TranslationProvider';

export default function ExplicacionKit2Page() {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">{t('kit2.title')}</h1>
      <p className="text-lg mb-8">{t('kit2.subtitle')}</p>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('kit2.whatIs')}</h2>
        <p className="mb-4">
          {t('kit2.description')}
        </p>
        
        <h3 className="text-xl font-semibold mb-2">{t('kit2.mainFeatures')}</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('kit2.features.personalizedPdf')}</li>
          <li>{t('kit2.features.validity')}</li>
          <li>{t('kit2.features.configurableCommissions')}</li>
          <li>{t('kit2.features.viralDistribution')}</li>
          <li>{t('kit2.features.multipleKit2s')}</li>
        </ul>
      </div>

      {/* Franja Verde con Documento */}
      <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              📄 {t('kit2.viewGuide')}
            </h3>
            <p className="text-green-700">
              Descarga la guía completa del sistema Kit2 para entender todos los detalles
            </p>
          </div>
          <Link 
            href="/documentos/kit2/Guia-Familiar-Sistema-Kit2.pdf" 
            target="_blank"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Ver PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
