import { supabase } from '../supabase';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const sessionUtils = {
  startSession: () => {
    const timestamp = Date.now().toString();
    sessionStorage.setItem('sessionStart', timestamp);
    return timestamp;
  },

  checkSession: (): boolean => {
    const start = sessionStorage.getItem('sessionStart');
    if (!start) return false;

    const elapsed = Date.now() - parseInt(start);
    return elapsed < SESSION_TIMEOUT;
  },

  extendSession: () => {
    sessionStorage.setItem('sessionStart', Date.now().toString());
  },

  endSession: () => {
    sessionStorage.clear();
    localStorage.removeItem('rememberMe');
  },

  setRememberMe: (value: boolean) => {
    if (value) {
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem('rememberMe', expiry.toString());
    } else {
      localStorage.removeItem('rememberMe');
    }
  },

  hasRememberMe: (): boolean => {
    const expiry = localStorage.getItem('rememberMe');
    if (!expiry) return false;
    return parseInt(expiry) > Date.now();
  }
};