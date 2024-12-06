'use client';

import { AlertCircle } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/src/utils/utils';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, description, className, id, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} className={error ? 'text-destructive' : ''}>
          {label}
        </Label>
        
        <Input
          id={fieldId}
          ref={ref}
          aria-describedby={`${fieldId}-error ${fieldId}-description`}
          aria-invalid={!!error}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />

        {error && (
          <div
            id={`${fieldId}-error`}
            className="flex items-center gap-2 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {description && (
          <p
            id={`${fieldId}-description`}
            className="text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';