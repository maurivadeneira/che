'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '@/components/providers/TranslationProvider';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-gray-800 text-white shadow-lg lg:ml-64">
      <div className="bg-gray-900 py-2 px-2">
        <div className="flex justify-end space-x-3 text-xs">
          <Link href={`/${locale}/explicacion-kit2`} className="hover:text-blue-300 transition-colors">{t('header.kit2')}</Link>
          <Link href={`/${locale}/auth/register`} className="hover:text-blue-300 transition-colors">{t('header.register')}</Link>
          <Link href={`/${locale}/cuenta`} className="hover:text-blue-300 transition-colors">{t('header.account')}</Link>
          <Link href={`/${locale}/auth/login`} className="hover:text-blue-300 transition-colors">{t('header.login')}</Link>
        </div>
      </div>
      <div className="py-4 px-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="relative h-36 w-36">
                <img src="/images/logo-che-enhanced.svg" alt="CHE" width="144" height="144" style={{objectFit: "contain"}} />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-bold">{t('company.name')}</span>
                <span className="text-sm text-gray-300">Mundo Libre</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href={`/${locale}`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>{t('navigation.home')}</Link>
            <Link href={`/${locale}/herejias-con-ia`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/herejias-con-ia` ? 'bg-orange-600 text-white' : 'hover:text-orange-300'}`}>{t('navigation.heresies')}</Link>
            <Link href={`/${locale}/conferencias`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/conferencias` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>{t('navigation.conferences')}</Link>
            <Link href={`/${locale}/biblioteca`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/biblioteca` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>{t('navigation.library')}</Link>
            <Link href={`/${locale}/fondos-rotatorios`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/fondos-rotatorios` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>{t('navigation.funds')}</Link>
            <Link href={`/${locale}/nosotros`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/nosotros` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>{t('navigation.about')}</Link>
            <Link href={`/${locale}/contacto`} className={`text-xs font-medium px-2 py-1 rounded transition-colors ${pathname === `/${locale}/contacto` ? 'bg-orange-600 text-white' : 'hover:text-blue-300'}`}>{t('navigation.contact')}</Link>
          </nav>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white" aria-label="Menu">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
