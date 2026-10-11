import type { Metadata } from 'next';
import { EventsDetailClient } from '@/components/client-views/events-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Event Details',
        description: 'View schedule, timings, brochure, snapshot gallery, and registration details for this departmental event at ACPCE.',
        openGraph: {
            title: 'Event Details | SHAIDS ACPCE',
            description: 'Official departmental activity and workshop details from Department of Artificial Intelligence & Data Science, ACPCE.',
            url: `https://shaids-acpce.org/events/${id}`,
        },
    };
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <EventsDetailClient params={params} />;
}
