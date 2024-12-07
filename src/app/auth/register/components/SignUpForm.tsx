'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthForm } from '@/src/components/auth/auth-form';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { useToast } from '@/src/hooks';
import { supabaseClient } from '@/src/lib/supabaseClient';

interface SignUpFormState {
	email: string;
	password: string;
	fullName: string;
}

export const SignUpForm = (): JSX.Element => {
	const [formState, setFormState] = useState<SignUpFormState>({
		email: '',
		password: '',
		fullName: '',
	});
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const { toast } = useToast();

	const handleSignUp = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			if (formState.password.length < 6) {
				setError('Password must be at least 6 characters long');
				return;
			}

			const {
				data: { user },
				error: signUpError,
			} = await supabaseClient.auth.signUp({
				email: formState.email,
				password: formState.password,
				options: {
					data: {
						full_name: formState.fullName,
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
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up';
			setError(errorMessage);
			toast({
				title: 'Error',
				description: errorMessage,
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
						value={formState.fullName}
						onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="name@example.com"
						value={formState.email}
						onChange={(e) => setFormState({ ...formState, email: e.target.value })}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						value={formState.password}
						onChange={(e) => setFormState({ ...formState, password: e.target.value })}
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
};
