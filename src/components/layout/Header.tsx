'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      {/* Barra superior */}
      <div className="bg-gray-900 py-2 px-2">
        <div className="flex justify-end space-x-3 text-xs">
          <Link href={`/${locale}/explicacion-kit2`} className="hover:text-blue-300 transition-colors">
            Kit2
          </Link>
          <Link href={`/${locale}/auth/register`} className="hover:text-blue-300 transition-colors">
            Registro
          </Link>
          <Link href={`/${locale}/cuenta`} className="hover:text-blue-300 transition-colors">
            Cuenta
          </Link>
          <Link href={`/${locale}/auth/login`} className="hover:text-blue-300 transition-colors">
            Login
          </Link>
        </div>
      </div>

      {/* Barra principal - Logo izquierda, navegación derecha */}
      <div className="py-2 px-2">
        <div className="w-full flex items-center justify-between">
          {/* Logo a la izquierda */}
          <div className="flex items-center flex-shrink-0">
            <Link href={`/${locale}`} className="flex items-center gap-1">
              <div className="relative h-8 w-8">
                <img
                  src="/images/che-mini-logo.svg"
                  alt="CHE"
                  width="32"
                  height="32"
                  style={{objectFit: "contain"}}
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold">C.H.E.</span>
                <span className="text-xs text-gray-300">Mundo Libre</span>
              </div>
            </Link>
          </div>

          {/* Navegación agrupada a la derecha */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href={`/${locale}`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>
              Inicio
            </Link>
            <Link href={`/${locale}/herejias-con-ia`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/herejias-con-ia` ? 'bg-orange-600 text-white' : 'hover:text-orange-300'}`}>
              Herejías
            </Link>
            <Link href={`/${locale}/conferencias`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/conferencias` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>
              Conferencias
            </Link>
            <Link href={`/${locale}/biblioteca`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/biblioteca` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>
              Biblioteca
            </Link>
            <Link href={`/${locale}/fondos-rotatorios`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/fondos-rotatorios` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>
              Fondos
            </Link>
            <Link href={`/${locale}/nosotros`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/nosotros` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>
              Nosotros
            </Link>
            <Link href={`/${locale}/contacto`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/contacto` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>
              Contacto
            </Link>
          </nav>

          {/* Hamburger para móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
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
            <Link href={`/${locale}`} onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === `/${locale}` ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Inicio
            </Link>
            <Link href={`/${locale}/herejias-con-ia`} onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === `/${locale}/herejias-con-ia` ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Herejías con IA
            </Link>
            <Link href={`/${locale}/conferencias`} onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === `/${locale}/conferencias` ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Conferencias
            </Link>
            <Link href={`/${locale}/biblioteca`} onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === `/${locale}/biblioteca` ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Biblioteca
            </Link>
            <Link href={`/${locale}/fondos-rotatorios`} onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === `/${locale}/fondos-rotatorios` ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Fondos Rotatorios
            </Link>
            <Link href={`/${locale}/nosotros`} onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === `/${locale}/nosotros` ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Nosotros
            </Link>
            <Link href={`/${locale}/contacto`} onClick={() => setIsMenuOpen(false)} className={`block py-2 px-3 rounded ${pathname === `/${locale}/contacto` ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}