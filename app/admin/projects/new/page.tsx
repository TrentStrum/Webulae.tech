'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Project description is required'),
  status: z.enum(['planning', 'in_progress', 'review', 'completed', 'on_hold']),
  dev_environment_url: z.string().url().optional().or(z.literal('')),
  staging_environment_url: z.string().url().optional().or(z.literal('')),
  start_date: z.string().optional(),
  target_completion_date: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProject() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'planning',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setSubmitting(true);

    try {
      const { error: projectError } = await supabase
        .from('projects')
        .insert([data])
        .select()
        .single();

      if (projectError) throw projectError;

      toast({
        title: 'Success',
        description: 'Project created successfully.',
      });

      router.push('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue="planning"
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_completion_date">Target Completion Date</Label>
                <Input
                  id="target_completion_date"
                  type="date"
                  {...register('target_completion_date')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dev_environment_url">Development Environment URL</Label>
              <Input
                id="dev_environment_url"
                type="url"
                {...register('dev_environment_url')}
                placeholder="https://"
                className={errors.dev_environment_url ? 'border-red-500' : ''}
              />
              {errors.dev_environment_url && (
                <p className="text-sm text-red-500">{errors.dev_environment_url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="staging_environment_url">Staging Environment URL</Label>
              <Input
                id="staging_environment_url"
                type="url"
                {...register('staging_environment_url')}
                placeholder="https://"
                className={errors.staging_environment_url ? 'border-red-500' : ''}
              />
              {errors.staging_environment_url && (
                <p className="text-sm text-red-500">{errors.staging_environment_url.message}</p>
              )}
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
                {submitting ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}