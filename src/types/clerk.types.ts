import type { UserResource } from '@clerk/types';

export type ClerkUserRole = 'admin' | 'developer' | 'client';

export interface ClerkMetadata {
  role?: ClerkUserRole;
  // Add other metadata fields as needed
}

// Extend Clerk's UserResource type with our metadata
declare module '@clerk/types' {
  interface UserResource {
    publicMetadata: ClerkMetadata;
  }
}

// Type for our mapped user
export interface AppUser {
  id: string;
  email: string;
  role: ClerkUserRole;
  fullName?: string;
  imageUrl?: string;
} 