'use client';

import React from 'react';
import Image from 'next/image';

interface FestGalleryMarqueeProps {
    images: string[];
    onImageClick?: (index: number) => void;
}

export function FestGalleryMarquee({ images, onImageClick }: FestGalleryMarqueeProps) {
    if (!images || images.length === 0) return null;

    // Double or triple the array for seamless infinite looping animation
    const loopedImages = [...images, ...images, ...images];

    return (
        <div className="relative w-full overflow-hidden py-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl group">
            {/* Gradient Fades on Left & Right Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black via-black/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black via-black/50 to-transparent z-10 pointer-events-none" />

            {/* Scrolling Track */}
            <div className="flex gap-6 w-max animate-marquee cursor-pointer">
                {loopedImages.map((src, idx) => {
                    const originalIndex = idx % images.length;
                    return (
                        <div
                            key={idx}
                            onClick={() => onImageClick && onImageClick(originalIndex)}
                            className="w-64 sm:w-80 h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/10 relative shrink-0 transition-all duration-300 hover:scale-105 hover:border-primary/50 shadow-2xl group/item"
                        >
                            <Image
                                fill
                                src={src}
                                alt={`Fest gallery photo ${originalIndex + 1}`}
                                sizes="(max-width: 640px) 256px, 320px"
                                className="w-full h-full object-cover group-hover/item:brightness-110 transition-all duration-300"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
