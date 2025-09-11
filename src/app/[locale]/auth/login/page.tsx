'use client';

import { useTranslation } from '@/components/providers/TranslationProvider';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">{t('auth.login.title')}</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.login.email')}</label>
            <input type="email" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.login.password')}</label>
            <input type="password" className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {t('auth.login.signIn')}
          </button>
        </form>
      </div>
    </div>
  );
}
