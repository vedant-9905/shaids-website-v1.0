import type { Metadata } from 'next';
import { AboutOverviewClient } from '@/components/client-views/about-overview-client';

export const metadata: Metadata = {
    title: 'Department Overview',
    description: 'Learn about the history, vision, mission, PEOs, PSOs, and core technical domains of the Department of Artificial Intelligence & Data Science at ACPCE.',
    openGraph: {
        title: 'Department Overview | SHAIDS ACPCE',
        description: 'Explore the vision, mission, learning outcomes, and technical domains in AI & DS at ACPCE Navi Mumbai.',
        url: 'https://shaids-acpce.org/about/overview',
    },
};

export default function DepartmentOverviewPage() {
    return <AboutOverviewClient />;
}
