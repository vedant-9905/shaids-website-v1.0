import { StaffDetailClient } from '@/components/client-views/staff-detail-client';

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <StaffDetailClient params={params} />;
}
