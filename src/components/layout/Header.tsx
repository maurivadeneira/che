import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-gray-800 text-white shadow-lg">
      {/* Barra superior con enlaces de cuenta */}
      <div className="bg-gray-900 py-3 px-4">
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

      {/* Barra principal de navegación */}
      <div className="py-1 px-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo aún más grande */}
          <div className="flex items-center -ml-8">
            <Link href="/" className="flex items-center space-x-3">
              {/* Logo más grande para leer "Mundo Libre" */}
              <div className="relative h-40 w-40">
                <Image
                  src="/images/logo-che-enhanced.svg"
                  alt="CHE Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col ml-3">
                <div>
                  <span className="text-3xl font-bold">C.H.E.</span>
                  <span className="text-xl text-white ml-2">Mundo Libre</span>
                </div>
                <span className="text-base text-gray-300">Corporación Herejía Económica</span>
              </div>
            </Link>
          </div>

          {/* Navegación principal */}
          <nav className="hidden md:flex space-x-8 mr-4">
            <Link href="/" className="hover:text-blue-300 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/herejias-con-ia" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">
              Herejías con IA
            </Link>
            <Link href="/conferencias" className="hover:text-blue-300 transition-colors font-medium">
              Conferencias
            </Link>
            <Link href="/biblioteca" className="hover:text-blue-300 transition-colors font-medium">
              Biblioteca
            </Link>
            <Link href="/fondos-rotatorios" className="hover:text-blue-300 transition-colors font-medium">
              Fondos Rotatorios
            </Link>
            <Link href="/nosotros" className="hover:text-blue-300 transition-colors font-medium">
              Nosotros
            </Link>
            <Link href="/contacto" className="hover:text-blue-300 transition-colors font-medium">
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
