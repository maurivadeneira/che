import type { Metadata } from 'next';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from "@/components/common/Breadcrumb";

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const fondos = [
    { name: 'Inversión Empresarial', href: `/${locale}/fondos/inversion-empresarial`, description: 'Proyectos de inversión', icon: '💼' },
    { name: 'Editorial y Medios', href: `/${locale}/fondos/editorial-medios`, description: 'Publicaciones', icon: '📚' },
    { name: 'Sanación Emocional', href: `/${locale}/fondos/sanacion-emocional`, description: 'Bienestar', icon: '💚' },
    { name: 'Vivienda', href: `/${locale}/fondos/vivienda`, description: 'Soluciones habitacionales', icon: '🏠' },
    { name: 'Recreación Social', href: `/${locale}/fondos/recreacion-hotelera`, description: 'Turismo', icon: '🌴' },
    { name: 'Sistemas y Plataformas', href: `/${locale}/fondos/sistemas-plataformas`, description: 'Tecnología', icon: '💻' },
    { name: 'Bancario', href: `/${locale}/fondos/bancario`, description: 'Servicios financieros', icon: '🏦' },
    { name: 'Proyectos de Ingeniería', href: `/${locale}/fondos/ingenieria`, description: 'Infraestructura', icon: '🔧' },
    { name: 'Comercial', href: `/${locale}/fondos/comercial`, description: 'Actividades comerciales', icon: '🛒' },
    { name: 'Investigación Científica', href: `/${locale}/fondos/investigacion-cientifica`, description: 'Investigación', icon: '🔬' },
    { name: 'Arte y Cultura', href: `/${locale}/fondos/arte-cultura`, description: 'Manifestaciones artísticas', icon: '🎨' }
  ];

  return (
    <html lang={locale}>
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Franja amarilla de desarrollo */}
          <div className="bg-yellow-400 text-black text-center py-2 px-4 text-sm font-medium">
            Este proyecto se encuentra en fase de desarrollo. Algunas secciones podrían estar incompletas.
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
      </body>
    </html>
  );
}
