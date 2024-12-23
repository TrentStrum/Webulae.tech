'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

import { Button } from '@/src/components/ui/button';

export default function AuthButtons(): JSX.Element {
	const { isSignedIn, isLoaded } = useAuth();

	// Don't show anything while loading to prevent flash
	if (!isLoaded) return <></>;

	// If signed in, don't show auth buttons
	if (isSignedIn) return <></>;

	return (
		<div className="flex gap-2 px-3">
			<Button variant="ghost" asChild>
				<Link href="/sign-in">Sign In</Link>
			</Button>
			<Button asChild>
				<Link href="/sign-up">Sign Up</Link>
			</Button>
		</div>
	);
}
