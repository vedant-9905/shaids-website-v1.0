import type { Metadata } from 'next';
import { NptelClient } from '@/components/client-views/nptel-client';

export const metadata: Metadata = {
    title: 'NPTEL Elite Certifications',
    description: 'National Level SWAYAM NPTEL elite certifications, course completion percentiles, and gold medalists from AI & DS students and faculty at ACPCE.',
    openGraph: {
        title: 'NPTEL Elite Certifications | SHAIDS ACPCE',
        description: 'National Level SWAYAM NPTEL achievements by students and faculty in AI & Data Science at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/about/achievements/nptel',
    },
};

export default function NptelAchievementsPage() {
    return <NptelClient />;
}
