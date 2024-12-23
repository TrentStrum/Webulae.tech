export function AccessDenied(): JSX.Element {
	return (
		<div className="flex flex-col items-center justify-center p-4">
			<h2 className="text-xl font-semibold">Access Denied</h2>
			<p className="text-muted-foreground">You don&apos;t have permission to view this content.</p>
		</div>
	);
} 