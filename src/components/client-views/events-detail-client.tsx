'use client';

import Image from 'next/image';
import React, { useState, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { useContent } from '@/context/content-context';
import { ShareModal } from '@/components/ui/share-modal';

export function EventsDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { events } = useContent();
    const [shareOpen, setShareOpen] = useState(false);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

    const event = events.find(e => e.id === id);

    if (!event) {
        return (
            <div className="container mx-auto px-4 pt-40 pb-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
                <p className="text-muted-foreground mb-8 text-sm">The event you are looking for does not exist or has been removed.</p>
                <Button variant="neon" asChild className="rounded-2xl">
                    <Link href="/events">Back to Events</Link>
                </Button>
            </div>
        );
    }

    let formattedDate = 'Date TBA';
    try {
        if (event.date) {
            formattedDate = format(new Date(event.date), 'MMMM d, yyyy');
        }
    } catch {
        formattedDate = event.date;
    }

    return (
        <div className="relative container mx-auto px-4 pt-32 pb-24 max-w-5xl [font-size:85%] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link href="/events" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group font-medium">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </Link>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
                {/* Left: Content */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="lg:col-span-2 space-y-8"
                >
                    <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#050505] shadow-2xl relative aspect-[16/9] group">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                        {event.image_url ? (
                            <Image fill src={event.image_url} alt={event.title} sizes="(max-width: 1024px) 100vw, 66vw" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-8xl opacity-20 filter grayscale">📅</span>
                                </div>
                            </>
                        )}
                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                            <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-primary text-xs font-black uppercase tracking-wider border border-white/10 shadow-lg">
                                {event.type || 'Event'}
                            </span>
                            {event.category && (
                                <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-cyan-400 text-xs font-black uppercase tracking-wider border border-white/10 shadow-lg">
                                    {event.category}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                            {event.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground pt-1">
                            <span className="flex items-center gap-1.5 text-white font-medium">
                                <Calendar size={15} className="text-primary" /> {formattedDate}
                            </span>
                            {event.time && (
                                <span className="flex items-center gap-1.5 text-white font-medium">
                                    <Clock size={15} className="text-secondary" /> {event.time}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-white font-medium">
                                <MapPin size={15} className="text-pink-400" /> {event.location}
                            </span>
                        </div>
                    </div>

                    {/* About the Event */}
                    <div className="p-8 rounded-[2.5rem] border border-white/10 bg-[#07070a]/90 backdrop-blur-xl shadow-2xl space-y-6">
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full" />
                            About the Event
                        </h2>
                        <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-normal">
                            {event.long_description || event.description}
                        </div>

                        {event.organizer && (
                            <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-bold text-white">Organized by:</span> {event.organizer}
                            </div>
                        )}
                    </div>

                    {/* Brochure Section */}
                    {event.brochure_url && (
                        <div className="p-6 rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                                    <Download size={22} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Event Brochure</h4>
                                    <p className="text-xs text-muted-foreground">Download the official event flyer and guidelines</p>
                                </div>
                            </div>
                            <Button variant="outline" asChild className="rounded-2xl border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs">
                                <a href={event.brochure_url} target="_blank" rel="noopener noreferrer">
                                    Download Brochure
                                </a>
                            </Button>
                        </div>
                    )}

                    {/* Event Photo Gallery */}
                    {event.gallery_images && event.gallery_images.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                <span className="w-2 h-6 bg-secondary rounded-full" />
                                Event Snapshot Gallery
                            </h2>
                            <div className="rounded-[2.5rem] border border-white/10 bg-[#07070a] p-4 shadow-xl space-y-4">
                                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden relative border border-white/10">
                                    <Image fill src={event.gallery_images[activeGalleryIndex]} alt={`Event Photo ${activeGalleryIndex + 1}`} sizes="(max-width: 1024px) 100vw, 66vw" className="w-full h-full object-cover transition-all duration-500" />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                    {event.gallery_images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveGalleryIndex(idx)}
                                            className={`relative w-20 h-14 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                                                activeGalleryIndex === idx ? 'border-primary ring-2 ring-primary/50 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <Image fill src={img} alt={`Thumb ${idx}`} sizes="80px" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Right: Registration Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <div className="p-8 rounded-[2.5rem] border border-white/10 bg-[#07070e]/90 backdrop-blur-xl shadow-2xl space-y-6 sticky top-32">
                        <div className="space-y-2">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-wider border border-white/10">
                                Registration Status
                            </span>
                            <h3 className="text-xl font-bold text-white">
                                {event.is_past ? 'Event Concluded' : (event.has_registration ? 'Open for Registrations' : 'Open Entry')}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {event.is_past
                                    ? 'This event has concluded. Stay tuned for future editions.'
                                    : (event.has_registration
                                        ? 'Limited slots available. Secure your spot now to confirm participation.'
                                        : 'Free admission for all ACPCE students. No pre-registration required.')
                                }
                            </p>
                        </div>

                        {!event.is_past && event.has_registration && (
                            event.registration_url ? (
                                <Button className="w-full h-12 rounded-2xl text-xs font-black uppercase tracking-wider gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" variant="neon" asChild>
                                    <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                                        Register Online <ExternalLink size={14} />
                                    </a>
                                </Button>
                            ) : (
                                <Button className="w-full h-12 rounded-2xl text-xs font-black uppercase tracking-wider" variant="neon" disabled>
                                    Registration Link Opening Soon
                                </Button>
                            )
                        )}

                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <Button onClick={() => setShareOpen(true)} variant="outline" className="w-full h-11 rounded-2xl text-xs font-bold gap-2 border-white/10 bg-white/5 hover:bg-white/10">
                                <Share2 size={14} /> Share Event Details
                            </Button>
                        </div>

                        <div className="pt-2 flex items-center gap-2 text-[11px] text-muted-foreground/70">
                            <ShieldCheck size={14} className="text-emerald-400 shrink-0" /> Official Departmental Activity
                        </div>
                    </div>
                </motion.div>
            </div>

            <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} title={event.title} />
        </div>
    );
}
