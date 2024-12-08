export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string;
					role: 'admin' | 'client' | 'developer';
					username: string | null;
					full_name: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					email: string;
					role?: 'admin' | 'client' | 'developer';
					username?: string | null;
					full_name?: string | null;
				};
				Update: {
					email?: string;
					role?: 'admin' | 'client' | 'developer';
					username?: string | null;
					full_name?: string | null;
				};
			};
			blog_posts: {
				Row: {
					id: string;
					title: string;
					content: string;
					author_id: string;
					slug: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					title: string;
					content: string;
					author_id: string;
					slug: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					title?: string;
					content?: string;
					author_id?: string;
					slug?: string;
					updated_at?: string;
				};
			};
			customers: {
				Row: {
					id: string;
					user_id: string;
					stripe_customer_id: string;
					created_at?: string;
				};
				Insert: {
					user_id: string;
					stripe_customer_id: string;
				};
				Update: {
					stripe_customer_id?: string;
				};
			};
			project_timeline: {
				Row: {
					id: string;
					project_id: string;
					title: string;
					description: string;
					status: 'pending' | 'in_progress' | 'completed';
					created_at: string;
					updated_at: string;
				};
				Insert: {
					project_id: string;
					title: string;
					description: string;
					status?: 'pending' | 'in_progress' | 'completed';
				};
				Update: {
					title?: string;
					description?: string;
					status?: 'pending' | 'in_progress' | 'completed';
				};
			};
			projects: {
				Row: {
					id: string;
					name: string;
					description: string;
					status: 'active' | 'completed' | 'on_hold';
					owner_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					name: string;
					description: string;
					status?: 'active' | 'completed' | 'on_hold';
					owner_id: string;
				};
				Update: {
					name?: string;
					description?: string;
					status?: 'active' | 'completed' | 'on_hold';
				};
			};
			subscriptions: {
				Row: {
					id: string;
					user_id: string;
					payment_methods: {
						id: string;
						card_last4: string;
						card_brand: string;
						exp_month: number;
						exp_year: number;
						is_default: boolean;
					}[];
					plan_id: string;
					plan_name: string;
					status: string;
					next_billing_date: string;
					projects_used: number;
					projects_limit: number;
					storage_used: number;
					storage_limit: number;
					api_calls_used: number;
					api_calls_limit: number;
					current_period_start: string;
					current_period_end: string;
					cancel_at_period_end: boolean;
					stripe_subscription_id: string;
					stripe_customer_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					user_id: string;
					plan_id: string;
					plan_name: string;
					stripe_subscription_id: string;
					stripe_customer_id: string;
				};
				Update: {
					status?: string;
					cancel_at_period_end?: boolean;
				};
			};
			payment_methods: {
				Row: {
					id: string;
					card_last4: string;
					card_brand: string;
					exp_month: number;
					exp_year: number;
					is_default: boolean;
				};
				Insert: {
					card_last4: string;
					card_brand: string;
					exp_month: number;
					exp_year: number;
				};
				Update: {
					is_default?: boolean;
				};
			};
			// Add other tables as needed
		};
	};
}

export type DatabaseProfile = {
	id: string;
	role: 'admin' | 'client' | 'developer';
	email: string;
	username: string | null;
	full_name: string | null;
	bio: string | null;
	website: string | null;
	created_at: string;
	updated_at: string;
	last_sign_in_at: string | null;
};
