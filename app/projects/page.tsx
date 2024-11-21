'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface Project {
	id: string;
	name: string;
	description: string | null;
	status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
	updated_at: string;
	created_at: string;
	dev_environment_url: string | null;
	staging_environment_url: string | null;
	start_date: string | null;
	target_completion_date: string | null;
}

interface ProjectMember {
	project_id: string;
}

const STATUS_COLORS = {
	planning: 'bg-blue-500/10 text-blue-500',
	in_progress: 'bg-yellow-500/10 text-yellow-500',
	review: 'bg-purple-500/10 text-purple-500',
	completed: 'bg-green-500/10 text-green-500',
	on_hold: 'bg-red-500/10 text-red-500',
} as const;

const LoadingSkeleton = () => (
	<div className="container py-8">
		<div className="h-10 w-48 bg-muted rounded mb-8" />
		<div className="grid gap-6">
			{[1, 2, 3].map((i) => (
				<Card key={i} className="animate-pulse">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="h-8 bg-muted rounded w-1/4" />
							<div className="h-6 bg-muted rounded w-20" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="h-4 bg-muted rounded w-3/4 mb-4" />
						<div className="h-4 bg-muted rounded w-1/4" />
					</CardContent>
				</Card>
			))}
		</div>
	</div>
);

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const router = useRouter();

	const loadProjects = useCallback(async () => {
		let mounted = true;
		
		try {
			const { data: { session } } = await supabase.auth.getSession();
			
			if (!mounted) return;
			
			if (!session) {
				router.push('/login');
				return;
			}

			const { data: projectMembers, error: memberError } = await supabase
				.from('project_members')
				.select('project_id')
				.eq('user_id', session.user.id);

			if (memberError) throw memberError;

			const projectIds = projectMembers?.map(pm => pm.project_id) || [];

			if (projectIds.length > 0) {
				const { data: projects, error: projectsError } = await supabase
					.from('projects')
					.select('*')
					.in('id', projectIds)
					.order('updated_at', { ascending: false });

				if (projectsError) throw projectsError;
				
				if (mounted) {
					setProjects(projects || []);
				}
			}
		} catch (error) {
			if (mounted) {
				console.error('Error loading projects:', error);
				setError(error instanceof Error ? error : new Error('Failed to load projects'));
			}
		} finally {
			if (mounted) {
				setLoading(false);
			}
		}
	}, [router]);

	useEffect(() => {
		let mounted = true;

		const handleFocus = () => {
			if (document.visibilityState === 'visible') {
				loadProjects();
			}
		};

		document.addEventListener('visibilitychange', handleFocus);

		loadProjects();

		return () => {
			mounted = false;
			document.removeEventListener('visibilitychange', handleFocus);
		};
	}, [loadProjects, router]);

	const getStatusColor = (status: Project['status']) => {
		return STATUS_COLORS[status] || 'bg-gray-500/10 text-gray-500';
	};

	if (loading) return <LoadingSkeleton />;

	if (error) {
		return (
			<div className="container py-8">
				<Card className="border-red-500">
					<CardContent className="py-8 text-center text-red-500">
						Error loading projects: {error.message}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">My Projects</h1>

			<div className="grid gap-6">
				{projects.length === 0 ? (
					<Card>
						<CardContent className="py-8 text-center text-muted-foreground">
							<p role="status">No projects found.</p>
						</CardContent>
					</Card>
				) : (
					projects.map((project) => (
						<Link 
							key={project.id} 
							href={`/projects/${project.id}`}
							className="block"
							aria-label={`View ${project.name} project details`}
						>
							<Card className="transition-all hover:shadow-lg hover:border-primary/50">
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>{project.name}</CardTitle>
										<Badge className={getStatusColor(project.status)}>
											{project.status.replace('_', ' ')}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-4">{project.description}</p>
									<p className="text-sm text-muted-foreground">
										Last updated{' '}
										{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
									</p>
								</CardContent>
							</Card>
						</Link>
					))
				)}
			</div>
		</div>
	);
}
