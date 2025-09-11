'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/TranslationProvider';

export default function HerejiasConIAPage() {
  const { t } = useTranslation();

  const dialogosIA = [
    {
      titleKey: 'bigBang',
      file: '/documentos/herejiasIA/CUESTIONANDO_BIG_BANG.pdf',
    },
    {
      titleKey: 'economyVsScience',
      file: '/documentos/herejiasIA/ECONOMIA_vs_CIENCIA.pdf', 
    },
    {
      titleKey: 'extraterrestrials',
      file: '/documentos/herejiasIA/EXTRATERRESTRES.pdf',
    },
    {
      titleKey: 'questioningPhysics',
      file: '/documentos/herejiasIA/CUESTIONANDO_LA_FISICA.pdf',
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dialogosIA.map((dialogo, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600">
                {t(`heresies.dialogues.${dialogo.titleKey}.title`)}
              </h3>
              <p className="text-gray-600 mb-4">
                {t(`heresies.dialogues.${dialogo.titleKey}.description`)}
              </p>
              <Link 
                href={dialogo.file} 
                target="_blank"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Leer PDF
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
