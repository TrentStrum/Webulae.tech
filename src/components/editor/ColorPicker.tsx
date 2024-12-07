```typescript
'use client';

import { Editor } from '@tiptap/react';
import { Button } from '../ui/button';

const colors = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
];

interface ColorPickerProps {
  editor: Editor;
}

export function ColorPicker({ editor }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-10 gap-1 p-2">
      {colors.map((color) => (
        <Button
          key={color}
          variant="ghost"
          className="w-6 h-6 p-0"
          style={{ backgroundColor: color }}
          onClick={() => editor.chain().focus().setColor(color).run()}
        />
      ))}
    </div>
  );
}
```;
