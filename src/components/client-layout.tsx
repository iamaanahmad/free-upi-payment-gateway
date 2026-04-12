'use client';

import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/header';
import Footer from '@/components/footer';
import { AnalyticsProvider } from '@/components/analytics-provider';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <FirebaseClientProvider>
      <AnalyticsProvider>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
      </AnalyticsProvider>
    </FirebaseClientProvider>
  );
}