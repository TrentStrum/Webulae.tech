'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  username: string;
  bio: string;
  website: string;
  avatar_url: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setOriginalProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const hasChanges = () => {
    if (!profile || !originalProfile) return false;
    return (
      profile.full_name !== originalProfile.full_name ||
      profile.username !== originalProfile.username ||
      profile.bio !== originalProfile.bio ||
      profile.website !== originalProfile.website
    );
  };

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!profile || !hasChanges()) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          username: profile.username,
          bio: profile.bio,
          website: profile.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      setOriginalProfile(profile);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'There was an error updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data</div>;
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <form onSubmit={updateProfile}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="full_name"
                value={profile.full_name || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={profile.username || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio || ''}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={profile.website || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={saving || !hasChanges()}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}