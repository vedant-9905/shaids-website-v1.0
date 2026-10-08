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
    rank: string;
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

const CACHE_KEY = 'shaids_content_cache_v2';

// Entity Data Mappers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEvent(r: Record<string, any>): EventItem {
    return { ...r, academicYear: r.academic_year || r.academicYear || '2026-27' } as EventItem;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTeam(r: Record<string, any>): TeamMember {
    return { ...r, academicYear: r.academic_year || r.academicYear || '2026-27' } as TeamMember;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStaff(r: Record<string, any>): StaffMember {
    return r as StaffMember;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResource(r: Record<string, any>): ResourceItem {
    return r as ResourceItem;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(r: Record<string, any>): ProjectItem {
    return {
        ...r,
        academicYear: r.academic_year || r.academicYear || '2026-27',
        techStack: r.tech_stack || r.techStack || []
    } as ProjectItem;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNptel(r: Record<string, any>): NptelItem {
    return {
        ...r,
        academicYear: r.academic_year || r.academicYear || '2026-27',
        isFaculty: r.is_faculty !== undefined ? r.is_faculty : r.isFaculty
    } as NptelItem;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapHighlight(r: Record<string, any>): HighlightItem {
    return { ...r, academicYear: r.academic_year || r.academicYear || '2026-27' } as HighlightItem;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFestSubEvent(r: Record<string, any>): FestSubEvent {
    return {
        ...r,
        festId: r.fest_id || r.festId,
        runnerUp: r.runner_up || r.runnerUp,
        desc: r.desc_text || r.desc,
        detailedInfo: r.detailed_info || r.detailedInfo,
        academicYear: r.academic_year || r.academicYear || '2026-27',
        eventGallery: r.event_gallery || r.eventGallery || []
    } as FestSubEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTopper(r: Record<string, any>): TopperItem {
    return {
        ...r,
        semType: r.sem_type || r.semType,
        yearBatch: r.year_batch || r.yearBatch
    } as TopperItem;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDomainAward(r: Record<string, any>): DomainAwardItem {
    return r as DomainAwardItem;
}

type SyncMessage =
    | { type: 'SYNC_REFRESH' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { type: 'PATCH'; table: string; eventType: 'INSERT' | 'UPDATE' | 'DELETE'; item?: any; id?: string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { type: 'SET_STATE'; table: string; data: any };

// Global module-level coordination to prevent concurrent flood and preserve compiler purity
let inFlightRefreshPromise: Promise<void> | null = null;
const singleTableTimers: Record<string, ReturnType<typeof setTimeout>> = {};

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

    // Broadcast instant sync signals across all open tabs/windows
    const broadcastSync = useCallback((message: SyncMessage = { type: 'SYNC_REFRESH' }) => {
        if (typeof window === 'undefined') return;
        try {
            if ('BroadcastChannel' in window) {
                const bc = new BroadcastChannel('shaids-live-sync');
                bc.postMessage(message);
                bc.close();
            }
            window.localStorage.setItem('shaids_live_signal', JSON.stringify({ ...message, _ts: Date.now() }));
        } catch {
            // Channel not available in context
        }
    }, []);

    // Instant patch applicator: updates local React state immediately in 0ms
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applyRealtimePatch = useCallback((table: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', newRecord?: Record<string, any>, oldRecord?: Record<string, any>) => {
        switch (table) {
            case 'events': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setEvents(prev => prev.filter(e => e.id !== targetId));
                } else if (newRecord) {
                    const item = mapEvent(newRecord);
                    setEvents(prev => {
                        const exists = prev.some(e => e.id === item.id);
                        return exists ? prev.map(e => e.id === item.id ? item : e) : [item, ...prev];
                    });
                }
                break;
            }
            case 'team': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setTeam(prev => prev.filter(m => m.id !== targetId));
                } else if (newRecord) {
                    const item = mapTeam(newRecord);
                    setTeam(prev => {
                        const filtered = prev.filter(m => m.id !== item.id);
                        const next = [...filtered, item];
                        next.sort((a, b) => (new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime()));
                        return next;
                    });
                }
                break;
            }
            case 'staff': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setStaff(prev => prev.filter(s => s.id !== targetId));
                } else if (newRecord) {
                    const item = mapStaff(newRecord);
                    setStaff(prev => {
                        const filtered = prev.filter(s => s.id !== item.id);
                        const next = [...filtered, item];
                        next.sort((a, b) => (new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime()));
                        return next;
                    });
                }
                break;
            }
            case 'resources': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setResources(prev => prev.filter(r => r.id !== targetId));
                } else if (newRecord) {
                    const item = mapResource(newRecord);
                    setResources(prev => {
                        const exists = prev.some(r => r.id === item.id);
                        return exists ? prev.map(r => r.id === item.id ? item : r) : [item, ...prev];
                    });
                }
                break;
            }
            case 'projects': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setProjects(prev => prev.filter(p => p.id !== targetId));
                } else if (newRecord) {
                    const item = mapProject(newRecord);
                    setProjects(prev => {
                        const exists = prev.some(p => p.id === item.id);
                        return exists ? prev.map(p => p.id === item.id ? item : p) : [item, ...prev];
                    });
                }
                break;
            }
            case 'nptel': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setNptel(prev => prev.filter(n => n.id !== targetId));
                } else if (newRecord) {
                    const item = mapNptel(newRecord);
                    setNptel(prev => {
                        const exists = prev.some(n => n.id === item.id);
                        return exists ? prev.map(n => n.id === item.id ? item : n) : [item, ...prev];
                    });
                }
                break;
            }
            case 'highlights': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setHighlights(prev => prev.filter(h => h.id !== targetId));
                } else if (newRecord) {
                    const item = mapHighlight(newRecord);
                    setHighlights(prev => {
                        const exists = prev.some(h => h.id === item.id);
                        return exists ? prev.map(h => h.id === item.id ? item : h) : [item, ...prev];
                    });
                }
                break;
            }
            case 'fest_sub_events': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setFestSubEvents(prev => prev.filter(f => f.id !== targetId));
                } else if (newRecord) {
                    const item = mapFestSubEvent(newRecord);
                    setFestSubEvents(prev => {
                        const exists = prev.some(f => f.id === item.id);
                        return exists ? prev.map(f => f.id === item.id ? item : f) : [item, ...prev];
                    });
                }
                break;
            }
            case 'fest_galleries': {
                if (newRecord?.id && newRecord?.gallery) {
                    setFestGalleries(prev => ({ ...prev, [newRecord.id]: newRecord.gallery }));
                }
                break;
            }
            case 'toppers': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setToppers(prev => prev.filter(t => t.id !== targetId));
                } else if (newRecord) {
                    const item = mapTopper(newRecord);
                    setToppers(prev => {
                        const exists = prev.some(t => t.id === item.id);
                        return exists ? prev.map(t => t.id === item.id ? item : t) : [...prev, item];
                    });
                }
                break;
            }
            case 'domain_awards': {
                if (eventType === 'DELETE') {
                    const targetId = oldRecord?.id || newRecord?.id;
                    if (targetId) setDomainAwards(prev => prev.filter(d => d.id !== targetId));
                } else if (newRecord) {
                    const item = mapDomainAward(newRecord);
                    setDomainAwards(prev => {
                        const exists = prev.some(d => d.id === item.id);
                        return exists ? prev.map(d => d.id === item.id ? item : d) : [...prev, item];
                    });
                }
                break;
            }
            case 'home_config': {
                if (newRecord) {
                    setHomeConfig(newRecord as unknown as HomeConfig);
                }
                break;
            }
        }
    }, []);

    // Full collection setter for batch updates like reordering or full config save
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applySetState = useCallback((table: string, data: any) => {
        switch (table) {
            case 'team':
                if (Array.isArray(data)) setTeam(data);
                break;
            case 'staff':
                if (Array.isArray(data)) setStaff(data);
                break;
            case 'home_config':
                if (data) setHomeConfig(data);
                break;
            case 'fest_galleries':
                if (data) setFestGalleries(prev => ({ ...prev, ...data }));
                break;
        }
    }, []);

    // Targeted single-table revalidation: only queries 1 table instead of 12!
    const refreshSingleTable = useCallback(async (tableName: string) => {
        if (!isSupabaseConfigured || !supabase) return;
        try {
            switch (tableName) {
                case 'events': {
                    const { data } = await supabase.from('events').select('*');
                    if (data) setEvents(data.map(mapEvent));
                    break;
                }
                case 'team': {
                    const { data } = await supabase.from('team').select('*');
                    if (data) {
                        const mapped = data.map(mapTeam);
                        mapped.sort((a, b) => (new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime()));
                        setTeam(mapped);
                    }
                    break;
                }
                case 'staff': {
                    const { data } = await supabase.from('staff').select('*');
                    if (data) {
                        const mapped = data.map(mapStaff);
                        mapped.sort((a, b) => (new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime()));
                        setStaff(mapped);
                    }
                    break;
                }
                case 'resources': {
                    const { data } = await supabase.from('resources').select('*');
                    if (data) setResources(data.map(mapResource));
                    break;
                }
                case 'projects': {
                    const { data } = await supabase.from('projects').select('*');
                    if (data) setProjects(data.map(mapProject));
                    break;
                }
                case 'nptel': {
                    const { data } = await supabase.from('nptel').select('*');
                    if (data) setNptel(data.map(mapNptel));
                    break;
                }
                case 'highlights': {
                    const { data } = await supabase.from('highlights').select('*');
                    if (data) setHighlights(data.map(mapHighlight));
                    break;
                }
                case 'fest_sub_events': {
                    const { data } = await supabase.from('fest_sub_events').select('*');
                    if (data) setFestSubEvents(data.map(mapFestSubEvent));
                    break;
                }
                case 'fest_galleries': {
                    const { data } = await supabase.from('fest_galleries').select('*');
                    if (data) {
                        const map: Record<string, string[]> = {};
                        data.forEach((row: { id: string; gallery: string[] }) => { map[row.id] = row.gallery; });
                        setFestGalleries(prev => ({ ...prev, ...map }));
                    }
                    break;
                }
                case 'toppers': {
                    const { data } = await supabase.from('toppers').select('*');
                    if (data) setToppers(data.map(mapTopper));
                    break;
                }
                case 'domain_awards': {
                    const { data } = await supabase.from('domain_awards').select('*');
                    if (data) setDomainAwards(data.map(mapDomainAward));
                    break;
                }
                case 'home_config': {
                    const { data } = await supabase.from('home_config').select('*').single();
                    if (data) setHomeConfig(data as unknown as HomeConfig);
                    break;
                }
            }
        } catch (err) {
            console.warn(`Error refreshing single table [${tableName}]:`, err);
        }
    }, []);

    // Debounced single-table revalidation scheduler (prevents query flood)
    const scheduleSingleTableRefresh = useCallback((tableName: string) => {
        if (singleTableTimers[tableName]) {
            clearTimeout(singleTableTimers[tableName]);
        }
        singleTableTimers[tableName] = setTimeout(() => {
            refreshSingleTable(tableName);
            delete singleTableTimers[tableName];
        }, 150);
    }, [refreshSingleTable]);

    // Full database sync with request deduplication
    const refreshContent = useCallback(async () => {
        if (!isSupabaseConfigured || !supabase) return;
        if (inFlightRefreshPromise) return inFlightRefreshPromise;

        inFlightRefreshPromise = (async () => {
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

                if (evRes.data) setEvents(evRes.data.map(mapEvent));
                if (tmRes.data) {
                    const mapped = tmRes.data.map(mapTeam);
                    mapped.sort((a, b) => (new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime()));
                    setTeam(mapped);
                }
                if (stRes.data) {
                    const mapped = stRes.data.map(mapStaff);
                    mapped.sort((a, b) => (new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime()));
                    setStaff(mapped);
                }
                if (rsRes.data) setResources(rsRes.data.map(mapResource));
                if (prRes.data) setProjects(prRes.data.map(mapProject));
                if (npRes.data) setNptel(npRes.data.map(mapNptel));
                if (hlRes.data) setHighlights(hlRes.data.map(mapHighlight));
                if (fsRes.data) setFestSubEvents(fsRes.data.map(mapFestSubEvent));
                if (fgRes.data) {
                    const map: Record<string, string[]> = {};
                    fgRes.data.forEach((row: { id: string; gallery: string[] }) => { map[row.id] = row.gallery; });
                    setFestGalleries(prev => ({ ...prev, ...map }));
                }
                if (tpRes.data) setToppers(tpRes.data.map(mapTopper));
                if (daRes.data) setDomainAwards(daRes.data.map(mapDomainAward));
                if (hcRes.data) setHomeConfig(hcRes.data as unknown as HomeConfig);

                // Persist fresh cache for 0ms initial load on subsequent sessions
                if (typeof window !== 'undefined') {
                    try {
                        window.localStorage.setItem(CACHE_KEY, JSON.stringify({
                            events: evRes.data?.map(mapEvent),
                            team: tmRes.data?.map(mapTeam),
                            staff: stRes.data?.map(mapStaff),
                            resources: rsRes.data?.map(mapResource),
                            projects: prRes.data?.map(mapProject),
                            nptel: npRes.data?.map(mapNptel),
                            highlights: hlRes.data?.map(mapHighlight),
                            festSubEvents: fsRes.data?.map(mapFestSubEvent),
                            toppers: tpRes.data?.map(mapTopper),
                            domainAwards: daRes.data?.map(mapDomainAward),
                            homeConfig: hcRes.data
                        }));
                    } catch {
                        // LocalStorage quota or restricted
                    }
                }
            } catch (err: unknown) {
                console.error('Supabase Live Refresh Error:', err);
            } finally {
                inFlightRefreshPromise = null;
            }
        })();

        return inFlightRefreshPromise;
    }, []);

    // Setup Realtime WebSocket Stream, Cross-Tab Broadcast, and Instant Hydration
    useEffect(() => {
        let isMounted = true;

        // Async initializer: reads local cache and fetches live Supabase data
        const init = async () => {
            if (typeof window !== 'undefined') {
                try {
                    const raw = window.localStorage.getItem(CACHE_KEY);
                    if (raw && isMounted) {
                        const cached = JSON.parse(raw);
                        if (Array.isArray(cached.events) && cached.events.length > 0) setEvents(cached.events);
                        if (Array.isArray(cached.team) && cached.team.length > 0) setTeam(cached.team);
                        if (Array.isArray(cached.staff) && cached.staff.length > 0) setStaff(cached.staff);
                        if (Array.isArray(cached.resources) && cached.resources.length > 0) setResources(cached.resources);
                        if (Array.isArray(cached.projects) && cached.projects.length > 0) setProjects(cached.projects);
                        if (Array.isArray(cached.nptel) && cached.nptel.length > 0) setNptel(cached.nptel);
                        if (Array.isArray(cached.highlights) && cached.highlights.length > 0) setHighlights(cached.highlights);
                        if (Array.isArray(cached.festSubEvents) && cached.festSubEvents.length > 0) setFestSubEvents(cached.festSubEvents);
                        if (cached.festGalleries) setFestGalleries(cached.festGalleries);
                        if (Array.isArray(cached.toppers) && cached.toppers.length > 0) setToppers(cached.toppers);
                        if (Array.isArray(cached.domainAwards) && cached.domainAwards.length > 0) setDomainAwards(cached.domainAwards);
                        if (cached.homeConfig) setHomeConfig(cached.homeConfig);
                        setLoading(false);
                    }
                } catch {
                    // Ignore cache read failures
                }
            }

            if (!isSupabaseConfigured || !supabase) {
                if (isMounted) setLoading(false);
                return;
            }

            await refreshContent();
            if (isMounted) setLoading(false);
        };

        // Queue in microtask to prevent cascading synchronous render during effect mounting
        queueMicrotask(() => {
            init();
        });

        // Cross-Tab Message Handlers
        const handleSyncMessage = (msg: SyncMessage) => {
            if (!msg) return;
            if (msg.type === 'SYNC_REFRESH') {
                refreshContent();
            } else if (msg.type === 'PATCH') {
                applyRealtimePatch(
                    msg.table,
                    msg.eventType,
                    msg.item,
                    msg.id ? { id: msg.id } : undefined
                );
            } else if (msg.type === 'SET_STATE') {
                applySetState(msg.table, msg.data);
            }
        };

        let bc: BroadcastChannel | null = null;
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            bc = new BroadcastChannel('shaids-live-sync');
            bc.onmessage = (event) => {
                handleSyncMessage(event.data);
            };
        }

        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'shaids_live_signal' && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    handleSyncMessage(parsed);
                } catch {
                    // Ignore malformed storage events
                }
            }
        };
        window.addEventListener('storage', handleStorage);

        // Supabase Realtime WebSocket Connection: Ultra-fast ~20ms push updates directly from Postgres
        let channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
        if (isSupabaseConfigured && supabase) {
            channel = supabase
                .channel('shaids-realtime-ultra')
                .on(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    'postgres_changes' as any,
                    { event: '*', schema: 'public' },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (payload: any) => {
                        applyRealtimePatch(
                            payload.table,
                            payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
                            payload.new,
                            payload.old
                        );
                        // Forward to other tabs for zero-network cross-tab parity
                        broadcastSync({
                            type: 'PATCH',
                            table: payload.table,
                            eventType: payload.eventType,
                            item: payload.new,
                            id: payload.old?.id || payload.new?.id
                        });
                        // Non-blocking targeted single-table consistency check
                        scheduleSingleTableRefresh(payload.table);
                    }
                )
                .subscribe();
        }

        // Adaptive Heartbeat & Instant Tab Focus Revalidation
        // Only polls when window is active & visible (saves 100% CPU & battery when in background)
        let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
        let lastCheckTime = Date.now();

        const triggerSmartCheck = () => {
            if (typeof document !== 'undefined' && document.hidden) return;
            const now = Date.now();
            if (now - lastCheckTime > 3000) {
                lastCheckTime = now;
                refreshContent();
            }
        };

        const handleVisibilityChange = () => {
            if (typeof document !== 'undefined' && !document.hidden) {
                triggerSmartCheck();
                if (!heartbeatInterval) {
                    heartbeatInterval = setInterval(triggerSmartCheck, 5000);
                }
            } else {
                if (heartbeatInterval) {
                    clearInterval(heartbeatInterval);
                    heartbeatInterval = null;
                }
            }
        };

        if (typeof document !== 'undefined' && !document.hidden) {
            heartbeatInterval = setInterval(triggerSmartCheck, 5000);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', triggerSmartCheck);
        window.addEventListener('online', triggerSmartCheck);

        return () => {
            isMounted = false;
            if (bc) bc.close();
            window.removeEventListener('storage', handleStorage);
            if (channel && supabase) supabase.removeChannel(channel);
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', triggerSmartCheck);
            window.removeEventListener('online', triggerSmartCheck);
        };
    }, [refreshContent, applyRealtimePatch, applySetState, broadcastSync, scheduleSingleTableRefresh]);

    // --- ULTRA-FAST OPTIMISTIC MUTATION OPERATIONS ---

    // EVENTS
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

            const eventToSave: EventItem = { ...event, id: validId, academicYear: event.academicYear || '2026-27' };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setEvents(prev => existingEvent ? prev.map(e => e.id === validId ? eventToSave : e) : [eventToSave, ...prev]);
            broadcastSync({ type: 'PATCH', table: 'events', eventType: existingEvent ? 'UPDATE' : 'INSERT', item: eventToSave });

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
                refreshSingleTable('events');
                return;
            }

            if (data && data[0]) {
                const saved = mapEvent(data[0]);
                setEvents(prev => prev.map(e => e.id === saved.id ? saved : e));
            }
            toast.success('Event saved live!');
            scheduleSingleTableRefresh('events');
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setEvents(prev => prev.filter(e => e.id !== id));
            broadcastSync({ type: 'PATCH', table: 'events', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
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
                refreshSingleTable('events');
                return;
            }

            toast.success('Event deleted live!');
            scheduleSingleTableRefresh('events');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete event';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // TEAM
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

            const memberToSave: TeamMember = { ...member, id: validId, academicYear: member.academicYear || '2026-27' };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setTeam(prev => existingMember ? prev.map(m => m.id === validId ? memberToSave : m) : [...prev, memberToSave]);
            broadcastSync({ type: 'PATCH', table: 'team', eventType: existingMember ? 'UPDATE' : 'INSERT', item: memberToSave });

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
                refreshSingleTable('team');
                return;
            }

            if (data && data[0]) {
                const saved = mapTeam(data[0]);
                setTeam(prev => prev.map(m => m.id === saved.id ? saved : m));
            }
            toast.success('Team member saved live!');
            scheduleSingleTableRefresh('team');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save team member';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteTeamMember = async (id: string) => {
        try {
            const target = team.find(m => m.id === id);
            if (target?.image_url) deleteMediaFile(target.image_url);

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setTeam(prev => prev.filter(m => m.id !== id));
            broadcastSync({ type: 'PATCH', table: 'team', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
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
                refreshSingleTable('team');
                return;
            }

            toast.success('Team member deleted live!');
            scheduleSingleTableRefresh('team');
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setTeam(updated);
            broadcastSync({ type: 'SET_STATE', table: 'team', data: updated });

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
                    refreshSingleTable('team');
                    return;
                }
                scheduleSingleTableRefresh('team');
            }
            toast.success('Team order updated and synced live!');
        } catch (err: unknown) {
            console.error('Reorder Team Error:', err);
        }
    };

    // STAFF
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setStaff(prev => existingMember ? prev.map(m => m.id === validId ? memberToSave : m) : [...prev, memberToSave]);
            broadcastSync({ type: 'PATCH', table: 'staff', eventType: existingMember ? 'UPDATE' : 'INSERT', item: memberToSave });

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
                refreshSingleTable('staff');
                return;
            }

            if (data && data[0]) {
                const saved = mapStaff(data[0]);
                setStaff(prev => prev.map(m => m.id === saved.id ? saved : m));
            }
            toast.success('Faculty member saved live!');
            scheduleSingleTableRefresh('staff');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save faculty member';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteStaffMember = async (id: string) => {
        try {
            const target = staff.find(m => m.id === id);
            if (target?.image_url) deleteMediaFile(target.image_url);

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setStaff(prev => prev.filter(s => s.id !== id));
            broadcastSync({ type: 'PATCH', table: 'staff', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
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
                refreshSingleTable('staff');
                return;
            }

            toast.success('Faculty member deleted live!');
            scheduleSingleTableRefresh('staff');
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setStaff(updated);
            broadcastSync({ type: 'SET_STATE', table: 'staff', data: updated });

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
                    refreshSingleTable('staff');
                    return;
                }
                scheduleSingleTableRefresh('staff');
            }
            toast.success('Faculty order updated and synced live!');
        } catch (err: unknown) {
            console.error('Reorder Staff Error:', err);
        }
    };

    // RESOURCES
    const saveResource = async (resource: ResourceItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existingResource = resources.find(r => r.id === resource.id);
            const validId = resource.id && isValidUUID(resource.id) ? resource.id : (existingResource ? existingResource.id : generateUUID());

            const resourceToSave: ResourceItem = { ...resource, id: validId };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setResources(prev => existingResource ? prev.map(r => r.id === validId ? resourceToSave : r) : [resourceToSave, ...prev]);
            broadcastSync({ type: 'PATCH', table: 'resources', eventType: existingResource ? 'UPDATE' : 'INSERT', item: resourceToSave });

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
                refreshSingleTable('resources');
                return;
            }

            if (data && data[0]) {
                const saved = mapResource(data[0]);
                setResources(prev => prev.map(r => r.id === saved.id ? saved : r));
            }
            toast.success('Resource saved live!');
            scheduleSingleTableRefresh('resources');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save resource';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteResource = async (id: string) => {
        try {
            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setResources(prev => prev.filter(r => r.id !== id));
            broadcastSync({ type: 'PATCH', table: 'resources', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
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
                refreshSingleTable('resources');
                return;
            }

            toast.success('Resource deleted live!');
            scheduleSingleTableRefresh('resources');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete resource';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // PROJECTS
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

            const toSave: ProjectItem = { ...project, id: validId, academicYear: project.academicYear || '2026-27' };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setProjects(prev => existing ? prev.map(p => p.id === validId ? toSave : p) : [toSave, ...prev]);
            broadcastSync({ type: 'PATCH', table: 'projects', eventType: existing ? 'UPDATE' : 'INSERT', item: toSave });

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
                refreshSingleTable('projects');
                return;
            }

            if (data && data[0]) {
                const saved = mapProject(data[0]);
                setProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
            }
            toast.success('Project saved live!');
            scheduleSingleTableRefresh('projects');
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setProjects(prev => prev.filter(p => p.id !== id));
            broadcastSync({ type: 'PATCH', table: 'projects', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
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
                refreshSingleTable('projects');
                return;
            }

            toast.success('Project deleted live!');
            scheduleSingleTableRefresh('projects');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete project';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // NPTEL
    const saveNptel = async (item: NptelItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = nptel.find(n => n.id === item.id);
            const validId = item.id && isValidUUID(item.id) ? item.id : (existing ? existing.id : generateUUID());
            const toSave: NptelItem = { ...item, id: validId, academicYear: item.academicYear || '2026-27' };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setNptel(prev => existing ? prev.map(n => n.id === validId ? toSave : n) : [toSave, ...prev]);
            broadcastSync({ type: 'PATCH', table: 'nptel', eventType: existing ? 'UPDATE' : 'INSERT', item: toSave });

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
                refreshSingleTable('nptel');
                return;
            }

            if (data && data[0]) {
                const saved = mapNptel(data[0]);
                setNptel(prev => prev.map(n => n.id === saved.id ? saved : n));
            }
            toast.success('NPTEL record saved live!');
            scheduleSingleTableRefresh('nptel');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save NPTEL record';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteNptel = async (id: string) => {
        try {
            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setNptel(prev => prev.filter(n => n.id !== id));
            broadcastSync({ type: 'PATCH', table: 'nptel', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
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
                refreshSingleTable('nptel');
                return;
            }

            toast.success('NPTEL record deleted live!');
            scheduleSingleTableRefresh('nptel');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete NPTEL record';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // HIGHLIGHTS
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

            const toSave: HighlightItem = { ...item, id: validId, academicYear: item.academicYear || '2026-27' };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setHighlights(prev => existing ? prev.map(h => h.id === validId ? toSave : h) : [toSave, ...prev]);
            broadcastSync({ type: 'PATCH', table: 'highlights', eventType: existing ? 'UPDATE' : 'INSERT', item: toSave });

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
                refreshSingleTable('highlights');
                return;
            }

            if (data && data[0]) {
                const saved = mapHighlight(data[0]);
                setHighlights(prev => prev.map(h => h.id === saved.id ? saved : h));
            }
            toast.success('Highlight saved live!');
            scheduleSingleTableRefresh('highlights');
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setHighlights(prev => prev.filter(h => h.id !== id));
            broadcastSync({ type: 'PATCH', table: 'highlights', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
                toast.success('Highlight deleted!');
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
                refreshSingleTable('highlights');
                return;
            }

            toast.success('Highlight deleted live!');
            scheduleSingleTableRefresh('highlights');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete highlight';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // FEST SUB EVENTS
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

            const toSave: FestSubEvent = { ...subEvent, id: validId, academicYear: subEvent.academicYear || '2026-27' };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setFestSubEvents(prev => existing ? prev.map(f => f.id === validId ? toSave : f) : [toSave, ...prev]);
            broadcastSync({ type: 'PATCH', table: 'fest_sub_events', eventType: existing ? 'UPDATE' : 'INSERT', item: toSave });

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
                refreshSingleTable('fest_sub_events');
                return;
            }

            if (data && data[0]) {
                const saved = mapFestSubEvent(data[0]);
                setFestSubEvents(prev => prev.map(f => f.id === saved.id ? saved : f));
            }
            toast.success('Fest sub-event saved live!');
            scheduleSingleTableRefresh('fest_sub_events');
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setFestSubEvents(prev => prev.filter(f => f.id !== id));
            broadcastSync({ type: 'PATCH', table: 'fest_sub_events', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
                toast.success('Fest sub-event deleted!');
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
                refreshSingleTable('fest_sub_events');
                return;
            }

            toast.success('Fest sub-event deleted live!');
            scheduleSingleTableRefresh('fest_sub_events');
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setFestGalleries(prev => ({ ...prev, [festId]: gallery }));
            broadcastSync({ type: 'PATCH', table: 'fest_galleries', eventType: 'UPDATE', item: { id: festId, gallery } });

            const { error } = await supabase.from('fest_galleries').upsert({
                id: festId,
                gallery
            });

            if (error) {
                console.error('Supabase Fest Gallery Save Error:', error);
                toast.error(`Supabase DB Error: ${error.message}`);
                refreshSingleTable('fest_galleries');
                return;
            }

            toast.success(`${festId.toUpperCase()} fest gallery updated live!`);
            scheduleSingleTableRefresh('fest_galleries');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save fest gallery';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // TOPPERS
    const saveTopper = async (item: TopperItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = toppers.find(t => t.id === item.id);
            const validId = item.id && isValidUUID(item.id) ? item.id : (existing ? existing.id : generateUUID());
            const toSave: TopperItem = { ...item, id: validId };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setToppers(prev => existing ? prev.map(t => t.id === validId ? toSave : t) : [...prev, toSave]);
            broadcastSync({ type: 'PATCH', table: 'toppers', eventType: existing ? 'UPDATE' : 'INSERT', item: toSave });

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
                refreshSingleTable('toppers');
                return;
            }

            if (data && data[0]) {
                const saved = mapTopper(data[0]);
                setToppers(prev => prev.map(t => t.id === saved.id ? saved : t));
            }
            toast.success('Academic topper saved live!');
            scheduleSingleTableRefresh('toppers');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save topper record';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteTopper = async (id: string) => {
        try {
            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setToppers(prev => prev.filter(t => t.id !== id));
            broadcastSync({ type: 'PATCH', table: 'toppers', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
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
                refreshSingleTable('toppers');
                return;
            }

            toast.success('Topper record deleted live!');
            scheduleSingleTableRefresh('toppers');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete topper record';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // DOMAIN AWARDS
    const saveDomainAward = async (item: DomainAwardItem) => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                toast.error('Live Supabase Database is not configured!');
                return;
            }

            const existing = domainAwards.find(d => d.id === item.id);
            const validId = item.id && isValidUUID(item.id) ? item.id : (existing ? existing.id : generateUUID());
            const toSave: DomainAwardItem = { ...item, id: validId };

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setDomainAwards(prev => existing ? prev.map(d => d.id === validId ? toSave : d) : [...prev, toSave]);
            broadcastSync({ type: 'PATCH', table: 'domain_awards', eventType: existing ? 'UPDATE' : 'INSERT', item: toSave });

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
                refreshSingleTable('domain_awards');
                return;
            }

            if (data && data[0]) {
                const saved = mapDomainAward(data[0]);
                setDomainAwards(prev => prev.map(d => d.id === saved.id ? saved : d));
            }
            toast.success('Domain award saved live!');
            scheduleSingleTableRefresh('domain_awards');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save domain award';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    const deleteDomainAward = async (id: string) => {
        try {
            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setDomainAwards(prev => prev.filter(d => d.id !== id));
            broadcastSync({ type: 'PATCH', table: 'domain_awards', eventType: 'DELETE', id });

            if (!isValidUUID(id)) {
                toast.success('Domain award deleted!');
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
                refreshSingleTable('domain_awards');
                return;
            }

            toast.success('Domain award deleted live!');
            scheduleSingleTableRefresh('domain_awards');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete domain award';
            toast.error(`Live DB Error: ${msg}`);
        }
    };

    // HOME CONFIG
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

            // 1. Instant 0ms Optimistic Update & Cross-Tab Broadcast
            setHomeConfig(config);
            broadcastSync({ type: 'SET_STATE', table: 'home_config', data: config });

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
                refreshSingleTable('home_config');
                return;
            }

            if (data && data[0]) {
                setHomeConfig(data[0] as unknown as HomeConfig);
            }
            toast.success('Homepage details updated live!');
            scheduleSingleTableRefresh('home_config');
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
