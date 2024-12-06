```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function GET(req: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 });
    }

    // Get usage metrics
    const [projectsCount, storageUsed, apiCalls] = await Promise.all([
      getProjectsCount(session.user.id),
      getStorageUsage(session.user.id),
      getApiUsage(session.user.id),
    ]);

    return NextResponse.json({
      projects: {
        used: projectsCount,
        limit: getProjectLimit(subscription.plan_id),
      },
      storage: {
        used: storageUsed,
        limit: getStorageLimit(subscription.plan_id),
      },
      api: {
        used: apiCalls,
        limit: getApiLimit(subscription.plan_id),
      },
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

async function getProjectsCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  return count || 0;
}

async function getStorageUsage(userId: string): Promise<number> {
  const { data } = await supabase
    .from('project_documents')
    .select('file_size')
    .eq('uploader_id', userId);
  
  return data?.reduce((total, doc) => total + (doc.file_size || 0), 0) || 0;
}

async function getApiUsage(userId: string): Promise<number> {
  const { count } = await supabase
    .from('api_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
  
  return count || 0;
}

function getProjectLimit(planId: string): number {
  const limits: Record<string, number> = {
    'basic': 5,
    'pro': 15,
    'enterprise': 50,
  };
  return limits[planId] || 5;
}

function getStorageLimit(planId: string): number {
  const limits: Record<string, number> = {
    'basic': 5 * 1024 * 1024 * 1024, // 5GB
    'pro': 50 * 1024 * 1024 * 1024, // 50GB
    'enterprise': 500 * 1024 * 1024 * 1024, // 500GB
  };
  return limits[planId] || limits['basic'];
}

function getApiLimit(planId: string): number {
  const limits: Record<string, number> = {
    'basic': 10000,
    'pro': 50000,
    'enterprise': 500000,
  };
  return limits[planId] || limits['basic'];
}
```;
