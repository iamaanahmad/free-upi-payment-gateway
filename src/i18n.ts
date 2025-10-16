import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {LocalePrefix} from 'next-intl/routing';

export const locales = ['en', 'hi', 'bn-IN', 'mr-IN', 'te-IN', 'ta-IN', 'gu-IN', 'ur-IN', 'kn-IN', 'or-IN', 'ml-IN', 'pa-IN'];
export const localeNames: {[key: string]: string} = {
  'en': 'English',
  'hi': 'हिंदी',
  'bn-IN': 'বাংলা',
  'mr-IN': 'मराठी',
  'te-IN': 'తెలుగు',
  'ta-IN': 'தமிழ்',
  'gu-IN': 'ગુજરાતી',
  'ur-IN': 'اردو',
  'kn-IN': 'ಕನ್ನಡ',
  'or-IN': 'ଓଡ଼ିଆ',
  'ml-IN': 'മലയാളം',
  'pa-IN': 'ਪੰਜਾਬੀ'
};

export const localePrefix: LocalePrefix = 'always';

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});