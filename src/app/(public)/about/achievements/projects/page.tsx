import type { Metadata } from 'next';
import { BestProjectsClient } from '@/components/client-views/best-projects-client';

export const metadata: Metadata = {
    title: 'Best Capstone Projects & Innovations',
    description: 'Explore award-winning student capstones, machine learning prototypes, AI research projects, and GitHub repositories developed by AI & DS students at ACPCE.',
    openGraph: {
        title: 'Best Capstone Projects & Innovations | SHAIDS ACPCE',
        description: 'Outstanding final-year student engineering projects and AI innovations at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/about/achievements/projects',
    },
};

export default function BestProjectsPage() {
    return <BestProjectsClient />;
}
