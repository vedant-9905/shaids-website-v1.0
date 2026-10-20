'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Building2, MessageSquare, Award } from 'lucide-react';

const tabs = [
    { name: 'Department Overview', href: '/about/overview', icon: Building2 },
    { name: 'Leadership Messages', href: '/about/messages', icon: MessageSquare },
    { name: 'Achievements & Toppers', href: '/about/achievements', icon: Award },
];

export function AboutNavigationTabs() {
    const pathname = usePathname();

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-black/10 dark:border-white/10 pb-4">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href || (tab.href === '/about/achievements' && pathname.startsWith('/about/achievements'));
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all border',
                            isActive
                                ? 'bg-primary text-primary-foreground border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105'
                                : 'bg-black/5 dark:bg-white/5 text-muted-foreground border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:text-foreground'
                        )}
                    >
                        <Icon size={16} />
                        {tab.name}
                    </Link>
                );
            })}
        </div>
    );
}
