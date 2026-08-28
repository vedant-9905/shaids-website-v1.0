'use client';
import Image from 'next/image';

import React, { use } from 'react';
import { Github, Linkedin, Instagram, Mail, ArrowLeft, User, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useContent } from '@/context/content-context';

export function TeamDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { team } = useContent();

    const member = team.find(m => m.id === id);

    if (!member) {
        return (
            <div className="container mx-auto px-4 pt-40 pb-24 text-center">
                <h1 className="text-2xl font-bold mb-3">Team Member Not Found</h1>
                <p className="text-muted-foreground text-sm mb-6">The profile you are looking for does not exist or has been updated.</p>
                <Button variant="neon" asChild className="rounded-2xl">
                    <Link href="/team">Back to Team</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-32 pb-24 max-w-4xl">
            <Link href="/team" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sky-400 transition-colors mb-8 group font-medium">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Team
            </Link>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Left Column: Avatar Card & Social Icons */}
                <div className="md:col-span-1 p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl text-center space-y-4">
                    <div className="relative w-40 h-40 mx-auto rounded-full border-2 border-sky-400/20 overflow-hidden bg-white/5 flex items-center justify-center shadow-md">
                        {member.image_url ? (
                            <Image fill src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl opacity-40">👤</span>
                        )}
                    </div>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">{member.name}</h1>
                        <p className="text-sky-400 font-semibold text-xs uppercase tracking-wider mt-1">{member.role}</p>
                    </div>

                    <div className="flex justify-center items-center gap-3 pt-4 border-t border-white/10">
                        {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors">
                                <Github size={18} />
                            </a>
                        )}
                        {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors">
                                <Linkedin size={18} />
                            </a>
                        )}
                        {member.instagram && (
                            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors">
                                <Instagram size={18} />
                            </a>
                        )}
                        {member.email && (
                            <a href={`mailto:${member.email}`} className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors">
                                <Mail size={18} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Right Column: Clean Bio & Detailed Sections */}
                <div className="md:col-span-2 space-y-6">
                    {/* Overview */}
                    <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl space-y-3">
                        <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                            <User size={16} className="text-sky-400" /> Overview
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {member.bio || `Core student council member at SHAIDS.`}
                        </p>
                    </div>

                    {/* Key Skills */}
                    {member.skills && member.skills.length > 0 && (
                        <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl space-y-3">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Sparkles size={16} className="text-sky-400" /> Skills & Technical Focus
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {member.skills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interests & Achievements */}
                    {member.achievements && member.achievements.length > 0 && (
                        <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl space-y-3">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Award size={16} className="text-sky-400" /> Interests & Achievements
                            </h3>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                {member.achievements.map((ach: string) => (
                                    <li key={ach} className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                        <span>{ach}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
