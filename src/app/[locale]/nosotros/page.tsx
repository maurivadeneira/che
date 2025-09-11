'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';

export default function NosotrosPage() {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('about.title')}</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('company.fullName')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('about.corporateInfo')}</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>{t('about.foundation')}:</strong> {t('about.foundationDate')}</li>
                <li><strong>{t('about.headquarters')}:</strong> {t('about.headquartersLocation')}</li>
                <li><strong>{t('about.nature')}:</strong> {t('about.natureType')}</li>
                <li><strong>{t('about.character')}:</strong> {t('about.characterType')}</li>
                <li><strong>{t('about.taxId')}:</strong> {t('about.taxIdValue')}</li>
                <li><strong>{t('about.email')}:</strong> {t('about.emailValue')}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('company.subtitle')}</h3>
              <p className="text-gray-600">
                {t('company.fullName')} es una organización dedicada al desarrollo 
                de teorías económicas alternativas y soluciones innovadoras para 
                el crecimiento global sostenible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
