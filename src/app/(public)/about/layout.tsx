'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Building2, MessageSquare, Award } from 'lucide-react';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: 'Department Overview', href: '/about/overview', icon: Building2 },
        { name: 'Leadership Messages', href: '/about/messages', icon: MessageSquare },
        { name: 'Achievements & Toppers', href: '/about/achievements', icon: Award },
    ];

    return (
        <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
            {/* About Section Header */}
            <div className="mb-10 text-center space-y-3">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                    Department of <br></br><span className="text-gradient">Artificial Intelligence </span>
                    &amp; <span className="text-gradient">Data Science</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto opacity-80">
                    Empowering students through academic excellence, innovation, and industry leadership.
                </p>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-white/10 pb-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all border',
                                isActive
                                    ? 'bg-primary text-white border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105'
                                    : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white'
                            )}
                        >
                            <Icon size={16} />
                            {tab.name}
                        </Link>
                    );
                })}
            </div>

            {/* Page Content */}
            <div>{children}</div>
        </div>
    );
}
