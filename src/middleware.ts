import { NextRequest, NextResponse } from 'next/server';

const locales = ['es', 'en', 'fr', 'de', 'it'];
const defaultLocale = 'es';

function getLocale(request: NextRequest) {
  // Verificar si ya hay un locale en la URL
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Detectar idioma del navegador o usar por defecto
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || defaultLocale;
    const supportedLocale = locales.includes(locale) ? locale : defaultLocale;
    
    return supportedLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Verificar si ya tiene locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
