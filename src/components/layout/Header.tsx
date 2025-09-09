'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      {/* Barra superior */}
      <div className="bg-gray-900 py-2 px-4">
        <div className="w-full flex justify-end space-x-4 text-xs sm:text-sm">
          <Link href="/explicacion-kit2" className="hover:text-blue-300 transition-colors">
            Explicación Kit2
          </Link>
          <Link href="/auth/register" className="hover:text-blue-300 transition-colors">
            Registrarse
          </Link>
          <Link href="/mi-cuenta" className="hover:text-blue-300 transition-colors">
            Mi Cuenta
          </Link>
          <Link href="/auth/login" className="hover:text-blue-300 transition-colors">
            Login
          </Link>
        </div>
      </div>

      {/* Barra principal - Distribución justificada */}
      <div className="py-2 px-4">
        <div className="w-full flex items-center">
          {/* Logo */}
          <div className="flex items-center mr-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8 sm:h-12 sm:w-12 md:h-40 md:w-40">
                <Image
                  src="/images/logo-che-enhanced.svg"
                  alt="CHE Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div>
                  <span className="text-sm sm:text-base md:text-3xl font-bold">C.H.E.</span>
                  <span className="text-xs sm:text-sm md:text-xl text-white ml-1">Mundo Libre</span>
                </div>
                <span className="text-xs md:text-base text-gray-300 hidden sm:block">Corporación Herejía Económica</span>
              </div>
            </Link>
          </div>

          {/* Navegación - Distribuir uniformemente en el espacio restante */}
          <nav className="hidden landscape:flex lg:flex flex-1 justify-evenly">
            <Link href="/" className={`hover:text-blue-300 transition-colors font-medium text-xs landscape:text-sm ${pathname === '/' ? 'text-orange-400' : ''}`}>
              Inicio
            </Link>
            <Link href="/herejias-con-ia" className={`hover:text-orange-300 transition-colors font-medium text-xs landscape:text-sm ${pathname === '/herejias-con-ia' ? 'text-orange-400' : 'text-white'}`}>
              Herejías con IA
            </Link>
            <Link href="/conferencias" className={`hover:text-blue-300 transition-colors font-medium text-xs landscape:text-sm ${pathname === '/conferencias' ? 'text-orange-400' : ''}`}>
              Conferencias
            </Link>
            <Link href="/biblioteca" className={`hover:text-blue-300 transition-colors font-medium text-xs landscape:text-sm ${pathname === '/biblioteca' ? 'text-orange-400' : ''}`}>
              Biblioteca
            </Link>
            <Link href="/fondos-rotatorios" className={`hover:text-blue-300 transition-colors font-medium text-xs landscape:text-sm ${pathname === '/fondos-rotatorios' ? 'text-orange-400' : ''}`}>
              Fondos Rotatorios
            </Link>
            <Link href="/nosotros" className={`hover:text-blue-300 transition-colors font-medium text-xs landscape:text-sm ${pathname === '/nosotros' ? 'text-orange-400' : ''}`}>
              Nosotros
            </Link>
            <Link href="/contacto" className={`hover:text-blue-300 transition-colors font-medium text-xs landscape:text-sm ${pathname === '/contacto' ? 'text-orange-400' : ''}`}>
              Contacto
            </Link>
          </nav>

          {/* Hamburger solo en portrait */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="portrait:block landscape:hidden lg:hidden p-2 text-white ml-auto"
            aria-label="Menu principal"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú móvil - Solo portrait */}
      {isMenuOpen && (
        <div className="portrait:block landscape:hidden lg:hidden bg-gray-700 border-t border-gray-600">
          <nav className="px-4 py-3 space-y-2">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === '/' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Inicio
            </Link>
            <Link href="/herejias-con-ia" onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === '/herejias-con-ia' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Herejías con IA
            </Link>
            <Link href="/conferencias" onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === '/conferencias' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Conferencias
            </Link>
            <Link href="/biblioteca" onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === '/biblioteca' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Biblioteca
            </Link>
            <Link href="/fondos-rotatorios" onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === '/fondos-rotatorios' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Fondos Rotatorios
            </Link>
            <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === '/nosotros' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Nosotros
            </Link>
            <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === '/contacto' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
