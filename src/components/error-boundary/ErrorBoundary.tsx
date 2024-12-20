'use client';

import { useEffect } from 'react';

import { Button } from '@/src/components/ui/button';

interface Props {
	children: React.ReactNode;
	fallback: React.ReactNode;
}

export function ErrorBoundary({ children, fallback }: Props): JSX.Element {
	useEffect(() => {
		// Log the error to your error reporting service
		console.error('Error:', fallback);
	}, [fallback]);

	if (fallback) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
				<h2 className="text-2xl font-bold">Something went wrong!</h2>
				<div className="text-gray-600">{fallback}</div>
				<Button onClick={() => window.location.reload()}>Try again</Button>
			</div>
		);
	}

	return <>{children}</>;
}
