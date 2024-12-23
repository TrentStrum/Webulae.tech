import Image from 'next/image';
import Link from 'next/link';

import { AuthSideContent } from '@/src/components/auth/AuthSideContent';
import { Button } from '@/src/components/ui/button';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<div className="grid min-h-screen grid-cols-1 md:grid-cols-3 lg:grid-cols-2">
			<div className="col-span-1 flex flex-col justify-between p-8 md:p-12">
				<div>
					<Link href="/">
						<Image
							src="/logo.svg"
							alt="Logo"
							width={120}
							height={40}
							className="dark:invert"
						/>
					</Link>
				</div>

				<div className="flex-1 flex items-center justify-center">
					{children}
				</div>

				<div className="space-y-4">
					<div className="text-sm text-muted-foreground">
						<span>Need help? </span>
						<Button variant="link" asChild className="p-0">
							<Link href="/contact">Contact Support</Link>
						</Button>
					</div>
					<div className="flex items-center space-x-4 text-sm text-muted-foreground">
						<Link href="/terms" className="hover:underline">Terms</Link>
						<Link href="/privacy" className="hover:underline">Privacy</Link>
					</div>
				</div>
			</div>

			<AuthSideContent className="hidden md:block md:col-span-2 lg:col-span-1">
				<div className="space-y-6">
					<h1 className="text-3xl font-bold tracking-tight text-white">
						Welcome to Our Platform
					</h1>
					<p className="text-lg text-white/80">
						Securely manage your projects and collaborate with your team.
					</p>
				</div>
			</AuthSideContent>
		</div>
	);
} 