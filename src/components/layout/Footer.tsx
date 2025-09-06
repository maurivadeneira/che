'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative h-12 w-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">CHE</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">C.H.E.</h3>
                <p className="text-sm text-gray-400">Corporación Herejía Económica</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Un proyecto social global para desarrollo en el mundo entero, en cada país que sea permitido.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/explicacion-kit2" className="text-sm text-gray-400 hover:text-white transition-colors">Explicación Kit2</Link></li>
              <li><Link href="/conferencias" className="text-sm text-gray-400 hover:text-white transition-colors">Conferencias</Link></li>
              <li><Link href="/biblioteca" className="text-sm text-gray-400 hover:text-white transition-colors">Biblioteca</Link></li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><Link href="/fondos-rotatorios" className="text-sm text-gray-400 hover:text-white transition-colors">Fondos Rotatorios</Link></li>
              <li><Link href="/herejias-ia" className="text-sm text-gray-400 hover:text-white transition-colors">Herejías con IA</Link></li>
              <li><Link href="/nosotros" className="text-sm text-gray-400 hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="/contacto" className="text-sm text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Usuario */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Usuario</h4>
            <ul className="space-y-2">
              <li><Link href="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">Iniciar Sesión</Link></li>
              <li><Link href="/cuenta" className="text-sm text-gray-400 hover:text-white transition-colors">Mi Cuenta</Link></li>
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              <p>© {currentYear} CHE - Corporación Herejía Económica. Todos los derechos reservados.</p>
              <p className="mt-1">Fundada: 5 de Marzo 2014 | Sede: Bogotá D.C., Colombia</p>
            </div>
            
            <div className="mt-4 md:mt-0 text-xs text-gray-500 text-right">
              <p>Modelo de Concesión Vigente</p>
              <p>Mauricio Rivadeneira: 20% | CHE: 80%</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
