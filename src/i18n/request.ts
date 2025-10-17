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

import en from './messages/en.json';
import hi from './messages/hi.json';
import bnIN from './messages/bn-IN.json';
import mrIN from './messages/mr-IN.json';
import teIN from './messages/te-IN.json';
import taIN from './messages/ta-IN.json';
import guIN from './messages/gu-IN.json';
import urIN from './messages/ur-IN.json';
import knIN from './messages/kn-IN.json';
import orIN from './messages/or-IN.json';
import mlIN from './messages/ml-IN.json';
import paIN from './messages/pa-IN.json';

const messagesMap = {
  'en': en,
  'hi': hi,
  'bn-IN': bnIN,
  'mr-IN': mrIN,
  'te-IN': teIN,
  'ta-IN': taIN,
  'gu-IN': guIN,
  'ur-IN': urIN,
  'kn-IN': knIN,
  'or-IN': orIN,
  'ml-IN': mlIN,
  'pa-IN': paIN,
};

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  // Merge locale messages with English as fallback
  const localeMessages = messagesMap[locale as keyof typeof messagesMap] || {};
  const messages = {
    ...en, // English as base
    ...localeMessages // Override with locale-specific translations
  };

  return {
    locale,
    messages,
    timeZone: 'Asia/Kolkata', // Indian Standard Time
  };
});

// Synchronous function to get messages for a locale (for use in server components)
export function getMessagesForLocale(locale: string) {
  if (!locales.includes(locale as any)) return en;

  const localeMessages = messagesMap[locale as keyof typeof messagesMap] || {};
  return {
    ...en, // English as base
    ...localeMessages // Override with locale-specific translations
  };
}