
import '../../globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/i18n/messages/en.json';

// This is a minimal layout for the embeddable widget.
// It does not include the standard header or footer.

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-body antialiased bg-transparent">
      <NextIntlClientProvider locale="en" messages={en}>
        <FirebaseClientProvider>
            <main>
              {children}
            </main>
            <Toaster />
        </FirebaseClientProvider>
      </NextIntlClientProvider>
    </div>
  );
}
