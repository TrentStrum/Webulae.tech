'use client';

import { useState } from 'react';

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/src/components/ui/select';
import { useToast } from '@/src/hooks';
import { useUploadDocument } from '@/src/hooks/react-query/useDocuments';

interface DocumentUploaderProps {
	projectId: string;
}

export default function DocumentUploader({ projectId }: DocumentUploaderProps) {
	const [category, setCategory] = useState('');
	const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument();
	const { toast } = useToast();

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = event.target.files?.[0];
			if (!file || !category) {
				toast({
					title: 'Error',
					description: 'Please select a file and a category.',
					variant: 'destructive',
				});
				return;
			}

			await uploadDocument({ file, category, projectId });

			toast({
				title: 'Success',
				description: 'Document uploaded successfully.',
			});

			event.target.value = ''; // Reset file input
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to upload document.',
				variant: 'destructive',
			});
		}
	};

	return (
		<Card className="mb-8">
			<CardHeader>
				<CardTitle>Upload Document</CardTitle>
				<CardDescription>
					Upload new documents to the system. Supported formats: PDF, DOC, DOCX, XLS, XLSX
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div>
						<Label htmlFor="category">Category</Label>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger>
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="contract">Contract</SelectItem>
								<SelectItem value="scope_change">Scope Change</SelectItem>
								<SelectItem value="design">Design</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="file">File</Label>
						<Input
							id="file"
							type="file"
							onChange={handleFileUpload}
							disabled={isUploading}
							accept=".pdf,.doc,.docx,.xls,.xlsx"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
