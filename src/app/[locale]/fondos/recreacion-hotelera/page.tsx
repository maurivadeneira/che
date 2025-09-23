'use client';

import Image from 'next/image';
import { useTranslation } from '@/components/providers/TranslationProvider';

export default function RecreacionSocialPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 flex justify-center">
        <div className="relative h-80 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-100">
          <Image
            src="/images/fondos/05_Recreacion_Social.png"
            alt="recreacionSocial"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('funds.individual.recreacionSocial.title')}</h1>
        <div className="flex justify-center">
          <div className="relative h-10 w-10">
            <Image
              src="/images/che-mini-logo.svg"
              alt="CHE"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          {t('funds.status.development')}
        </span>
      </div>
      
      <p className="text-lg mb-8">{t('funds.individual.recreacionSocial.description')}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('funds.individual.recreacionSocial.objective.title')}</h2>
          <p className="text-gray-600">
            {t('funds.individual.recreacionSocial.objective.content')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('funds.individual.recreacionSocial.types.title')}</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
            {t('funds.individual.recreacionSocial.items').map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('funds.individual.recreacionSocial.process.title')}</h2>
          <p className="text-gray-600">
            {t('funds.individual.recreacionSocial.process.content')}
          </p>
        </section>
      </div>
    </div>
  );
}