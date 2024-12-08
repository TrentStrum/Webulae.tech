import { supabase } from '@/src/lib/supabase';

describe('Supabase Client', () => {
	beforeEach(() => {
		// Reset environment variables
		process.env.NEXT_PUBLIC_SUPABASE_URL = undefined;
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = undefined;
	});

	it('throws error when environment variables are missing', () => {
		expect(() => supabase).toThrow('Missing Supabase configuration');
	});

	it('throws error for invalid Supabase URL', () => {
		process.env.NEXT_PUBLIC_SUPABASE_URL = 'invalid-url';
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

		expect(() => supabase).toThrow('Invalid Supabase URL');
	});

	it('creates client with valid configuration', () => {
		process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

		expect(supabase).toBeDefined();
	});

	it('reuses existing client instance', () => {
		process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

		const client1 = supabase;
		const client2 = supabase;
		expect(client1).toBe(client2);
	});
});
