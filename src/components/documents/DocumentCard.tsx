'use client';

import { FileText, Download } from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';

import type { Document } from '@/src/types';

type Props = {
	document: Document[] | undefined;
};

export default function DocumentCard({ document }: Props): JSX.Element {
	if (!document?.length) return <div>No documents found</div>;

	return (
		<div className="space-y-4">
			{document.map((doc) => (
				<Card key={doc.id}>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<FileText className="h-6 w-6 text-muted-foreground" />
								<div>
									<CardTitle className="text-lg">{doc.name}</CardTitle>
									<CardDescription>
										Uploaded by {doc.uploaded_by?.full_name || doc.uploaded_by?.username}
									</CardDescription>
								</div>
							</div>
							<Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')}>
								<Download className="h-4 w-4 mr-2" />
								Download
							</Button>
						</div>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
