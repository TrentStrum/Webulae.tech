'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { resetUserPassword } from './actions';

interface User {
  id: string;
  role: 'client' | 'admin' | 'developer';
  username: string | null;
  full_name: string | null;
  email: string | null;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
    loadUsers();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        router.push('/');
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    }
  };

  const loadUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select(`
          id,
          role,
          username,
          full_name,
          auth_users (
            email
          )
        `)
        .order('role', { ascending: false });

      if (error) throw error;

      setUsers(users.map(user => ({
        ...user,
        email: user.auth_users?.email || null
      })));
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (email: string | null) => {
    if (!email) return;

    try {
      const { success, error } = await resetUserPassword(email);
      
      if (!success) throw error;

      toast({
        title: 'Success',
        description: 'Password reset email has been sent.',
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: 'Failed to send password reset email.',
        variant: 'destructive',
      });
    }
  };

  const toggleUserRole = async (userId: string, currentRole: User['role']) => {
    try {
      setUpdating(userId);
      let newRole: User['role'];

      // Define role rotation: client -> developer -> admin -> client
      switch (currentRole) {
        case 'client':
          newRole = 'developer';
          break;
        case 'developer':
          newRole = 'admin';
          break;
        case 'admin':
          newRole = 'client';
          break;
        default:
          newRole = 'client';
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'Success',
        description: `User role updated to ${newRole}.`,
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || '-'}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>{user.username || '-'}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserRole(user.id, user.role)}
                      disabled={updating === user.id}
                    >
                      {updating === user.id ? 'Updating...' : 'Change Role'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePasswordReset(user.email)}
                      disabled={!user.email}
                    >
                      Reset Password
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}