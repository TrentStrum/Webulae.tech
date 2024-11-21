'use client';

import { ReactNode } from 'react';

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
}

export function AuthForm({ children, onSubmit, error }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-900/30">
          {error}
        </div>
      )}
      {children}
    </form>
  );
}