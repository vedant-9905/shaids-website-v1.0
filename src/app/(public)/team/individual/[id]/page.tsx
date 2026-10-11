import type { Metadata } from 'next';
import { TeamIndividualClient } from '@/components/client-views/team-individual-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Student Profile',
        description: 'View detailed student profile, academic background, tech skills, and achievements at SHAIDS ACPCE.',
        openGraph: {
            title: 'Student Profile | SHAIDS ACPCE',
            description: 'Student portfolio and profile at Department of Artificial Intelligence & Data Science, ACPCE.',
            url: `https://shaids-acpce.org/team/individual/${id}`,
        },
    };
}

export default function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
    return <TeamIndividualClient params={params} />;
}
