```typescript
'use client';

import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/src/components/ui/button';
import { cn } from '@/src/utils/utils';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  isLoading,
  loadingText = 'Loading...',
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={isLoading || disabled}
      className={cn('relative', className)}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {isLoading ? loadingText : children}
    </Button>
  );
}
```