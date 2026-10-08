'use client';
import Image from 'next/image';
import React, { use } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Mail, ArrowLeft, GraduationCap, UserCircle, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useContent } from '@/context/content-context';

export default function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { team } = useContent();

    const member = team.find(m => m.id === id);

    if (!member) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 pt-40 pb-24 text-center"
            >
                <h1 className="text-2xl font-bold mb-3">Team Member Not Found</h1>
                <p className="text-muted-foreground text-sm mb-6">The profile you are looking for does not exist or has been updated.</p>
                <Button variant="neon" asChild className="rounded-2xl">
                    <Link href="/team">Back to Team</Link>
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Ambient Spotlight */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4 pt-32 pb-24 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link href="/team" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group font-medium">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Team Core
                    </Link>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: Profile Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="rounded-[3rem] border border-white/10 bg-[#050505] p-10 shadow-[0_0_100px_-20px_rgba(56,189,248,0.2)] relative overflow-hidden group text-center">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                            
                            <div className="relative w-44 h-44 mx-auto mb-6">
                                <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
                                <div className="relative w-full h-full rounded-full border-2 border-sky-400/20 overflow-hidden shadow-2xl bg-white/5 flex items-center justify-center">
                                    {member.image_url ? (
                                        <Image fill src={member.image_url} alt={member.name} sizes="176px" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">👤</div>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight mb-1">{member.name}</h1>
                            <p className="text-sky-400 font-bold uppercase text-xs tracking-wider mb-6">{member.role}</p>
                            
                            <div className="flex justify-center gap-3 pt-6 border-t border-white/10">
                                {member.github && (
                                    <motion.a 
                                        whileHover={{ scale: 1.15, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={member.github} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors"
                                    >
                                        <Github size={18} />
                                    </motion.a>
                                )}
                                {member.linkedin && (
                                    <motion.a 
                                        whileHover={{ scale: 1.15, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={member.linkedin} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors"
                                    >
                                        <Linkedin size={18} />
                                    </motion.a>
                                )}
                                {member.instagram && (
                                    <motion.a 
                                        whileHover={{ scale: 1.15, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={member.instagram} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors"
                                    >
                                        <Instagram size={18} />
                                    </motion.a>
                                )}
                                {member.email && (
                                    <motion.a 
                                        whileHover={{ scale: 1.15, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={`mailto:${member.email}`} 
                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors"
                                    >
                                        <Mail size={18} />
                                    </motion.a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Bio & Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.section 
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4">
                                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                    <UserCircle size={16} className="text-sky-400" /> Student Profile Overview
                                </h2>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                                {member.bio || `Core student council member at SHAIDS.`}
                            </p>
                        </motion.section>

                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
                                <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                                    <GraduationCap size={16} /> Batch &amp; Graduation
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-base font-bold">Bachelor of Engineering (AI &amp; DS)</p>
                                    <p className="text-xs text-muted-foreground font-semibold">Graduation Year: {member.graduation_year || '2026'}</p>
                                </div>
                            </motion.div>

                            {member.skills && member.skills.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
                                    <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                                        <Briefcase size={16} /> Key Skills &amp; Focus
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.map((skill: string) => (
                                            <motion.span 
                                                key={skill} 
                                                whileHover={{ scale: 1.05 }}
                                                className="px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs font-bold text-sky-300 inline-block cursor-default"
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {member.achievements && member.achievements.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
                                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Award size={16} /> Key Achievements
                                </h4>
                                <ul className="space-y-2.5 text-sm text-muted-foreground font-medium">
                                    {member.achievements.map((ach: string) => (
                                        <li key={ach} className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                                            <span>{ach}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

