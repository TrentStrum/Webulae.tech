'use client';

import type { Editor } from '@tiptap/react';

interface FontFamilyPickerProps {
	editor: Editor;
}

export function FontFamilyPicker({ editor }: FontFamilyPickerProps): JSX.Element {
	const fonts = [
		{ name: 'Default', value: 'sans-serif' },
		{ name: 'Serif', value: 'serif' },
		{ name: 'Mono', value: 'monospace' },
	];

	return (
		<div className="flex flex-col gap-1 p-2">
			{fonts.map((font) => (
				<button
					key={font.value}
					className="px-4 py-2 text-sm hover:bg-secondary rounded-md text-left"
					style={{ fontFamily: font.value }}
					onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
				>
					{font.name}
				</button>
			))}
		</div>
	);
}
