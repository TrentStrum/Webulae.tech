'use client';
import { useSignIn } from '@clerk/nextjs';
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react';
import React from 'react';

import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { cn } from '@/src/lib/utils';

export function SignIn() {
	const { isLoaded, signIn } = useSignIn();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isLoaded) return;

		try {
			const formData = new FormData(e.currentTarget);
			await signIn.create({
				identifier: formData.get('email') as string,
				password: formData.get('password') as string,
			});
		} catch (err) {
			console.error('Error signing in:', err);
		}
	};

	const handleOAuthSignIn = (strategy: 'oauth_google' | 'oauth_github') => {
		if (!isLoaded) return;

		signIn?.authenticateWithRedirect({
			strategy,
			redirectUrl: '/sso-callback',
			redirectUrlComplete: '/'
		});
	};

	return (
		<div className="w-full">
			<h2 className="font-bold text-xl text-foreground">Welcome Back</h2>
			<p className="text-muted-foreground text-sm max-w-sm mt-2">
				Sign in to your account to continue
			</p>

			<form className="my-8" onSubmit={handleSubmit}>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Email Address</Label>
					<Input name="email" id="email" placeholder="you@example.com" type="email" />
				</LabelInputContainer>
				<LabelInputContainer className="mb-8">
					<Label htmlFor="password">Password</Label>
					<Input name="password" id="password" placeholder="••••••••" type="password" />
				</LabelInputContainer>

				<button
					className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					type="submit"
				>
					Sign in &rarr;
					<BottomGradient />
				</button>

				<div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

				<div className="flex flex-col space-y-4">
					<button
						onClick={() => handleOAuthSignIn('oauth_github')}
						className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
						type="button"
					>
						<IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
						<span className="text-neutral-700 dark:text-neutral-300 text-sm">
							Continue with GitHub
						</span>
						<BottomGradient />
					</button>
					<button
						onClick={() => handleOAuthSignIn('oauth_google')}
						className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
						type="button"
					>
						<IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
						<span className="text-neutral-700 dark:text-neutral-300 text-sm">
							Continue with Google
						</span>
						<BottomGradient />
					</button>
				</div>
			</form>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return <div className={cn('flex flex-col space-y-2 w-full', className)}>{children}</div>;
};
