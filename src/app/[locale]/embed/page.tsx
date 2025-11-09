
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code } from "lucide-react";
import {useTranslations} from 'next-intl';
import Link from "next/link";
import { useLocale } from "next-intl";

export default function EmbedPage() {
  const t = useTranslations('EmbedPage');
  const locale = useLocale();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://upipg.cit.org.in';
  const embedCode = `<iframe src="${baseUrl}/${locale}/embed/widget" width="100%" height="600" frameborder="0"></iframe>`;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">{t('howToUseTitle')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('howToUseDescription')}
            </p>
            <Alert>
              <Code className="h-4 w-4" />
              <AlertDescription className="font-mono text-sm mt-2 break-all">
                {embedCode}
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">{t('featuresTitle')}</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t('feature1')}</li>
              <li>{t('feature2')}</li>
              <li>{t('feature3')}</li>
              <li>{t('feature4')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">{t('customizationTitle')}</h3>
            <p className="text-muted-foreground">
              {t('customizationDescription')}
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-center text-muted-foreground">
              {t('needHelp')} <Link href={`/${locale}/developers`} className="text-primary hover:underline">{t('visitDevelopers')}</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
