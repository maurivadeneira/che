'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Locale } from '@/lib/i18n';

const languages = [
  { code: 'es' as Locale, name: 'Español', flag: '🇪🇸' },
  { code: 'en' as Locale, name: 'English', flag: '��🇸' },
  { code: 'fr' as Locale, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as Locale, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it' as Locale, name: 'Italiano', flag: '🇮🇹' },
];

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-xs hover:text-blue-300 transition-colors"
      >
        <span>{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLocale(language.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                locale === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
