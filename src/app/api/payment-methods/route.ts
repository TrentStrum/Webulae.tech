import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { userId, paymentMethodId } = await req.json();
		if (!userId || !paymentMethodId) {
			return NextResponse.json(
				{ error: 'User ID and payment method ID are required' },
				{ status: 400 }
			);
		}

		const { error } = await supabase.from('payment_methods').insert({
			user_id: userId,
			payment_method_id: paymentMethodId,
			is_default: false,
		});

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ message: 'Payment method added successfully' });
	} catch (error) {
		console.error('Error adding payment method:', error);
		return NextResponse.json({ error: 'Failed to add payment method' }, { status: 500 });
	}
}
