'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function Hero() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMainButtonClick = () => {
    if (session) {
      router.push('/profile');
    } else {
      router.push('/signup');
    }
  };

  if (isLoading) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Transform Your Digital Vision into Reality
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Expert software development and digital solutions tailored to your business needs. 
            We bring innovation, quality, and reliability to every project.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={handleMainButtonClick}>
              {session ? 'View Profile' : 'Get Started'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}