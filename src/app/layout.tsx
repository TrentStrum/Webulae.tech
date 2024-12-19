'use client';


import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import './globals.css';
import { ErrorBoundary } from '@/src/components/error/error-boundary';
import { Footer } from '@/src/components/layout/footer';
import { Navbar } from '@/src/components/layout/navbar';
import { ClientProviders } from '@/src/components/providers/client-providers';
import { Toaster } from '@/src/components/ui/toaster';
import { ThemeProvider } from '@/src/contexts/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ClerkProvider
						appearance={{
							// your appearance config
						}}
						dynamic
					>
						<ClientProviders>
							<ErrorBoundary>
								<div className="flex min-h-screen flex-col">
									<Navbar />
									<main className="flex-1">{children}</main>
									<Footer />
									<Toaster />
								</div>
							</ErrorBoundary>
						</ClientProviders>
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
