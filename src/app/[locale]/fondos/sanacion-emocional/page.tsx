'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';

export default function SanacionEmocionalPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {t('funds.items.healing')} - CHE
        </h1>
        
        <div className="mb-6">
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {t('funds.status.active')}
          </span>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          {t('funds.descriptions.healing')}
        </p>
      </div>
    </div>
  );
}
