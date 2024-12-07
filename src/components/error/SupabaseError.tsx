'use client';

import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

interface SupabaseErrorProps {
	error: Error;
	resetErrorBoundary?: () => void;
}

export function SupabaseError({ error, resetErrorBoundary }: SupabaseErrorProps) {
	const isConfigError = error.message.includes('Supabase configuration');

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Alert variant="destructive" className="max-w-md">
				<AlertTriangle className="h-5 w-5" />
				<AlertTitle>Configuration Error</AlertTitle>
				<AlertDescription className="mt-2">
					<p className="mb-4">{error.message}</p>
					{isConfigError ? (
						<div className="text-sm bg-background/10 p-4 rounded-md mb-4">
							<p className="font-mono">Add these variables to your .env.local file:</p>
							<pre className="mt-2 whitespace-pre-wrap">
								NEXT_PUBLIC_SUPABASE_URL=your-project-url{'\n'}
								NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
							</pre>
						</div>
					) : null}
					{resetErrorBoundary && (
						<Button onClick={resetErrorBoundary} variant="outline" className="w-full">
							Try Again
						</Button>
					)}
				</AlertDescription>
			</Alert>
		</div>
	);
}
