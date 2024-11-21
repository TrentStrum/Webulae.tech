'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  Calendar,
  FileText,
  MessageSquare,
  PlusCircle,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  dev_environment_url: string | null;
  staging_environment_url: string | null;
}

interface TimelineItem {
  id: string;
  title: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface Update {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  };
}

interface Document {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  paid_date: string | null;
}

export default function ProjectDashboard() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      // Load project details
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(project);

      // Load timeline
      const { data: timeline, error: timelineError } = await supabase
        .from('project_timeline')
        .select('*')
        .eq('project_id', id)
        .order('start_date', { ascending: true });

      if (timelineError) throw timelineError;
      setTimeline(timeline || []);

      // Load updates
      const { data: updates, error: updatesError } = await supabase
        .from('project_updates')
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;
      setUpdates(updates || []);

      // Load documents
      const { data: documents, error: documentsError } = await supabase
        .from('project_documents')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (documentsError) throw documentsError;
      setDocuments(documents || []);

      // Load invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('project_invoices')
        .select('*')
        .eq('project_id', id)
        .order('due_date', { ascending: false });

      if (invoicesError) throw invoicesError;
      setInvoices(invoices || []);
    } catch (error) {
      console.error('Error loading project data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScopeChangeRequest = () => {
    router.push(`/projects/${id}/scope-change`);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      planning: 'bg-blue-500/10 text-blue-500',
      in_progress: 'bg-yellow-500/10 text-yellow-500',
      review: 'bg-purple-500/10 text-purple-500',
      completed: 'bg-green-500/10 text-green-500',
      on_hold: 'bg-red-500/10 text-red-500',
      paid: 'bg-green-500/10 text-green-500',
      sent: 'bg-blue-500/10 text-blue-500',
      overdue: 'bg-red-500/10 text-red-500',
      delayed: 'bg-red-500/10 text-red-500',
    };
    return statusColors[status] || 'bg-gray-500/10 text-gray-500';
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!project) {
    return <div className="container py-8">Project not found</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace('_', ' ')}
          </Badge>
        </div>
        <Button onClick={handleScopeChangeRequest}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Request Scope Change
        </Button>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">
            <Calendar className="mr-2 h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="updates">
            <Activity className="mr-2 h-4 w-4" />
            Updates
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt className="mr-2 h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {timeline.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{item.title}</CardTitle>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Starts: {new Date(item.start_date).toLocaleDateString()}</span>
                  <span>Ends: {new Date(item.end_date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <CardTitle>{update.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{update.content}</p>
                <div className="text-sm text-muted-foreground">
                  Posted by {update.profiles.full_name || update.profiles.username}{' '}
                  {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value Continuing with the project dashboard implementation:

<boltAction type="file" filePath="app/projects/[id]/page.tsx">        <TabsContent value="documents" className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{doc.name}</CardTitle>
                  <Badge>{doc.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Added {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Messages</CardTitle>
                <Button onClick={() => router.push(`/projects/${id}/messages`)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Click "New Message" to contact your project team.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Invoice #{invoice.invoice_number}</CardTitle>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(invoice.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  {invoice.paid_date && (
                    <p className="text-sm text-muted-foreground">
                      Paid on {new Date(invoice.paid_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {(project.dev_environment_url || project.staging_environment_url) && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold">Environment Links</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {project.dev_environment_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Development Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={project.dev_environment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {project.dev_environment_url}
                  </a>
                </CardContent>
              </Card>
            )}
            {project.staging_environment_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Staging Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={project.staging_environment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {project.staging_environment_url}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}