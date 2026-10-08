'use client';
import Image from 'next/image';
import React, { use } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, User, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useContent } from '@/context/content-context';

export function StaffDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { staff } = useContent();

    const member = staff.find(s => s.id === id);

    if (!member) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 pt-40 pb-24 text-center"
            >
                <h1 className="text-2xl font-bold mb-3">Faculty Staff Not Found</h1>
                <p className="text-muted-foreground text-sm mb-6">The staff profile you are looking for does not exist or has been updated.</p>
                <Button variant="neon" asChild className="rounded-2xl">
                    <Link href="/staff">Back to Staff</Link>
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Ambient Spotlight */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4 pt-32 pb-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link href="/staff" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sky-400 transition-colors mb-8 group font-medium">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Faculty & Staff
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Avatar & Mail Icon */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="md:col-span-1 p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl text-center space-y-4 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />

                        <div className="relative w-40 h-40 mx-auto rounded-full border-2 border-sky-400/20 overflow-hidden bg-white/5 flex items-center justify-center shadow-md group">
                            {member.image_url ? (
                                <Image fill src={member.image_url} alt={member.name} sizes="160px" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                                <span className="text-5xl opacity-40">🎓</span>
                            )}
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground">{member.name}</h1>
                            <p className="text-sky-400 font-semibold text-xs uppercase tracking-wider mt-1">{member.designation}</p>
                        </div>

                        <div className="flex justify-center items-center gap-3 pt-4 border-t border-white/10">
                            {member.email && (
                                <motion.a 
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={`mailto:${member.email}`} 
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-sky-400/10 text-muted-foreground hover:text-sky-400 transition-colors" 
                                    title="Send Email"
                                >
                                    <Mail size={18} />
                                </motion.a>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column: Details & Sections */}
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
                                {member.bio || `Faculty member at ACPCE Artificial Intelligence & Data Science department.`}
                            </p>
                        </motion.div>

                        {/* Qualifications & Expertise Section */}
                        {(member.qualification || (member.expertise && member.expertise.length > 0)) && (
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-xl space-y-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
                                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                                    <Award size={16} className="text-sky-400" /> Qualifications & Background
                                </h3>

                                {/* Qualification in one line */}
                                {member.qualification && (
                                    <div>
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Qualification</span>
                                        <div className="px-3.5 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-300 inline-block">
                                            {member.qualification}
                                        </div>
                                    </div>
                                )}

                                {/* Expertise topics / skills in the next line */}
                                {member.expertise && member.expertise.length > 0 && (
                                    <div className="pt-2 border-t border-white/5">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                                            <Sparkles size={13} className="text-sky-400" /> Key Expertise & Topics
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {member.expertise.map((item, idx) => (
                                                <motion.span 
                                                    key={idx} 
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-foreground/90 shadow-sm cursor-default"
                                                >
                                                    {item}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
