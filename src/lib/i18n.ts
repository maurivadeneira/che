export type Locale = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt';

export async function getTranslations(locale: Locale) {
  try {
    const translations = await import(`../../public/locales/${locale}/common.json`);
    return translations.default;
  } catch (error) {
    const translations = await import(`../../public/locales/es/common.json`);
    return translations.default;
  }
}
