'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, UserCheck } from 'lucide-react';
import { useContent } from '@/context/content-context';
import { AcademicYearToggle } from '@/components/academic-year-toggle';

export default function NptelAchievementsPage() {
    const { nptel, academicYear } = useContent();

    const filteredNptel = nptel ? nptel.filter(item => !item.academicYear || item.academicYear === academicYear) : [];

    const studentAchievers = filteredNptel.filter((item) => !item.isFaculty);
    const facultyAchievers = filteredNptel.filter((item) => item.isFaculty);

    return (
        <div className="space-y-10 [font-size:85%]">
            <Link href="/about/achievements" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors group font-medium">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Achievements
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30 uppercase tracking-[0.2em]">
                        SWAYAM NPTEL
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        NPTEL Elite <span className="text-amber-400">Certifications</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        SWAYAM NPTEL National Level Certifications earned by our students and faculty members.
                    </p>
                </div>

                <div>
                    <AcademicYearToggle />
                </div>
            </div>

            {/* Student Achievers List */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                        <Award className="text-amber-400" size={24} />
                        Student NPTEL Achievers
                    </h2>
                    <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studentAchievers.map((st, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-amber-500/20 bg-[#07080d] space-y-3 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-white">{st.name}</h3>
                                <p className="text-xs text-muted-foreground">{st.year}</p>
                            </div>
                            <div className="pt-3 border-t border-white/5 text-xs text-amber-300 font-semibold">
                                Course: {st.course}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Faculty Achievers List */}
            <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                        <UserCheck className="text-amber-400" size={24} />
                        Faculty NPTEL Achievers
                    </h2>
                    <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {facultyAchievers.map((fac, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-amber-500/20 bg-[#08070d] space-y-3 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-white">{fac.name}</h3>
                                <p className="text-xs text-muted-foreground">{fac.year || 'Faculty Member'}</p>
                            </div>
                            <div className="pt-3 border-t border-white/5 text-xs text-amber-300 font-semibold">
                                Course: {fac.course}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
