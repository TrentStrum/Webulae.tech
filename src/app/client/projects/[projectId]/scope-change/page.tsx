'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { useToast } from '@/src/hooks';
import { useCreateScopeChangeRequest } from '@/src/hooks/react-query/useScopeChangeRequests';

export default function ScopeChangePage() {
	const { id: projectId } = useParams();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const router = useRouter();
	const { toast } = useToast();

	const { mutate: createScopeChange, isPending: submitting } = useCreateScopeChangeRequest(
		projectId as string
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		createScopeChange(
			{
				project_id: projectId as string,
				title,
				description,
				requester_id: 'current-user-id-placeholder',
			},
			{
				onSuccess: () => {
					toast({
						title: 'Success',
						description: 'Scope change request submitted successfully.',
					});
					router.push(`/projects/${projectId}`);
				},
				onError: (error: any) => {
					console.error('Error submitting scope change request:', error);
					toast({
						title: 'Error',
						description: 'Failed to submit scope change request.',
						variant: 'destructive',
					});
				},
			}
		);
	};

	return (
		<div className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Request Scope Change</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={6}
								required
							/>
							<p className="text-sm text-muted-foreground">
								Please provide detailed information about the requested changes and their impact.
							</p>
						</div>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
								disabled={submitting}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={submitting}>
								{submitting ? 'Submitting...' : 'Submit Request'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
