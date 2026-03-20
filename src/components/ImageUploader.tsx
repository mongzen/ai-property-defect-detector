import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { UploadedImage } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages: UploadedImage[] = [];
      let loadedCount = 0;

      acceptedFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        const img: UploadedImage = {
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: url,
          mimeType: file.type,
        };

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          img.base64Data = base64String.split(',')[1];
          newImages.push(img);
          loadedCount++;

          if (loadedCount === acceptedFiles.length) {
            onImagesChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [images, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
  } as any);

  const removeImage = (idToRemove: string) => {
    onImagesChange(images.filter((img) => img.id !== idToRemove));
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center gap-4',
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/50'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="p-4 bg-indigo-100 rounded-full text-indigo-600">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-700">
            Drag & drop property images here
          </p>
          <p className="text-sm text-slate-500 mt-1">
            or click to select files (JPEG, PNG, WEBP)
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
              >
                <img
                  src={img.previewUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-mono">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
