'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, UserCheck } from 'lucide-react';
import { useContent } from '@/context/content-context';
import { AcademicYearToggle } from '@/components/academic-year-toggle';

export default function NptelAchievementsPage() {
    const { nptel, academicYear } = useContent();

    const filteredNptel = nptel ? nptel.filter(item => !item.academicYear || item.academicYear === academicYear) : [];

    const studentAchievers = filteredNptel.filter((item) => !item.isFaculty);
    const facultyAchievers = filteredNptel.filter((item) => item.isFaculty);

    return (
        <div className="relative space-y-10 [font-size:85%] overflow-hidden">
            {/* Ambient Amber Glow */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link href="/about/achievements" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-amber-400 transition-colors group font-medium">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Achievements
                </Link>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30 uppercase tracking-[0.2em]"
                    >
                        SWAYAM NPTEL
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight"
                    >
                        NPTEL Elite <span className="text-amber-400">Certifications</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-muted-foreground max-w-2xl text-sm"
                    >
                        SWAYAM NPTEL National Level Certifications earned by our students and faculty members.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    <AcademicYearToggle />
                </motion.div>
            </div>

            {/* Student Achievers List */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                >
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                        <Award className="text-amber-400" size={24} />
                        Student NPTEL Achievers
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studentAchievers.map((st, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.06 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="p-6 rounded-3xl border border-amber-500/20 bg-[#07080d]/90 backdrop-blur-xl space-y-3 shadow-xl hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all flex flex-col justify-between relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-white">{st.name}</h3>
                                <p className="text-xs text-muted-foreground">{st.year}</p>
                            </div>
                            <div className="pt-3 border-t border-white/5 text-xs text-amber-300 font-semibold">
                                Course: {st.course}
                            </div>
                        </motion.div>
                    ))}
                    {studentAchievers.length === 0 && (
                        <div className="col-span-3 p-12 text-center rounded-[2.5rem] border border-dashed border-white/10 text-muted-foreground italic">
                            No student certification records recorded yet for {academicYear}.
                        </div>
                    )}
                </div>
            </div>

            {/* Faculty Achievers List */}
            <div className="space-y-6 pt-6 border-t border-white/10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                >
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                        <UserCheck className="text-amber-400" size={24} />
                        Faculty NPTEL Achievers
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {facultyAchievers.map((fac, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="p-6 rounded-3xl border border-amber-500/20 bg-[#08070d]/90 backdrop-blur-xl space-y-3 shadow-xl hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all flex flex-col justify-between relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-white">{fac.name}</h3>
                                <p className="text-xs text-muted-foreground">{fac.year || 'Faculty Member'}</p>
                            </div>
                            <div className="pt-3 border-t border-white/5 text-xs text-amber-300 font-semibold">
                                Course: {fac.course}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
