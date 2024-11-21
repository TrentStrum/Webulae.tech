export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          role: 'client' | 'admin' | 'developer'
        }
        Insert: {
          id: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          role?: 'client' | 'admin' | 'developer'
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          role?: 'client' | 'admin' | 'developer'
        }
      }
      // ... rest of the types remain the same
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_comment_likes_count: {
        Args: {
          comment_id: string
        }
        Returns: number
      }
    }
    Enums: {
      user_role: 'client' | 'admin' | 'developer'
    }
  }
}