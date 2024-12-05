```typescript
'use client';

import { cn } from '@/src/utils/utils';

interface LoadingPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  animate?: boolean;
  rounded?: boolean;
}

export function LoadingPlaceholder({
  width = 'w-full',
  height = 'h-4',
  animate = true,
  rounded = true,
  className,
  ...props
}: LoadingPlaceholderProps) {
  return (
    <div
      className={cn(
        'bg-muted',
        animate && 'animate-pulse',
        rounded && 'rounded',
        width,
        height,
        className
      )}
      role="presentation"
      aria-hidden="true"
      {...props}
    />
  );
}
```