import type { PaymentMethod, SubscriptionStatus } from './subscription.types';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			blog_comments: {
				Row: {
					author_id: string;
					content: string;
					created_at: string;
					id: string;
					parent_id: string | null;
					post_id: string;
					updated_at: string;
				};
				Insert: {
					author_id: string;
					content: string;
					created_at?: string;
					id?: string;
					parent_id?: string | null;
					post_id: string;
					updated_at?: string;
				};
				Update: {
					author_id?: string;
					content?: string;
					created_at?: string;
					id?: string;
					parent_id?: string | null;
					post_id?: string;
					updated_at?: string;
				};
				Relationships: Array<{
					foreignKeyName: string;
					columns: string[];
					isOneToOne: boolean;
					referencedRelation: string;
					referencedColumns: string[];
				}>;
			};
			projects: {
				Row: {
					created_at: string;
					description: string | null;
					dev_environment_url: string | null;
					id: string;
					name: string;
					staging_environment_url: string | null;
					start_date: string | null;
					status: Database['public']['Enums']['project_status'];
					target_completion_date: string | null;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					dev_environment_url?: string | null;
					id?: string;
					name: string;
					staging_environment_url?: string | null;
					start_date?: string | null;
					status?: Database['public']['Enums']['project_status'];
					target_completion_date?: string | null;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					dev_environment_url?: string | null;
					id?: string;
					name?: string;
					staging_environment_url?: string | null;
					start_date?: string | null;
					status?: Database['public']['Enums']['project_status'];
					target_completion_date?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			subscriptions: {
				Row: {
					id: string;
					user_id: string;
					status: SubscriptionStatus;
					payment_methods: PaymentMethod[];
				};
				Insert: {
					id?: string;
					user_id: string;
					status: SubscriptionStatus;
					payment_methods: PaymentMethod[];
				};
				Update: {
					id?: string;
					user_id?: string;
					status?: SubscriptionStatus;
					payment_methods?: PaymentMethod[];
				};
				Relationships: [];
			};
			// Add other tables as needed
		};
		Views: {
			admin_users: {
				Row: {
					id: string | null;
				};
				Relationships: Array<{
					foreignKeyName: string;
					columns: string[];
					isOneToOne: boolean;
					referencedRelation: string;
					referencedColumns: string[];
				}>;
			};
			// Add other views as needed
		};
		Functions: {
			apply_project_members_policy_fix: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			// Add other functions as needed
		};
		Enums: {
			invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
			message_status: 'unread' | 'read' | 'archived';
			project_status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
			user_role: 'client' | 'admin' | 'developer';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> =
	PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
	PublicSchema['Tables'][T]['Update'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
