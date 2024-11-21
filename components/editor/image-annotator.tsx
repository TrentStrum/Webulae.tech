'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Circle,
  MousePointer,
  Pencil,
  Square,
  Type,
  X,
} from 'lucide-react';

interface ImageAnnotatorProps {
  imageUrl: string;
  onSave: (dataUrl: string) => Promise<void>;
  onClose: () => void;
}

export function ImageAnnotator({ imageUrl, onSave, onClose }: ImageAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<'select' | 'draw' | 'rectangle' | 'circle' | 'text'>('select');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
    });
    fabricCanvasRef.current = canvas;

    // Load image
    fabric.Image.fromURL(imageUrl, (img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const scale = Math.min(
        canvas.width! / img.width!,
        canvas.height! / img.height!
      );
      img.scale(scale);

      // Center image
      img.set({
        left: (canvas.width! - img.width! * scale) / 2,
        top: (canvas.height! - img.height! * scale) / 2,
      });

      canvas.add(img);
      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
    };
  }, [imageUrl]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = tool === 'draw';
    canvas.selection = tool === 'select';

    if (tool === 'draw') {
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = '#ff0000';
    }

    // Reset event listeners
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    if (tool === 'rectangle' || tool === 'circle') {
      let isDrawing = false;
      let startX = 0;
      let startY = 0;
      let shape: fabric.Object | null = null;

      canvas.on('mouse:down', (o) => {
        const pointer = canvas.getPointer(o.e);
        isDrawing = true;
        startX = pointer.x;
        startY = pointer.y;

        if (tool === 'rectangle') {
          shape = new fabric.Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: 'transparent',
            stroke: '#ff0000',
            strokeWidth: 2,
          });
        } else {
          shape = new fabric.Circle({
            left: startX,
            top: startY,
            radius: 0,
            fill: 'transparent',
            stroke: '#ff0000',
            strokeWidth: 2,
          });
        }

        canvas.add(shape);
      });

      canvas.on('mouse:move', (o) => {
        if (!isDrawing || !shape) return;

        const pointer = canvas.getPointer(o.e);
        if (tool === 'rectangle') {
          const rect = shape as fabric.Rect;
          const width = pointer.x - startX;
          const height = pointer.y - startY;
          rect.set({
            width: Math.abs(width),
            height: Math.abs(height),
            left: width > 0 ? startX : pointer.x,
            top: height > 0 ? startY : pointer.y,
          });
        } else {
          const circle = shape as fabric.Circle;
          const radius = Math.sqrt(
            Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
          ) / 2;
          circle.set({
            radius,
            left: startX - radius,
            top: startY - radius,
          });
        }
        canvas.renderAll();
      });

      canvas.on('mouse:up', () => {
        isDrawing = false;
        shape = null;
      });
    }

    if (tool === 'text') {
      canvas.on('mouse:down', (o) => {
        const pointer = canvas.getPointer(o.e);
        const text = new fabric.IText('Click to edit', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 20,
          fill: '#ff0000',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
      });
    }
  }, [tool]);

  const handleSave = async () => {
    if (!fabricCanvasRef.current) return;
    
    try {
      setSaving(true);
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
      });
      await onSave(dataUrl);
      onClose();
    } catch (error) {
      console.error('Error saving annotated image:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Annotate Image</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <Button
              variant={tool === 'select' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setTool('select')}
            >
              <MousePointer className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'draw' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setTool('draw')}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'rectangle' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setTool('rectangle')}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'circle' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setTool('circle')}
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'text' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setTool('text')}
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (fabricCanvasRef.current) {
                  const activeObject = fabricCanvasRef.current.getActiveObject();
                  if (activeObject) {
                    fabricCanvasRef.current.remove(activeObject);
                  }
                }
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative flex-1">
            <canvas ref={canvasRef} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}