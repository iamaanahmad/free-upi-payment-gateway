import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Metadata } from "next";
import {useTranslations} from 'next-intl';

export const metadata: Metadata = {
    title: 'About UPI PG',
    description: 'Learn about UPI PG, our mission to simplify UPI payments in India, and the features of our free UPI payment link and QR code generator.',
};

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground">
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
            <h3 className="text-xl font-semibold">{t('keyFeaturesTitle')}</h3>
            <ul>
                <li><strong>{t('feature1').split(': ')[0]}:</strong> {t('feature1').split(': ')[1]}</li>
                <li><strong>{t('feature2').split(': ')[0]}:</strong> {t('feature2').split(': ')[1]}</li>
                <li><strong>{t('feature3').split(': ')[0]}:</strong> {t('feature3').split(': ')[1]}</li>
                <li><strong>{t('feature4').split(': ')[0]}:</strong> {t('feature4').split(': ')[1]}</li>
                <li><strong>{t('feature5').split(': ')[0]}:</strong> {t('feature5').split(': ')[1]}</li>
            </ul>
            <p>{t('p3')}</p>
            <p>{t('p4')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
