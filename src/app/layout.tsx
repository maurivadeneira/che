import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';

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
          {/* Sidebar con los 11 Fondos Rotatorios */}
          <Sidebar />
          
          {/* Contenido principal */}
          <div className="flex flex-1 flex-col">
            {/* Barra de desarrollo */}
            <div className="bg-yellow-400 text-black py-2 px-4 text-center text-sm font-medium">
              Este proyecto se encuentra en fase de desarrollo. Algunas secciones podrían estar incompletas.
            </div>
            
            {/* Header con navegación */}
            <Header />
            
            {/* Contenido de la página */}
            <main className="flex-1">
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
