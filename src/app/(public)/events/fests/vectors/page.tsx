import type { Metadata } from 'next';
import { VectorsClient } from '@/components/client-views/vectors-client';

export const metadata: Metadata = {
    title: 'VECTORS 2026 | Flagship Technical Fest',
    description: 'VECTORS 2026 is the annual flagship technical festival of ACPCE featuring competitive coding arenas, AI & DS project showcases, model deployments, and hackathons.',
    openGraph: {
        title: 'VECTORS 2026 | Flagship Technical Fest | SHAIDS ACPCE',
        description: 'Explore technical competitions, hackathons, and departmental AI & DS events at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/events/fests/vectors',
    },
};

export default function VectorsPage() {
    return <VectorsClient />;
}
