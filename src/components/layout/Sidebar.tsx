'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const fondos = [
  {
    name: 'Inversión Empresarial - CHE Mundo Libre',
    href: '/fondos/inversion-empresarial',
    description: 'Proyectos de inversión y emprendimiento',
    icon: '💼',
  },
  {
    name: 'Editorial y Medios Audiovisuales - CHE Mundo Libre',
    href: '/fondos/editorial-medios',
    description: 'Publicaciones y contenido multimedia',
    icon: '📚',
  },
  {
    name: 'Sanación Emocional - CHE Mundo Libre',
    href: '/fondos/sanacion-emocional',
    description: 'Bienestar emocional (en desarrollo)',
    icon: '💚',
  },
  {
    name: 'Vivienda - CHE Mundo Libre',
    href: '/fondos/vivienda',
    description: 'Proyectos habitacionales',
    icon: '🏠',
  },
  {
    name: 'Recreación Social y Hotelera - CHE Mundo Libre',
    href: '/fondos/recreacion-hotelera',
    description: 'Turismo y entretenimiento',
    icon: '🌟',
  },
  {
    name: 'Sistemas y Plataformas - CHE Mundo Libre',
    href: '/fondos/sistemas-plataformas',
    description: 'Desarrollo tecnológico',
    icon: '⚙️',
  },
  {
    name: 'Bancario - CHE Mundo Libre',
    href: '/fondos/bancario',
    description: 'Servicios financieros',
    icon: '🏦',
  },
  {
    name: 'Proyectos de Ingeniería - CHE Mundo Libre',
    href: '/fondos/ingenieria',
    description: 'Infraestructura y construcción',
    icon: '🔧',
  },
  {
    name: 'Comercial - CHE Mundo Libre',
    href: '/fondos/comercial',
    description: 'Actividades comerciales',
    icon: '🛒',
  },
  {
    name: 'Investigación Científica - CHE Mundo Libre',
    href: '/fondos/investigacion-cientifica',
    description: 'Investigación y desarrollo',
    icon: '🔬',
  },
  {
    name: 'Arte y Cultura - CHE Mundo Libre',
    href: '/fondos/arte-cultura',
    description: 'Manifestaciones artísticas y culturales',
    icon: '🎨',
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
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
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-scroll p-4" style={{scrollbarWidth: 'thin'}}>
          <div className="space-y-2">
            {fondos.map((fondo) => {
              const isActive = pathname === fondo.href;
              return (
                <Link
                  key={fondo.name}
                  href={fondo.href}
                  className={cn(
                    'flex items-start p-3 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <span className="text-xl mr-3 mt-0.5">{fondo.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={cn(
                          'font-medium text-sm truncate pr-2',
                          isActive ? 'text-blue-700' : 'text-gray-900'
                        )}
                        title={fondo.name}
                      >
                        {fondo.name}
                      </h3>
                      <div className="relative h-5 w-5 flex-shrink-0">
                        <Image
                          src="/images/che-mini-logo.svg"
                          alt="CHE"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate" title={fondo.description}>
                      {fondo.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}