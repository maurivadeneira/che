import type { Metadata } from 'next';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { TranslationProvider, type Locale } from '@/components/providers/TranslationProvider';
import { getTranslations } from '@/lib/i18n';

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  const translations = await getTranslations(locale as Locale);
  
  // Helper para obtener traducciones en servidor
  const getServerTranslation = (key: string) => {
    return key.split('.').reduce((current, k) => current?.[k], translations) || key;
  };

  const fondos = [
    { name: getServerTranslation('funds.items.business'), href: `/${locale}/fondos/inversion-empresarial`, description: getServerTranslation('funds.descriptions.business'), icon: '💼' },
    { name: getServerTranslation('funds.items.editorial'), href: `/${locale}/fondos/editorial-medios`, description: getServerTranslation('funds.descriptions.editorial'), icon: '📚' },
    { name: getServerTranslation('funds.items.healing'), href: `/${locale}/fondos/sanacion-emocional`, description: getServerTranslation('funds.descriptions.healing'), icon: '��' },
    { name: getServerTranslation('funds.items.housing'), href: `/${locale}/fondos/vivienda`, description: getServerTranslation('funds.descriptions.housing'), icon: '🏠' },
    { name: getServerTranslation('funds.items.recreation'), href: `/${locale}/fondos/recreacion-hotelera`, description: getServerTranslation('funds.descriptions.recreation'), icon: '🌴' },
    { name: getServerTranslation('funds.items.systems'), href: `/${locale}/fondos/sistemas-plataformas`, description: getServerTranslation('funds.descriptions.systems'), icon: '💻' },
    { name: getServerTranslation('funds.items.banking'), href: `/${locale}/fondos/bancario`, description: getServerTranslation('funds.descriptions.banking'), icon: '🏦' },
    { name: getServerTranslation('funds.items.engineering'), href: `/${locale}/fondos/ingenieria`, description: getServerTranslation('funds.descriptions.engineering'), icon: '🔧' },
    { name: getServerTranslation('funds.items.commercial'), href: `/${locale}/fondos/comercial`, description: getServerTranslation('funds.descriptions.commercial'), icon: '🛒' },
    { name: getServerTranslation('funds.items.research'), href: `/${locale}/fondos/investigacion-cientifica`, description: getServerTranslation('funds.descriptions.research'), icon: '🔬' },
    { name: getServerTranslation('funds.items.culture'), href: `/${locale}/fondos/arte-cultura`, description: getServerTranslation('funds.descriptions.culture'), icon: '🎨' }
  ];

  return (
    <html lang={locale}>
      <body>
        <TranslationProvider locale={locale as Locale} translations={translations}>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-yellow-400 text-black text-center py-2 px-4 text-sm font-medium">
              {getServerTranslation('development.banner')}
            </div>
            
            <Header locale={locale} />
            <div className="flex-1 flex">
              <Sidebar fondos={fondos} />
              <main className="flex-1 lg:ml-64">
                <div className="p-4">
                  <Breadcrumb />
                  {children}
                </div>
              </main>
            </div>
            <Footer />
            <MobileNav fondos={fondos} />
          </div>
        </TranslationProvider>
      </body>
    </html>
  );
}
