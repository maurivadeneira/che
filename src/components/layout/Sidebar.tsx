'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const fondos = [
  {
    name: 'Inversión Empresarial',
    href: '/fondos/inversion-empresarial',
    description: 'Proyectos de inversión y emprendimiento',
    icon: '��',
  },
  {
    name: 'Editorial y Medios Audiovisuales',
    href: '/fondos/editorial-medios',
    description: 'Publicaciones y contenido multimedia',
    icon: '📚',
  },
  {
    name: 'Sanación Emocional',
    href: '/fondos/sanacion-emocional',
    description: 'Bienestar emocional (en desarrollo)',
    icon: '💚',
  },
  {
    name: 'Vivienda',
    href: '/fondos/vivienda',
    description: 'Proyectos habitacionales',
    icon: '🏠',
  },
  {
    name: 'Recreación Social y Hotelera',
    href: '/fondos/recreacion-hotelera',
    description: 'Turismo y entretenimiento',
    icon: '🌟',
  },
  {
    name: 'Sistemas y Plataformas',
    href: '/fondos/sistemas-plataformas',
    description: 'Desarrollo tecnológico',
    icon: '⚙️',
  },
  {
    name: 'Bancario',
    href: '/fondos/bancario',
    description: 'Servicios financieros',
    icon: '🏦',
  },
  {
    name: 'Proyectos de Ingeniería',
    href: '/fondos/ingenieria',
    description: 'Infraestructura y construcción',
    icon: '🔧',
  },
  {
    name: 'Comercial',
    href: '/fondos/comercial',
    description: 'Actividades comerciales',
    icon: '🛒',
  },
  {
    name: 'Investigación Científica',
    href: '/fondos/investigacion-cientifica',
    description: 'Investigación y desarrollo',
    icon: '🔬',
  },
  {
    name: 'Arte y Cultura',
    href: '/fondos/arte-cultura',
    description: 'Manifestaciones artísticas y culturales',
    icon: '🎨',
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg h-full">
      <div className="p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full text-left text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          {isOpen ? (
            <ChevronDownIcon className="h-5 w-5 mr-2" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 mr-2" />
          )}
          Fondos Rotatorios
        </button>

        {isOpen && (
          <div className="mt-4 space-y-2">
            {fondos.map((fondo) => {
              const isActive = pathname === fondo.href;
              return (
                <Link
                  key={fondo.name}
                  href={fondo.href}
                  className={cn(
                    'flex items-start p-3 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <span className="text-xl mr-3 mt-0.5">{fondo.icon}</span>
                  <div className="flex-1">
                    <h3
                      className={cn(
                        'font-medium text-sm',
                        isActive ? 'text-blue-700' : 'text-gray-900'
                      )}
                    >
                      {fondo.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {fondo.description}
                    </p>
                  </div>
                </Link>
              );
            })}
            
            {/* Logo institucional al final de los fondos */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-16 w-16 mb-2">
                  <Image
                    src="/images/che-mini-logo.svg"
                    alt="CHE - Mundo Libre"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-gray-600 font-medium">CHE</p>
                <p className="text-xs text-gray-500">Mundo Libre</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
