//This is the root layout. It does not contain any internationalization.
//The internationalized layout is in [locale]/layout.tsx.

import './globals.css';

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
