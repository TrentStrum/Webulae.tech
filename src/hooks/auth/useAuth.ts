'use client';

import { useContext } from 'react';

import { AuthContext } from '@/src/contexts/AuthContext';

import type { AuthState } from '@/src/types/auth.types';

export function useAuth(): AuthState {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
