import { Metadata } from 'next';
import Script from 'next/script';

interface StructuredDataProps {
  locale: string;
  pageType?: 'website' | 'faq' | 'about' | 'developers';
}

export function StructuredData({ locale, pageType = 'website' }: StructuredDataProps) {
  const baseUrl = 'https://upipg.cit.org.in';
  const currentUrl = `${baseUrl}${locale === 'en' ? '' : `/${locale}`}`;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "UPI PG",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.ico`,
    "description": "Free UPI QR Code Generator and Payment Link creator for India. Generate instant, shareable UPI payment links and QR codes with custom amounts.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam", "Punjabi"],
      "url": `${baseUrl}/about`
    },
    "sameAs": [
      // Add social media URLs when available
    ],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "knowsAbout": [
      "UPI Payments",
      "QR Code Generation",
      "Digital Payments India",
      "BHIM UPI",
      "NPCI",
      "Payment Links"
    ]
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "UPI PG - Free UPI Payment Link & QR Code Generator",
    "url": baseUrl,
    "description": "Instantly generate free, shareable UPI payment links and QR codes with custom amounts and notes. The best and simplest tool for freelancers, small businesses, and individuals in India.",
    "inLanguage": locale,
    "publisher": {
      "@type": "Organization",
      "name": "UPI PG"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // FAQ Schema for homepage
  const faqSchema = pageType === 'website' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this service really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, UPI PG is completely free for generating individual payment links. We believe in making payments simple and accessible for everyone."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a bank account to use this?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You need a UPI ID, which is linked to your bank account via an app like Google Pay, PhonePe, Paytm, or your bank's own BHIM UPI app. Our service generates a link or QR code that the payer uses; we never ask for your bank account details."
        }
      },
      {
        "@type": "Question",
        "name": "Can I generate a UPI QR code without an amount?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, our tool is designed as a UPI QR code generator with amount included to simplify the payment process. You must specify an amount to generate a link."
        }
      },
      {
        "@type": "Question",
        "name": "Is this an official NPCI or BHIM UPI QR code generator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We are an independent platform that uses the standard UPI protocol defined by NPCI. We provide a simple interface to create payment links and QR codes that work across the entire UPI network."
        }
      }
    ]
  } : null;

  // Software Application Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "UPI PG",
    "description": "Free UPI QR Code Generator and Payment Link creator",
    "url": baseUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "featureList": [
      "UPI QR Code Generation",
      "Payment Link Creation",
      "Custom Amount Support",
      "Multi-language Support",
      "Mobile Responsive"
    ],
    "screenshot": `${baseUrl}/og-image.png`
  };

  const schemas = [organizationSchema, websiteSchema, softwareSchema];
  if (faqSchema) schemas.push(faqSchema);

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas)
      }}
    />
  );
}