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
      {/* Barra superior - Solo desktop */}
      <div className="hidden md:block bg-gray-900 py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-end space-x-6 text-sm">
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

      {/* Barra principal */}
      <div className="py-2 md:py-1 px-4 md:px-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo responsive */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3">
              <div className="relative h-10 w-10 md:h-40 md:w-40">
                <Image
                  src="/images/logo-che-enhanced.svg"
                  alt="CHE Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div>
                  <span className="text-sm md:text-3xl font-bold">C.H.E.</span>
                  <span className="text-xs md:text-xl text-white ml-1 md:ml-2">Mundo Libre</span>
                </div>
                <span className="text-xs md:text-base text-gray-300 hidden sm:block">Corporación Herejía Económica</span>
              </div>
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex space-x-4 xl:space-x-8 mr-4">
            <Link href="/" className={`hover:text-blue-300 transition-colors font-medium text-sm xl:text-base ${pathname === '/' ? 'text-orange-400' : ''}`}>
              Inicio
            </Link>
            <Link href="/herejias-con-ia" className={`hover:text-orange-300 transition-colors font-medium text-sm xl:text-base ${pathname === '/herejias-con-ia' ? 'text-orange-400' : 'text-white'}`}>
              Herejías con IA
            </Link>
            <Link href="/conferencias" className={`hover:text-blue-300 transition-colors font-medium text-sm xl:text-base ${pathname === '/conferencias' ? 'text-orange-400' : ''}`}>
              Conferencias
            </Link>
            <Link href="/biblioteca" className={`hover:text-blue-300 transition-colors font-medium text-sm xl:text-base ${pathname === '/biblioteca' ? 'text-orange-400' : ''}`}>
              Biblioteca
            </Link>
            <Link href="/fondos-rotatorios" className={`hover:text-blue-300 transition-colors font-medium text-sm xl:text-base ${pathname === '/fondos-rotatorios' ? 'text-orange-400' : ''}`}>
              Fondos
            </Link>
            <Link href="/nosotros" className={`hover:text-blue-300 transition-colors font-medium text-sm xl:text-base ${pathname === '/nosotros' ? 'text-orange-400' : ''}`}>
              Nosotros
            </Link>
            <Link href="/contacto" className={`hover:text-blue-300 transition-colors font-medium text-sm xl:text-base ${pathname === '/contacto' ? 'text-orange-400' : ''}`}>
              Contacto
            </Link>
          </nav>

          {/* Menú móvil hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Menu principal"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-700 border-t border-gray-600">
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
            
            {/* Enlaces de cuenta en móvil */}
            <div className="border-t border-gray-600 pt-3 mt-3 space-y-2">
              <Link href="/explicacion-kit2" onClick={() => setIsMenuOpen(false)} className="block py-2 px-3 text-blue-300 hover:bg-gray-600 rounded">
                Explicación Kit2
              </Link>
              <Link href="/auth/register" onClick={() => setIsMenuOpen(false)} className="block py-2 px-3 text-blue-300 hover:bg-gray-600 rounded">
                Registrarse
              </Link>
              <Link href="/mi-cuenta" onClick={() => setIsMenuOpen(false)} className="block py-2 px-3 text-blue-300 hover:bg-gray-600 rounded">
                Mi Cuenta
              </Link>
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="block py-2 px-3 text-blue-300 hover:bg-gray-600 rounded">
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
