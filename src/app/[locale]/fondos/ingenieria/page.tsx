'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';

export default function IngenieriaPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {t('funds.items.engineering')} - CHE
        </h1>
        
        <div className="mb-6">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {t('funds.status.development')}
          </span>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          {t('funds.descriptions.engineering')}
        </p>

        <div className="grid gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Objetivo del Fondo</h3>
            <p>Desarrollar proyectos de infraestructura e ingeniería para el desarrollo social y económico.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
