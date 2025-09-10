'use client';

import Image from 'next/image';
import { useTranslation } from '@/components/providers/TranslationProvider';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold">{t('homepage.title')}</h1>
        <div className="relative h-12 w-12">
          <Image
            src="/images/che-mini-logo.svg"
            alt="CHE"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <p className="text-lg mb-4">{t('company.subtitle')}</p>
      <div className="bg-yellow-100 p-4 rounded mb-4">
        <p><strong>{t('homepage.status')}</strong></p>
      </div>
    </div>
  );
}
