'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
            bg: 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-black to-black hover:border-cyan-500/60 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]'
        },
        {
            title: 'KURUKSHETRA 2026',
            category: 'Annual Sports Fest',
            desc: 'Inter-batch Box Cricket leagues, LAN e-sports arena (BGMI/Valorant), chess, and athletic clashes.',
            href: '/events/fests/kurukshetra',
            icon: Flame,
            badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            bg: 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-black to-black hover:border-emerald-500/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]'
        },
        {
            title: 'RHYTHMS 2026',
            category: 'Annual Cultural Fest',
            desc: 'Inter-departmental group dance, battle of the bands, fashion runway, and theatrical street plays.',
            href: '/events/fests/rhythms',
            icon: Music,
            badgeBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            bg: 'border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-black to-black hover:border-pink-500/60 hover:shadow-[0_0_35px_rgba(236,72,153,0.25)]'
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
            bg: 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-black to-black hover:border-amber-500/60 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]'
        },
        {
            title: 'National & Intercollegiate Highlights',
            subtitle: 'Competition Victories',
            desc: 'Smart India Hackathon, state level expos, and IEEE Scopus paper accolades.',
            href: '/about/achievements/highlights',
            icon: Trophy,
            color: 'text-primary',
            bg: 'border-primary/30 bg-gradient-to-br from-primary/10 via-black to-black hover:border-primary/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]'
        },
        {
            title: 'Best Capstone Projects',
            subtitle: 'Student Innovations',
            desc: 'Explore top final-year capstone prototypes, tech stacks, abstracts, and galleries.',
            href: '/about/achievements/projects',
            icon: Sparkles,
            color: 'text-cyan-400',
            bg: 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-black to-black hover:border-cyan-500/60 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]'
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
        <div className="relative space-y-20 [font-size:85%] overflow-hidden">
            {/* Ambient Background Spotlight */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 mb-2"
                >
                    <Trophy size={14} /> Department Accolades
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight"
                >
                    Excellence &amp; <span className="text-gradient">Achievements Hub</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="text-muted-foreground text-sm md:text-base leading-relaxed"
                >
                    Celebrating academic toppers, flagship college fests, national competition highlights, and student capstone innovation.
                </motion.p>
            </div>

            {/* Annual Flagship Fests Section */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                >
                    <h2 className="text-2xl font-bold tracking-tight text-white">Annual Flagship Fests &amp; Technical Arenas</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {collegeFests.map((fest, idx) => {
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
                                <Link href={fest.href} className="block group h-full">
                                    <div className={`h-full p-8 rounded-[2.5rem] border ${fest.bg} space-y-4 shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                                        <div className="flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${fest.badgeBg}`}>
                                                {fest.category}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-white/10 group-hover:scale-110 transition-all">
                                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Icon className="w-5 h-5 text-white shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                            <h3 className="text-2xl font-black text-white tracking-tight">{fest.title}</h3>
                                        </div>

                                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                            {fest.desc}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Clickable Achievement Portals */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                >
                    <h2 className="text-2xl font-bold tracking-tight text-white">Department Achievement Portals</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {hubs.map((hub, idx) => {
                        const Icon = hub.icon;
                        return (
                            <motion.div
                                key={hub.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                            >
                                <Link href={hub.href} className="block group h-full">
                                    <div className={`h-full p-8 rounded-[2.5rem] border ${hub.bg} space-y-4 shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                                        <div className="flex items-center justify-between">
                                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${hub.color} border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-white/10 group-hover:scale-110 transition-all">
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
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Academic Toppers */}
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                    >
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                            <GraduationCap className="text-secondary" size={24} />
                            Academic Toppers
                        </h2>
                    </motion.div>

                    {/* Semester Dropdown Selector */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <Filter size={12} /> Select Semester:
                        </label>
                        <select
                            value={selectedSem}
                            onChange={(e) => setSelectedSem(e.target.value as 'Odd' | 'Even')}
                            className="px-4 py-2 rounded-xl bg-[#111] border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-primary cursor-pointer hover:border-white/40 transition-colors"
                        >
                            <option value="Even">Even Semester (Sem IV, VI, VIII)</option>
                            <option value="Odd">Odd Semester (Sem III, V, VII)</option>
                        </select>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedSem}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {toppersData[selectedSem].map((section, idx) => (
                            <motion.div
                                key={section.year}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: idx * 0.1 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="p-6 rounded-[2.5rem] border border-white/10 bg-[#07070a]/90 backdrop-blur-xl space-y-4 shadow-xl hover:border-white/20 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <div>
                                    <h3 className="text-base font-bold text-secondary">{section.year}</h3>
                                    <p className="text-[11px] text-muted-foreground font-medium">{section.semLabel}</p>
                                </div>
                                <div className="space-y-3 pt-2">
                                    {section.students.map((st, i) => (
                                        <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                                            <div>
                                                <p className="text-xs font-bold text-white">{st.name}</p>
                                                <p className="text-[11px] text-muted-foreground">{st.rank}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-black text-primary block">{st.sgpa}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {section.students.length === 0 && (
                                        <p className="text-xs text-muted-foreground italic py-4 text-center">Topper list updating soon.</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Student Domain Excellence Awards */}
            {domainAwards.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-white/10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            <Star className="text-amber-400" size={24} />
                            Student Domain Excellence Awards
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {domainAwards.map((award, idx) => (
                            <motion.div
                                key={award.id || idx}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: idx * 0.08 }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="p-6 rounded-3xl border border-amber-500/20 bg-white/5 backdrop-blur-xl space-y-3 shadow-xl hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all flex flex-col justify-between relative overflow-hidden"
                            >
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
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
