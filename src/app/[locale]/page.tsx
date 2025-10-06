'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/TranslationProvider';
import { useParams } from 'next/navigation';

export default function HomePage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale as string;

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' }
  ];

  const changeLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

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
      <p className="text-lg mb-6">{t('company.subtitle')}</p>

      {/* Banner de Invitación Académica */}
      <div className="max-w-4xl mx-auto bg-white border-2 border-blue-600 rounded-lg shadow-xl mb-6 overflow-hidden">
        {/* Header azul con badges de idiomas CLICKEABLES */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-3 py-1 font-bold rounded-full text-sm transition-all transform hover:scale-110 ${
                  locale === lang.code
                    ? 'bg-yellow-400 text-blue-900 shadow-lg'
                    : 'bg-white text-blue-600 hover:bg-yellow-200'
                }`}
                title={`Cambiar a ${lang.name}`}
              >
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-center">
            {t('academicInvitation.title')}
          </h2>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <p className="text-gray-800 font-semibold text-center">
            {t('academicInvitation.greeting')}
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            {t('academicInvitation.intro')}
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            {t('academicInvitation.platform')}
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
            <p className="font-bold text-blue-900">
              {t('academicInvitation.invitation')}
            </p>
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            {t('academicInvitation.dialogues')}
          </p>
          
          <p className="text-gray-600 italic text-center mt-4">
            {t('academicInvitation.closing')}
          </p>
          
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="font-bold text-gray-900 text-lg">{t('academicInvitation.signature')}</p>
            <p className="text-gray-600 italic">{t('academicInvitation.title_signature')}</p>
          </div>
        </div>

        {/* Botones de Acción Destacados */}
        <div className="bg-gray-50 px-6 py-5 border-t-2 border-gray-200">
          <p className="text-center text-gray-700 font-semibold mb-4">
            Le invitamos a explorar:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href={`/${locale}/herejias-con-ia`}
              className="flex flex-col items-center justify-center p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all hover:shadow-lg transform hover:-translate-y-1"
            >
              <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
              <span className="font-bold">Herejías con IA</span>
            </Link>

            <Link 
              href={`/${locale}/conferencias`}
              className="flex flex-col items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all hover:shadow-lg transform hover:-translate-y-1"
            >
              <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
              <span className="font-bold">Conferencias</span>
            </Link>

            <Link 
              href={`/${locale}/biblioteca`}
              className="flex flex-col items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all hover:shadow-lg transform hover:-translate-y-1"
            >
              <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
              <span className="font-bold">Biblioteca</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Banner de desarrollo */}
      <div className="bg-yellow-100 p-4 rounded">
        <p><strong>{t('homepage.status')}</strong></p>
      </div>
    </div>
  );
}
