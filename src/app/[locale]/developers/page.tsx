
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import type { Metadata } from "next";
import {useTranslations} from 'next-intl';

export const metadata: Metadata = {
    title: 'Developer Integrations',
    description: 'Integrate UPI PG with your website. Learn how to use our embeddable widget, create UPI deep links, and generate dynamic QR codes for seamless payments.',
};

const upiLinkExample = `upi://pay?pa=your-upi-id@bank&pn=Your%20Name&am=100.00&cu=INR&tn=Payment%20for%20Goods`;

const iframeSnippet = `<iframe
  src="https://upipg.cit.org.in/embed"
  width="100%"
  height="600px"
  frameborder="0"
  title="UPI Payment Generator"
></iframe>`;


export default function DevelopersPage() {
  const t = useTranslations('DevelopersPage');
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground space-y-8">
            <section>
                <h3 className="text-2xl font-semibold">{t('embedWidgetTitle')}</h3>
                <p>{t('embedWidgetP1')}</p>
                <CodeBlock content={iframeSnippet} />
                <p className="text-sm text-muted-foreground mt-2">{t('embedWidgetP2')}</p>
            </section>
            
            <section>
                <h3 className="text-2xl font-semibold">{t('deepLinkTitle')}</h3>
                <p>{t('deepLinkP1')}</p>
                <p>{t('deepLinkP2')}</p>
                <CodeBlock content={upiLinkExample} />
                <h4 className="font-semibold">{t('parametersTitle')}</h4>
                 <ul>
                    <li><code>pa</code>: {t('paramPA')}</li>
                    <li><code>pn</code>: {t('paramPN')}</li>
                    <li><code>am</code>: {t('paramAM')}</li>
                    <li><code>cu</code>: {t('paramCU')}</li>
                    <li><code>tn</code>: {t('paramTN')}</li>
                </ul>
                <p>{t('deepLinkP3')}</p>
                 <a href={upiLinkExample} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {t('deepLinkExampleButton')}
                </a>
            </section>

             <section>
                <h3 className="text-2xl font-semibold">{t('qrCodeTitle')}</h3>
                <p>{t('qrCodeP1')}</p>
                <p>{t('qrCodeP2')}</p>
                <CodeBlock content={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLinkExample)}`} />
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLinkExample)}`} 
                    alt="Example UPI QR Code" 
                    className="mx-auto rounded-lg border p-2 bg-white"
                />
            </section>
        </CardContent>
      </Card>
    </div>
  );
}
