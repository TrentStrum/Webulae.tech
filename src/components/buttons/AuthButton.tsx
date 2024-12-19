'use client';

import { Button } from '@/src/components/ui/button';
import Link from 'next/link';

export default function AuthButtons(): JSX.Element {
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
