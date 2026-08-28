'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Calendar, MapPin, Users, Crown, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent, FestSubEvent } from '@/context/content-context';
import { FestGalleryMarquee } from '@/components/ui/fest-gallery-marquee';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { AcademicYearToggle } from '@/components/academic-year-toggle';

export default function VectorsFestPage() {
    const { festSubEvents, festGalleries, academicYear } = useContent();

    const filteredSubEvents = festSubEvents.filter(e => e.festId === 'vectors' && (!e.academicYear || e.academicYear === academicYear));
    const vectorsSubEvents = filteredSubEvents.length > 0 ? filteredSubEvents : festSubEvents.filter(e => e.festId === 'vectors');
    const vectorsGallery = festGalleries.vectors || [];

    const [selectedSubEvent, setSelectedSubEvent] = useState<FestSubEvent | null>(null);
    const [lightboxState, setLightboxState] = useState<{ images: string[]; index: number } | null>(null);

    return (
        <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl space-y-12">
            <div className="flex items-center justify-between">
                <Link href="/events" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors group font-medium">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </Link>
                <AcademicYearToggle />
            </div>

            {/* Banner Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-cyan-500/30 bg-[#050914] shadow-2xl p-8 md:p-14">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-3xl space-y-6">
                    <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-black border border-cyan-500/40 uppercase tracking-[0.25em]">
                        College Flagship Technical Fest
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                        VECTORS <span className="text-gradient">2026</span>
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                        The premier college-wide Technical Symposium. Featuring AI &amp; DS Departmental events, competitive coding arenas, model deployments, and innovation exhibitions.
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2 text-cyan-400"><Calendar size={16} /> Annual Technical Fest</span>
                        <span className="flex items-center gap-2 text-cyan-400"><MapPin size={16} /> ACPCE Campus Auditorium &amp; Labs</span>
                        <span className="flex items-center gap-2 text-cyan-400"><Users size={16} /> 500+ Participants</span>
                    </div>
                </div>
            </div>

            {/* Departmental Vectors Events Grid */}
            <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-white">
                    <span className="w-2 h-8 bg-cyan-400 rounded-full" />
                    Departmental VECTORS Events &amp; Winners
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {vectorsSubEvents.map((evt) => (
                        <div key={evt.id} className="p-6 rounded-[2.5rem] border border-cyan-500/20 bg-[#070913]/90 backdrop-blur-xl space-y-4 flex flex-col justify-between shadow-2xl group hover:border-cyan-500/40 transition-all">
                            <div className="space-y-4">
                                <div
                                    onClick={() => setLightboxState({ images: [evt.image, ...(evt.eventGallery || [])], index: 0 })}
                                    className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 relative cursor-pointer"
                                >
                                    <Image fill src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">{evt.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{evt.desc}</p>

                                <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                                        <Crown size={14} /> Winner: {evt.winner}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                                        <Trophy size={14} className="text-slate-400" /> Runner-Up: {evt.runnerUp}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                                        <UserCheck size={12} className="text-cyan-400" /> Organizers: {evt.organizer}
                                    </div>
                                </div>
                            </div>

                            <Button onClick={() => setSelectedSubEvent(evt)} variant="neon" className="w-full rounded-2xl h-10 text-xs font-bold mt-4">
                                View Event Info &amp; Gallery
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fest Gallery */}
            <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                        <span className="w-2 h-6 bg-cyan-400 rounded-full" />
                        VECTORS Fest Gallery
                    </h2>
                </div>

                <FestGalleryMarquee
                    images={vectorsGallery}
                    onImageClick={(index) => setLightboxState({ images: vectorsGallery, index })}
                />
            </div>

            {/* Sub-Event Modal */}
            {selectedSubEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-2xl flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <h3 className="text-xl font-bold">{selectedSubEvent.title}</h3>
                            <button onClick={() => setSelectedSubEvent(null)} className="p-2 text-muted-foreground hover:text-white rounded-xl hover:bg-white/5">✕</button>
                        </div>
                        <div className="space-y-3">
                            {selectedSubEvent.desc && (
                                <p className="text-sm font-medium text-slate-200 leading-relaxed">{selectedSubEvent.desc}</p>
                            )}
                            {selectedSubEvent.detailedInfo && selectedSubEvent.detailedInfo !== selectedSubEvent.desc && (
                                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground leading-relaxed">
                                    <span className="font-bold text-cyan-400 block mb-1">Event Highlights &amp; Winners Info:</span>
                                    {selectedSubEvent.detailedInfo}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                            <p className="font-bold text-amber-400 flex items-center gap-2"><Crown size={14} /> Winner: {selectedSubEvent.winner}</p>
                            <p className="font-semibold text-slate-300 flex items-center gap-2"><Trophy size={14} /> Runner-Up: {selectedSubEvent.runnerUp}</p>
                            <p className="text-muted-foreground flex items-center gap-2"><UserCheck size={14} className="text-cyan-400" /> Organizers: {selectedSubEvent.organizer}</p>
                        </div>

                        {selectedSubEvent.eventGallery && selectedSubEvent.eventGallery.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider">Event Specific Photos</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedSubEvent.eventGallery.map((imgUrl, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setLightboxState({ images: selectedSubEvent.eventGallery, index: i })}
                                            className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 cursor-pointer group relative"
                                        >
                                            <Image fill src={imgUrl} alt={`Sub event ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
