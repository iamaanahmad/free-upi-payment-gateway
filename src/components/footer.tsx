"use client";

import Link from 'next/link';
import {useTranslations} from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card/80 border-t mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
          {t('copyright', {year})}
        </p>
        <div className="flex gap-4 sm:gap-6">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t('about')}
          </Link>
           <Link href="/developers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t('developers')}
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t('terms')}
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t('privacy')}
          </Link>
          <Link href="/embed" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t('embed')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
