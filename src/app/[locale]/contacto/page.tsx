'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';

export default function ContactoPage() {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('contact.title')}</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{t('contact.contactInfo')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{t('contact.primaryEmail')}</h3>
                <p className="text-blue-600">{t('contact.primaryEmailValue')}</p>
              </div>
              <div>
                <h3 className="font-semibold">{t('contact.headquarters')}</h3>
                <p>{t('contact.headquartersValue')}</p>
              </div>
              <div>
                <h3 className="font-semibold">{t('contact.website')}</h3>
                <p className="text-blue-600">corpherejiaeconomica.com</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{t('company.fullName')}</h2>
            <p className="text-gray-600 mb-4">{t('company.subtitle')}</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p><strong>{t('about.foundation')}:</strong> {t('about.foundationDate')}</p>
              <p><strong>{t('about.nature')}:</strong> {t('about.natureType')}</p>
              <p><strong>{t('about.character')}:</strong> {t('about.characterType')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
