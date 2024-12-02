'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/src/contexts/theme-provider';
import { QueryProvider } from '@/src/contexts/QueryProvider';
import { Navbar } from '@/src/components/layout/navbar';
import { Footer } from '@/src/components/layout/footer';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { Toaster } from '@/src/components/ui/toaster';
import { ErrorBoundary } from 'react-error-boundary';

const inter = Inter({ subsets: ['latin'] });

function ErrorFallback({ error }: { error: Error }) {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h2 className="text-lg font-semibold">Something went wrong:</h2>
				<pre className="text-sm text-red-500">{error.message}</pre>
			</div>
		</div>
	);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html suppressHydrationWarning>
			<body className={inter.className}>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
							disableTransitionOnChange
					>
						<QueryProvider>
							<AuthProvider>
								<Navbar />
								<main className="min-h-screen">
									{children}
								</main>
								<Footer />
								<Toaster />
							</AuthProvider>
						</QueryProvider>
					</ThemeProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}
