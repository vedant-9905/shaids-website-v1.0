import type { Metadata } from 'next';
import { StaffClient } from '@/components/client-views/staff-client';

export const metadata: Metadata = {
    title: 'Faculty & Staff Directory',
    description: 'Explore the distinguished faculty members of the Department of Artificial Intelligence & Data Science at ACPCE, their research domains, expertise, and contact information.',
    openGraph: {
        title: 'Faculty & Staff Directory | SHAIDS ACPCE',
        description: 'Explore the faculty profiles, qualifications, and research areas in the Department of AI & DS at ACPCE.',
        url: 'https://shaids-acpce.org/staff',
    },
};

export default function StaffPage() {
    return <StaffClient />;
}
