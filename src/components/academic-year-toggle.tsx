'use client';

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useContent, AcademicYear } from '@/context/content-context';

export function AcademicYearToggle({ className = '' }: { className?: string }) {
    const { academicYear, setAcademicYear } = useContent();

    return (
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/15 bg-[#090b14]/90 backdrop-blur-xl shadow-lg hover:border-primary/40 transition-all ${className}`}>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 shrink-0">
                <Calendar size={14} className="text-primary" />
                <span className="hidden sm:inline text-[11px] text-muted-foreground uppercase tracking-wider">Session:</span>
            </div>
            <div className="relative flex items-center">
                <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                    className="appearance-none bg-transparent pr-6 text-xs font-black text-amber-300 focus:outline-none cursor-pointer"
                >
                    <option value="2026-27" className="bg-[#0b0c16] text-white">A.Y. 2026–27</option>
                    <option value="2025-26" className="bg-[#0b0c16] text-white">A.Y. 2025–26 </option>
                </select>
                <ChevronDown size={14} className="absolute right-0 text-primary pointer-events-none" />
            </div>
        </div>
    );
}
