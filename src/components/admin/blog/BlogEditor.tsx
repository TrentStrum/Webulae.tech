'use client';

import { BlogForm } from './BlogForm';

interface BlogEditorProps {
	action: 'create' | 'edit';
}

export default function BlogEditor({ action }: BlogEditorProps) {
	return <BlogForm action={action} />;
}
