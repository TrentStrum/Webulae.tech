'use client';

import { AlertCircle, XCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

interface ErrorMessageProps {
	title?: string;
	message: string;
	onRetry?: () => void;
	onDismiss?: () => void;
}

export function ErrorMessage({ title = 'Error', message, onRetry, onDismiss }: ErrorMessageProps) {
	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle className="flex items-center justify-between">
				{title}
				{onDismiss && (
					<Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onDismiss}>
						<XCircle className="h-4 w-4" />
					</Button>
				)}
			</AlertTitle>
			<AlertDescription className="mt-2">
				<p>{message}</p>
				{onRetry && (
					<Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
						Try Again
					</Button>
				)}
			</AlertDescription>
		</Alert>
	);
}
