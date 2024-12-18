import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

import type { RouteContext } from '@/src/types/route.types';

export async function DELETE(
	_: Request,
	{ params }: RouteContext<{ methodId: string }>
): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { error } = await supabase.from('payment_methods').delete().eq('id', params.methodId);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ message: 'Payment method deleted successfully' });
	} catch (error) {
		console.error('Error deleting payment method:', error);
		return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
	}
}
