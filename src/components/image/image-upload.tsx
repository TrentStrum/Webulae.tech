'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';

import { ImageEditor } from './image-editor';

interface ImageUploadProps {
  onUpload: (file: File) => Promise<string>;
  aspectRatio?: number;
  className?: string;
}

export function ImageUpload({ onUpload, aspectRatio, className }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  return (
    <>
      <Button
        variant="outline"
        onClick={() => document.getElementById('image-upload')?.click()}
        className={className}
        disabled={uploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      {selectedImage && (
        <ImageEditor
          imageUrl={selectedImage}
          onSave={handleSave}
          onClose={() => setSelectedImage(null)}
          aspectRatio={aspectRatio}
        />
      )}
    </>
  );
}