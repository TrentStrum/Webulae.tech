'use client';

import { useState, useRef } from 'react';
import { type Crop, ReactCrop as Cropper } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

interface ImageEditorProps {
	imageUrl: string;
	onSave: (blob: Blob) => Promise<void>;
	onClose: () => void;
	aspectRatio?: number;
}

export function ImageEditor({ imageUrl, onSave, onClose, aspectRatio }: ImageEditorProps) {
	const [crop, setCrop] = useState<Crop>({
		unit: '%',
		width: 90,
		height: 90,
		x: 5,
		y: 5,
	});
	const [saving, setSaving] = useState(false);
	const imageRef = useRef<HTMLImageElement>(null);

	const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
		const canvas = document.createElement('canvas');
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = crop.width;
		canvas.height = crop.height;
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('No 2d context');
		}

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);

		return new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error('Canvas is empty'));
					return;
				}
				resolve(blob);
			}, 'image/jpeg');
		});
	};

	const handleSave = async () => {
		if (!imageRef.current) return;

		try {
			setSaving(true);
			const croppedImage = await getCroppedImg(imageRef.current, crop);
			await onSave(croppedImage);
			onClose();
		} catch (error) {
			console.error('Error saving cropped image:', error);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Edit Image</DialogTitle>
				</DialogHeader>
				<div className="flex justify-center p-4">
					<Cropper crop={crop} onChange={(c) => setCrop(c)} aspect={aspectRatio}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img ref={imageRef} src={imageUrl} alt="Edit" className="max-h-[60vh] object-contain" />
					</Cropper>
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
