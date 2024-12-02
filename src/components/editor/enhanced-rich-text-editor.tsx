'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { Button } from '../ui/button';
import { Toolbar } from '@radix-ui/react-toolbar';

type Props = {
	content: string;
	onChange: (content: string) => void;
	onImageUpload?: (file: File) => Promise<string>;
	placeholder?: string;
	showAdvancedToolbar?: boolean; // Toggle advanced features
	onAnnotateImage?: (file: File) => void; // Launch ImageAnnotator
};

export function EnhancedRichTextEditor({
	content,
	onChange,
	onImageUpload,
	placeholder = 'Start writing...',
	showAdvancedToolbar = true,
	onAnnotateImage,
}: Props) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Image,
			Link.configure({
				openOnClick: false,
			}),
			Color,
			TextStyle,
			Highlight,
			Placeholder.configure({ placeholder }),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) return null;

	const handleImageUpload = async () => {
		if (!onImageUpload) return;

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (file) {
				try {
					const url = await onImageUpload(file);
					editor.chain().focus().setImage({ src: url }).run();
				} catch (error) {
					console.error('Error uploading image:', error);
				}
			}
		};
		input.click();
	};

	return (
		<div className="border rounded-lg">
			<Toolbar className="p-2 border-b flex flex-wrap gap-1">
				{/* Basic Toolbar */}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBold().run()}
					data-active={editor.isActive('bold')}
					className="data-[active=true]:bg-muted"
				>
					B
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					data-active={editor.isActive('italic')}
					className="data-[active=true]:bg-muted"
				>
					I
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					data-active={editor.isActive('underline')}
					className="data-[active=true]:bg-muted"
				>
					U
				</Button>
				<Button variant="ghost" size="sm" onClick={handleImageUpload}>
					Upload Image
				</Button>
				{onAnnotateImage && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							const input = document.createElement('input');
							input.type = 'file';
							input.accept = 'image/*';
							input.onchange = () => {
								const file = input.files?.[0];
								if (file) {
									onAnnotateImage(file);
								}
							};
							input.click();
						}}
					>
						Annotate Image
					</Button>
				)}

				{/* Advanced Toolbar */}
				{showAdvancedToolbar && (
					<>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							data-active={editor.isActive('bulletList')}
							className="data-[active=true]:bg-muted"
						>
							Bullet List
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().toggleHighlight().run()}
							data-active={editor.isActive('highlight')}
							className="data-[active=true]:bg-muted"
						>
							Highlight
						</Button>
					</>
				)}
			</Toolbar>
			<EditorContent editor={editor} className="prose prose-sm max-w-none p-4" />
		</div>
	);
}
