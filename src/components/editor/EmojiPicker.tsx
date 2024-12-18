'use client';

import type { Editor } from '@tiptap/react';

interface EmojiPickerProps {
	editor: Editor;
}

export function EmojiPicker({ editor }: EmojiPickerProps): JSX.Element {
	const emojis = ['😀', '😊', '🎉', '❤️', '👍', '🚀', '💡', '⭐'];

	return (
		<div className="flex flex-wrap gap-2 p-2">
			{emojis.map((emoji) => (
				<button
					key={emoji}
					className="text-xl hover:bg-secondary p-2 rounded-md"
					onClick={() => editor.chain().focus().insertContent(emoji).run()}
				>
					{emoji}
				</button>
			))}
		</div>
	);
}
