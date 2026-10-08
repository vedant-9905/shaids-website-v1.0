'use client';
import Image from 'next/image';
import React, { use } from 'react';
import { motion } from 'framer-motion';
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

            <div className="container mx-auto px-4 pt-32 pb-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link href="/team" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sky-400 transition-colors mb-8 group font-medium">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Team
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Avatar Card & Social Icons */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="md:col-span-1 p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl text-center space-y-4 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
                        
                        <div className="relative w-40 h-40 mx-auto rounded-full border-2 border-sky-400/20 overflow-hidden bg-white/5 flex items-center justify-center shadow-md group">
                            {member.image_url ? (
                                <Image fill src={member.image_url} alt={member.name} sizes="160px" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                                <motion.a 
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={member.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors"
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
                                    className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors"
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
                                    className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors"
                                >
                                    <Instagram size={18} />
                                </motion.a>
                            )}
                            {member.email && (
                                <motion.a 
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={`mailto:${member.email}`} 
                                    className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors"
                                >
                                    <Mail size={18} />
                                </motion.a>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column: Clean Bio & Detailed Sections */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl space-y-3 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                                <User size={16} className="text-sky-400" /> Overview
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {member.bio || `Core student council member at SHAIDS.`}
                            </p>
                        </motion.div>

                        {/* Key Skills */}
                        {member.skills && member.skills.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl space-y-3 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
                                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                                    <Sparkles size={16} className="text-sky-400" /> Skills & Technical Focus
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {member.skills.map((skill: string) => (
                                        <motion.span 
                                            key={skill} 
                                            whileHover={{ scale: 1.05 }}
                                            className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-300 inline-block cursor-default"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Interests & Achievements */}
                        {member.achievements && member.achievements.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                                className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl space-y-3 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
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
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
