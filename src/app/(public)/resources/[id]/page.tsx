import type { Metadata } from 'next';
import { ResourceDetailClient } from '@/components/client-views/resource-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Resource Details',
        description: 'View study material details, download links, and curated tools for AI & DS students at ACPCE.',
        openGraph: {
            title: 'Resource Details | SHAIDS ACPCE',
            description: 'Curated technical study resources and learning materials from Department of AI & DS, ACPCE.',
            url: `https://shaids-acpce.org/resources/${id}`,
        },
    };
}

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <ResourceDetailClient params={params} />;
}
