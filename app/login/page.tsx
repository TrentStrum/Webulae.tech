'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthForm } from '@/components/auth/auth-form';
import { AuthSideContent } from '@/components/auth/auth-side-content';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Show verification message if coming from signup
  const needsVerification = searchParams?.get('verified') === 'false';
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      toast({
        title: 'Success',
        description: 'You have been successfully logged in.',
      });

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      toast({
        title: 'Error',
        description: err.message || 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AuthSideContent
        icon={Mail}
        title="Welcome back"
        quote="Webulae has transformed our business with their exceptional software solutions. Their expertise and dedication are unmatched."
        author="Sofia Davis, Tech Innovators Inc"
      />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          {needsVerification && (
            <div className="p-3 text-sm bg-primary/20 text-primary rounded-md">
              Please check your email to verify your account before logging in.
            </div>
          )}
          <AuthForm onSubmit={handleLogin} error={error}>
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
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </AuthForm>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}