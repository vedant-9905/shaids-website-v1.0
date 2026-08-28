// Event Card Component
'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface EventProps {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    image_url?: string;
    isPast?: boolean;
    has_registration?: boolean;
    registration_url?: string;
    type?: string;
}

export function EventCard({
    id, title, date, location, description, image_url, isPast = false, has_registration = true, registration_url, type = 'Event'
}: EventProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={cn(
                "flex flex-col rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2",
                !isPast && "hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] hover:border-white/20"
            )}
        >
            {/* Top glare */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

            <div className="h-48 bg-muted relative overflow-hidden group">
                <Link href={`/events/${id}`} className="absolute inset-0 z-20" />
                {image_url ? (
                    <Image src={image_url} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={75} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">📅</span>
                        </div>
                    </>
                )}
                <div className="absolute top-3 left-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-wider border border-white/10">
                        {type}
                    </span>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-primary" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-secondary" />
                        <span className="truncate max-w-[120px]">{location}</span>
                    </div>
                </div>

                <Link href={`/events/${id}`} className="block group">
                    <h3 className="text-xl font-bold mb-2 text-foreground transition-colors line-clamp-1">{title}</h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">{description}</p>

                <div className={cn("grid gap-3 mt-auto", has_registration && !isPast ? "grid-cols-2" : "grid-cols-1")}>
                    <Link href={`/events/${id}`} className="w-full">
                        <Button variant="outline" className="w-full rounded-2xl text-xs h-10 border-white/5 bg-white/5 hover:bg-white/10">
                            Details
                        </Button>
                    </Link>

                    {has_registration && !isPast && (
                        registration_url ? (
                            <Button className="w-full group rounded-2xl text-xs h-10" variant="neon" asChild>
                                <a href={registration_url || '#'} target="_blank" rel="noopener noreferrer">
                                    Register
                                    <ExternalLink className="ml-1 w-3 h-3" />
                                </a>
                            </Button>
                        ) : (
                            <Link href={`/events/${id}`} className="w-full">
                                <Button className="w-full group rounded-2xl text-xs h-10" variant="neon">
                                    Register
                                    <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
}
