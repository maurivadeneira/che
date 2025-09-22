'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';

export default function EditorialMediosPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {t('funds.items.editorial')} - CHE
        </h1>
        
        <div className="mb-6">
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {t('funds.status.active')}
          </span>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          {t('funds.descriptions.editorial')}
        </p>

        <div className="grid gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Objetivo del Fondo</h3>
            <p>Desarrollar contenido editorial y medios audiovisuales para la difusión del conocimiento CHE.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
