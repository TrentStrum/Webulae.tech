'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';

import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Link as LinkIcon,
	Image as ImageIcon,
	CheckSquare,
	Quote,
	HighlighterIcon,
	Undo,
	Redo,
	Eraser,
} from 'lucide-react';
import { Toolbar } from '@radix-ui/react-toolbar';


type Props = {
	content: string;
	onChange: (content: string) => void;
	onImageUpload?: (file: File) => Promise<string>;
	placeholder?: string;
}

export function EnhancedRichTextEditor({
	content,
	onChange,
	onImageUpload,
	placeholder = 'Start writing...',
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
			Typography,
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Highlight.configure({
				multicolor: true,
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) {
		return null;
	}

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

	const setLink = () => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL:', previousUrl);

		if (url === null) {
			return;
		}

		if (url === '') {
			editor.chain().focus().unsetLink().run();
			return;
		}

		editor.chain().focus().setLink({ href: url }).run();
	};

	return (
		<div className="border rounded-lg">
			<Toolbar className="p-2 border-b flex flex-wrap gap-1">
				<Select
					value={
						editor.isActive('heading', { level: 1 })
							? 'h1'
							: editor.isActive('heading', { level: 2 })
								? 'h2'
								: editor.isActive('heading', { level: 3 })
									? 'h3'
									: 'p'
					}
					onValueChange={(value) => {
						if (value === 'p') {
							editor.chain().focus().setParagraph().run();
						} else {
							editor
								.chain()
								.focus()
								.toggleHeading({
									level: parseInt(value.charAt(1)) as 1 | 2 | 3,
								})
								.run();
						}
					}}
				>
					<SelectTrigger className="w-[120px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="p">Paragraph</SelectItem>
						<SelectItem value="h1">Heading 1</SelectItem>
						<SelectItem value="h2">Heading 2</SelectItem>
						<SelectItem value="h3">Heading 3</SelectItem>
					</SelectContent>
				</Select>

				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBold().run()}
					data-active={editor.isActive('bold')}
					className="data-[active=true]:bg-muted"
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					data-active={editor.isActive('italic')}
					className="data-[active=true]:bg-muted"
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					data-active={editor.isActive('underline')}
					className="data-[active=true]:bg-muted"
				>
					<UnderlineIcon className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleHighlight().run()}
					data-active={editor.isActive('highlight')}
					className="data-[active=true]:bg-muted"
				>
					<HighlighterIcon className="h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					data-active={editor.isActive('bulletList')}
					className="data-[active=true]:bg-muted"
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					data-active={editor.isActive('orderedList')}
					className="data-[active=true]:bg-muted"
				>
					<ListOrdered className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					data-active={editor.isActive('taskList')}
					className="data-[active=true]:bg-muted"
				>
					<CheckSquare className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					data-active={editor.isActive('blockquote')}
					className="data-[active=true]:bg-muted"
				>
					<Quote className="h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().setTextAlign('left').run()}
					data-active={editor.isActive({ textAlign: 'left' })}
					className="data-[active=true]:bg-muted"
				>
					<AlignLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().setTextAlign('center').run()}
					data-active={editor.isActive({ textAlign: 'center' })}
					className="data-[active=true]:bg-muted"
				>
					<AlignCenter className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().setTextAlign('right').run()}
					data-active={editor.isActive({ textAlign: 'right' })}
					className="data-[active=true]:bg-muted"
				>
					<AlignRight className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().setTextAlign('justify').run()}
					data-active={editor.isActive({ textAlign: 'justify' })}
					className="data-[active=true]:bg-muted"
				>
					<AlignJustify className="h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="sm"
					onClick={setLink}
					data-active={editor.isActive('link')}
					className="data-[active=true]:bg-muted"
				>
					<LinkIcon className="h-4 w-4" />
				</Button>
				{onImageUpload && (
					<Button variant="ghost" size="sm" onClick={handleImageUpload}>
						<ImageIcon className="h-4 w-4" />
					</Button>
				)}

				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
				>
					<Redo className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
				>
					<Eraser className="h-4 w-4" />
				</Button>

				<input
					type="color"
					onInput={(event) => {
						editor
							.chain()
							.focus()
							.setColor((event.target as HTMLInputElement).value)
							.run();
					}}
					className="w-8 h-8 p-0 border-none rounded cursor-pointer"
				/>
			</Toolbar>
			<EditorContent editor={editor} className="prose prose-sm max-w-none p-4" />
		</div>
	);
}
