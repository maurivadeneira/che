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
      <div className="bg-gray-900 py-2 px-2">
        <div className="flex justify-end space-x-3 text-xs">
          <Link href="/explicacion-kit2" className="hover:text-blue-300 transition-colors">
            Kit2
          </Link>
          <Link href="/auth/register" className="hover:text-blue-300 transition-colors">
            Registro
          </Link>
          <Link href="/mi-cuenta" className="hover:text-blue-300 transition-colors">
            Cuenta
          </Link>
          <Link href="/auth/login" className="hover:text-blue-300 transition-colors">
            Login
          </Link>
        </div>
      </div>

      {/* Barra principal - Layout completamente custom */}
      <div className="py-2 px-2">
        <div className="w-full flex items-center gap-2">
          {/* Logo compacto */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-1">
              <div className="relative h-8 w-8">
                <Image
                  src="/images/logo-che-enhanced.svg"
                  alt="CHE"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold">C.H.E.</span>
                <span className="text-xs text-gray-300">Mundo Libre</span>
              </div>
            </Link>
          </div>

          {/* Navegación - Mobile first approach */}
          <nav className="hidden md:flex flex-1 justify-between px-2">
            <Link href="/" className={`text-xs font-medium px-1 ${pathname === '/' ? 'text-orange-400' : 'hover:text-blue-300'}`}>
              Inicio
            </Link>
            <Link href="/herejias-con-ia" className={`text-xs font-medium px-1 ${pathname === '/herejias-con-ia' ? 'text-orange-400' : 'hover:text-orange-300'}`}>
              Herejías
            </Link>
            <Link href="/conferencias" className={`text-xs font-medium px-1 ${pathname === '/conferencias' ? 'text-orange-400' : 'hover:text-blue-300'}`}>
              Conferencias
            </Link>
            <Link href="/biblioteca" className={`text-xs font-medium px-1 ${pathname === '/biblioteca' ? 'text-orange-400' : 'hover:text-blue-300'}`}>
              Biblioteca
            </Link>
            <Link href="/fondos-rotatorios" className={`text-xs font-medium px-1 ${pathname === '/fondos-rotatorios' ? 'text-orange-400' : 'hover:text-blue-300'}`}>
              Fondos
            </Link>
            <Link href="/nosotros" className={`text-xs font-medium px-1 ${pathname === '/nosotros' ? 'text-orange-400' : 'hover:text-blue-300'}`}>
              Nosotros
            </Link>
            <Link href="/contacto" className={`text-xs font-medium px-1 ${pathname === '/contacto' ? 'text-orange-400' : 'hover:text-blue-300'}`}>
              Contacto
            </Link>
          </nav>

          {/* Hamburger - Solo cuando la navegación está oculta */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white ml-auto"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 border-t border-gray-600">
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
