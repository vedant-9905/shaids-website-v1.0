'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent, HighlightItem } from '@/context/content-context';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { AcademicYearToggle } from '@/components/academic-year-toggle';

export default function HighlightsAchievementsPage() {
    const { highlights, academicYear } = useContent();

    const filteredHighlights = highlights ? highlights.filter(h => !h.academicYear || h.academicYear === academicYear) : [];

    const [selectedHighlight, setSelectedHighlight] = useState<HighlightItem | null>(null);
    const [lightboxState, setLightboxState] = useState<{ images: string[]; index: number } | null>(null);

    return (
        <div className="space-y-10 [font-size:85%]">
            <Link href="/about/achievements" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors group font-medium">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Achievements
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <span className="px-3.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-black border border-primary/30 uppercase tracking-[0.2em]">
                        Department Accolades
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        National &amp; Intercollegiate <span className="text-gradient">Highlights</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        Celebrating national hackathon victories, intercollegiate technical trophies, and high-impact research publications.
                    </p>
                </div>

                <div>
                    <AcademicYearToggle />
                </div>
            </div>

            {/* Highlights Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHighlights.map((item) => (
                    <div key={item.id} className="p-6 rounded-[2.5rem] border border-white/10 bg-[#07070b]/90 backdrop-blur-xl space-y-4 flex flex-col justify-between shadow-2xl group hover:border-primary/40 transition-all">
                        <div className="space-y-4">
                            <div
                                onClick={() => setLightboxState({ images: [item.image, ...(item.gallery || [])], index: 0 })}
                                className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 relative cursor-pointer"
                            >
                                <Image fill src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider border bg-primary/20 text-primary border-primary/30">
                                    {item.category}
                                </span>
                            </div>

                            {item.achievement && (
                                <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
                                    <Trophy size={15} className="text-amber-400 shrink-0" />
                                    <span className="font-black uppercase tracking-wider text-[11px]">{item.achievement}</span>
                                </div>
                            )}

                            <h2 className="text-xl font-black text-white tracking-tight leading-snug">{item.title}</h2>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{item.description}</p>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <div className="text-[11px] text-muted-foreground space-y-1">
                                <div><span className="font-bold text-white">Team: </span>{item.team}</div>
                                <div className="flex items-center gap-3 pt-1 text-[10px]">
                                    <span className="flex items-center gap-1"><MapPin size={10} className="text-primary" /> {item.location}</span>
                                    <span className="flex items-center gap-1"><Calendar size={10} className="text-primary" /> {item.date}</span>
                                </div>
                            </div>
                            <Button onClick={() => setSelectedHighlight(item)} variant="neon" className="w-full rounded-2xl h-10 text-xs font-bold gap-2">
                                View Full Details &amp; Gallery
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedHighlight && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl overflow-y-auto custom-scrollbar space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="px-3.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border bg-primary/20 text-primary border-primary/30">
                                    {selectedHighlight.category}
                                </span>
                                {selectedHighlight.achievement && (
                                    <span className="px-3.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center gap-1">
                                        🏆 {selectedHighlight.achievement}
                                    </span>
                                )}
                            </div>
                            <button onClick={() => setSelectedHighlight(null)} className="p-2 text-muted-foreground hover:text-white rounded-xl hover:bg-white/5">✕</button>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black">{selectedHighlight.title}</h2>
                        
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Event Overview &amp; Accolade</h4>
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">{selectedHighlight.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
                            <div>
                                <span className="font-bold text-white block mb-1">Team / Awardee</span>
                                <span className="text-muted-foreground">{selectedHighlight.team}</span>
                            </div>
                            <div>
                                <span className="font-bold text-white block mb-1">Achievement / Result</span>
                                <span className="text-amber-400 font-bold flex items-center gap-1">
                                    <Trophy size={13} /> {selectedHighlight.achievement || 'Participant / Winner'}
                                </span>
                            </div>
                            <div>
                                <span className="font-bold text-white block mb-1">Location &amp; Date</span>
                                <span className="text-muted-foreground">{selectedHighlight.location} ({selectedHighlight.date})</span>
                            </div>
                        </div>

                        {/* Photo Gallery */}
                        {selectedHighlight.gallery && selectedHighlight.gallery.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Highlight Gallery</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {selectedHighlight.gallery.map((imgUrl, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setLightboxState({ images: selectedHighlight.gallery, index: i })}
                                            className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 cursor-pointer group relative"
                                        >
                                            <Image fill src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Site-Wide Image Lightbox with Zoom & Next/Prev Arrows */}
            {lightboxState && (
                <ImageLightbox
                    images={lightboxState.images}
                    currentIndex={lightboxState.index}
                    onClose={() => setLightboxState(null)}
                />
            )}
        </div>
    );
}
