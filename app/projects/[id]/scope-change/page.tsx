'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function ScopeChangePage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('scope_change_requests')
        .insert([
          {
            project_id: id,
            requester_id: session.user.id,
            title,
            description,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Scope change request submitted successfully.',
      });

      router.push(`/projects/${id}`);
    } catch (error) {
      console.error('Error submitting scope change request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit scope change request.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Request Scope Change</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
              <p className="text-sm text-muted-foreground">
                Please provide detailed information about the requested changes and their impact.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}