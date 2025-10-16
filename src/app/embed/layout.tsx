
import '../globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';

// This is a minimal layout for the embeddable widget.
// It does not include the standard header or footer.

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-transparent">
        <FirebaseClientProvider>
            <main>
              {children}
            </main>
            <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
