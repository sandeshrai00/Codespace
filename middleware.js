import { NextResponse } from 'next/server';

const locales = ['en', 'th', 'zh'];
const defaultLocale = 'en';

// Paths that should not be localized
const publicPaths = [
  '/api',
  '/admin',
  '/_next',
  '/favicon.ico',
  '/logo.png',
  '/images',
  '/img',
];

function getLocaleFromRequest(request) {
  // 1. Check cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Parse the Accept-Language header
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const parts = lang.trim().split(';');
        const code = parts[0].toLowerCase();
        const quality = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1.0;
        return { code, quality };
      })
      .sort((a, b) => b.quality - a.quality);

    // Find the first matching locale
    for (const { code } of languages) {
      // Match exact locale (e.g., 'en', 'th', 'zh')
      if (locales.includes(code)) {
        return code;
      }
      // Match language code prefix (e.g., 'zh-CN' -> 'zh', 'en-US' -> 'en')
      const prefix = code.split('-')[0];
      if (locales.includes(prefix)) {
        return prefix;
      }
    }
  }

  // 3. Default to English
  return defaultLocale;
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to path with locale
  const locale = getLocaleFromRequest(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  // Preserve query parameters
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  
  // Set cookie to remember the locale
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|admin|_next|images|img|favicon.ico|logo.png).*)',
  ],
};
