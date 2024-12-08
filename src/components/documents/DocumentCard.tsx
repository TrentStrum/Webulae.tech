'use client';

import { FileText, Download } from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';

import type { Document } from '@/src/types';

type Props = {
	document: Document;
};

export default function DocumentCard({ document }: Props) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<FileText className="h-6 w-6 text-muted-foreground" />
						<div>
							<CardTitle className="text-lg">{document.name}</CardTitle>
							<CardDescription>
								Uploaded by {document.uploaded_by?.full_name || document.uploaded_by?.username}
							</CardDescription>
						</div>
					</div>
					<Button variant="outline" size="sm" onClick={() => window.open(document.url, '_blank')}>
						<Download className="h-4 w-4 mr-2" />
						Download
					</Button>
				</div>
			</CardHeader>
		</Card>
	);
}
