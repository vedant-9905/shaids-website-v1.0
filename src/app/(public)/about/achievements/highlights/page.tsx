'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, MapPin, Calendar, Sparkles } from 'lucide-react';
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
        <div className="relative space-y-10 [font-size:85%] overflow-hidden">
            {/* Ambient Purple Glow */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link href="/about/achievements" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors group font-medium">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Achievements
                </Link>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-3.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-black border border-primary/30 uppercase tracking-[0.2em]"
                    >
                        Department Accolades
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight"
                    >
                        National &amp; Intercollegiate <span className="text-gradient">Highlights</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-muted-foreground max-w-2xl text-sm"
                    >
                        Celebrating national hackathon victories, intercollegiate technical trophies, and high-impact research publications.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    <AcademicYearToggle />
                </motion.div>
            </div>

            {/* Highlights Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHighlights.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className="p-6 rounded-[2.5rem] border border-white/10 bg-[#07070b]/90 backdrop-blur-xl space-y-4 flex flex-col justify-between shadow-2xl group hover:border-primary/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.2)] transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="space-y-4">
                            <div
                                onClick={() => setLightboxState({ images: [item.image, ...(item.gallery || [])], index: 0 })}
                                className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 relative cursor-pointer group/img"
                            >
                                <Image fill src={item.image} alt={item.title} sizes="(max-width: 768px) 100vw, 33vw" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
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
                                <Sparkles size={14} /> View Full Details &amp; Gallery
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedHighlight && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col p-6 md:p-8 rounded-[2.5rem] border border-primary/30 bg-[#0a0a0f] text-white shadow-2xl overflow-y-auto space-y-6"
                        >
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
                                <button onClick={() => setSelectedHighlight(null)} className="p-2 text-muted-foreground hover:text-white rounded-xl hover:bg-white/5 cursor-pointer">✕</button>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black">{selectedHighlight.title}</h2>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">{selectedHighlight.description}</p>

                            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">Award / Placement</span>
                                    <span className="text-amber-400 font-bold text-sm">{selectedHighlight.achievement || 'Recognition'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">Team / Contributors</span>
                                    <span className="text-white font-semibold text-sm">{selectedHighlight.team}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-xs text-muted-foreground pt-1">
                                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {selectedHighlight.location}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {selectedHighlight.date}</span>
                            </div>

                            {selectedHighlight.gallery && selectedHighlight.gallery.length > 0 && (
                                <div className="space-y-3 pt-2 border-t border-white/10">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Accolade Snapshots</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedHighlight.gallery.map((imgUrl, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setLightboxState({ images: selectedHighlight.gallery, index: i })}
                                                className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 relative cursor-pointer hover:border-primary/50 transition-all"
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
