import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix} from './i18n/request';

export default createMiddleware({
  defaultLocale: 'en',
  locales,
  localePrefix
});

export const config = {
  // Match only internationalized pathnames, exclude embed
  matcher: [
    '/',
    '/((?!embed).*)', // Exclude /embed and subpaths
    '/(en|hi|bn-IN|mr-IN|te-IN|ta-IN|gu-IN|ur-IN|kn-IN|or-IN|ml-IN|pa-IN)/:path*'
  ]
};