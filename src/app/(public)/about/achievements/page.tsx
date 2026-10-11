import type { Metadata } from 'next';
import { AchievementsClient } from '@/components/client-views/achievements-client';

export const metadata: Metadata = {
    title: 'Achievements & Academic Toppers',
    description: 'Explore academic rank holders, semester toppers, NPTEL elite certifications, domain awards, and student research capstones in AI & DS at ACPCE.',
    openGraph: {
        title: 'Achievements & Academic Toppers | SHAIDS ACPCE',
        description: 'Celebrate departmental milestones, academic rank holders, and student projects at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/about/achievements',
    },
};

export default function AchievementsPage() {
    return <AchievementsClient />;
}
