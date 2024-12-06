'use client';

import { Mail, Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { useLoginMutation } from '@/src/hooks/auth/useAuthMutations';
import { useToast } from '@/src/hooks/helpers/use-toast';

import { AuthSideContent } from '../register/components/AuthSideContent';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const { toast } = useToast();
	const { mutate: login, isPending: isLoading } = useLoginMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		login(
			{ email, password },
			{
				onSuccess: () => {
					toast({
						title: 'Success',
						description: 'Successfully logged in',
					});
				},
				onError: (error) => {
					toast({
						title: 'Error',
						description: error.message || 'Failed to login',
						variant: 'destructive',
					});
				},
			}
		);
	};

	return (
		<div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<AuthSideContent 
				icon={LogIn}
				title="Welcome back"
				quote="Sign in to your account to continue your journey"
			/>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
						<p className="text-sm text-muted-foreground">
							Enter your credentials to sign in
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Input
									id="email"
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-2.5"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-muted-foreground" />
									) : (
										<Eye className="h-5 w-5 text-muted-foreground" />
									)}
								</button>
							</div>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>

					<p className="px-8 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{' '}
						<Link
							href="/auth/register"
							className="underline underline-offset-4 hover:text-primary"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
