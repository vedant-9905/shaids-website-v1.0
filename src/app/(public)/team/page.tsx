import type { Metadata } from 'next';
import { TeamClient } from '@/components/client-views/team-client';

export const metadata: Metadata = {
    title: 'Student Committee',
    description: 'Meet the student council and core committee members driving innovation, technical workshops, and departmental leadership at SHAIDS ACPCE.',
    openGraph: {
        title: 'Student Committee | SHAIDS ACPCE',
        description: 'Meet the passionate student committee leadership of the AI & DS Department at ACPCE.',
        url: 'https://shaids-acpce.org/team',
    },
};

export default function TeamPage() {
    return <TeamClient />;
}
