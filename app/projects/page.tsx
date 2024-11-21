'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  updated_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
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
        setProjects(projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-500/10 text-blue-500';
      case 'in_progress':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'review':
        return 'bg-purple-500/10 text-purple-500';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'on_hold':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-8 bg-muted rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
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
              No projects found.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
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
                    Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
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