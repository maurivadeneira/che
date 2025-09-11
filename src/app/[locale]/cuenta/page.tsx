'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';

export default function CuentaPage() {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('account.title')}</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{t('account.panel')}</h2>
          <p className="mb-4">{t('account.developmentNote')}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('account.myKit2s')}</h3>
              <p className="text-gray-600">{t('account.kit2sDescription')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('account.commissions')}</h3>
              <p className="text-gray-600">{t('account.commissionsDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
