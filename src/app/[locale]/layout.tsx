import type {Metadata} from 'next';
import '../globals.css';
import {notFound} from 'next/navigation';
import {locales, getMessagesForLocale} from '@/i18n/request';
import { ClientLayout } from '@/components/client-layout';
import { StructuredData } from '@/components/seo/structured-data';
import { IntlProvider } from '@/components/intl-provider';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://upipg.cit.org.in';
  const canonicalUrl = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;

  return {
    title: {
      template: '%s | UPI PG - Free UPI Payment Link & QR Code Generator',
      default: 'UPI PG - Free UPI Payment Link & QR Code Generator',
    },
    description: 'Instantly generate free, shareable UPI payment links and QR codes with custom amounts and notes. India\'s best UPI QR code generator for freelancers, small businesses, and individuals. Works with Google Pay, PhonePe, Paytm, BHIM UPI, and all Indian banks. No login required.',
    keywords: "UPI QR code generator India, UPI payment link, free UPI QR code, UPI QR with amount, BHIM UPI QR code, NPCI, Google Pay QR, PhonePe QR, Paytm QR, Indian payment link generator, digital payments India, UPI ID generator, rupee payment QR, Indian fintech, UPI deep links",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': '/',
        'hi': '/hi',
        'bn-IN': '/bn-IN',
        'gu-IN': '/gu-IN',
        'mr-IN': '/mr-IN',
        'te-IN': '/te-IN',
        'ta-IN': '/ta-IN',
        'kn-IN': '/kn-IN',
        'ml-IN': '/ml-IN',
        'pa-IN': '/pa-IN',
        'or-IN': '/or-IN',
        'ur-IN': '/ur-IN',
      },
    },
    openGraph: {
      title: 'UPI PG - Free UPI Payment Link & QR Code Generator for India',
      description: 'India\'s simplest way to request UPI payments. Create instant, shareable payment pages and QR codes. Works with Google Pay, PhonePe, Paytm, BHIM UPI, and all Indian banks.',
      url: canonicalUrl,
      siteName: 'UPI PG',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
      locale: locale.replace('-', '_'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'UPI PG - Free UPI Payment Link & QR Code Generator for India',
      description: 'Generate instant, free UPI payment links and QR codes. Perfect for Indian businesses and individuals using Google Pay, PhonePe, Paytm, BHIM UPI.',
      images: ['/twitter-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function RootLayout({
  children,
  params
}: Readonly<RootLayoutProps>) {
  const { locale } = await params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = getMessagesForLocale(locale);

  return (
    <>
      <StructuredData locale={locale} pageType="website" />
      <IntlProvider locale={locale} messages={messages}>
        <ClientLayout>
            {children}
        </ClientLayout>
      </IntlProvider>
    </>
  );
}
