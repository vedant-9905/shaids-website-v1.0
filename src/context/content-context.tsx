'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured, isValidUUID, generateUUID, deleteMediaFile } from '@/lib/supabase';
import { toast } from 'sonner';

export type AcademicYear = '2026-27' | '2025-26';

export interface EventItem {
    id: string;
    title: string;
    description: string;
    long_description?: string;
    date: string;
    end_date?: string;
    time?: string;
    location: string;
    image_url?: string;
    type?: string;
    category?: string;
    organizer?: string;
    brochure_url?: string;
    registration_url?: string;
    has_registration: boolean;
    is_past: boolean;
    academicYear?: AcademicYear;
    gallery_images?: string[];
}

export function isEventCompleted(event: EventItem): boolean {
    if (event.is_past) return true;
    if (!event.date) return false;

    try {
        const dateToCheck = event.end_date || event.date;
        const targetDate = new Date(dateToCheck + 'T23:59:59').getTime();
        const now = new Date().getTime();
        return now > targetDate;
    } catch {
        return false;
    }
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    category?: string;
    image_url?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    email?: string;
    bio?: string;
    graduation_year?: string;
    academicYear?: AcademicYear;
    skills?: string[];
    achievements?: string[];
    display_order?: number;
    created_at?: string;
}

export interface StaffMember {
    id: string;
    name: string;
    designation: string;
    department?: string;
    qualification?: string;
    expertise?: string[];
    email?: string;
    image_url?: string;
    bio?: string;
    display_order?: number;
    created_at?: string;
}

export interface ResourceItem {
    id: string;
    title: string;
    description: string;
    category: string;
    link: string;
    tags?: string[];
    author?: string;
}

export interface ProjectItem {
    id: string;
    title: string;
    category: string;
    abstract: string;
    team: string[];
    advisor: string;
    techStack: string[];
    image: string;
    gallery: string[];
    academicYear?: AcademicYear;
    github?: string;
    demo?: string;
}

export interface NptelItem {
    id: string;
    name: string;
    course: string;
    cert: string;
    score: string;
    year: string;
    academicYear?: AcademicYear;
    isFaculty?: boolean;
}

export interface HighlightItem {
    id: string;
    title: string;
    category: string;
    team: string;
    location: string;
    date: string;
    description: string;
    achievement?: string;
    image: string;
    gallery: string[];
    academicYear?: AcademicYear;
}

export interface FestSubEvent {
    id: string;
    festId: 'vectors' | 'kurukshetra' | 'rhythms';
    title: string;
    organizer: string;
    winner: string;
    runnerUp: string;
    desc: string;
    detailedInfo: string;
    image: string;
    academicYear?: AcademicYear;
    eventGallery: string[];
}

export interface TopperItem {
    id: string;
    semType: 'Odd' | 'Even';
    yearBatch: 'SE' | 'TE' | 'BE';
    rank: string; // 'Rank 1', 'Rank 2', 'Rank 3'
    name: string;
    sgpa: string;
}

export interface DomainAwardItem {
    id: string;
    title: string;
    recipient: string;
    domain: string;
}

export interface HomeConfig {
    hero_headline: string;
    hero_subtitle: string;
    announcement_text: string;
    about_text: string;
    stat_members: string;
    stat_events: string;
    stat_workshops: string;
    image_events?: string;
    image_team?: string;
    image_resources?: string;
    image_staff?: string;
}

export interface FestGalleries {
    vectors: string[];
    kurukshetra: string[];
    rhythms: string[];
}

const DEFAULT_FEST_GALLERIES: FestGalleries = {
    vectors: [],
    kurukshetra: [],
    rhythms: []
};

const DEFAULT_HOME_CONFIG: HomeConfig = {
    hero_headline: 'Empowering Tomorrow with AI & Data Science',
    hero_subtitle: 'Department of Artificial Intelligence & Data Science Student Council',
    announcement_text: '🚀 Tech Symposium 2026 Registration Open Now!',
    about_text: 'SHAIDS (Student Association of Artificial Intelligence & Data Science) is dedicated to fostering innovation, technical growth, and collaborative learning across all batches.',
    stat_members: '250+',
    stat_events: '18+',
    stat_workshops: '12+',
    image_events: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    image_team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    image_resources: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
    image_staff: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80'
};



interface ContentContextType {
    events: EventItem[];
    team: TeamMember[];
    staff: StaffMember[];
    resources: ResourceItem[];
    projects: ProjectItem[];
    nptel: NptelItem[];
    highlights: HighlightItem[];
    festSubEvents: FestSubEvent[];
    festGalleries: FestGalleries;
    toppers: TopperItem[];
    domainAwards: DomainAwardItem[];
    homeConfig: HomeConfig;
    loading: boolean;
    saveEvent: (event: EventItem) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    saveTeamMember: (member: TeamMember) => Promise<void>;
    deleteTeamMember: (id: string) => Promise<void>;
    reorderTeamMembers: (members: TeamMember[]) => Promise<void>;
    academicYear: AcademicYear;
    setAcademicYear: (ay: AcademicYear) => void;
    saveStaffMember: (member: StaffMember) => Promise<void>;
    deleteStaffMember: (id: string) => Promise<void>;
    reorderStaffMembers: (members: StaffMember[]) => Promise<void>;
    saveResource: (resource: ResourceItem) => Promise<void>;
    deleteResource: (id: string) => Promise<void>;
    saveProject: (project: ProjectItem) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    saveNptel: (nptel: NptelItem) => Promise<void>;
    deleteNptel: (id: string) => Promise<void>;
    saveHighlight: (highlight: HighlightItem) => Promise<void>;
    deleteHighlight: (id: string) => Promise<void>;
    saveFestSubEvent: (subEvent: FestSubEvent) => Promise<void>;
    deleteFestSubEvent: (id: string) => Promise<void>;
    saveFestGallery: (festId: 'vectors' | 'kurukshetra' | 'rhythms', gallery: string[]) => Promise<void>;
    saveTopper: (topper: TopperItem) => Promise<void>;
    deleteTopper: (id: string) => Promise<void>;
    saveDomainAward: (award: DomainAwardItem) => Promise<void>;
    deleteDomainAward: (id: string) => Promise<void>;
    updateHomeConfig: (config: HomeConfig) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [academicYear, setAcademicYear] = useState<AcademicYear>('2026-27');
    const [events, setEvents] = useState<EventItem[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [nptel, setNptel] = useState<NptelItem[]>([]);
    const [highlights, setHighlights] = useState<HighlightItem[]>([]);
    const [festSubEvents, setFestSubEvents] = useState<FestSubEvent[]>([]);
    const [festGalleries, setFestGalleries] = useState<FestGalleries>(DEFAULT_FEST_GALLERIES);
    const [toppers, setToppers] = useState<TopperItem[]>([]);
    const [domainAwards, setDomainAwards] = useState<DomainAwardItem[]>([]);
    const [homeConfig, setHomeConfig] = useState<HomeConfig>(DEFAULT_HOME_CONFIG);
    const [loading, setLoading] = useState(true);

    const refreshContent = useCallback(async () => {
        if (!isSupabaseConfigured || !supabase) return;
        try {
            const [evRes, tmRes, stRes, rsRes, prRes, npRes, hlRes, fsRes, fgRes, tpRes, daRes, hcRes] = await Promise.all([
                supabase.from('events').select('*'),
                supabase.from('team').select('*'),
                supabase.from('staff').select('*'),
                supabase.from('resources').select('*'),
                supabase.from('projects').select('*'),
                supabase.from('nptel').select('*'),
                supabase.from('highlights').select('*'),
                supabase.from('fest_sub_events').select('*'),
                supabase.from('fest_galleries').select('*'),
                supabase.from('toppers').select('*'),
                supabase.from('domain_awards').select('*'),
                supabase.from('home_config').select('*').single()
            ]);

            if (evRes.data) {
                setEvents(evRes.data.map((r: Record<string, unknown>) => ({ ...r, academicYear: r.academic_year || '2026-27' } as unknown as EventItem)));
            }
            if (tmRes.data) {
                const mapped = tmRes.data.map((r: Record<string, unknown>) => ({ ...r, academicYear: r.academic_year || '2026-27' } as unknown as TeamMember));
                mapped.sort((a, b) => {
                    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return timeA - timeB;
                });
                setTeam(mapped);
            }
            if (stRes.data) {
                const mapped = stRes.data.map((r: Record<string, unknown>) => (r as unknown as StaffMember));
                mapped.sort((a, b) => {
                    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return timeA - timeB;
                });
                setStaff(mapped);
            }
            if (rsRes.data) {
                setResources(rsRes.data);
            }
            if (prRes.data) {
                setProjects(prRes.data.map((r: Record<string, unknown>) => ({ ...r, academicYear: r.academic_year || '2026-27', techStack: r.tech_stack } as unknown as ProjectItem)));
            }
            if (npRes.data) {
                setNptel(npRes.data.map((r: Record<string, unknown>) => ({ ...r, academicYear: r.academic_year || '2026-27', isFaculty: r.is_faculty } as unknown as NptelItem)));
            }
            if (hlRes.data) {
                setHighlights(hlRes.data.map((r: Record<string, unknown>) => ({ ...r, academicYear: r.academic_year || '2026-27' } as unknown as HighlightItem)));
            }
            if (fsRes.data) {
                setFestSubEvents(fsRes.data.map((r: Record<string, unknown>) => ({
                    ...r,
                    festId: r.fest_id,
                    runnerUp: r.runner_up,
                    desc: r.desc_text || r.desc,
                    detailedInfo: r.detailed_info,
                    academicYear: r.academic_year || '2026-27',
                    eventGallery: r.event_gallery
                } as unknown as FestSubEvent)));
            }
            if (fgRes.data) {
                const map: Record<string, string[]> = {};
                fgRes.data.forEach((row: { id: string; gallery: string[] }) => { map[row.id] = row.gallery; });
                setFestGalleries(prev => ({ ...prev, ...map }));
            }
            if (tpRes.data) {
                setToppers(tpRes.data.map((r: Record<string, unknown>) => ({ ...r, semType: r.sem_type, yearBatch: r.year_batch } as unknown as TopperItem)));
            }
            if (daRes.data) {
                setDomainAwards(daRes.data);
            }
            if (hcRes.data) {
                setHomeConfig(hcRes.data);
            }
        } catch (err: unknown) {
            console.error('Supabase Live Refresh Error:', err);
        }
    }, []);

    const broadcastSync = () => {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            try {
                const bc = new BroadcastChannel('shaids-live-sync');
                bc.postMessage('SYNC_REFRESH');
                bc.close();
            } catch {
                // BroadcastChannel may not be supported or allowed in all contexts
            }
        }
    };

    useEffect(() => {
        async function loadContent() {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured! Check NEXT_PUBLIC_SUPABASE_URL.');
                setLoading(false);
                return;
            }
            await refreshContent();
            setLoading(false);
        }

        loadContent();

        let bc: BroadcastChannel | null = null;
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            bc = new BroadcastChannel('shaids-live-sync');
            bc.onmessage = (event) => {
                if (event.data === 'SYNC_REFRESH') {
                    refreshContent();
                }
            };
        }

        let channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
        if (isSupabaseConfigured && supabase) {
            const client = supabase;
            channel = client
                .channel('schema-db-changes')
                .on('postgres_changes', { event: '*', schema: 'public' }, () => {
                    refreshContent();
                })
                .subscribe();
        }

        const pollInterval = setInterval(() => {
            refreshContent();
        }, 20000);

        return () => {
            if (bc) bc.close();
            if (channel && supabase) supabase.removeChannel(channel);
            clearInterval(pollInterval);
        };
    }, [refreshContent]);

    // --- EVENTS OPERATIONS ---
    const saveEvent = async (event: EventItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existingEvent = events.find(e => e.id === event.id);
            const validId = event.id && isValidUUID(event.id) ? event.id : (existingEvent ? existingEvent.id : generateUUID());

            if (existingEvent) {
                if (existingEvent.image_url && existingEvent.image_url !== event.image_url) {
                    deleteMediaFile(existingEvent.image_url);
                }
                if (existingEvent.brochure_url && existingEvent.brochure_url !== event.brochure_url) {
                    deleteMediaFile(existingEvent.brochure_url);
                }
                if (existingEvent.gallery_images) {
                    const newGallery = event.gallery_images || [];
                    existingEvent.gallery_images.forEach(img => {
                        if (!newGallery.includes(img)) deleteMediaFile(img);
                    });
                }
            }

            const eventToSave: EventItem = { ...event, id: validId };

            const payload = {
                id: eventToSave.id,
                title: eventToSave.title,
                description: eventToSave.description,
                long_description: eventToSave.long_description || null,
                date: eventToSave.date,
                end_date: eventToSave.end_date || null,
                time: eventToSave.time || null,
                location: eventToSave.location,
                image_url: eventToSave.image_url || null,
                type: eventToSave.type || null,
                category: eventToSave.category || null,
                organizer: eventToSave.organizer || null,
                brochure_url: eventToSave.brochure_url || null,
                registration_url: eventToSave.registration_url || null,
                has_registration: Boolean(eventToSave.has_registration),
                is_past: Boolean(eventToSave.is_past),
                gallery_images: eventToSave.gallery_images || [],
                academic_year: eventToSave.academicYear || '2026-27'
            };

            const { data, error } = await supabase.from('events').upsert(payload).select();

            if (error) {
                console.error('Supabase Events Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? ({ ...data[0], academicYear: data[0].academic_year || eventToSave.academicYear || '2026-27' } as unknown as EventItem) : eventToSave;
            setEvents(prev => existingEvent ? prev.map(e => (e.id === saved.id ? saved : e)) : [saved, ...prev]);
            await refreshContent();
            toast.success('Event saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save event';
            console.error('Save Event Error:', err);
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            const target = events.find(e => e.id === id);
            if (target) {
                if (target.image_url) deleteMediaFile(target.image_url);
                if (target.brochure_url) deleteMediaFile(target.brochure_url);
                if (target.gallery_images) target.gallery_images.forEach(img => deleteMediaFile(img));
            }

            if (!isValidUUID(id)) {
                setEvents(prev => prev.filter(e => e.id !== id));
                toast.success('Event deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('events').delete().eq('id', id);

            if (error) {
                console.error('Supabase Events Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setEvents(prev => prev.filter(e => e.id !== id));
            await refreshContent();
            toast.success('Event deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete event';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // --- TEAM OPERATIONS ---
    const saveTeamMember = async (member: TeamMember) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existingMember = team.find(m => m.id === member.id);
            const validId = member.id && isValidUUID(member.id) ? member.id : (existingMember ? existingMember.id : generateUUID());

            if (existingMember && existingMember.image_url && existingMember.image_url !== member.image_url) {
                deleteMediaFile(existingMember.image_url);
            }

            const memberToSave: TeamMember = { ...member, id: validId };

            const payload = {
                id: memberToSave.id,
                name: memberToSave.name,
                role: memberToSave.role,
                category: memberToSave.category || 'Core Committee',
                image_url: memberToSave.image_url || null,
                github: memberToSave.github || null,
                linkedin: memberToSave.linkedin || null,
                instagram: memberToSave.instagram || null,
                email: memberToSave.email || null,
                bio: memberToSave.bio || null,
                graduation_year: memberToSave.graduation_year || null,
                skills: memberToSave.skills || [],
                achievements: memberToSave.achievements || [],
                academic_year: memberToSave.academicYear || '2026-27'
            };

            const { data, error } = await supabase.from('team').upsert(payload).select();

            if (error) {
                console.error('Supabase Team Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? ({ ...data[0], academicYear: data[0].academic_year || memberToSave.academicYear } as unknown as TeamMember) : memberToSave;
            setTeam(prev => existingMember ? prev.map(m => (m.id === saved.id ? saved : m)) : [...prev, saved]);
            await refreshContent();
            toast.success('Team member saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save team member';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteTeamMember = async (id: string) => {
        try {
            const target = team.find(m => m.id === id);
            if (target?.image_url) deleteMediaFile(target.image_url);

            if (!isValidUUID(id)) {
                setTeam(prev => prev.filter(m => m.id !== id));
                toast.success('Team member deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('team').delete().eq('id', id);

            if (error) {
                console.error('Supabase Team Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setTeam(prev => prev.filter(m => m.id !== id));
            await refreshContent();
            toast.success('Team member deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete team member';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const reorderTeamMembers = async (reordered: TeamMember[]) => {
        try {
            const baseTime = Date.now() - (reordered.length * 10000);
            const updated = reordered.map((m, idx) => ({
                ...m,
                display_order: idx + 1,
                created_at: new Date(baseTime + idx * 1000).toISOString()
            }));
            setTeam(updated);
            broadcastSync();

            if (isSupabaseConfigured && supabase) {
                const upsertData = updated.map(m => ({
                    id: m.id,
                    name: m.name,
                    role: m.role,
                    category: m.category || 'Core Committee',
                    image_url: m.image_url || null,
                    github: m.github || null,
                    linkedin: m.linkedin || null,
                    instagram: m.instagram || null,
                    email: m.email || null,
                    bio: m.bio || null,
                    graduation_year: m.graduation_year || null,
                    skills: m.skills || [],
                    achievements: m.achievements || [],
                    academic_year: m.academicYear || '2026-27',
                    created_at: m.created_at
                }));
                const { error } = await supabase.from('team').upsert(upsertData);
                if (error) {
                    console.error('Supabase Reorder Team Error:', error);
                    toast.error(`Reorder Error: ${error.message}`);
                    return;
                }
                await refreshContent();
                broadcastSync();
            }
            toast.success('Team order updated and synced live!');
        } catch (err: unknown) {
            console.error('Reorder Team Error:', err);
        }
    };

    // --- STAFF OPERATIONS ---
    const saveStaffMember = async (member: StaffMember) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existingMember = staff.find(m => m.id === member.id);
            const validId = member.id && isValidUUID(member.id) ? member.id : (existingMember ? existingMember.id : generateUUID());

            if (existingMember && existingMember.image_url && existingMember.image_url !== member.image_url) {
                deleteMediaFile(existingMember.image_url);
            }

            const memberToSave: StaffMember = { ...member, id: validId };

            const payload = {
                id: memberToSave.id,
                name: memberToSave.name,
                designation: memberToSave.designation,
                department: memberToSave.department || 'Artificial Intelligence & Data Science',
                qualification: memberToSave.qualification || null,
                expertise: memberToSave.expertise || [],
                email: memberToSave.email || null,
                image_url: memberToSave.image_url || null,
                bio: memberToSave.bio || null
            };

            const { data, error } = await supabase.from('staff').upsert(payload).select();

            if (error) {
                console.error('Supabase Staff Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? (data[0] as unknown as StaffMember) : memberToSave;
            setStaff(prev => existingMember ? prev.map(m => (m.id === saved.id ? saved : m)) : [...prev, saved]);
            await refreshContent();
            broadcastSync();
            toast.success('Faculty member saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save faculty member';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteStaffMember = async (id: string) => {
        try {
            const target = staff.find(m => m.id === id);
            if (target?.image_url) deleteMediaFile(target.image_url);

            if (!isValidUUID(id)) {
                setStaff(prev => prev.filter(m => m.id !== id));
                toast.success('Faculty member deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('staff').delete().eq('id', id);

            if (error) {
                console.error('Supabase Staff Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setStaff(prev => prev.filter(m => m.id !== id));
            await refreshContent();
            broadcastSync();
            toast.success('Faculty member deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete faculty member';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const reorderStaffMembers = async (reordered: StaffMember[]) => {
        try {
            const baseTime = Date.now() - (reordered.length * 10000);
            const updated = reordered.map((m, idx) => ({
                ...m,
                display_order: idx + 1,
                created_at: new Date(baseTime + idx * 1000).toISOString()
            }));
            setStaff(updated);
            broadcastSync();

            if (isSupabaseConfigured && supabase) {
                const upsertData = updated.map(m => ({
                    id: m.id,
                    name: m.name,
                    designation: m.designation,
                    department: m.department || 'Artificial Intelligence & Data Science',
                    qualification: m.qualification || null,
                    expertise: m.expertise || [],
                    email: m.email || null,
                    image_url: m.image_url || null,
                    bio: m.bio || null,
                    created_at: m.created_at
                }));
                const { error } = await supabase.from('staff').upsert(upsertData);
                if (error) {
                    console.error('Supabase Reorder Staff Error:', error);
                    toast.error(`Reorder Error: ${error.message}`);
                    return;
                }
                await refreshContent();
                broadcastSync();
            }
            toast.success('Faculty order updated and synced live!');
        } catch (err: unknown) {
            console.error('Reorder Staff Error:', err);
        }
    };

    // --- RESOURCE OPERATIONS ---
    const saveResource = async (resource: ResourceItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existingResource = resources.find(r => r.id === resource.id);
            const validId = resource.id && isValidUUID(resource.id) ? resource.id : (existingResource ? existingResource.id : generateUUID());

            const resourceToSave: ResourceItem = { ...resource, id: validId };

            const payload = {
                id: resourceToSave.id,
                title: resourceToSave.title,
                description: resourceToSave.description || '',
                category: resourceToSave.category,
                link: resourceToSave.link,
                tags: resourceToSave.tags || [],
                author: resourceToSave.author || null
            };

            const { data, error } = await supabase.from('resources').upsert(payload).select();

            if (error) {
                console.error('Supabase Resource Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? (data[0] as unknown as ResourceItem) : resourceToSave;
            setResources(prev => existingResource ? prev.map(r => (r.id === saved.id ? saved : r)) : [saved, ...prev]);
            await refreshContent();
            toast.success('Resource saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save resource';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteResource = async (id: string) => {
        try {
            if (!isValidUUID(id)) {
                setResources(prev => prev.filter(r => r.id !== id));
                toast.success('Resource deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('resources').delete().eq('id', id);

            if (error) {
                console.error('Supabase Resource Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setResources(prev => prev.filter(r => r.id !== id));
            await refreshContent();
            toast.success('Resource deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete resource';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // --- PROJECT OPERATIONS ---
    const saveProject = async (project: ProjectItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = projects.find(p => p.id === project.id);
            const validId = project.id && isValidUUID(project.id) ? project.id : (existing ? existing.id : generateUUID());

            if (existing) {
                if (existing.image && existing.image !== project.image) deleteMediaFile(existing.image);
                if (existing.gallery) {
                    const newGallery = project.gallery || [];
                    existing.gallery.forEach(img => {
                        if (!newGallery.includes(img)) deleteMediaFile(img);
                    });
                }
            }

            const toSave = { ...project, id: validId };

            const payload = {
                id: toSave.id,
                title: toSave.title,
                category: toSave.category || null,
                abstract: toSave.abstract || null,
                team: toSave.team || [],
                advisor: toSave.advisor || null,
                tech_stack: toSave.techStack || [],
                image: toSave.image || null,
                gallery: toSave.gallery || [],
                github: toSave.github || null,
                demo: toSave.demo || null,
                academic_year: toSave.academicYear || '2026-27'
            };

            const { data, error } = await supabase.from('projects').upsert(payload).select();

            if (error) {
                console.error('Supabase Project Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? ({ ...data[0], academicYear: data[0].academic_year || toSave.academicYear || '2026-27', techStack: data[0].tech_stack } as unknown as ProjectItem) : toSave;
            setProjects(prev => existing ? prev.map(p => (p.id === saved.id ? saved : p)) : [saved, ...prev]);
            await refreshContent();
            toast.success('Project saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save project';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteProject = async (id: string) => {
        try {
            const target = projects.find(p => p.id === id);
            if (target) {
                if (target.image) deleteMediaFile(target.image);
                if (target.gallery) target.gallery.forEach(img => deleteMediaFile(img));
            }

            if (!isValidUUID(id)) {
                setProjects(prev => prev.filter(p => p.id !== id));
                toast.success('Project deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('projects').delete().eq('id', id);

            if (error) {
                console.error('Supabase Project Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setProjects(prev => prev.filter(p => p.id !== id));
            await refreshContent();
            toast.success('Project deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete project';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // --- NPTEL OPERATIONS ---
    const saveNptel = async (item: NptelItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = nptel.find(n => n.id === item.id);
            const validId = item.id && isValidUUID(item.id) ? item.id : (existing ? existing.id : generateUUID());
            const toSave = { ...item, id: validId };

            const payload = {
                id: toSave.id,
                name: toSave.name,
                course: toSave.course,
                cert: toSave.cert || null,
                score: toSave.score || null,
                year: toSave.year || null,
                is_faculty: Boolean(toSave.isFaculty),
                academic_year: toSave.academicYear || '2026-27'
            };

            const { data, error } = await supabase.from('nptel').upsert(payload).select();

            if (error) {
                console.error('Supabase NPTEL Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? ({ ...data[0], academicYear: data[0].academic_year || toSave.academicYear || '2026-27', isFaculty: data[0].is_faculty } as unknown as NptelItem) : toSave;
            setNptel(prev => existing ? prev.map(n => (n.id === saved.id ? saved : n)) : [saved, ...prev]);
            await refreshContent();
            toast.success('NPTEL record saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save NPTEL record';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteNptel = async (id: string) => {
        try {
            if (!isValidUUID(id)) {
                setNptel(prev => prev.filter(n => n.id !== id));
                toast.success('NPTEL record deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('nptel').delete().eq('id', id);

            if (error) {
                console.error('Supabase NPTEL Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setNptel(prev => prev.filter(n => n.id !== id));
            await refreshContent();
            toast.success('NPTEL record deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete NPTEL record';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // --- HIGHLIGHT OPERATIONS ---
    const saveHighlight = async (item: HighlightItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = highlights.find(h => h.id === item.id);
            const validId = item.id && isValidUUID(item.id) ? item.id : (existing ? existing.id : generateUUID());

            if (existing) {
                if (existing.image && existing.image !== item.image) deleteMediaFile(existing.image);
                if (existing.gallery) {
                    const newGallery = item.gallery || [];
                    existing.gallery.forEach(img => {
                        if (!newGallery.includes(img)) deleteMediaFile(img);
                    });
                }
            }

            const toSave = { ...item, id: validId };

            const payload = {
                id: toSave.id,
                title: toSave.title,
                category: toSave.category || null,
                team: toSave.team || null,
                location: toSave.location || null,
                date: toSave.date || null,
                description: toSave.description || '',
                achievement: toSave.achievement || null,
                image: toSave.image || null,
                gallery: toSave.gallery || [],
                academic_year: toSave.academicYear || '2026-27'
            };

            const { data, error } = await supabase.from('highlights').upsert(payload).select();

            if (error) {
                console.error('Supabase Highlight Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? ({ ...data[0], academicYear: data[0].academic_year || toSave.academicYear || '2026-27' } as unknown as HighlightItem) : toSave;
            setHighlights(prev => existing ? prev.map(h => (h.id === saved.id ? saved : h)) : [saved, ...prev]);
            await refreshContent();
            toast.success('Highlight record saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save highlight';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteHighlight = async (id: string) => {
        try {
            const target = highlights.find(h => h.id === id);
            if (target) {
                if (target.image) deleteMediaFile(target.image);
                if (target.gallery) target.gallery.forEach(img => deleteMediaFile(img));
            }

            if (!isValidUUID(id)) {
                setHighlights(prev => prev.filter(h => h.id !== id));
                toast.success('Highlight record deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('highlights').delete().eq('id', id);

            if (error) {
                console.error('Supabase Highlight Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setHighlights(prev => prev.filter(h => h.id !== id));
            await refreshContent();
            toast.success('Highlight record deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete highlight';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // --- FEST SUB EVENT OPERATIONS ---
    const saveFestSubEvent = async (subEvent: FestSubEvent) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = festSubEvents.find(f => f.id === subEvent.id);
            const validId = subEvent.id && isValidUUID(subEvent.id) ? subEvent.id : (existing ? existing.id : generateUUID());

            if (existing) {
                if (existing.image && existing.image !== subEvent.image) deleteMediaFile(existing.image);
                if (existing.eventGallery) {
                    const newGallery = subEvent.eventGallery || [];
                    existing.eventGallery.forEach(img => {
                        if (!newGallery.includes(img)) deleteMediaFile(img);
                    });
                }
            }

            const toSave = { ...subEvent, id: validId };

            const payload = {
                id: toSave.id,
                fest_id: toSave.festId,
                title: toSave.title,
                organizer: toSave.organizer || null,
                winner: toSave.winner || null,
                runner_up: toSave.runnerUp || null,
                desc_text: toSave.desc || '',
                detailed_info: toSave.detailedInfo || null,
                image: toSave.image || null,
                event_gallery: toSave.eventGallery || [],
                academic_year: toSave.academicYear || '2026-27'
            };

            const { data, error } = await supabase.from('fest_sub_events').upsert(payload).select();

            if (error) {
                console.error('Supabase Fest Sub Event Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? ({
                ...data[0],
                festId: data[0].fest_id,
                runnerUp: data[0].runner_up,
                desc: data[0].desc_text || data[0].desc,
                detailedInfo: data[0].detailed_info,
                academicYear: data[0].academic_year,
                eventGallery: data[0].event_gallery
            } as unknown as FestSubEvent) : toSave;

            setFestSubEvents(prev => existing ? prev.map(f => (f.id === saved.id ? saved : f)) : [saved, ...prev]);
            await refreshContent();
            toast.success('Fest Sub-Event saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save fest sub-event';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteFestSubEvent = async (id: string) => {
        try {
            const target = festSubEvents.find(f => f.id === id);
            if (target) {
                if (target.image) deleteMediaFile(target.image);
                if (target.eventGallery) target.eventGallery.forEach(img => deleteMediaFile(img));
            }

            if (!isValidUUID(id)) {
                setFestSubEvents(prev => prev.filter(f => f.id !== id));
                toast.success('Fest Sub-Event deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('fest_sub_events').delete().eq('id', id);

            if (error) {
                console.error('Supabase Fest Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setFestSubEvents(prev => prev.filter(f => f.id !== id));
            await refreshContent();
            toast.success('Fest Sub-Event deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete fest sub-event';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const saveFestGallery = async (festId: 'vectors' | 'kurukshetra' | 'rhythms', gallery: string[]) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const oldList = festGalleries[festId] || [];
            oldList.forEach(img => {
                if (!gallery.includes(img)) deleteMediaFile(img);
            });

            const { error } = await supabase.from('fest_galleries').upsert({
                id: festId,
                gallery
            });

            if (error) {
                console.error('Supabase Fest Gallery Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            setFestGalleries(prev => ({ ...prev, [festId]: gallery }));
            await refreshContent();
            toast.success(`${festId.toUpperCase()} fest gallery updated in live Supabase DB!`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save fest gallery';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // --- TOPPER OPERATIONS ---
    const saveTopper = async (item: TopperItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = toppers.find(t => t.id === item.id);
            const validId = item.id && isValidUUID(item.id) ? item.id : (existing ? existing.id : generateUUID());
            const toSave = { ...item, id: validId };

            const payload = {
                id: toSave.id,
                sem_type: toSave.semType,
                year_batch: toSave.yearBatch,
                rank: toSave.rank,
                name: toSave.name,
                sgpa: toSave.sgpa
            };

            const { data, error } = await supabase.from('toppers').upsert(payload).select();

            if (error) {
                console.error('Supabase Topper Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? ({ ...data[0], semType: data[0].sem_type, yearBatch: data[0].year_batch } as unknown as TopperItem) : toSave;
            setToppers(prev => existing ? prev.map(t => (t.id === saved.id ? saved : t)) : [...prev, saved]);
            await refreshContent();
            toast.success('Academic Topper saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save topper record';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteTopper = async (id: string) => {
        try {
            if (!isValidUUID(id)) {
                setToppers(prev => prev.filter(t => t.id !== id));
                toast.success('Topper record deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('toppers').delete().eq('id', id);

            if (error) {
                console.error('Supabase Topper Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setToppers(prev => prev.filter(t => t.id !== id));
            await refreshContent();
            toast.success('Topper record deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete topper record';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // --- DOMAIN AWARD OPERATIONS ---
    const saveDomainAward = async (item: DomainAwardItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = domainAwards.find(d => d.id === item.id);
            const validId = item.id && isValidUUID(item.id) ? item.id : (existing ? existing.id : generateUUID());
            const toSave = { ...item, id: validId };

            const payload = {
                id: toSave.id,
                title: toSave.title,
                recipient: toSave.recipient,
                domain: toSave.domain
            };

            const { data, error } = await supabase.from('domain_awards').upsert(payload).select();

            if (error) {
                console.error('Supabase Domain Award Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            const saved = data && data[0] ? (data[0] as unknown as DomainAwardItem) : toSave;
            setDomainAwards(prev => existing ? prev.map(d => (d.id === saved.id ? saved : d)) : [...prev, saved]);
            await refreshContent();
            toast.success('Domain Award saved directly to live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save domain award';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteDomainAward = async (id: string) => {
        try {
            if (!isValidUUID(id)) {
                setDomainAwards(prev => prev.filter(d => d.id !== id));
                toast.success('Domain Award deleted!');
                return;
            }

            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const { error } = await supabase.from('domain_awards').delete().eq('id', id);

            if (error) {
                console.error('Supabase Domain Award Delete Error:', error);
                toast.error(`Supabase Delete Error: ${error.message}`);
                return;
            }

            setDomainAwards(prev => prev.filter(d => d.id !== id));
            await refreshContent();
            toast.success('Domain Award deleted from live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete domain award';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // --- HOME CONFIG OPERATIONS ---
    const updateHomeConfig = async (config: HomeConfig) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            if (homeConfig.image_events && homeConfig.image_events !== config.image_events) deleteMediaFile(homeConfig.image_events);
            if (homeConfig.image_team && homeConfig.image_team !== config.image_team) deleteMediaFile(homeConfig.image_team);
            if (homeConfig.image_resources && homeConfig.image_resources !== config.image_resources) deleteMediaFile(homeConfig.image_resources);
            if (homeConfig.image_staff && homeConfig.image_staff !== config.image_staff) deleteMediaFile(homeConfig.image_staff);

            const payload = {
                id: 'main',
                hero_headline: config.hero_headline,
                hero_subtitle: config.hero_subtitle,
                announcement_text: config.announcement_text,
                about_text: config.about_text,
                stat_members: config.stat_members,
                stat_events: config.stat_events,
                stat_workshops: config.stat_workshops,
                image_events: config.image_events || null,
                image_team: config.image_team || null,
                image_resources: config.image_resources || null,
                image_staff: config.image_staff || null
            };

            const { data, error } = await supabase.from('home_config').upsert(payload).select();

            if (error) {
                console.error('Supabase Home Config Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                return;
            }

            setHomeConfig(data && data[0] ? (data[0] as unknown as HomeConfig) : config);
            await refreshContent();
            toast.success('Homepage details updated directly in live Supabase DB!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to update homepage config';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    return (
        <ContentContext.Provider
            value={{
                events,
                team,
                staff,
                resources,
                projects,
                nptel,
                highlights,
                festSubEvents,
                festGalleries,
                toppers,
                domainAwards,
                homeConfig,
                academicYear,
                setAcademicYear,
                loading,
                saveEvent,
                deleteEvent,
                saveTeamMember,
                deleteTeamMember,
                reorderTeamMembers,
                saveStaffMember,
                deleteStaffMember,
                reorderStaffMembers,
                saveResource,
                deleteResource,
                saveProject,
                deleteProject,
                saveNptel,
                deleteNptel,
                saveHighlight,
                deleteHighlight,
                saveFestSubEvent,
                deleteFestSubEvent,
                saveFestGallery,
                saveTopper,
                deleteTopper,
                saveDomainAward,
                deleteDomainAward,
                updateHomeConfig
            }}
        >
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
}
