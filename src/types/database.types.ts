import type { PaymentMethod, SubscriptionStatus } from './subscription.types';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
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
				Relationships: [
					{
						foreignKeyName: 'blog_comments_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'blog_comments_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'blog_comments_parent_id_fkey';
						columns: ['parent_id'];
						isOneToOne: false;
						referencedRelation: 'blog_comments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'blog_comments_post_id_fkey';
						columns: ['post_id'];
						isOneToOne: false;
						referencedRelation: 'blog_posts';
						referencedColumns: ['id'];
					},
				];
			};
			blog_post_views: {
				Row: {
					ip_address: unknown | null;
					post_id: string;
					user_agent: string | null;
					viewed_at: string;
					viewer_id: string | null;
				};
				Insert: {
					ip_address?: unknown | null;
					post_id: string;
					user_agent?: string | null;
					viewed_at?: string;
					viewer_id?: string | null;
				};
				Update: {
					ip_address?: unknown | null;
					post_id?: string;
					user_agent?: string | null;
					viewed_at?: string;
					viewer_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'blog_post_views_post_id_fkey';
						columns: ['post_id'];
						isOneToOne: false;
						referencedRelation: 'blog_posts';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'blog_post_views_viewer_id_fkey';
						columns: ['viewer_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'blog_post_views_viewer_id_fkey';
						columns: ['viewer_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			blog_posts: {
				Row: {
					author_id: string;
					content: string;
					content_format: string | null;
					created_at: string;
					excerpt: string | null;
					id: string;
					metadata: Json | null;
					published_at: string | null;
					slug: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					author_id: string;
					content: string;
					content_format?: string | null;
					created_at?: string;
					excerpt?: string | null;
					id?: string;
					metadata?: Json | null;
					published_at?: string | null;
					slug: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					author_id?: string;
					content?: string;
					content_format?: string | null;
					created_at?: string;
					excerpt?: string | null;
					id?: string;
					metadata?: Json | null;
					published_at?: string | null;
					slug?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'blog_posts_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'blog_posts_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			client_feedback: {
				Row: {
					client_id: string;
					comment: string;
					created_at: string;
					id: string;
					is_public: boolean | null;
					rating: number;
				};
				Insert: {
					client_id: string;
					comment: string;
					created_at?: string;
					id?: string;
					is_public?: boolean | null;
					rating: number;
				};
				Update: {
					client_id?: string;
					comment?: string;
					created_at?: string;
					id?: string;
					is_public?: boolean | null;
					rating?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'client_feedback_client_id_fkey';
						columns: ['client_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'client_feedback_client_id_fkey';
						columns: ['client_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			comment_likes: {
				Row: {
					comment_id: string;
					created_at: string;
					user_id: string;
				};
				Insert: {
					comment_id: string;
					created_at?: string;
					user_id: string;
				};
				Update: {
					comment_id?: string;
					created_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'comment_likes_comment_id_fkey';
						columns: ['comment_id'];
						isOneToOne: false;
						referencedRelation: 'blog_comments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comment_likes_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comment_likes_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			content_annotations: {
				Row: {
					annotation_data: Json;
					content_id: string;
					content_type: string;
					created_at: string;
					created_by: string;
					id: string;
					updated_at: string;
				};
				Insert: {
					annotation_data: Json;
					content_id: string;
					content_type: string;
					created_at?: string;
					created_by: string;
					id?: string;
					updated_at?: string;
				};
				Update: {
					annotation_data?: Json;
					content_id?: string;
					content_type?: string;
					created_at?: string;
					created_by?: string;
					id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'content_annotations_created_by_fkey';
						columns: ['created_by'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'content_annotations_created_by_fkey';
						columns: ['created_by'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			faqs: {
				Row: {
					answer: string;
					category: string;
					created_at: string;
					id: string;
					question: string;
					updated_at: string;
				};
				Insert: {
					answer: string;
					category: string;
					created_at?: string;
					id?: string;
					question: string;
					updated_at?: string;
				};
				Update: {
					answer?: string;
					category?: string;
					created_at?: string;
					id?: string;
					question?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					bio: string | null;
					full_name: string | null;
					id: string;
					role: Database['public']['Enums']['user_role'] | null;
					updated_at: string;
					username: string | null;
					website: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					bio?: string | null;
					full_name?: string | null;
					id: string;
					role?: Database['public']['Enums']['user_role'] | null;
					updated_at?: string;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					bio?: string | null;
					full_name?: string | null;
					id?: string;
					role?: Database['public']['Enums']['user_role'] | null;
					updated_at?: string;
					username?: string | null;
					website?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'profiles_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'auth_users';
						referencedColumns: ['id'];
					},
				];
			};
			project_documents: {
				Row: {
					annotations: Json | null;
					category: string;
					created_at: string;
					file_type: string;
					file_url: string;
					id: string;
					name: string;
					parent_id: string | null;
					project_id: string;
					uploader_id: string;
					version: number | null;
				};
				Insert: {
					annotations?: Json | null;
					category: string;
					created_at?: string;
					file_type: string;
					file_url: string;
					id?: string;
					name: string;
					parent_id?: string | null;
					project_id: string;
					uploader_id: string;
					version?: number | null;
				};
				Update: {
					annotations?: Json | null;
					category?: string;
					created_at?: string;
					file_type?: string;
					file_url?: string;
					id?: string;
					name?: string;
					parent_id?: string | null;
					project_id?: string;
					uploader_id?: string;
					version?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'project_documents_parent_id_fkey';
						columns: ['parent_id'];
						isOneToOne: false;
						referencedRelation: 'project_documents';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_documents_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_documents_uploader_id_fkey';
						columns: ['uploader_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_documents_uploader_id_fkey';
						columns: ['uploader_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			project_invoices: {
				Row: {
					amount: number;
					created_at: string;
					due_date: string;
					id: string;
					invoice_number: string;
					paid_date: string | null;
					project_id: string;
					status: Database['public']['Enums']['invoice_status'];
					updated_at: string;
				};
				Insert: {
					amount: number;
					created_at?: string;
					due_date: string;
					id?: string;
					invoice_number: string;
					paid_date?: string | null;
					project_id: string;
					status?: Database['public']['Enums']['invoice_status'];
					updated_at?: string;
				};
				Update: {
					amount?: number;
					created_at?: string;
					due_date?: string;
					id?: string;
					invoice_number?: string;
					paid_date?: string | null;
					project_id?: string;
					status?: Database['public']['Enums']['invoice_status'];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'project_invoices_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
				];
			};
			project_members: {
				Row: {
					created_at: string;
					project_id: string;
					role: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					project_id: string;
					role: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					project_id?: string;
					role?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'project_members_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_members_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_members_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			project_messages: {
				Row: {
					content: string;
					created_at: string;
					id: string;
					project_id: string;
					recipient_id: string;
					sender_id: string;
					status: Database['public']['Enums']['message_status'];
					subject: string;
				};
				Insert: {
					content: string;
					created_at?: string;
					id?: string;
					project_id: string;
					recipient_id: string;
					sender_id: string;
					status?: Database['public']['Enums']['message_status'];
					subject: string;
				};
				Update: {
					content?: string;
					created_at?: string;
					id?: string;
					project_id?: string;
					recipient_id?: string;
					sender_id?: string;
					status?: Database['public']['Enums']['message_status'];
					subject?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'project_messages_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_messages_recipient_id_fkey';
						columns: ['recipient_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_messages_recipient_id_fkey';
						columns: ['recipient_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_messages_sender_id_fkey';
						columns: ['sender_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_messages_sender_id_fkey';
						columns: ['sender_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			project_timeline: {
				Row: {
					created_at: string;
					description: string | null;
					end_date: string;
					id: string;
					project_id: string;
					start_date: string;
					status: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					end_date: string;
					id?: string;
					project_id: string;
					start_date: string;
					status: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					end_date?: string;
					id?: string;
					project_id?: string;
					start_date?: string;
					status?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'project_timeline_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
				];
			};
			project_updates: {
				Row: {
					author_id: string;
					content: string;
					created_at: string;
					id: string;
					project_id: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					author_id: string;
					content: string;
					created_at?: string;
					id?: string;
					project_id: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					author_id?: string;
					content?: string;
					created_at?: string;
					id?: string;
					project_id?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'project_updates_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_updates_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_updates_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
				];
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
			scope_change_requests: {
				Row: {
					approved_by: string | null;
					created_at: string;
					description: string;
					id: string;
					project_id: string;
					requester_id: string;
					status: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					approved_by?: string | null;
					created_at?: string;
					description: string;
					id?: string;
					project_id: string;
					requester_id: string;
					status?: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					approved_by?: string | null;
					created_at?: string;
					description?: string;
					id?: string;
					project_id?: string;
					requester_id?: string;
					status?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'scope_change_requests_approved_by_fkey';
						columns: ['approved_by'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'scope_change_requests_approved_by_fkey';
						columns: ['approved_by'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'scope_change_requests_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'scope_change_requests_requester_id_fkey';
						columns: ['requester_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'scope_change_requests_requester_id_fkey';
						columns: ['requester_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			subscriptions: {
				Row: {
					id: string;
					user_id: string;
					plan_id: string;
					plan_name: string;
					status: SubscriptionStatus;
					next_billing_date: string;
					projects_used: number;
					projects_limit: number;
					storage_used: number;
					storage_limit: number;
					api_calls_used: number;
					api_calls_limit: number;
					payment_methods: PaymentMethod[];
					current_period_start: string;
					current_period_end: string;
					cancel_at_period_end: boolean;
					stripe_subscription_id: string;
					stripe_customer_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					user_id: string;
					plan_id: string;
					plan_name: string;
					status: SubscriptionStatus;
					next_billing_date: string;
					projects_used: number;
					projects_limit: number;
					storage_used: number;
					storage_limit: number;
					api_calls_used: number;
					api_calls_limit: number;
					payment_methods: PaymentMethod[];
					current_period_start: string;
					current_period_end: string;
					cancel_at_period_end: boolean;
					stripe_subscription_id: string;
					stripe_customer_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					plan_id?: string;
					plan_name?: string;
					status?: SubscriptionStatus;
					next_billing_date?: string;
					projects_used?: number;
					projects_limit?: number;
					storage_used?: number;
					storage_limit?: number;
					api_calls_used?: number;
					api_calls_limit?: number;
					payment_methods?: PaymentMethod[];
					current_period_start?: string;
					current_period_end?: string;
					cancel_at_period_end?: boolean;
					stripe_subscription_id?: string;
					stripe_customer_id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			payment_methods: {
				Row: {
					id: string;
					user_id: string;
					isDefault: boolean;
				};
				Insert: {
					id?: string;
					user_id: string;
					isDefault: boolean;
				};
				Update: {
					id?: string;
					user_id?: string;
					isDefault?: boolean;
				};
				Relationships: [];
			};
		};
		Views: {
			admin_users: {
				Row: {
					id: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'profiles_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'auth_users';
						referencedColumns: ['id'];
					},
				];
			};
			auth_users: {
				Row: {
					email: string | null;
					email_confirmed_at: string | null;
					id: string | null;
					last_sign_in_at: string | null;
					raw_user_meta_data: Json | null;
				};
				Insert: {
					email?: string | null;
					email_confirmed_at?: string | null;
					id?: string | null;
					last_sign_in_at?: string | null;
					raw_user_meta_data?: Json | null;
				};
				Update: {
					email?: string | null;
					email_confirmed_at?: string | null;
					id?: string | null;
					last_sign_in_at?: string | null;
					raw_user_meta_data?: Json | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			apply_project_members_policy_fix: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			create_first_admin: {
				Args: {
					user_id: string;
				};
				Returns: undefined;
			};
			get_comment_likes_count: {
				Args: {
					comment_id: string;
				};
				Returns: number;
			};
			get_post_view_count: {
				Args: {
					post_id: string;
				};
				Returns: number;
			};
			promote_to_admin: {
				Args: {
					user_id: string;
				};
				Returns: undefined;
			};
		};
		Enums: {
			invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
			message_status: 'unread' | 'read' | 'archived';
			project_status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
			user_role: 'client' | 'admin' | 'developer';
			user_role_old: 'user' | 'admin';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;
