'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthForm } from '@/components/auth/auth-form';
import { AuthSideContent } from '@/components/auth/auth-side-content';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      // First check if the user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', email.split('@')[0])
        .single();

      if (existingUser) {
        throw new Error('Username already taken. Please use a different email.');
      }

      // Proceed with signup
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (user) {
        // Generate a unique username by adding a random suffix if needed
        const baseUsername = email.split('@')[0];
        let username = baseUsername;
        let attempt = 1;

        while (true) {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

          if (!existingProfile) break;
          username = `${baseUsername}${attempt}`;
          attempt++;
        }

        // Create profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: fullName,
              username,
              avatar_url: null,
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Only show a user-friendly message
          toast({
            title: 'Account created',
            description: 'Your account was created but there was an issue setting up your profile. This will be fixed automatically.',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Your account has been created successfully. Please check your email to verify your account.',
          });
        }

        router.push('/login?verified=false');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      toast({
        title: 'Error',
        description: err.message || 'An error occurred during sign up',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to get started
            </p>
          </div>
          <AuthForm onSubmit={handleSignUp} error={error}>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-sm text-muted-foreground">
                Must be at least 6 characters long
              </p>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </AuthForm>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <AuthSideContent
        icon={UserPlus}
        title="Join Webulae"
        quote="Join our community of innovative businesses and experience the power of custom software solutions tailored to your needs."
      />
    </div>
  );
}