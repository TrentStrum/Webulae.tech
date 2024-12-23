'use client';

import { useQuery } from '@tanstack/react-query';

import { usePermissions } from '@/src/hooks/auth/usePermissions';

export function AnalyticsDashboard() {
  const { can } = usePermissions();

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return res.json();
    },
    enabled: can('analytics:read'), // Only fetch if user has permission
  });

	if (!can('analytics:read')) {
		return <p>You don&apos;t have permission to view analytics</p>;
	}

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading analytics</div>;

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
} 