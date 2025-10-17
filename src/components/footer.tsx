"use client";

import Link from 'next/link';
import Image from 'next/image';
import {useTranslations} from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="UPI PG Logo" width={24} height={24} className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">
              {t('copyright', {year})}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            <Link href="about" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
              {t('about')}
            </Link>
            <Link href="developers" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
              {t('developers')}
            </Link>
            <Link href="terms" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
              {t('terms')}
            </Link>
            <Link href="privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
              {t('privacy')}
            </Link>
            <Link href="embed" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
              {t('embed')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
