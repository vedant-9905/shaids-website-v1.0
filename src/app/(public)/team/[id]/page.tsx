import { TeamDetailClient } from '@/components/client-views/team-detail-client';

export default function TeamMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <TeamDetailClient params={params} />;
}
