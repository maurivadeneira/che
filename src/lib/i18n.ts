export type Locale = 'es' | 'en' | 'fr' | 'de' | 'it';

// Función helper para obtener traducciones (Server Side)
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
