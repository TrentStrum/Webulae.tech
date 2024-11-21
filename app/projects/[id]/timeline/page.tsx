'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
}

export default function ProjectTimeline() {
  const { id } = useParams();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTimeline();
  }, [id]);

  const loadTimeline = async () => {
    try {
      const { data, error } = await supabase
        .from('project_timeline')
        .select('*')
        .eq('project_id', id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setTimeline(data || []);
    } catch (error) {
      console.error('Error loading timeline:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project timeline.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-blue-500/10 text-blue-500',
      in_progress: 'bg-yellow-500/10 text-yellow-500',
      completed: 'bg-green-500/10 text-green-500',
      delayed: 'bg-red-500/10 text-red-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-500';
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
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
              className={`flex items-start ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
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