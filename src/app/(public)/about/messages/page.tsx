import type { Metadata } from 'next';
import { AboutMessagesClient } from '@/components/client-views/about-messages-client';

export const metadata: Metadata = {
    title: 'Leadership Messages',
    description: 'Read inspirational messages from the Principal of ACPCE, Head of Department (AI & DS), and Student Committee President.',
    openGraph: {
        title: 'Leadership Messages | SHAIDS ACPCE',
        description: 'Read departmental leadership perspectives from Principal Dr. Sawata R. Deore and HoD Mrs. Shilpali Bansu.',
        url: 'https://shaids-acpce.org/about/messages',
    },
};

export default function LeadershipMessagesPage() {
    return <AboutMessagesClient />;
}
