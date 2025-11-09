import type {Metadata} from 'next';
import '../../../globals.css';
import {notFound} from 'next/navigation';
import {locales, getMessagesForLocale} from '@/i18n/request';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { IntlProvider } from '@/components/intl-provider';

export const metadata: Metadata = {
  title: 'UPI Payment Widget',
  robots: {
    index: false,
    follow: false,
  },
};

interface WidgetLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function WidgetLayout({
  children,
  params
}: Readonly<WidgetLayoutProps>) {
  const { locale } = await params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = getMessagesForLocale(locale);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <FirebaseClientProvider>
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster />
      </FirebaseClientProvider>
    </IntlProvider>
  );
}
