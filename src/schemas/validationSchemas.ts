import { z } from 'zod';

import { OrganizationStatus } from '@/src/types/organization.types';
import { ProjectStatus } from '@/src/types/project.types';
import { UserStatus, UserRole } from '@/src/types/user.types';

export const organizationSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  status: z.nativeEnum(OrganizationStatus),
  settings: z.object({
    timezone: z.string(),
    locale: z.string(),
    features: z.record(z.boolean()),
    theme: z.object({
      primary: z.string(),
      logo: z.string().url().optional(),
    }),
  }),
});

export const userSchema = z.object({
  email: z.string().email(),
  status: z.nativeEnum(UserStatus),
  role: z.nativeEnum(UserRole),
  profile: z.object({
    displayName: z.string().min(1).max(100),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    socialLinks: z.record(z.string().url()).optional(),
  }),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
    }),
    dashboard: z.object({
      layout: z.enum(['grid', 'list']),
      defaultView: z.enum(['week', 'month', 'year']),
    }),
  }),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  status: z.nativeEnum(ProjectStatus),
  organizationId: z.string().uuid(),
  createdBy: z.string().uuid(),
});

// Partial schemas for updates
export const partialOrganizationSchema = organizationSchema.partial();
export const partialUserSchema = userSchema.partial();
export const partialProjectSchema = projectSchema.partial(); 