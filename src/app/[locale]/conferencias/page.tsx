'use client';
import { useTranslation } from '@/components/providers/TranslationProvider';

export default function ConferenciasPage() {
  const { t, locale } = useTranslation();
  
  const conferencias = [
    {
      titleKey: "intro",
      fecha: "5/9/2025",
      enlace: "https://www.youtube.com/watch?v=m9rDQNNp6is",
      tipo: t('conferences.type')
    },
    {
      titleKey: "fundamentals", 
      fecha: "5/9/2025",
      enlace: "https://www.youtube.com/watch?v=S6vZCz20t9s",
      tipo: t('conferences.type')
    },
    {
      titleKey: "kit", 
      fecha: "5/9/2025",
      enlace: "https://www.youtube.com/watch?v=B6zuFjeFNMQ",
      tipo: t('conferences.type')
    },
    {
      titleKey: "author", 
      fecha: "5/9/2025",
      enlace: "https://www.youtube.com/watch?v=9ZnozV3EgwE",
      tipo: t('conferences.type')
    }
  ];

  const getLanguageName = () => {
    const names: Record<string, string> = {
      'es': 'Español',
      'en': 'English',
      'pt': 'Português',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano'
    };
    return names[locale] || 'Español';
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{t('conferences.title')}</h1>
        <p className="text-lg mb-6 text-gray-600">{t('conferences.subtitle')}</p>
        
        {/* Instrucciones claras */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded">
          <h3 className="font-bold text-blue-900 mb-2">
            📺 {locale === 'es' ? 'Cómo activar subtítulos' : locale === 'en' ? 'How to enable subtitles' : locale === 'pt' ? 'Como ativar legendas' : locale === 'fr' ? 'Comment activer les sous-titres' : locale === 'de' ? 'Untertitel aktivieren' : 'Come attivare i sottotitoli'}
          </h3>
          <ol className="text-sm text-blue-900 space-y-1 ml-4 list-decimal">
            <li>{locale === 'es' ? 'Click en el ícono CC (subtítulos) en el reproductor' : locale === 'en' ? 'Click the CC icon in the player' : locale === 'pt' ? 'Clique no ícone CC no player' : locale === 'fr' ? 'Cliquez sur l\'icône CC dans le lecteur' : locale === 'de' ? 'Klicken Sie auf das CC-Symbol' : 'Fare clic sull\'icona CC'}</li>
            <li>{locale === 'es' ? 'Click en el ícono de configuración ⚙️' : locale === 'en' ? 'Click the settings icon ⚙️' : locale === 'pt' ? 'Clique no ícone de configurações ⚙️' : locale === 'fr' ? 'Cliquez sur l\'icône paramètres ⚙️' : locale === 'de' ? 'Klicken Sie auf Einstellungen ⚙️' : 'Fare clic sull\'icona impostazioni ⚙️'}</li>
            <li>{locale === 'es' ? 'Selecciona "Subtítulos" → ' : locale === 'en' ? 'Select "Subtitles" → ' : locale === 'pt' ? 'Selecione "Legendas" → ' : locale === 'fr' ? 'Sélectionnez "Sous-titres" → ' : locale === 'de' ? 'Wählen Sie "Untertitel" → ' : 'Seleziona "Sottotitoli" → '}<strong>{getLanguageName()}</strong></li>
          </ol>
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
                    href={conferencia.enlace} 
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
