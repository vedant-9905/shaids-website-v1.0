import type { Metadata } from 'next';
import { EventsClient } from '@/components/client-views/events-client';

export const metadata: Metadata = {
    title: 'Events & Workshops',
    description: 'Explore upcoming and completed hackathons, technical workshops, guest seminars, and flagship fests organized by the AI & DS Department at ACPCE.',
    openGraph: {
        title: 'Events & Workshops | SHAIDS ACPCE',
        description: 'Discover technical workshops, hackathons, seminars, and fests organized by the Department of AI & DS at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/events',
    },
};

export default function EventsPage() {
    return <EventsClient />;
}
