import { Inter } from 'next/font/google';

import { ErrorBoundary } from '@/src/components/error/error-boundary';
import { Footer } from '@/src/components/layout/footer';
import { Navbar } from '@/src/components/layout/navbar';
import { Providers } from '@/src/components/providers/providers';
import './globals.css';
import { ToastProvider } from '@/src/components/providers/ToastProvider';
import { QueryProvider } from '@/src/contexts/QueryProvider';
import { ThemeProvider } from '@/src/contexts/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={inter.className}>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<QueryProvider>
							<ErrorBoundary>
								<div className="flex min-h-screen flex-col">
									<Navbar />
									<main className="flex-1">{children}</main>
									<Footer />
									<ToastProvider />
								</div>
							</ErrorBoundary>
						</QueryProvider>
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
