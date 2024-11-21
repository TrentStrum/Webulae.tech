import { supabase } from './supabase';

export async function testRoleSystem() {
  try {
    console.log('Starting role system tests...');

    // 1. Test client role assignment
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'test-client@example.com',
      password: 'password123'
    });

    if (signUpError) throw signUpError;
    console.log('✓ Created test user');

    // Wait for profile creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Verify default role is client
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single();

    if (profileError) throw profileError;
    console.log('Profile role:', profile.role);
    if (profile.role !== 'client') throw new Error(`Default role is ${profile.role}, expected 'client'`);
    console.log('✓ Default role is client');

    // 3. Try to change client to admin (should fail)
    const { error: upgradeError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user!.id);

    if (!upgradeError) throw new Error('Client was able to become admin');
    console.log('✓ Client cannot become admin');

    // 4. Try to change client to developer (should fail)
    const { error: devError } = await supabase
      .from('profiles')
      .update({ role: 'developer' })
      .eq('id', user!.id);

    if (!devError) throw new Error('Client was able to become developer');
    console.log('✓ Client cannot become developer');

    // 5. Create an admin user for testing admin functionality
    const { data: adminUser, error: adminCreateError } = await supabase.auth.signUp({
      email: 'test-admin@example.com',
      password: 'admin123'
    });

    if (adminCreateError) throw adminCreateError;

    // Wait for profile creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Manually set admin role (this would normally be done by a superuser)
    const { error: setAdminError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', adminUser!.user!.id);

    if (setAdminError) throw setAdminError;
    console.log('✓ Created admin user');

    // 6. Cleanup
    await Promise.all([
      supabase.auth.admin.deleteUser(user!.id),
      supabase.auth.admin.deleteUser(adminUser!.user!.id)
    ]);
    console.log('✓ Test cleanup successful');

    console.log('\nAll role system tests passed!');
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}