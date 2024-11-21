'use client';

import { useState } from 'react';
import { ImageEditor } from './image-editor';
import { ImageAnnotator } from '@/components/editor/image-annotator';
import { Button } from '@/components/ui/button';
import { Upload, Edit, Pencil } from 'lucide-react';

interface EnhancedImageUploadProps {
  onUpload: (file: File) => Promise<string>;
  aspectRatio?: number;
  className?: string;
  allowAnnotation?: boolean;
}

export function EnhancedImageUpload({
  onUpload,
  aspectRatio,
  className,
  allowAnnotation = false,
}: EnhancedImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (blob: Blob) => {
    try {
      setUploading(true);
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      await onUpload(file);
    } finally {
      setUploading(false);
      setSelectedImage(null);
    }
  };

  const handleAnnotationSave = async (dataUrl: string) => {
    try {
      setUploading(true);
      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'annotated-image.png', { type: 'image/png' });
      await onUpload(file);
    } finally {
      setUploading(false);
      setSelectedImage(null);
      setIsAnnotating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => document.getElementById('enhanced-image-upload')?.click()}
          className={className}
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        {selectedImage && allowAnnotation && (
          <Button
            variant="outline"
            onClick={() => setIsAnnotating(true)}
            disabled={uploading}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Annotate
          </Button>
        )}
      </div>
      <input
        id="enhanced-image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      {selectedImage && !isAnnotating && (
        <ImageEditor
          imageUrl={selectedImage}
          onSave={handleSave}
          onClose={() => setSelectedImage(null)}
          aspectRatio={aspectRatio}
        />
      )}
      {selectedImage && isAnnotating && (
        <ImageAnnotator
          imageUrl={selectedImage}
          onSave={handleAnnotationSave}
          onClose={() => setIsAnnotating(false)}
        />
      )}
    </div>
  );
}