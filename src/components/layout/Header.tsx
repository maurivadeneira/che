'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const mainNavigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Herejías con IA', href: '/herejias-ia' },
  { name: 'Conferencias', href: '/conferencias' },
  { name: 'Biblioteca', href: '/biblioteca' },
  { name: 'Fondos Rotatorios', href: '/fondos-rotatorios' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
];

const userNavigation = [
  { name: 'Explicación Kit2', href: '/explicacion-kit2' },
  { name: 'Registrarse', href: '/auth/register' },
  { name: 'Mi Cuenta', href: '/cuenta' },
  { name: 'Login', href: '/auth/login' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-slate-800 shadow-lg relative z-50">
      <div className="bg-yellow-400 px-4 py-2 text-center text-sm font-medium text-yellow-900">
        Este proyecto se encuentra en fase de desarrollo. Algunas secciones podrían estar incompletas.
      </div>

      {/* Primera fila - Usuario - Espaciado ajustado para alinear con segunda fila */}
      <div className="bg-slate-700 px-4 py-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex justify-end space-x-8 text-sm">
            {userNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-1 text-white hover:text-orange-400 transition-colors',
                    isActive && 'text-orange-400'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Segunda fila - Principal */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative h-14 w-20">
                <Image
                  src="/images/logo-che-enhanced.svg"
                  alt="CHE Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">C.H.E.</h1>
                <p className="text-xs text-gray-300">Corporación Herejía Económica</p>
              </div>
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="flex items-baseline space-x-2">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium text-white hover:text-orange-400 transition-colors duration-200',
                      isActive && 'text-orange-400 border-b-2 border-orange-400'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 text-white hover:text-orange-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/95">
              {/* Navegación de usuario en móvil */}
              <div className="border-b border-slate-600 pb-2 mb-2">
                {userNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'block px-3 py-2 text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors',
                        isActive && 'text-orange-400'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              
              {/* Navegación principal en móvil */}
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 text-base font-medium text-white hover:text-orange-400 transition-colors',
                      isActive && 'text-orange-400'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
