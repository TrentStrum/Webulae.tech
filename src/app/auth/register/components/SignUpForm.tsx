'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/src/lib/supabaseClient';
import { useToast } from '@/src/hooks';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { AuthForm } from '@/src/components/auth/auth-form';
import { Button } from '@/src/components/ui/button';


export function SignUpForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			if (password.length < 6) {
				setError('Password must be at least 6 characters long');
				return;
			}

			// Sign up with Supabase
			const {
				data: { user },
				error: signUpError,
			} = await supabaseClient.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: fullName,
					},
				},
			});

			if (signUpError) throw signUpError;

			if (user) {
				toast({
					title: 'Success',
					description: 'Account created. Check your email to verify your account.',
				});

				router.push('/login?verified=false');
				router.refresh();
			}
		} catch (err: any) {
			setError(err.message || 'An error occurred during sign up');
			toast({
				title: 'Error',
				description: err.message || 'An error occurred during sign up',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div className="flex flex-col space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p className="text-sm text-muted-foreground">Enter your details to get started</p>
			</div>
			<AuthForm onSubmit={handleSignUp} error={error}>
				<div className="space-y-2">
					<Label htmlFor="fullName">Full Name</Label>
					<Input
						id="fullName"
						placeholder="John Doe"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						required
					/>
				</div>
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
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={6}
					/>
					<p className="text-sm text-muted-foreground">Must be at least 6 characters long</p>
				</div>
				<Button className="w-full" type="submit" disabled={loading}>
					{loading ? 'Creating account...' : 'Create account'}
				</Button>
			</AuthForm>
			<p className="px-8 text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<Link href="/login" className="underline underline-offset-4 hover:text-primary">
					Sign in
				</Link>
			</p>
		</div>
	);
}
