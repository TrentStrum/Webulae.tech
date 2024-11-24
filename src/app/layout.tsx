import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/src/components/theme-provider';
import { QueryProvider } from '@/src/context/QueryProvider';
import { Navbar } from '@/src/components/layout/navbar';
import { Footer } from '@/src/components/layout/footer';

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
    <html lang="en">
      <body>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
          <QueryProvider>
            <Navbar />
            {children}
            <Footer />
          </QueryProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}