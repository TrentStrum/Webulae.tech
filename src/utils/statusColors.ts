export const getStatusColor = (status: string) => {
	const statusColors: Record<string, string> = {
		planning: 'bg-blue-500/10 text-blue-500',
		in_progress: 'bg-yellow-500/10 text-yellow-500',
		review: 'bg-purple-500/10 text-purple-500',
		completed: 'bg-green-500/10 text-green-500',
		on_hold: 'bg-red-500/10 text-red-500',
	};
	return statusColors[status] || 'bg-gray-500/10 text-gray-500';
};
