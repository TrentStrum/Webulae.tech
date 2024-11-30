import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/src/types/database.types';
import { AuthUser } from '@/src/types/authUser.types';

const supabase = createClientComponentClient<Database>();

export const AuthDataAccess = {
	async getSession() {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();
		if (error) throw error;
		return session;
	},

	async getUserProfile(userId: string): Promise<AuthUser | null> {
		const { data: { user }, error: userError } = await supabase.auth.getUser();
		if (userError) throw userError;
		if (!user) return null;

		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('role, avatar_url')
			.eq('id', userId)
			.single();

		if (profileError && profileError.code !== 'PGRST116') throw profileError;

		return {
			id: userId,
			email: user.email!,
			role: profile?.role ?? 'client',
			avatar_url: profile?.avatar_url ?? null,
		};
	},

	async login(email: string, password: string) {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) throw error;
	},

	async logout() {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	},

	onAuthStateChange(callback: (user: AuthUser | null) => void) {
		return supabase.auth.onAuthStateChange(async (event, session) => {
			if (session?.user) {
				const profile = await this.getUserProfile(session.user.id);
				callback(profile);
			} else {
				callback(null);
			}
		});
	},
};
