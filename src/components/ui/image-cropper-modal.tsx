'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Check, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCropperModalProps {
    file: File | null;
    aspectRatio?: number; // e.g. 1 for square, 16/9 for banner
    onCropComplete: (croppedFile: File) => void;
    onCancel: () => void;
}

export function ImageCropperModal({
    file,
    aspectRatio = 1,
    onCropComplete,
    onCancel,
}: ImageCropperModalProps) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const imgRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const imageSrc = React.useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => {
        return () => {
            if (imageSrc) URL.revokeObjectURL(imageSrc);
        };
    }, [imageSrc]);

    if (!file || !imageSrc) return null;

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCrop = () => {
        if (!imgRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Output crop dimensions
        const cropWidth = 800;
        const cropHeight = Math.round(cropWidth / aspectRatio);
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const img = imgRef.current;

        // Draw onto canvas taking into account scale, position, rotation
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, cropWidth, cropHeight);

        ctx.translate(cropWidth / 2, cropHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);

        // Calculate aspect fit scale
        const renderScale = Math.max(cropWidth / img.naturalWidth, cropHeight / img.naturalHeight);
        const drawW = img.naturalWidth * renderScale;
        const drawH = img.naturalHeight * renderScale;

        // Apply drag offsets adjusted for scale
        ctx.drawImage(
            img,
            -drawW / 2 + position.x,
            -drawH / 2 + position.y,
            drawW,
            drawH
        );

        ctx.restore();

        canvas.toBlob((blob) => {
            if (blob) {
                const croppedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + "_cropped.jpg", {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });
                onCropComplete(croppedFile);
            }
        }, 'image/jpeg', 0.92);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-lg p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white space-y-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-lg font-bold">Crop & Adjust Image</h3>
                    <button onClick={onCancel} className="p-2 text-muted-foreground hover:text-white rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* Crop Canvas Area */}
                <div
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="relative w-full h-72 bg-black/60 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                >
                    {/* Background Grid Guide */}
                    <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

                    {/* Image Viewport */}
                    <div
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        }}
                        className="relative max-w-full max-h-full flex items-center justify-center"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop Preview"
                            className="max-w-none max-h-64 object-contain pointer-events-none"
                        />
                    </div>

                    {/* Crop Overlay Mask */}
                    <div className="absolute inset-0 border-2 border-primary/60 rounded-2xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <ZoomOut size={16} className="text-muted-foreground" />
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.05"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="flex-1 accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
                        />
                        <ZoomIn size={16} className="text-muted-foreground" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Drag image to adjust position</span>
                        <button
                            type="button"
                            onClick={() => setRotation((prev) => (prev + 90) % 360)}
                            className="flex items-center gap-1.5 hover:text-white font-medium"
                        >
                            <RotateCw size={14} /> Rotate
                        </button>
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button type="button" variant="neon" onClick={handleCrop} className="rounded-xl font-bold gap-2">
                        <Check size={16} /> Crop & Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
