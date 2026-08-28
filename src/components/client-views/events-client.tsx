'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useContent, isEventCompleted } from '@/context/content-context';
import { EventCard } from '@/components/events/event-card';
import { AcademicYearToggle } from '@/components/academic-year-toggle';
import { Sparkles, Trophy, Music, ArrowRight, Filter } from 'lucide-react';

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
            glowColor: 'group-hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
            icon: Sparkles,
            accent: 'from-cyan-500/20 via-blue-500/10 to-transparent',
        },
        {
            title: 'KURUKSHETRA 2026',
            subtitle: 'Sports Fest',
            desc: 'Cricket, Football, Turf Leagues & Track Events.',
            href: '/events/fests/kurukshetra',
            badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            glowColor: 'group-hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
            icon: Trophy,
            accent: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        },
        {
            title: 'RHYTHMS 2026',
            subtitle: 'Cultural Fest',
            desc: 'Dance, Battle of Bands, Fashion Parade & Nukkad Natak.',
            href: '/events/fests/rhythms',
            badgeBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            glowColor: 'group-hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]',
            icon: Music,
            accent: 'from-pink-500/20 via-purple-500/10 to-transparent',
        },
    ];

    return (
        <div className="container mx-auto px-4 pt-32 pb-24">
            {/* Header */}
            <div className="mb-10 text-center space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                    Community <span className="text-gradient">Events</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto opacity-70 text-base md:text-lg leading-relaxed">
                    Explore upcoming workshops, hackathons, industrial visits, and departmental fests.
                </p>

                <div className="pt-2 flex justify-center">
                    <AcademicYearToggle />
                </div>
            </div>

            {/* Category Filters Bar */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 border ${
                            selectedCategory === cat.id
                                ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105'
                                : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                    >
                        {cat.id !== 'All' && <Filter size={12} />}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Main Layout Grid (Events List on Left, Fests Panel on Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left (2 cols): Upcoming & Past Events */}
                <div className="lg:col-span-2 space-y-16">
                    {/* Upcoming Events Section */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary rounded-full" />
                            Upcoming Events
                        </h2>
                        {upcomingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {upcomingEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        id={event.id}
                                        title={event.title}
                                        description={event.description}
                                        date={formatDateDisplay(event.date, event.end_date)}
                                        location={event.location}
                                        image_url={event.image_url}
                                        type={event.type || event.category}
                                        has_registration={event.has_registration}
                                        registration_url={event.registration_url}
                                        isPast={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center border border-dashed rounded-[2rem] border-white/10 text-muted-foreground italic text-sm">
                                No upcoming events found in &ldquo;{selectedCategory}&rdquo;. Check back soon!
                            </div>
                        )}
                    </div>

                    {/* Past Events Section */}
                    {pastEvents.length > 0 && (
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-2 h-8 bg-secondary rounded-full" />
                                Completed Events
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pastEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        id={event.id}
                                        title={event.title}
                                        description={event.description}
                                        date={formatDateDisplay(event.date, event.end_date)}
                                        location={event.location}
                                        image_url={event.image_url}
                                        type={event.type || event.category}
                                        has_registration={false}
                                        isPast={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right (1 col): Department Fests Panel */}
                <aside className="space-y-6">
                    <div className="sticky top-32 space-y-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold tracking-tight">Annual Flagship Fests</h2>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <div className="space-y-4">
                            {fests.map((fest) => {
                                const Icon = fest.icon;
                                return (
                                    <Link key={fest.title} href={fest.href} className="block group">
                                        <div className={`relative rounded-3xl border border-white/10 bg-[#07070a]/90 backdrop-blur-xl p-6 transition-all duration-300 ${fest.glowColor} overflow-hidden`}>
                                            <div className={`absolute inset-0 bg-gradient-to-br ${fest.accent} opacity-50 group-hover:opacity-100 transition-opacity`} />
                                            
                                            <div className="relative z-10 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${fest.badgeBg}`}>
                                                        {fest.subtitle}
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-white/10 transition-all">
                                                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-5 h-5 text-white shrink-0" />
                                                    <h3 className="text-xl font-black text-white tracking-tight">{fest.title}</h3>
                                                </div>

                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {fest.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
