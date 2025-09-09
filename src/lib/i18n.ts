import { createContext, useContext } from 'react';

export type Locale = 'es' | 'en' | 'fr' | 'de' | 'it';

export const LocaleContext = createContext<{
  locale: Locale;
  t: (key: string) => string;
}>({
  locale: 'es',
  t: (key: string) => key,
});

export const useTranslation = () => useContext(LocaleContext);

// Función helper para obtener traducciones
export async function getTranslations(locale: Locale) {
  try {
    const translations = await import(`../../public/locales/${locale}/common.json`);
    return translations.default;
  } catch (error) {
    // Fallback a español si el idioma no existe
    const translations = await import(`../../public/locales/es/common.json`);
    return translations.default;
  }
}

// Helper para obtener texto traducido
export function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}
