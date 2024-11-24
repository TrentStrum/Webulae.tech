'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { AuthSideContent } from '@/src/app/features/signup/components/AuthSideContent';
import { apiClient } from '@/src/lib/apiClient';
import { useToast } from '@/src/hooks';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	const needsVerification = searchParams?.get('verified') === 'false';

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response: { status: number; data: any } = await apiClient.post('/auth/login', { email, password });
			if (response.status !== 200) {
				throw new Error('Invalid credentials');
			}

			toast({
				title: 'Success',
				description: 'Logged in successfully.',
			});

			router.push('/');
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to log in.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<AuthSideContent
				icon={Mail}
				title="Welcome back"
				quote="Webulae empowers businesses to excel through expert software solutions. Log in to explore."
				author="Webulae Team"
			/>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
						<p className="text-sm text-muted-foreground">
							Enter your credentials to access your account.
						</p>
					</div>
					{needsVerification && (
						<div className="p-3 text-sm bg-primary/20 text-primary rounded-md">
							Please check your email to verify your account before logging in.
						</div>
					)}
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? 'Logging in...' : 'Log in'}
						</Button>
					</form>
					<p className="px-8 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{' '}
						<Link href="/signup" className="underline underline-offset-4 hover:text-primary">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
