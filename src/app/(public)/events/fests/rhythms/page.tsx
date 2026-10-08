'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Calendar, MapPin, Users, Crown, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent, FestSubEvent } from '@/context/content-context';
import { FestGalleryMarquee } from '@/components/ui/fest-gallery-marquee';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { AcademicYearToggle } from '@/components/academic-year-toggle';

export default function RhythmsFestPage() {
    const { festSubEvents, festGalleries, academicYear } = useContent();

    const filteredSubEvents = festSubEvents.filter(e => e.festId === 'rhythms' && (!e.academicYear || e.academicYear === academicYear));
    const rhythmsSubEvents = filteredSubEvents.length > 0 ? filteredSubEvents : festSubEvents.filter(e => e.festId === 'rhythms');
    const rhythmsGallery = festGalleries.rhythms || [];

    const [selectedSubEvent, setSelectedSubEvent] = useState<FestSubEvent | null>(null);
    const [lightboxState, setLightboxState] = useState<{ images: string[]; index: number } | null>(null);

    return (
        <div className="relative container mx-auto px-4 pt-32 pb-24 max-w-6xl space-y-12 overflow-hidden">
            {/* Top Navigation */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between"
            >
                <Link href="/events" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-pink-400 transition-colors group font-medium">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </Link>
                <AcademicYearToggle />
            </motion.div>

            {/* Banner Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative rounded-[2.5rem] overflow-hidden border border-pink-500/30 bg-[#12040b] shadow-2xl p-8 md:p-14"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent" />

                <div className="relative z-10 max-w-3xl space-y-6">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-black border border-pink-500/40 uppercase tracking-[0.25em]"
                    >
                        Annual Flagship Cultural Fest
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight"
                    >
                        RHYTHMS <span className="text-pink-400">2026</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-muted-foreground text-base md:text-lg leading-relaxed"
                    >
                        The annual grand celebration of music, dance, theater, fashion runway, and artistic talent.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-muted-foreground"
                    >
                        <span className="flex items-center gap-2 text-pink-400"><Calendar size={16} /> Annual Cultural Fest</span>
                        <span className="flex items-center gap-2 text-pink-400"><MapPin size={16} /> Main Campus Open Amphitheater</span>
                        <span className="flex items-center gap-2 text-pink-400"><Users size={16} /> 1000+ Attendees</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Departmental Sub Events */}
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                >
                    <span className="w-2 h-8 bg-pink-400 rounded-full" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Departmental RHYTHMS Events &amp; Winners
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {rhythmsSubEvents.map((evt, idx) => (
                        <motion.div
                            key={evt.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="p-6 rounded-[2.5rem] border border-pink-500/20 bg-[#12050b]/90 backdrop-blur-xl space-y-4 flex flex-col justify-between shadow-2xl group hover:border-pink-500/50 hover:shadow-[0_0_35px_rgba(236,72,153,0.2)] transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/20 to-transparent" />
                            <div className="space-y-4">
                                <div
                                    onClick={() => setLightboxState({ images: [evt.image, ...(evt.eventGallery || [])], index: 0 })}
                                    className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 relative cursor-pointer group/img"
                                >
                                    <Image fill src={evt.image} alt={evt.title} sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white border border-white/20">Expand Image</span>
                                    </div>
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
                                        <UserCheck size={12} className="text-pink-400" /> Organizers: {evt.organizer}
                                    </div>
                                </div>
                            </div>

                            <Button onClick={() => setSelectedSubEvent(evt)} variant="neon" className="w-full rounded-2xl h-10 text-xs font-bold mt-4">
                                View Event Info &amp; Gallery
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Gallery */}
            <div className="space-y-6 pt-6 border-t border-white/10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between"
                >
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                        <span className="w-2 h-6 bg-pink-400 rounded-full" />
                        RHYTHMS Captured Moments
                    </h2>
                    <span className="text-xs text-pink-400 font-semibold">{rhythmsGallery.length} Photos</span>
                </motion.div>

                {rhythmsGallery.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <FestGalleryMarquee images={rhythmsGallery} onImageClick={(idx) => setLightboxState({ images: rhythmsGallery, index: idx })} />
                    </motion.div>
                ) : (
                    <div className="p-12 text-center rounded-[2.5rem] border border-dashed border-white/10 text-muted-foreground text-xs italic">
                        Gallery highlights will be uploaded following the conclusion of RHYTHMS.
                    </div>
                )}
            </div>

            {/* Event Detail Modal with AnimatePresence */}
            <AnimatePresence>
                {selectedSubEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col p-6 md:p-8 rounded-[2.5rem] border border-pink-500/30 bg-[#14060d] text-white shadow-2xl overflow-y-auto space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="px-3.5 py-1 rounded-xl bg-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-wider border border-pink-500/30">
                                    RHYTHMS Departmental Sub-Event
                                </span>
                                <button onClick={() => setSelectedSubEvent(null)} className="p-2 text-muted-foreground hover:text-white rounded-xl hover:bg-white/5 cursor-pointer">✕</button>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black text-white">{selectedSubEvent.title}</h2>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">{selectedSubEvent.detailedInfo || selectedSubEvent.desc}</p>

                            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">Winner</span>
                                    <span className="text-amber-400 font-bold text-sm">{selectedSubEvent.winner}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">Runner-Up</span>
                                    <span className="text-slate-300 font-semibold text-sm">{selectedSubEvent.runnerUp}</span>
                                </div>
                            </div>

                            {selectedSubEvent.eventGallery && selectedSubEvent.eventGallery.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">Event Snapshot Gallery</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedSubEvent.eventGallery.map((imgUrl, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setLightboxState({ images: selectedSubEvent.eventGallery, index: i })}
                                                className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 relative cursor-pointer hover:border-pink-400/50 transition-all"
                                            >
                                                <Image fill src={imgUrl} alt={`Gallery ${i}`} sizes="(max-width: 768px) 50vw, 33vw" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Lightbox */}
            {lightboxState && (
                <ImageLightbox images={lightboxState.images} initialIndex={lightboxState.index} onClose={() => setLightboxState(null)} />
            )}
        </div>
    );
}
