'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';

export default function RecreacionHoteleraPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {t('funds.items.recreation')} - CHE
        </h1>
        
        <div className="mb-6">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {t('funds.status.development')}
          </span>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          {t('funds.descriptions.recreation')}
        </p>

        <div className="grid gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Objetivo del Fondo</h3>
            <p>Desarrollar proyectos de recreación social y servicios hoteleros para el bienestar comunitario.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
