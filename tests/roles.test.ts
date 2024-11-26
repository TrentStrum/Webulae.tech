import { supabaseClient } from '@/src/lib/supabaseClient';

describe('Role System', () => {
  it('should create a new user with client role by default', async () => {
    const email = `test-${Date.now()}@example.com`;
    const { data: { user }, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password: 'testpassword123'
    });

    expect(signUpError).toBeNull();
    expect(user).toBeTruthy();

    // Wait for profile creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single();

    expect(profileError).toBeNull();
    expect(profile?.role).toBe('client');

    // Cleanup
    await supabaseClient.auth.admin.deleteUser(user!.id);
  });

  it('should prevent clients from becoming admins', async () => {
    const email = `test-${Date.now()}@example.com`;
    const { data: { user } } = await supabaseClient.auth.signUp({
      email,
      password: 'testpassword123'
    });

    // Wait for profile creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { error: upgradeError } = await supabaseClient
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user!.id);

    expect(upgradeError).toBeTruthy();

    // Cleanup
    await supabaseClient.auth.admin.deleteUser(user!.id);
  });
});