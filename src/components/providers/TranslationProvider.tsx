'use client';

import { createContext, useContext } from 'react';

export type Locale = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt';

export const LocaleContext = createContext<{
  locale: Locale;
  t: (key: string) => string;
}>({
  locale: 'es',
  t: (key: string) => key,
});

export const useTranslation = () => useContext(LocaleContext);

interface TranslationProviderProps {
  locale: Locale;
  translations: any;
  children: React.ReactNode;
}

function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

export function TranslationProvider({ locale, translations, children }: TranslationProviderProps) {
  const t = (key: string) => getNestedTranslation(translations, key);

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
