'use client';

import { Button } from "@/src/components/ui/button";
import { CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { ProjectFormData, projectSchema } from "@/src/schemas/projectSchema";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

type Props = {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ProjectForm({ onSubmit, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'planning',
      dev_environment_url: '',
      staging_environment_url: '',
    },
  });

  // Watch start_date to validate target_completion_date
  const startDate = watch('start_date');
  useEffect(() => {
    if (startDate) {
      const target = watch('target_completion_date');
      if (target && new Date(target) < new Date(startDate)) {
        setValue('target_completion_date', '');
      }
    }
  }, [startDate, setValue, watch]);

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input 
            id="name" 
            {...register('name')} 
            className={errors.name ? 'border-destructive' : ''} 
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            rows={4}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
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
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_completion_date">Target Completion Date</Label>
            <Input
              id="target_completion_date"
              type="date"
              {...register('target_completion_date')}
              min={startDate || new Date().toISOString().split('T')[0]}
            />
            {errors.target_completion_date && (
              <p className="text-sm text-destructive">
                {errors.target_completion_date.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dev_environment_url">Development Environment URL</Label>
          <Input
            id="dev_environment_url"
            type="url"
            {...register('dev_environment_url')}
            placeholder="https://"
            className={errors.dev_environment_url ? 'border-destructive' : ''}
          />
          {errors.dev_environment_url && (
            <p className="text-sm text-destructive">
              {errors.dev_environment_url.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="staging_environment_url">Staging Environment URL</Label>
          <Input
            id="staging_environment_url"
            type="url"
            {...register('staging_environment_url')}
            placeholder="https://"
            className={errors.staging_environment_url ? 'border-destructive' : ''}
          />
          {errors.staging_environment_url && (
            <p className="text-sm text-destructive">
              {errors.staging_environment_url.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </CardContent>
  );
}