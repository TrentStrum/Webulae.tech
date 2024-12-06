'use client';

import { useParams } from 'next/navigation';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { useProjectTimeline } from '@/src/hooks/react-query/useTimeline';


const getStatusColor = (status: string) => {
	const colors = {
		planned: 'bg-blue-500/10 text-blue-500',
		in_progress: 'bg-yellow-500/10 text-yellow-500',
		completed: 'bg-green-500/10 text-green-500',
		delayed: 'bg-red-500/10 text-red-500',
	};
	return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-500';
};

export default function ProjectTimelinePage() {
	const { id } = useParams();
	const projectId = Array.isArray(id) ? id[0] : id;
	const { data: timeline = [], isLoading, isError } = useProjectTimeline(projectId);

	if (isLoading) {
		return <div className="container py-8">Loading...</div>;
	}

	if (isError) {
		return <div className="container py-8">Error loading timeline</div>;
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Project Timeline</h1>

			<div className="relative">
				{/* Timeline line */}
				<div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />

				{/* Timeline items */}
				<div className="space-y-8">
					{timeline.map((item, index) => (
						<div
							key={item.id}
							className={`flex items-start ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
						>
							<div className="w-1/2 px-8">
								<Card>
									<CardHeader>
										<div className="flex justify-between items-start">
											<CardTitle>{item.title}</CardTitle>
											<Badge className={getStatusColor(item.status)}>
												{item.status.replace('_', ' ')}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">{item.description}</p>
										<div className="text-sm text-muted-foreground">
											<p>Start: {new Date(item.start_date).toLocaleDateString()}</p>
											<p>End: {new Date(item.end_date).toLocaleDateString()}</p>
										</div>
									</CardContent>
								</Card>
							</div>
							<div className="w-1/2" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
