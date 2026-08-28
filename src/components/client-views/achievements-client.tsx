'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Trophy, Star, GraduationCap, ArrowRight, Sparkles, Filter, Flame, Cpu, Music } from 'lucide-react';

import { useContent } from '@/context/content-context';

export function AchievementsClient() {
    const { toppers, domainAwards } = useContent();
    const [selectedSem, setSelectedSem] = useState<'Odd' | 'Even'>('Even');

    const collegeFests = [
        {
            title: 'VECTORS 2026',
            category: 'Annual Technical Fest',
            desc: 'State-level technical symposium featuring AI Hackathons, CodeSprint competitive arenas, and project exhibitions.',
            href: '/events/fests/vectors',
            icon: Cpu,
            badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            bg: 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-black to-black hover:border-cyan-500/60'
        },
        {
            title: 'KURUKSHETRA 2026',
            category: 'Annual Sports Fest',
            desc: 'Inter-batch Box Cricket leagues, LAN e-sports arena (BGMI/Valorant), chess, and athletic clashes.',
            href: '/events/fests/kurukshetra',
            icon: Flame,
            badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            bg: 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-black to-black hover:border-emerald-500/60'
        },
        {
            title: 'RHYTHMS 2026',
            category: 'Annual Cultural Fest',
            desc: 'Inter-departmental group dance, battle of the bands, fashion runway, and theatrical street plays.',
            href: '/events/fests/rhythms',
            icon: Music,
            badgeBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            bg: 'border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-black to-black hover:border-pink-500/60'
        }
    ];

    const hubs = [
        {
            title: 'NPTEL Certifications',
            subtitle: 'SWAYAM NPTEL',
            desc: 'View NPTEL certificate holders and Faculty Achievers list.',
            href: '/about/achievements/nptel',
            icon: Award,
            color: 'text-amber-400',
            bg: 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-black to-black hover:border-amber-500/60'
        },
        {
            title: 'National & Intercollegiate Highlights',
            subtitle: 'Competition Victories',
            desc: 'Smart India Hackathon, state level expos, and IEEE Scopus paper accolades.',
            href: '/about/achievements/highlights',
            icon: Trophy,
            color: 'text-primary',
            bg: 'border-primary/30 bg-gradient-to-br from-primary/10 via-black to-black hover:border-primary/60'
        },
        {
            title: 'Best Capstone Projects',
            subtitle: 'Student Innovations',
            desc: 'Explore top final-year capstone prototypes, tech stacks, abstracts, and galleries.',
            href: '/about/achievements/projects',
            icon: Sparkles,
            color: 'text-cyan-400',
            bg: 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-black to-black hover:border-cyan-500/60'
        }
    ];

    const toppersData = {
        Even: [
            {
                year: 'SE (Second Year - Batch 2025–29)',
                semLabel: 'Sem IV (Even Semester)',
                students: toppers.filter(t => t.semType === 'Even' && t.yearBatch === 'SE')
            },
            {
                year: 'TE (Third Year - Batch 2024–28)',
                semLabel: 'Sem VI (Even Semester)',
                students: toppers.filter(t => t.semType === 'Even' && t.yearBatch === 'TE')
            },
            {
                year: 'BE (Final Year - Batch 2023–27)',
                semLabel: 'Sem VIII (Even Semester)',
                students: toppers.filter(t => t.semType === 'Even' && t.yearBatch === 'BE')
            }
        ],
        Odd: [
            {
                year: 'SE (Second Year - Batch 2025–29)',
                semLabel: 'Sem III (Odd Semester)',
                students: toppers.filter(t => t.semType === 'Odd' && t.yearBatch === 'SE')
            },
            {
                year: 'TE (Third Year - Batch 2024–28)',
                semLabel: 'Sem V (Odd Semester)',
                students: toppers.filter(t => t.semType === 'Odd' && t.yearBatch === 'TE')
            },
            {
                year: 'BE (Final Year - Batch 2023–27)',
                semLabel: 'Sem VII (Odd Semester)',
                students: toppers.filter(t => t.semType === 'Odd' && t.yearBatch === 'BE')
            }
        ]
    };

    return (
        <div className="space-y-16 [font-size:85%]">
            {/* College Annual Flagship Fests Showcase (AT VERY BEGINNING) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Sparkles className="text-primary" size={24} />
                        College Annual Flagship Fests
                    </h2>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {collegeFests.map((fest, idx) => {
                        const Icon = fest.icon;
                        return (
                            <Link key={idx} href={fest.href} className="block group">
                                <div className={`p-8 rounded-[2.5rem] border ${fest.bg} space-y-4 shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${fest.badgeBg}`}>
                                            {fest.category}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-white/10 transition-all">
                                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Icon className="w-5 h-5 text-white shrink-0" />
                                        <h3 className="text-2xl font-black text-white tracking-tight">{fest.title}</h3>
                                    </div>

                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                        {fest.desc}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Clickable Achievement Portals */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Department Achievement Portals</h2>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {hubs.map((hub, idx) => {
                        const Icon = hub.icon;
                        return (
                            <Link key={idx} href={hub.href} className="block group">
                                <div className={`p-8 rounded-[2.5rem] border ${hub.bg} space-y-4 shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                                    <div className="flex items-center justify-between">
                                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${hub.color} border border-white/10`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-white/10 transition-all">
                                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">{hub.subtitle}</span>
                                        <h3 className="text-xl font-black text-white tracking-tight">{hub.title}</h3>
                                    </div>

                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                        {hub.desc}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Academic Toppers (SE -> TE -> BE with Odd/Even Sem Selection) */}
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                            <GraduationCap className="text-secondary" size={24} />
                            Academic Toppers
                        </h2>
                    </div>

                    {/* Semester Dropdown Selector */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <Filter size={12} /> Select Semester:
                        </label>
                        <select
                            value={selectedSem}
                            onChange={(e) => setSelectedSem(e.target.value as 'Odd' | 'Even')}
                            className="px-4 py-2 rounded-xl bg-[#111] border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-primary"
                        >
                            <option value="Even">Even Semester (Sem IV, VI, VIII)</option>
                            <option value="Odd">Odd Semester (Sem III, V, VII)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {toppersData[selectedSem].map((section, idx) => (
                        <div key={idx} className="p-6 rounded-[2rem] border border-white/10 bg-[#07070a] space-y-4 shadow-xl">
                            <div>
                                <h3 className="text-base font-bold text-secondary">{section.year}</h3>
                                <p className="text-[11px] text-muted-foreground font-medium">{section.semLabel}</p>
                            </div>
                            <div className="space-y-3 pt-2">
                                {section.students.map((st, i) => (
                                    <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-white">{st.name}</p>
                                            <p className="text-[11px] text-muted-foreground">{st.rank}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-primary block">{st.sgpa}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Student Domain Excellence Awards */}
            <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Star className="text-amber-400" size={24} />
                        Student Domain Excellence Awards
                    </h2>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {domainAwards.map((award, idx) => (
                        <div key={award.id || idx} className="p-6 rounded-3xl border border-amber-500/20 bg-white/5 space-y-3 shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-500/20 text-amber-300 border-amber-500/30">
                                        {award.domain}
                                    </span>
                                    <Star className="text-amber-400" size={18} />
                                </div>
                                <div className="pt-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block">Recipient</span>
                                    <h3 className="text-xl font-black text-amber-300 tracking-tight leading-snug">{award.recipient}</h3>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-xs font-bold text-white uppercase tracking-wider">{award.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
