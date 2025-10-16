import type {Metadata} from 'next';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/header';
import Footer from '@/components/footer';
import { FirebaseClientProvider } from '@/firebase';
import {NextIntlClientProvider, useMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';


export const metadata: Metadata = {
  title: {
    template: '%s | UPI PG - Free UPI Payment Link & QR Code Generator',
    default: 'UPI PG - Free UPI Payment Link & QR Code Generator',
  },
  description: 'Instantly generate free, shareable UPI payment links and QR codes with custom amounts and notes. The best and simplest tool for freelancers, small businesses, and individuals in India. No login required.',
  keywords: "UPI QR code generator, UPI payment link, free UPI QR code, UPI QR with amount, BHIM UPI QR code, NPCI, payment link generator, India payments",
  metadataBase: new URL('https://upipg.cit.org.in'),
  openGraph: {
    title: 'UPI PG - Free UPI Payment Link & QR Code Generator',
    description: 'The simplest way to request UPI payments in India. Create a unique, shareable payment page and QR code in seconds.',
    url: 'https://upipg.cit.org.in',
    siteName: 'UPI PG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPI PG - Free UPI Payment Link & QR Code Generator',
    description: 'Generate instant, free UPI payment links and QR codes. Perfect for businesses and individuals in India.',
    images: ['/twitter-image.png'],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({
  children,
  params: {locale}
}: Readonly<RootLayoutProps>) {
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = useMessages();

  return (
    <html lang={locale} className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <FirebaseClientProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster />
          </FirebaseClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
