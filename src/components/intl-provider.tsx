'use client';

import { NextIntlClientProvider } from 'next-intl';

interface IntlProviderProps {
  locale: string;
  messages: Record<string, any>;
  children: React.ReactNode;
}

export function IntlProvider({ locale, messages, children }: IntlProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Kolkata"
    >
      {children}
    </NextIntlClientProvider>
  );
}