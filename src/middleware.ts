import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix} from './i18n/request';
import { NextResponse, type NextRequest } from 'next/server';

const nextIntlMiddleware = createMiddleware({
  defaultLocale: 'en',
  locales,
  localePrefix
});

// Wrapper middleware: if a request targets a locale-prefixed _next asset (e.g. /en/_next/...),
// rewrite it to the actual /_next/... path so static assets are served correctly.
export default function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Match '/<locale>/_next/...' (locale can include dash)
    const m = pathname.match(/^\/(?:[a-zA-Z]{2,}(?:-[A-Za-z]{2,})?)\/_next\/(.*)$/);
    if (m && m[1]) {
      const to = new URL(`/_next/${m[1]}`, req.url);
      return NextResponse.rewrite(to);
    }
  } catch (e) {
    // ignore and fall through to nextIntlMiddleware
  }

  // Delegate to next-intl middleware for other routes
  return nextIntlMiddleware(req as any);
}

export const config = {
  // Only match application pages. Exclude API routes, Next static assets, files with extensions
  // and the embed path so static assets (/_next/...) are not prefixed with locale.
  matcher: ['/((?!api|_next|embed|.*\\..*).*)']
};