'use client';

import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/header';
import Footer from '@/components/footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <FirebaseClientProvider>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
    </FirebaseClientProvider>
  );
}