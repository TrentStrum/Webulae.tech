'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/src/utils/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  centered?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({ 
  className, 
  size = "md", 
  centered = false,
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center",
        centered && "fixed inset-0 bg-background/50 backdrop-blur-sm z-50",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}