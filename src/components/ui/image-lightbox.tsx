'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface ImageLightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onIndexChange?: (newIndex: number) => void;
}

export function ImageLightbox({ images, currentIndex: initialIndex, onClose, onIndexChange }: ImageLightboxProps) {
    const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
    const [index, setIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);

    if (initialIndex !== prevInitialIndex) {
        setPrevInitialIndex(initialIndex);
        setIndex(initialIndex);
        setZoom(1);
    }

    const currentSrc = images?.[index] || images?.[0] || '';

    const handlePrev = useCallback(() => {
        if (!images || images.length === 0) return;
        const nextIdx = (index - 1 + images.length) % images.length;
        setIndex(nextIdx);
        setZoom(1);
        if (onIndexChange) onIndexChange(nextIdx);
    }, [index, images, onIndexChange]);

    const handleNext = useCallback(() => {
        if (!images || images.length === 0) return;
        const nextIdx = (index + 1) % images.length;
        setIndex(nextIdx);
        setZoom(1);
        if (onIndexChange) onIndexChange(nextIdx);
    }, [index, images, onIndexChange]);

    const zoomIn = useCallback(() => setZoom(prev => Math.min(prev + 0.3, 3)), []);
    const zoomOut = useCallback(() => setZoom(prev => Math.max(prev - 0.3, 0.6)), []);
    const resetZoom = () => setZoom(1);

    // Keyboard controls
    useEffect(() => {
        if (!images || images.length === 0) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === '+' || e.key === '=') zoomIn();
            if (e.key === '-') zoomOut();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [images, onClose, handlePrev, handleNext, zoomIn, zoomOut]);

    if (!images || images.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
                <div className="text-xs font-bold text-white/80 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    {index + 1} / {images.length}
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <button
                        onClick={zoomOut}
                        disabled={zoom <= 0.6}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-30"
                        title="Zoom Out (-)"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <button
                        onClick={resetZoom}
                        className="px-2.5 py-1 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="Reset Zoom"
                    >
                        {Math.round(zoom * 100)}%
                    </button>
                    <button
                        onClick={zoomIn}
                        disabled={zoom >= 3}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-30"
                        title="Zoom In (+)"
                    >
                        <ZoomIn size={18} />
                    </button>
                    <div className="w-px h-4 bg-white/20 mx-1" />
                    <button
                        onClick={resetZoom}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="Reset Scale"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full border border-white/10 transition-all bg-white/5"
                    title="Close (Esc)"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Main Center Image Display with Left / Right Navigation Arrows */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
                {/* Left Navigation Arrow */}
                {images.length > 1 && (
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary hover:scale-110 transition-all shadow-2xl backdrop-blur-md"
                        title="Previous Image (Left Arrow)"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Main Zoomable Image */}
                <div
                    className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
                    style={{ transform: `scale(${zoom})` }}
                >
                    <Image
                        fill
                        src={currentSrc}
                        alt={`Viewing photo ${index + 1}`}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl pointer-events-auto"
                        draggable={false}
                    />
                </div>

                {/* Right Navigation Arrow */}
                {images.length > 1 && (
                    <button
                        onClick={handleNext}
                        className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary hover:scale-110 transition-all shadow-2xl backdrop-blur-md"
                        title="Next Image (Right Arrow)"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>

            {/* Bottom Image Thumbnails Bar */}
            {images.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 max-w-2xl mx-auto custom-scrollbar z-10">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setIndex(i);
                                setZoom(1);
                                if (onIndexChange) onIndexChange(i);
                            }}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i === index ? 'border-primary scale-110 shadow-lg' : 'border-white/20 opacity-50 hover:opacity-100'}`}
                        >
                            <Image fill src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
