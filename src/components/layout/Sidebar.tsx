'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  BriefcaseIcon,
  BookOpenIcon,
  HeartIcon,
  HomeIcon,
  SparklesIcon,
  CpuChipIcon,
  BuildingLibraryIcon,
  WrenchScrewdriverIcon,
  ShoppingCartIcon,
  BeakerIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// Los 11 Fondos Rotatorios - SIN BLOQUEOS
const fondosRotatorios = [
  {
    id: 1,
    name: 'Inversión Empresarial',
    href: '/fondos/inversion-empresarial',
    icon: BriefcaseIcon,
    description: 'Proyectos de inversión y emprendimiento',
  },
  {
    id: 2,
    name: 'Editorial y Medios Audiovisuales',
    href: '/fondos/editorial-medios',
    icon: BookOpenIcon,
    description: 'Publicaciones y contenido multimedia',
  },
  {
    id: 3,
    name: 'Sanación Emocional',
    href: '/fondos/sanacion-emocional',
    icon: HeartIcon,
    description: 'Bienestar emocional (en desarrollo)',
    // disabled: false - QUITADO EL BLOQUEO
  },
  {
    id: 4,
    name: 'Vivienda',
    href: '/fondos/vivienda',
    icon: HomeIcon,
    description: 'Proyectos habitacionales',
  },
  {
    id: 5,
    name: 'Recreación Social y Hotelera',
    href: '/fondos/recreacion-hotelera',
    icon: SparklesIcon,
    description: 'Turismo y entretenimiento',
  },
  {
    id: 6,
    name: 'Sistemas y Plataformas',
    href: '/fondos/sistemas-plataformas',
    icon: CpuChipIcon,
    description: 'Desarrollo tecnológico',
  },
  {
    id: 7,
    name: 'Bancario',
    href: '/fondos/bancario',
    icon: BuildingLibraryIcon,
    description: 'Servicios financieros',
  },
  {
    id: 8,
    name: 'Proyectos de Ingeniería',
    href: '/fondos/ingenieria',
    icon: WrenchScrewdriverIcon,
    description: 'Infraestructura y construcción',
  },
  {
    id: 9,
    name: 'Comercial',
    href: '/fondos/comercial',
    icon: ShoppingCartIcon,
    description: 'Actividades comerciales',
  },
  {
    id: 10,
    name: 'Investigación Científica',
    href: '/fondos/investigacion-cientifica',
    icon: BeakerIcon,
    description: 'Investigación y desarrollo',
  },
  {
    id: 11,
    name: 'Arte y Cultura',
    href: '/fondos/arte-cultura',
    icon: PaintBrushIcon,
    description: 'Manifestaciones artísticas y culturales',
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={cn(
      'bg-white border-r border-gray-200 shadow-sm transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-80'
    )}>
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900">
                Fondos Rotatorios
              </h2>
            )}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {fondosRotatorios.map((fondo) => {
              const isActive = pathname === fondo.href;
              const Icon = fondo.icon;
              
              return (
                <li key={fondo.id}>
                  <Link
                    href={fondo.href}
                    className={cn(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all group relative',
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    )}
                    title={isCollapsed ? fondo.name : fondo.description}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    
                    {!isCollapsed && (
                      <div className="ml-3 flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">
                          {fondo.name}
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-gray-600 truncate block mt-1">
                          {fondo.description}
                        </span>
                      </div>
                    )}

                    {isActive && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-l-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
