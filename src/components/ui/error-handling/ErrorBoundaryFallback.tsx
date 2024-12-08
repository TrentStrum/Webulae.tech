'use client';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

interface ErrorBoundaryFallbackProps {
	error: Error;
	resetErrorBoundary: () => void;
	message?: string;
}

export function ErrorBoundaryFallback({
	error,
	resetErrorBoundary,
	message = 'Something went wrong',
}: ErrorBoundaryFallbackProps) {
	return (
		<div className="min-h-[400px] flex items-center justify-center p-4">
			<Card className="max-w-md w-full">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						<CardTitle>{message}</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground">{error.message}</p>
					<div className="flex justify-end gap-4">
						<Button variant="outline" onClick={() => window.location.reload()}>
							Refresh Page
						</Button>
						<Button onClick={resetErrorBoundary}>Try Again</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
