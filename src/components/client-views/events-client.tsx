'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useContent, isEventCompleted } from '@/context/content-context';
import { EventCard } from '@/components/events/event-card';
import { AcademicYearToggle } from '@/components/academic-year-toggle';
import { Sparkles, Trophy, Music, ArrowRight, Calendar } from 'lucide-react';

export function EventsClient() {
    const { events, academicYear } = useContent();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = [
        { id: 'All', label: 'All Events' },
        { id: 'Technical Event', label: 'Technical Event' },
        { id: 'Non-Technical Event', label: 'Non-Technical Event' },
        { id: 'Industrial Visit', label: 'Industrial Visit' },
    ];

    const yearFilteredEvents = events.filter(e => !e.academicYear || e.academicYear === academicYear);

    const filteredEvents = yearFilteredEvents.filter(e => {
        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'Technical Event') return e.category === 'Technical Event' || e.type === 'Workshop' || e.type === 'Seminar' || e.type === 'Hackathon' || !e.category;
        if (selectedCategory === 'Non-Technical Event') return e.category === 'Non-Technical Event' || e.type === 'Cultural';
        if (selectedCategory === 'Industrial Visit') return e.category === 'Industrial Visit' || e.type === 'Industrial Visit';
        return true;
    });

    const upcomingEvents = filteredEvents.filter(e => !isEventCompleted(e));
    const pastEvents = filteredEvents.filter(e => isEventCompleted(e));

    const formatDateDisplay = (date: string, endDate?: string) => {
        if (endDate && endDate !== date) {
            return `${date} to ${endDate}`;
        }
        return date;
    };

    const fests = [
        {
            title: 'VECTORS 2026',
            subtitle: 'Technical Fest',
            desc: 'AI Hackathons, CodeSprint, Project Expo & Tech Papers.',
            href: '/events/fests/vectors',
            badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            glowColor: 'hover:border-cyan-500/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]',
            icon: Sparkles,
            accent: 'from-cyan-500/20 via-blue-500/10 to-transparent',
        },
        {
            title: 'KURUKSHETRA 2026',
            subtitle: 'Sports Fest',
            desc: 'Cricket, Football, Turf Leagues & Track Events.',
            href: '/events/fests/kurukshetra',
            badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            glowColor: 'hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]',
            icon: Trophy,
            accent: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        },
        {
            title: 'RHYTHMS 2026',
            subtitle: 'Cultural Fest',
            desc: 'Dance, Battle of Bands, Fashion Parade & Nukkad Natak.',
            href: '/events/fests/rhythms',
            badgeBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            glowColor: 'hover:border-pink-500/50 hover:shadow-[0_0_35px_rgba(236,72,153,0.25)]',
            icon: Music,
            accent: 'from-pink-500/20 via-purple-500/10 to-transparent',
        },
    ];

    return (
        <div className="relative container mx-auto px-4 pt-32 pb-24 overflow-hidden">
            {/* Ambient Background Spotlight */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-primary/15 rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* Header */}
            <div className="mb-12 text-center space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
                >
                    Community <span className="text-gradient">Events</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                >
                    Explore upcoming workshops, hackathons, industrial visits, and departmental fests.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="pt-2 flex justify-center"
                >
                    <AcademicYearToggle />
                </motion.div>
            </div>

            {/* Category Filters Bar */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-14 flex flex-wrap items-center justify-center gap-2 md:gap-3"
            >
                {categories.map((cat, idx) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.25 + idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            selectedCategory === cat.id
                                ? 'bg-primary text-white border-primary shadow-[0_0_25px_rgba(139,92,246,0.5)]'
                                : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white backdrop-blur-md'
                        }`}
                    >
                        {cat.label}
                    </motion.button>
                ))}
            </motion.div>

            {/* Department Flagship Fests Banner Grid */}
            <div className="mb-20 space-y-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 w-full"
                    >
                        <Sparkles className="text-primary w-5 h-5" />
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Annual Flagship Fests</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {fests.map((fest, idx) => {
                        const Icon = fest.icon;
                        return (
                            <motion.div
                                key={fest.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                            >
                                <Link
                                    href={fest.href}
                                    className={`block h-full p-7 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/5 to-black/40 backdrop-blur-xl space-y-4 shadow-2xl relative overflow-hidden group transition-all duration-300 ${fest.glowColor}`}
                                >
                                    <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${fest.accent} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700`} />
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${fest.badgeBg}`}>
                                            {fest.subtitle}
                                        </span>
                                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-white/10 group-hover:scale-110 transition-all">
                                            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-5 h-5 text-white shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{fest.title}</h3>
                                    </div>

                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                        {fest.desc}
                                    </p>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Upcoming / Active Events Section */}
            {upcomingEvents.length > 0 && (
                <div className="mb-20 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                    >
                        <Calendar className="text-primary w-5 h-5" />
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Upcoming &amp; Live Events</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                            {upcomingEvents.length}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((evt, idx) => (
                            <motion.div
                                key={evt.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                            >
                                <EventCard
                                    id={evt.id}
                                    title={evt.title}
                                    date={formatDateDisplay(evt.date, evt.end_date)}
                                    location={evt.location}
                                    description={evt.description}
                                    image_url={evt.image_url}
                                    has_registration={evt.has_registration}
                                    registration_url={evt.registration_url}
                                    type={evt.type}
                                    isPast={false}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                    >
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-muted-foreground">Past Event Highlights</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-muted-foreground text-xs font-bold border border-white/10">
                            {pastEvents.length}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pastEvents.map((evt, idx) => (
                            <motion.div
                                key={evt.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
                            >
                                <EventCard
                                    id={evt.id}
                                    title={evt.title}
                                    date={formatDateDisplay(evt.date, evt.end_date)}
                                    location={evt.location}
                                    description={evt.description}
                                    image_url={evt.image_url}
                                    has_registration={false}
                                    type={evt.type}
                                    isPast={true}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-20 text-center border border-dashed rounded-[2.5rem] border-white/10 text-muted-foreground italic bg-white/[0.02]"
                >
                    No events found in &ldquo;{selectedCategory}&rdquo; for {academicYear}.
                </motion.div>
            )}
        </div>
    );
}
