import type { Metadata } from 'next';
import { ResourcesClient } from '@/components/client-views/resources-client';

export const metadata: Metadata = {
    title: 'Student Resources & Study Materials',
    description: 'Access curated notes, roadmaps, lab manuals, question banks, and learning tools curated for students in Artificial Intelligence & Data Science at ACPCE.',
    openGraph: {
        title: 'Student Resources & Study Materials | SHAIDS ACPCE',
        description: 'Comprehensive study materials, syllabi, and coding roadmaps for AI & DS engineering students at ACPCE.',
        url: 'https://shaids-acpce.org/resources',
    },
};

export default function ResourcesPage() {
    return <ResourcesClient />;
}
