
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import type { Metadata } from "next";

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
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Developer Integrations</CardTitle>
          <CardDescription>Integrate UPI payments into your website or application with ease.</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground space-y-8">
            <section>
                <h3 className="text-2xl font-semibold">Embeddable Widget</h3>
                <p>
                    The easiest way to add a UPI payment form to your website is by using our embeddable widget. Just copy and paste the following HTML snippet into your webpage, and a fully functional payment form will appear. It's lightweight, secure, and requires no backend setup on your part.
                </p>
                <CodeBlock content={iframeSnippet} />
                <p className="text-sm text-muted-foreground mt-2">
                    The widget will generate a unique payment page on UPI PG. You can adjust the <code>height</code> and <code>width</code> attributes to best fit your site's layout.
                </p>
            </section>
            
            <section>
                <h3 className="text-2xl font-semibold">Manual UPI Deep Link Integration</h3>
                <p>
                    For more custom integrations, you can create UPI deep links (also known as UPI URIs) directly within your application. These links, when clicked on a mobile device, will open the user's default UPI app with the payment details pre-filled.
                </p>
                <p>The format for a UPI link is as follows:</p>
                <CodeBlock content={upiLinkExample} />
                <h4 className="font-semibold">Parameters:</h4>
                 <ul>
                    <li><code>pa</code>: Payee Address (Your UPI ID). This is the only mandatory parameter.</li>
                    <li><code>pn</code>: Payee Name. The name of the person or business receiving the payment.</li>
                    <li><code>am</code>: Transaction Amount. The exact amount to be paid (e.g., 100.00).</li>
                    <li><code>cu</code>: Currency Code. Should always be "INR".</li>
                    <li><code>tn</code>: Transaction Note. A short description of the payment.</li>
                </ul>
                <p>
                    You can generate this link dynamically on your server or with client-side JavaScript and embed it in a button or hyperlink. Remember to URL-encode the parameter values.
                </p>
                 <a href={upiLinkExample} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Example Deep Link Button
                </a>
            </section>

             <section>
                <h3 className="text-2xl font-semibold">Dynamic QR Code Generation</h3>
                <p>
                    You can also generate QR codes that contain the UPI deep link information. When a user scans this QR code with their UPI app, the payment details are automatically filled. This is perfect for invoices, product pages, or point-of-sale displays.
                </p>
                <p>To do this, take the UPI deep link you constructed and URL-encode it. Then, use it as the data source for any QR code generation library or API. We use and recommend `qrserver.com` for its simplicity.</p>
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
