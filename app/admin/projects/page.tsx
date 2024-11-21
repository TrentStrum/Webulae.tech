'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ProjectCardSkeleton } from '@/components/skeletons/project-card-skeleton';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  updated_at: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
    loadProjects();
  }, [statusFilter]);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      router.push('/');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
    }
  };

  const loadProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      planning: 'bg-blue-500/10 text-blue-500',
      in_progress: 'bg-yellow-500/10 text-yellow-500',
      review: 'bg-purple-500/10 text-purple-500',
      completed: 'bg-green-500/10 text-green-500',
      on_hold: 'bg-red-500/10 text-red-500',
    };
    return statusColors[status] || 'bg-gray-500/10 text-gray-500';
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        <div className="mb-6">
          <Select disabled value="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
          </Select>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No projects found.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/admin/projects/${project.id}`)}
            >
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
          ))
        )}
      </div>
    </div>
  );
}