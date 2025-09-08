'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  fondos: Array<{
    name: string;
    href: string;
    description: string;
    icon: string;
  }>;
}

export function MobileNav({ fondos }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
            <div className="p-6 pt-16">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Fondos Rotatorios</h2>
              <nav className="space-y-2">
                {fondos.map((fondo, index) => (
                  <Link
                    key={index}
                    href={fondo.href}
                    onClick={() => setIsOpen(false)}
                    className="block p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{fondo.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{fondo.name}</div>
                        <div className="text-xs text-gray-600">{fondo.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
