import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Toaster as ToastProvider } from 'sonner';

import { ErrorBoundary } from '@/src/components/error/error-boundary';
import { Footer } from '@/src/components/layout/footer';
import { Navbar } from '@/src/components/layout/navbar';
import { QueryProvider } from '@/src/contexts/QueryProvider';
import { ThemeProvider } from '@/src/contexts/theme-provider';
import { initializeDatabase } from '@/src/lib/db/init';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	// Initialize on app start
	initializeDatabase().catch(console.error);

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={inter.className}>
				<ClerkProvider>
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
				</ClerkProvider>
			</body>
		</html>
	);
}
