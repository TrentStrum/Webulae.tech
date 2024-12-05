```typescript
'use client';

import { Editor } from '@tiptap/react';
import { Button } from '../ui/button';

const fonts = [
  { name: 'Default', value: 'Inter' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Cursive', value: 'cursive' },
];

interface FontFamilyPickerProps {
  editor: Editor;
}

export function FontFamilyPicker({ editor }: FontFamilyPickerProps) {
  return (
    <div className="flex flex-col gap-1 min-w-[150px] p-2">
      {fonts.map((font) => (
        <Button
          key={font.value}
          variant="ghost"
          className="justify-start"
          style={{ fontFamily: font.value }}
          onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
        >
          {font.name}
        </Button>
      ))}
    </div>
  );
}
```