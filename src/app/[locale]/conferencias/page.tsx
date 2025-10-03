'use client';
import { useTranslation } from '@/components/providers/TranslationProvider';

export default function ConferenciasPage() {
  const { t, locale } = useTranslation();
  
  // Mapeo de idiomas para YouTube
  const langMap: Record<string, string> = {
    'es': 'es',
    'en': 'en',
    'pt': 'pt',
    'fr': 'fr',
    'de': 'de',
    'it': 'it'
  };
  
  const conferencias = [
    {
      titleKey: "intro",
      fecha: "5/9/2025",
      videoId: "m9rDQNNp6is",
      tipo: t('conferences.type')
    },
    {
      titleKey: "fundamentals", 
      fecha: "5/9/2025",
      videoId: "S6vZCz20t9s",
      tipo: t('conferences.type')
    },
    {
      titleKey: "kit", 
      fecha: "5/9/2025",
      videoId: "B6zuFjeFNMQ",
      tipo: t('conferences.type')
    },
    {
      titleKey: "author", 
      fecha: "5/9/2025",
      videoId: "9ZnozV3EgwE",
      tipo: t('conferences.type')
    }
  ];

  // Generar URL con subtítulos automáticos en el idioma seleccionado
  const getVideoUrl = (videoId: string) => {
    const ccLang = langMap[locale] || 'es';
    return `https://www.youtube.com/watch?v=${videoId}&cc_load_policy=1&cc_lang_pref=${ccLang}`;
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{t('conferences.title')}</h1>
        <p className="text-lg mb-6 text-gray-600">{t('conferences.subtitle')}</p>
        
        {/* Banner informativo */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
          <p className="text-sm text-blue-900">
            💡 <strong>{t('conferences.tip')}:</strong> {t('conferences.subtitlesEnabled')}
          </p>
        </div>
        
        <div className="grid gap-6">
          {conferencias.map((conferencia, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {t(`conferences.items.${conferencia.titleKey}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {t(`conferences.items.${conferencia.titleKey}.description`)}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>{t('conferences.date')}:</strong> {conferencia.fecha} | 
                    <strong> {t('conferences.type')}:</strong> {conferencia.tipo}
                  </p>
                </div>
                <div>
                  <a 
                    href={getVideoUrl(conferencia.videoId)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Ver video
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
