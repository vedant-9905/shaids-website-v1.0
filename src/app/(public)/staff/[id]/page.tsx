import type { Metadata } from 'next';
import { StaffDetailClient } from '@/components/client-views/staff-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Faculty Profile',
        description: 'View qualifications, specialization, research domains, and academic publications of faculty in AI & DS at ACPCE.',
        openGraph: {
            title: 'Faculty Profile | SHAIDS ACPCE',
            description: 'Faculty directory profile in Department of Artificial Intelligence & Data Science, ACPCE.',
            url: `https://shaids-acpce.org/staff/${id}`,
        },
    };
}

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <StaffDetailClient params={params} />;
}
