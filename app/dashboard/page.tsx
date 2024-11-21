'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ThumbsUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  is_public: boolean;
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  };
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function ClientDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load user's feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('client_feedback')
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;
      setFeedback(feedbackData || []);

      // Load FAQs
      const { data: faqData, error: faqError } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true });

      if (faqError) throw faqError;
      setFaqs(faqData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!newFeedback.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your feedback.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('client_feedback')
        .insert([
          {
            comment: newFeedback,
            rating,
            is_public: isPublic,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Thank you for your feedback!',
      });

      setNewFeedback('');
      setRating(5);
      setIsPublic(false);
      loadData();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          } cursor-pointer`}
          onClick={() => setRating(i + 1)}
        />
      ));
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle>Share Your Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>
            <Textarea
              placeholder="Share your experience with our services..."
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              rows={4}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="isPublic" className="text-sm">
                Allow this feedback to be used as a testimonial
              </label>
            </div>
            <Button
              onClick={handleSubmitFeedback}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </CardContent>
        </Card>

        {/* Knowledge Base Section */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Previous Feedback */}
      {feedback.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Previous Feedback</h2>
          <div className="grid gap-4">
            {feedback.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < item.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{item.comment}</p>
                  {item.is_public && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Used as testimonial</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}