'use client';

import { Inter } from 'next/font/google';

import './globals.css';
import { ErrorBoundary } from '@/src/components/error/error-boundary';
import { Footer } from '@/src/components/layout/footer';
import { Navbar } from '@/src/components/layout/navbar';
import { Toaster } from '@/src/components/ui/toaster';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { QueryProvider } from '@/src/contexts/QueryProvider';
import { ThemeProvider } from '@/src/contexts/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ErrorBoundary>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<QueryProvider>
							<AuthProvider>
								<div className="flex min-h-screen flex-col">
									<Navbar />
									<main className="flex-1">{children}</main>
									<Footer />
									<Toaster />
								</div>
							</AuthProvider>
						</QueryProvider>
					</ThemeProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}
