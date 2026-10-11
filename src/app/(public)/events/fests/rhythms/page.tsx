import type { Metadata } from 'next';
import { RhythmsClient } from '@/components/client-views/rhythms-client';

export const metadata: Metadata = {
    title: 'RHYTHMS 2026 | Annual Cultural Fest',
    description: 'RHYTHMS 2026 is the annual cultural extravaganza of ACPCE celebrating music, dance, theater, art, and fashion shows across the engineering campus.',
    openGraph: {
        title: 'RHYTHMS 2026 | Annual Cultural Fest | SHAIDS ACPCE',
        description: 'ACPCE Annual Cultural Festival featuring musical performances, dance battles, and departmental celebrations in Navi Mumbai.',
        url: 'https://shaids-acpce.org/events/fests/rhythms',
    },
};

export default function RhythmsPage() {
    return <RhythmsClient />;
}
