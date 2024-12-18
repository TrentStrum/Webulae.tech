'use client';

import { useParams, useRouter } from 'next/navigation';

import { BlogForm } from '@/src/components/admin/blog/BlogForm';
import { useToast } from '@/src/hooks';

export default function BlogAdminActionPage() {
	const { action } = useParams();
	const router = useRouter();
	const { toast } = useToast();

	if (!['create', 'edit'].includes(action as string)) {
		toast({
			title: 'Error',
			description: 'Invalid action',
			variant: 'destructive',
		});
		router.push('/blog/admin');
		return null;
	}

	return <BlogForm action={action as 'create' | 'edit'} />;
}
