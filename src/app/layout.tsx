import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';

const fondos = [
  { name: 'Inversión Empresarial', href: '/fondos/inversion-empresarial', description: 'Proyectos de inversión', icon: '💼' },
  { name: 'Editorial y Medios', href: '/fondos/editorial-medios', description: 'Publicaciones', icon: '📚' },
  { name: 'Sanación Emocional', href: '/fondos/sanacion-emocional', description: 'Bienestar', icon: '💚' },
  { name: 'Vivienda', href: '/fondos/vivienda', description: 'Soluciones habitacionales', icon: '🏠' },
  { name: 'Recreación Social', href: '/fondos/recreacion-hotelera', description: 'Turismo', icon: '🌴' },
  { name: 'Sistemas y Plataformas', href: '/fondos/sistemas-plataformas', description: 'Tecnología', icon: '💻' },
  { name: 'Bancario', href: '/fondos/bancario', description: 'Servicios financieros', icon: '🏦' },
  { name: 'Proyectos de Ingeniería', href: '/fondos/ingenieria', description: 'Infraestructura', icon: '🔧' },
  { name: 'Comercial', href: '/fondos/comercial', description: 'Actividades comerciales', icon: '🛒' },
  { name: 'Investigación Científica', href: '/fondos/investigacion-cientifica', description: 'Investigación', icon: '🔬' },
  { name: 'Arte y Cultura', href: '/fondos/arte-cultura', description: 'Manifestaciones artísticas', icon: '🎨' }
];

export const metadata: Metadata = {
  title: 'CHE - Corporación Herejía Económica',
  description: 'Un proyecto social global para desarrollo en el mundo entero',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar - Solo desktop */}
          <div className="hidden md:block">
            <Sidebar />
          </div>
          
          {/* Mobile Navigation */}
          <MobileNav fondos={fondos} />
          
          {/* Contenido principal */}
          <div className="flex flex-1 flex-col min-w-0">
            {/* Barra de desarrollo */}
            <div className="bg-yellow-400 text-black py-2 px-4 text-center text-xs md:text-sm font-medium">
              Este proyecto se encuentra en fase de desarrollo. Algunas secciones podrían estar incompletas.
            </div>
            
            {/* Header responsive */}
            <Header />
            
            {/* Contenido de la página con padding para botón móvil */}
            <main className="flex-1 pt-16 md:pt-0">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
