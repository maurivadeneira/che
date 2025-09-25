'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/TranslationProvider';

export default function HerejiasConIAPage() {
  const { t, locale } = useTranslation();

  // Los 4 documentos originales que siempre deben aparecer
  const dialogosIA = [
    {
      titleKey: 'bigBang',
      docId: 'CUESTIONANDO_BIG_BANG',
      hasTranslations: true, // Disponible en 6 idiomas
    },
    {
      titleKey: 'economyVsScience',
      docId: 'ECONOMIA_vs_CIENCIA',
      hasTranslations: true, // Ya tiene traducciones
    },
    {
      titleKey: 'extraterrestrials',
      docId: 'EXTRATERRESTRES',
      hasTranslations: true, // Aún solo en español
    },
    {
      titleKey: 'questioningPhysics',
      docId: 'CUESTIONANDO_LA_FISICA',
      hasTranslations: true, // Aún solo en español
    }
  ];

  // Función para generar URL de descarga
  const getDownloadUrl = (docId: string, hasTranslations: boolean) => {
    if (hasTranslations) {
      if (locale === 'es') {
        // Español: usar ruta original PDF
        return `/documentos/herejiasIA/${docId}.pdf`;
      } else {
        // Otros idiomas: usar nueva ruta PDF convertida
        return `/documentos/herejiasIA/${locale}/${docId}.pdf`;
      }
    } else {
      // Documentos sin traducciones: usar ruta original (español)
      return `/documentos/herejiasIA/${docId}.pdf`;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">{t('heresies.title')}</h1>
          <div className="relative h-12 w-12">
            <Image
              src="/images/che-mini-logo.svg"
              alt="CHE"
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        <p className="text-lg mb-8 text-gray-600">{t('heresies.subtitle')}</p>
        
        {/* Los 4 documentos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dialogosIA.map((dialogo, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600">
                {t(`heresies.dialogues.${dialogo.titleKey}.title`)}
              </h3>
              <p className="text-gray-600 mb-4">
                {t(`heresies.dialogues.${dialogo.titleKey}.description`)}
              </p>
              
              {/* Botón de descarga */}
              <Link 
                href={getDownloadUrl(dialogo.docId, dialogo.hasTranslations)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <span>📄</span>
                <span>
                  {dialogo.hasTranslations && locale !== 'es' 
                    ? t('herejiasIA.download') 
                    : 'Descargar'
                  } PDF
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Documentos Multiidioma
          </h3>
          <p className="text-blue-700">
            Cada documento está disponible en múltiples idiomas. Usa el selector de idioma en la navegación para cambiar el idioma de descarga.
          </p>
        </div>
      </div>
    </div>
  );
}