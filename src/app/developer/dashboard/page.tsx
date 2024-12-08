'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import DeveloperDashboardContent from '@/src/components/pages/developer/dashboard/DeveloperDashboardContent';
import { useProfile, useToast } from '@/src/hooks';

export default function DeveloperDashboard() {
	const router = useRouter();
	const { toast } = useToast();
	const { profile, isLoading } = useProfile();

	useEffect(() => {
		if (!isLoading && (!profile || (profile.role !== 'developer' && profile.role !== 'admin'))) {
			router.push('/');
			toast({
				title: 'Access Denied',
				description: 'You do not have permission to access this page.',
				variant: 'destructive',
			});
		}
	}, [profile, isLoading, router, toast]);

	if (isLoading) return <div>Loading...</div>;

	return <DeveloperDashboardContent />;
}
