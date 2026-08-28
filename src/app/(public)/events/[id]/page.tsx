import { EventsDetailClient } from '@/components/client-views/events-detail-client';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <EventsDetailClient params={params} />;
}
