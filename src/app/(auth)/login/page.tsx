'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { AuthSideContent } from '@/src/app/(auth)/register/components/AuthSideContent';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useLoginMutation } from '@/src/hooks/react-query/useAuthMutations';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const { toast } = useToast();
	
	const { mutate: login, isPending } = useLoginMutation();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !password.trim()) {
			toast({
				title: 'Error',
				description: 'Please enter both email and password.',
				variant: 'destructive',
			});
			return;
		}

		login({ email: email.trim(), password: password.trim() });
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
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
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={togglePasswordVisibility}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>
							</div>
						</div>
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? 'Logging in...' : 'Log in'}
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
