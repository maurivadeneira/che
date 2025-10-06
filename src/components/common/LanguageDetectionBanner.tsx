'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';

const languageMap: { [key: string]: string } = {
  'es': '🇪🇸 Español',
  'en': '🇺🇸 English',
  'pt': '🇧🇷 Português',
  'fr': '🇫🇷 Français',
  'de': '🇩🇪 Deutsch',
  'it': '🇮🇹 Italiano'
};

export function LanguageDetectionBanner() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = params.locale as string;
  const [detectedLocale, setDetectedLocale] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bannerShown = sessionStorage.getItem('language-banner-shown');
    if (bannerShown) return;

    const browserLang = navigator.language.split('-')[0];
    
    // Verificación explícita para TypeScript
    if (browserLang && browserLang !== currentLocale && languageMap[browserLang]) {
      setDetectedLocale(browserLang);
      setShowBanner(true);
    }
  }, [currentLocale]);

  const handleAccept = () => {
    if (detectedLocale) {
      const newPathname = pathname.replace(`/${currentLocale}`, `/${detectedLocale}`);
      sessionStorage.setItem('language-banner-shown', 'true');
      router.push(newPathname);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('language-banner-shown', 'true');
    setShowBanner(false);
  };

  if (!showBanner || !detectedLocale) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <p className="text-sm md:text-base font-medium">
            Detectamos que tu idioma es <strong>{languageMap[detectedLocale]}</strong>. ¿Cambiar idioma?
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            Sí, cambiar
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 font-semibold rounded-lg transition-colors text-sm"
          >
            No, gracias
          </button>
        </div>
      </div>
    </div>
  );
}
