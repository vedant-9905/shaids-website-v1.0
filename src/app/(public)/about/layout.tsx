import React from 'react';
import type { Metadata } from 'next';
import { AboutNavigationTabs } from '@/components/ui/about-navigation-tabs';

export const metadata: Metadata = {
    title: {
        default: 'About Department',
        template: '%s | SHAIDS ACPCE',
    },
    description: 'Learn about the Department of Artificial Intelligence & Data Science at ACPCE, established vision & mission, leadership messages, and academic achievements.',
    openGraph: {
        title: 'About Department | SHAIDS ACPCE',
        description: 'Empowering students through academic excellence, innovation, and industry leadership in AI & DS at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/about/overview',
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
            {/* About Section Header */}
            <div className="mb-10 text-center space-y-3">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
                    Department of <br />
                    <span className="text-gradient">Artificial Intelligence </span>
                    &amp; <span className="text-gradient">Data Science</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto opacity-80">
                    Empowering students through academic excellence, innovation, and industry leadership.
                </p>
            </div>

            {/* Sub-Navigation Tabs */}
            <AboutNavigationTabs />

            {/* Page Content */}
            <div>{children}</div>
        </div>
    );
}
