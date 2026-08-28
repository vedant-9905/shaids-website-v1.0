'use client';
import Image from 'next/image';

import React, { useState, use } from 'react';
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
        <div className="container mx-auto px-4 pt-32 pb-24 max-w-5xl [font-size:85%]">
            <Link href="/events" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group font-medium">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Events
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
                {/* Left: Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#050505] shadow-2xl relative aspect-[16/9] group">
                        {event.image_url ? (
                            <Image fill src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-8xl opacity-20 filter grayscale">📅</span>
                                </div>
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-5 left-6">
                            <span className="px-3.5 py-1 rounded-xl bg-primary/20 backdrop-blur-xl text-primary text-[10px] font-black border border-primary/40 uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                                {event.type || 'Workshop'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">{event.title}</h1>
                    </div>

                    <div className="space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg md:text-xl font-bold tracking-tight">About the Event</h2>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium max-w-2xl">
                                {event.long_description || event.description || "Join us for an exciting deep dive into this topic."}
                            </p>
                        </section>

                        {/* Post-Event Gallery Carousel (Renders ONLY if gallery_images exist) */}
                        {event.gallery_images && event.gallery_images.length > 0 && (
                            <section className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                        <span className="w-2 h-6 bg-primary rounded-full" /> Event Highlights &amp; Post-Event Gallery
                                    </h3>
                                    <span className="text-xs text-muted-foreground font-semibold">{event.gallery_images.length} Photos</span>
                                </div>

                                {/* Carousel Display */}
                                <div className="space-y-3">
                                    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#050505] aspect-[16/9] group shadow-2xl">
                                        <Image
                                            fill
                                            src={event.gallery_images[activeGalleryIndex % event.gallery_images.length]}
                                            alt={`${event.title} gallery photo ${(activeGalleryIndex % event.gallery_images.length) + 1}`}
                                            className="w-full h-full object-cover transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                        {event.gallery_images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : event.gallery_images!.length - 1))}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-white/10"
                                                >
                                                    ←
                                                </button>
                                                <button
                                                    onClick={() => setActiveGalleryIndex((prev) => (prev + 1) % event.gallery_images!.length)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-white/10"
                                                >
                                                    →
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnails */}
                                    {event.gallery_images.length > 1 && (
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                            {event.gallery_images.map((imgUrl, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveGalleryIndex(idx)}
                                                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border transition-all ${
                                                        activeGalleryIndex === idx ? 'border-primary ring-2 ring-primary/40 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                                                    }`}
                                                >
                                                    <Image fill src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Brochure Download Section (Renders ONLY if brochure_url exists) */}
                        {event.brochure_url && (
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-5 group hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base">Official Event Brochure</h4>
                                        <p className="text-xs text-muted-foreground">Download schedule, guidelines, and speaker details.</p>
                                    </div>
                                </div>
                                <Button className="rounded-xl h-11 px-5 text-xs font-bold gap-2" variant="neon" asChild>
                                    <a href={event.brochure_url} target="_blank" rel="noopener noreferrer">
                                        <Download size={16} /> Download Brochure
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Info Card */}
                <aside className="space-y-6">
                    <div className="rounded-[2.5rem] border border-white/10 bg-[#050505]/40 backdrop-blur-3xl p-8 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] sticky top-32 overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                        <div className="space-y-6">
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
                                        <p className="text-base font-bold tracking-tight">{formattedDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <Clock className="w-4 h-4 text-secondary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</p>
                                        <p className="text-base font-bold tracking-tight">{event.time || 'TBA'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <MapPin className="w-4 h-4 text-accent" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                                        <p className="text-base font-bold tracking-tight">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-3">
                                {event.has_registration && !event.is_past && (
                                    event.registration_url ? (
                                        <Button className="w-full rounded-2xl h-12 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all group" variant="neon" asChild>
                                            <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                                                Register Now <ExternalLink size={16} className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button className="w-full rounded-2xl h-12 text-sm font-bold opacity-50 cursor-not-allowed" variant="secondary" disabled>
                                            Registration Opening Soon
                                        </Button>
                                    )
                                )}

                                <Button
                                    onClick={() => setShareOpen(true)}
                                    variant="outline"
                                    className="w-full rounded-2xl h-10 border-white/5 bg-white/5 hover:bg-white/10 gap-2 font-bold tracking-tight text-xs"
                                >
                                    <Share2 size={14} /> Share Event
                                </Button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Share Modal Dialog */}
            <ShareModal
                isOpen={shareOpen}
                onClose={() => setShareOpen(false)}
                title={event.title}
                description={event.description}
            />
        </div>
    );
}
