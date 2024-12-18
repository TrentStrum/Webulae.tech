'use client';

import type { Editor } from '@tiptap/react';

interface ColorPickerProps {
	editor: Editor;
}

export function ColorPicker({ editor }: ColorPickerProps): JSX.Element {
	const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

	return (
		<div className="flex flex-wrap gap-1 p-2">
			{colors.map((color) => (
				<button
					key={color}
					className="w-6 h-6 rounded-md border"
					style={{ backgroundColor: color }}
					onClick={() => editor.chain().focus().setColor(color).run()}
				/>
			))}
		</div>
	);
}
