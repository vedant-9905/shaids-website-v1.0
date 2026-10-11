import type { Metadata } from 'next';
import { TeamDetailClient } from '@/components/client-views/team-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Team Member Profile',
        description: 'View student profile, committee role, contributions, and social portfolios at SHAIDS ACPCE.',
        openGraph: {
            title: 'Team Member Profile | SHAIDS ACPCE',
            description: 'Student leader and committee member at Department of AI & DS, ACPCE.',
            url: `https://shaids-acpce.org/team/${id}`,
        },
    };
}

export default function TeamMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <TeamDetailClient params={params} />;
}
