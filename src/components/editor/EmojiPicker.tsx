```typescript
'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Editor } from '@tiptap/react';
import { useTheme } from 'next-themes';

interface EmojiPickerProps {
  editor: Editor;
}

export function EmojiPicker({ editor }: EmojiPickerProps) {
  const { theme } = useTheme();

  return (
    <Picker
      data={data}
      onEmojiSelect={(emoji: any) => {
        editor.chain().focus().insertContent(emoji.native).run();
      }}
      theme={theme === 'dark' ? 'dark' : 'light'}
      set="native"
    />
  );
}
```;
