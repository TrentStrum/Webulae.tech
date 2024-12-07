```typescript
'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/src/utils/utils';

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  fullscreen?: boolean;
  text?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  blur?: boolean;
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingOverlay({
  fullscreen = false,
  text = 'Loading...',
  spinnerSize = 'md',
  blur = true,
  className,
  ...props
}: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullscreen ? 'fixed inset-0' : 'absolute inset-0',
        blur ? 'backdrop-blur-sm' : '',
        'bg-background/80 z-50',
        className
      )}
      role="alert"
      aria-busy="true"
      aria-label={text}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 
          className={cn(
            'animate-spin text-primary',
            spinnerSizes[spinnerSize]
          )} 
        />
        {text && (
          <p className="text-sm font-medium text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
```;
