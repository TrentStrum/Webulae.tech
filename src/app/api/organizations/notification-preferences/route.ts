import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { supabase } from '@/src/lib/supabase/config';

export async function PUT(req: Request): Promise<NextResponse> {
	const { userId, orgId } = auth();
	
	if (!userId || !orgId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { preferences } = await req.json();

		// Update preferences in database
		await supabase.from('organization_settings').upsert({
			where: {
				organizationId: orgId,
			},
			create: {
				organizationId: orgId,
				notificationPreferences: preferences,
			},
			update: {
				notificationPreferences: preferences,
			},
		});

		// Log the change
		await supabase.from('audit_log').insert([{
			organization_id: orgId,
			event: 'settings.notifications.updated',
			actor: userId,
			description: 'Notification preferences updated',
			metadata: {
					preferences,
				}
			}]);

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to update notification preferences' },
			{ status: 500 }
		);
	}
}

export async function GET(): Promise<NextResponse> {
	const { userId, orgId } = auth();
	
	if (!userId || !orgId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const settings = await supabase.from('organization_settings').select('notificationPreferences').eq('organizationId', orgId).single();

		return NextResponse.json(settings?.data?.notificationPreferences ?? {});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch notification preferences' },
			{ status: 500 }
		);
	}
} 