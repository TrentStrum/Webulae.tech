import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { QueryProvider } from '@/components/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Webulae - Software Development Solutions',
  description: 'Professional software development and digital solutions for your business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Navbar />
            {children}
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}