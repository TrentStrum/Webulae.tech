'use client';

import { SignIn } from '@/src/app/sign-in/[[...sign-in]]/components/SignIn';
import { Card } from '@/src/components/ui/card';

export default function Page(): JSX.Element {
	return (
		<div className="container py-8 min-h-screen flex items-center justify-center">
			<Card className="max-w-md w-full p-8">
				<SignIn />
			</Card>
		</div>
	);
}
