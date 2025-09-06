'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Herejías con IA', href: '/herejias-ia' },
  { name: 'Explicación Kit2', href: '/explicacion-kit2' },
  { name: 'Conferencias', href: '/conferencias' },
  { name: 'Biblioteca', href: '/biblioteca' },
  { name: 'Fondos Rotatorios', href: '/fondos-rotatorios' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-slate-800 shadow-lg relative z-50">
      <div className="bg-yellow-400 px-4 py-2 text-center text-sm font-medium text-yellow-900">
        Este proyecto se encuentra en fase de desarrollo. Algunas secciones podrían estar incompletas.
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/images/logo-che-grande.png"
                  alt="CHE Logo"
                  fill
                  className="rounded-full object-cover"
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
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium text-white hover:text-orange-400 transition-colors duration-200',
                      isActive && 'text-orange-400 border-b-2 border-orange-400'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Link href="/auth/register" className="text-white hover:text-orange-400 transition-colors">Registrarse</Link>
                <span className="text-gray-400">|</span>
                <Link href="/cuenta" className="text-white hover:text-orange-400 transition-colors">Mi Cuenta</Link>
                <span className="text-gray-400">|</span>
                <Link href="/auth/login" className="text-white hover:text-orange-400 transition-colors">Login</Link>
              </div>
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
              {navigation.map((item) => {
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
