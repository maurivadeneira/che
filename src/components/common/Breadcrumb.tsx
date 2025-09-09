'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Home } from 'lucide-react';

export function Breadcrumb() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;
  
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 md:hidden">
      <div className="flex items-center space-x-3">
        <Link 
          href="/" 
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Home size={20} />
        </Link>
        
        {pathname.includes('/fondos') && (
          <>
            <span className="text-gray-400">/</span>
            <Link 
              href="/fondos-rotatorios"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Fondos Rotatorios
            </Link>
          </>
        )}
        
        <button 
          onClick={() => window.history.back()}
          className="ml-auto flex items-center bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver
        </button>
      </div>
    </div>
  );
}
