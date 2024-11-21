'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ProjectMember {
  user_id: string;
  role: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  };
}

interface Message {
  id: string;
  subject: string;
  content: string;
  status: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  };
}

export default function MessagesPage() {
  const { id } = useParams();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      // Load project members
      const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select(`
          user_id,
          role,
          profiles (
            username,
            full_name
          )
        `)
        .eq('project_id', id);

      if (membersError) throw membersError;
      setMembers(members || []);

      // Load messages
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data: messages, error: messagesError } = await supabase
        .from('project_messages')
        .select(`
          *,
          profiles!project_messages_sender_id_fkey (
            username,
            full_name
          )
        `)
        .eq('project_id', id)
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;
      setMessages(messages || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('project_messages')
        .insert([
          {
            project_id: id,
            sender_id: session.user.id,
            recipient_id: recipient,
            subject,
            content,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Message sent successfully.',
      });

      setSubject('');
      setContent('');
      setRecipient('');
      loadData();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">To</Label>
                <Select value={recipient} onValueChange={setRecipient} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        {member.profiles.full_name || member.profiles.username}{' '}
                        ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={sending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Message History</h2>
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{message.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      From: {message.profiles.full_name || message.profiles.username}
                    </p>
                  </div>
                  <Badge className={message.status === 'unread' ? 'bg-primary' : ''}>
                    {message.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap">{message.content}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}