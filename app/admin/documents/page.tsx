'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  category: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  };
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
    loadDocuments();
  }, []);

  const checkAccess = async () => {
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

    if (!profile || !['admin', 'developer'].includes(profile.role)) {
      router.push('/');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
    }
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('project_documents')
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!category) {
        toast({
          title: 'Error',
          description: 'Please select a document category.',
          variant: 'destructive',
        });
        return;
      }

      setUploading(true);

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save document metadata
      const { error: dbError } = await supabase
        .from('project_documents')
        .insert([
          {
            name: file.name,
            file_url: publicUrl,
            file_type: file.type,
            category,
            uploader_id: (await supabase.auth.getSession()).data.session?.user.id,
          },
        ]);

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'Document uploaded successfully.',
      });

      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Management</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload new documents to the system. Supported formats: PDF, DOC, DOCX, XLS, XLSX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="scope_change">Scope Change</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <CardDescription>
                      Uploaded by {doc.profiles.full_name || doc.profiles.username}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(doc.file_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}