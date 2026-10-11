import type { Metadata } from 'next';
import { HighlightsClient } from '@/components/client-views/highlights-client';

export const metadata: Metadata = {
    title: 'Department Accolades & Highlights',
    description: 'National hackathon victories, intercollegiate technical trophies, and high-impact research publications achieved by AI & DS students at ACPCE.',
    openGraph: {
        title: 'Department Accolades & Highlights | SHAIDS ACPCE',
        description: 'Explore national and state-level engineering accolades, hackathons, and research awards at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/about/achievements/highlights',
    },
};

export default function HighlightsAchievementsPage() {
    return <HighlightsClient />;
}
