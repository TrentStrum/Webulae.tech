import { AuthDataAccess } from '@/src/dataAccess/authDataAccess';
import { AuthUser } from '@/src/types/authUser.types';
import { supabase } from '@/src/lib/supabase';
import { tokenUtils } from '@/src/lib/auth/token';
import { sessionUtils } from '@/src/lib/auth/session';

export const authService = {
  // Session Management
  getSession: async () => {
    console.log('🔐 authService: Getting session');
    const session = await AuthDataAccess.getSession();
    console.log('📦 authService: Session result:', session);
    return session;
  },

  getUserProfile: async (userId: string) => {
    console.log('👤 authService: Getting user profile for ID:', userId);
    const profile = await AuthDataAccess.getUserProfile(userId);
    console.log('📋 authService: Profile result:', profile);
    return profile;
  },

  // Authentication State
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
    console.log('👂 authService: Setting up auth state listener');
    return AuthDataAccess.onAuthStateChange(callback);
  },

  // Authentication Actions
  login: async (email: string, password: string) => {
    console.log('🔐 authService: Attempting login');
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      
      if (response.error) {
        console.error('❌ authService: Login failed:', response.error);
        throw response.error;
      }
      
      if (response.data.session?.access_token) {
        tokenUtils.setToken(response.data.session.access_token);
        sessionUtils.startSession();
      }
      
      console.log('✅ authService: Login successful');
      return response;
    } catch (error) {
      console.error('❌ authService: Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    console.log('🔐 authService: Attempting logout');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      tokenUtils.removeToken();
      sessionUtils.endSession();
      console.log('✅ authService: Logout complete');
      return { error: null };
    } catch (error) {
      console.error('❌ authService: Logout failed:', error);
      throw error;
    }
  },

  // Password Management
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error };
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error };
    }
  },

  // Session Refresh
  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (session?.access_token) {
        tokenUtils.setToken(session.access_token);
      }
      return { success: true, session };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return { success: false, error };
    }
  }
};