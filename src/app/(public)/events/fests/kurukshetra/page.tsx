import type { Metadata } from 'next';
import { KurukshetraClient } from '@/components/client-views/kurukshetra-client';

export const metadata: Metadata = {
    title: 'KURUKSHETRA 2026 | Annual Sports Fest',
    description: 'KURUKSHETRA 2026 is the premier annual sports festival at ACPCE featuring turf football, box cricket leagues, athletic tournaments, and competitive gaming arenas.',
    openGraph: {
        title: 'KURUKSHETRA 2026 | Annual Sports Fest | SHAIDS ACPCE',
        description: 'Annual departmental sports championship, team events, and tournament galleries at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/events/fests/kurukshetra',
    },
};

export default function KurukshetraPage() {
    return <KurukshetraClient />;
}
