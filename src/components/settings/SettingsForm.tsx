'use client';

import { useMutation } from '@tanstack/react-query';

import { usePermissions } from '@/src/hooks/auth/usePermissions';
import { useToast } from '@/src/hooks/helpers/use-toast';

export function SettingsForm() {
  const { can } = usePermissions();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(data)),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update settings');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Settings updated',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to update settings',
        variant: 'destructive',
      });
    },
  });

  if (!can('settings:write')) {
    return null;
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate(new FormData(e.currentTarget));
    }}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
} 