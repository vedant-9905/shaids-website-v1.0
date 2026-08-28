'use client';

import React, { useState } from 'react';
import {
    useContent, EventItem, TeamMember, StaffMember, ResourceItem,
    ProjectItem, NptelItem, HighlightItem, FestSubEvent, isEventCompleted, HomeConfig,
    TopperItem, DomainAwardItem, AcademicYear
} from '@/context/content-context';
import { uploadMediaFile, generateUUID } from '@/lib/supabase';
import {
    Calendar, Users, GraduationCap, FileText, Plus, Trash2, Edit3, X, Sparkles, Info,
    Image as ImageIcon, Award, Trophy, Upload, Save, Star, ChevronUp, ChevronDown, GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import { ImageCropperModal } from '@/components/ui/image-cropper-modal';

export default function AdminDashboardPage() {
    const {
        events, team, staff, resources, projects, nptel, highlights, festSubEvents, festGalleries, toppers, domainAwards, homeConfig, loading,
        saveEvent, deleteEvent, saveTeamMember, deleteTeamMember, reorderTeamMembers,
        saveStaffMember, deleteStaffMember, reorderStaffMembers, saveResource, deleteResource,
        saveProject, deleteProject, saveNptel, deleteNptel,
        saveHighlight, deleteHighlight, saveFestSubEvent, deleteFestSubEvent, saveFestGallery,
        saveTopper, deleteTopper, saveDomainAward, deleteDomainAward, updateHomeConfig
    } = useContent();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'fests' | 'achievements' | 'team' | 'staff' | 'resources'>('overview');

    // Home Config Local Form State
    const [localHomeConfig, setLocalHomeConfig] = useState<HomeConfig | null>(null);

    // Sync homeConfig state when loaded
    React.useEffect(() => {
        if (homeConfig && !localHomeConfig) {
            setLocalHomeConfig(homeConfig);
        }
    }, [homeConfig, localHomeConfig]);

    // Modals state
    const [eventModal, setEventModal] = useState<(Partial<EventItem> & { rawGallery?: string }) | null>(null);
    const [teamModal, setTeamModal] = useState<(Partial<TeamMember> & { rawSkills?: string; rawAchievements?: string }) | null>(null);
    const [staffModal, setStaffModal] = useState<(Partial<StaffMember> & { rawExpertise?: string }) | null>(null);
    const [resourceModal, setResourceModal] = useState<(Partial<ResourceItem> & { rawTags?: string }) | null>(null);
    const [projectModal, setProjectModal] = useState<(Partial<ProjectItem> & { rawTeam?: string; rawTechStack?: string }) | null>(null);
    const [nptelModal, setNptelModal] = useState<Partial<NptelItem> | null>(null);
    const [highlightModal, setHighlightModal] = useState<Partial<HighlightItem> | null>(null);
    const [festModal, setFestModal] = useState<Partial<FestSubEvent> | null>(null);
    const [topperModal, setTopperModal] = useState<Partial<TopperItem> | null>(null);
    const [domainAwardModal, setDomainAwardModal] = useState<Partial<DomainAwardItem> | null>(null);

    // Selected Fest Gallery for Carousel Manager
    const [selectedFestForGallery, setSelectedFestForGallery] = useState<'vectors' | 'kurukshetra' | 'rhythms'>('vectors');
    const [newGalleryPhotoUrl, setNewGalleryPhotoUrl] = useState('');

    // Image Cropper State
    const [cropperState, setCropperState] = useState<{
        file: File;
        aspectRatio: number;
        onSuccess: (url: string) => void;
    } | null>(null);

    // Current Academic Year (2026-27) Student Committee Members
    const currentYearTeam = team.filter(m => !m.academicYear || m.academicYear === '2026-27');

    // Current Academic Year Events (Excluding Annual Flagship Fests)
    const currentYearStandardEvents = events.filter(e => {
        const isCurrentYear = !e.academicYear || e.academicYear === '2026-27';
        const isFlagship = e.category === 'Flagship Fest' || e.category === 'Fest' || e.type === 'Fest' || e.type === 'Flagship';
        return isCurrentYear && !isFlagship;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
                Loading Dashboard Data...
            </div>
        );
    }

    const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
        setUploading(true);
        try {
            const url = await uploadMediaFile(file);
            onSuccess(url);
            toast.success('File uploaded successfully!');
        } catch (err: unknown) {
            toast.error((err as Error).message || 'File upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleBatchFileUpload = async (files: FileList, onSuccess: (urls: string[]) => void) => {
        setUploading(true);
        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const url = await uploadMediaFile(files[i]);
                uploadedUrls.push(url);
            }
            onSuccess(uploadedUrls);
            toast.success(`${uploadedUrls.length} photos uploaded!`);
        } catch (err: unknown) {
            toast.error((err as Error).message || 'Batch upload failed');
        } finally {
            setUploading(false);
        }
    };

    const triggerImageCrop = (file: File, aspectRatio: number, onSuccess: (url: string) => void) => {
        setCropperState({ file, aspectRatio, onSuccess });
    };

    // --- HOME CONFIG SAVE ---
    const handleSaveHomeConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!localHomeConfig) return;
        await updateHomeConfig(localHomeConfig);
        toast.success('Homepage configuration and showcase photos updated successfully!');
    };

    // --- FEST CAROUSEL GALLERY ADD / REMOVE ---
    const handleBatchAddFestGalleryPhotos = (urls: string[]) => {
        if (!urls || urls.length === 0) return;
        const currentList = festGalleries[selectedFestForGallery] || [];
        saveFestGallery(selectedFestForGallery, [...currentList, ...urls]);
    };

    const handleAddFestGalleryPhoto = (url: string) => {
        if (!url) return;
        const currentList = festGalleries[selectedFestForGallery] || [];
        saveFestGallery(selectedFestForGallery, [...currentList, url]);
        setNewGalleryPhotoUrl('');
    };

    const handleRemoveFestGalleryPhoto = (indexToRemove: number) => {
        const currentList = festGalleries[selectedFestForGallery] || [];
        const updated = currentList.filter((_, idx) => idx !== indexToRemove);
        saveFestGallery(selectedFestForGallery, updated);
    };

    // --- EVENT SUBMIT ---
    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventModal?.title || !eventModal?.date || !eventModal?.location) {
            toast.error('Title, Date, and Location are required!');
            return;
        }

        const galleryImgs = eventModal.gallery_images || [];

        const newEvent: EventItem = {
            id: eventModal.id || generateUUID(),
            title: eventModal.title,
            description: eventModal.description || '',
            long_description: eventModal.long_description || '',
            date: eventModal.date,
            end_date: eventModal.end_date || '',
            time: eventModal.time || '',
            location: eventModal.location,
            image_url: eventModal.image_url || '',
            type: eventModal.type || 'Workshop',
            category: eventModal.category || 'Technical Event',
            organizer: eventModal.organizer || 'SHAIDS Team',
            brochure_url: eventModal.brochure_url || '',
            registration_url: eventModal.registration_url || '',
            has_registration: eventModal.has_registration ?? true,
            is_past: eventModal.is_past ?? false,
            gallery_images: galleryImgs,
            academicYear: eventModal.academicYear || '2026-27'
        };

        await saveEvent(newEvent);
        setEventModal(null);
    };

    // --- TEAM SUBMIT ---
    const handleSaveTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamModal?.name || !teamModal?.role) {
            toast.error('Name and Role are required!');
            return;
        }

        const rawSkillsArr = typeof teamModal.rawSkills === 'string'
            ? teamModal.rawSkills.split(',').map(s => s.trim()).filter(Boolean)
            : teamModal.skills || [];

        const rawAchieveArr = typeof teamModal.rawAchievements === 'string'
            ? teamModal.rawAchievements.split(',').map(s => s.trim()).filter(Boolean)
            : teamModal.achievements || [];

        const member: TeamMember = {
            id: teamModal.id || generateUUID(),
            name: teamModal.name,
            role: teamModal.role,
            category: teamModal.category || 'Core Team',
            image_url: teamModal.image_url || '',
            github: teamModal.github || '',
            linkedin: teamModal.linkedin || '',
            instagram: teamModal.instagram || '',
            email: teamModal.email || '',
            bio: teamModal.bio || '',
            graduation_year: teamModal.graduation_year || '2026',
            skills: rawSkillsArr,
            achievements: rawAchieveArr,
            academicYear: teamModal.academicYear || '2026-27'
        };

        await saveTeamMember(member);
        setTeamModal(null);
    };

    // --- STAFF SUBMIT ---
    const handleSaveStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!staffModal?.name || !staffModal?.designation) {
            toast.error('Name and Designation are required!');
            return;
        }

        const rawExp = typeof staffModal.rawExpertise === 'string'
            ? staffModal.rawExpertise.split(',').map(s => s.trim()).filter(Boolean)
            : staffModal.expertise || [];

        const member: StaffMember = {
            id: staffModal.id || generateUUID(),
            name: staffModal.name,
            designation: staffModal.designation,
            department: staffModal.department || 'Artificial Intelligence & Data Science',
            qualification: staffModal.qualification || '',
            expertise: rawExp,
            email: staffModal.email || '',
            image_url: staffModal.image_url || '',
            bio: staffModal.bio || '',
        };

        await saveStaffMember(member);
        setStaffModal(null);
    };

    const handleMoveTeamMember = async (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= team.length) return;
        const reordered = [...team];
        const [moved] = reordered.splice(index, 1);
        reordered.splice(newIndex, 0, moved);
        await reorderTeamMembers(reordered);
    };

    const handleMoveStaffMember = async (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= staff.length) return;
        const reordered = [...staff];
        const [moved] = reordered.splice(index, 1);
        reordered.splice(newIndex, 0, moved);
        await reorderStaffMembers(reordered);
    };

    const handleReorderTeam = async (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= team.length || toIndex >= team.length) return;
        const reordered = [...team];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        await reorderTeamMembers(reordered);
    };

    const handleReorderStaff = async (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= staff.length || toIndex >= staff.length) return;
        const reordered = [...staff];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        await reorderStaffMembers(reordered);
    };

    // --- RESOURCE SUBMIT ---
    const handleSaveResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resourceModal?.title || !resourceModal?.link) {
            toast.error('Title and Link are required!');
            return;
        }

        const rawTagsArr = typeof resourceModal.rawTags === 'string'
            ? resourceModal.rawTags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : resourceModal.tags || [];

        const item: ResourceItem = {
            id: resourceModal.id || generateUUID(),
            title: resourceModal.title,
            description: resourceModal.description || '',
            category: resourceModal.category || 'Notes',
            link: resourceModal.link,
            tags: rawTagsArr,
            author: resourceModal.author || 'SHAIDS Team',
        };

        await saveResource(item);
        setResourceModal(null);
    };

    // --- PROJECT SUBMIT ---
    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectModal?.title || !projectModal?.abstract) {
            toast.error('Title and Abstract are required!');
            return;
        }

        const rawTeamArr = typeof projectModal.rawTeam === 'string'
            ? projectModal.rawTeam.split(',').map(t => t.trim()).filter(Boolean)
            : projectModal.team || [];

        const rawTechArr = typeof projectModal.rawTechStack === 'string'
            ? projectModal.rawTechStack.split(',').map(t => t.trim()).filter(Boolean)
            : projectModal.techStack || [];

        const item: ProjectItem = {
            id: projectModal.id || generateUUID(),
            title: projectModal.title,
            category: projectModal.category || 'Healthcare & Deep Learning',
            abstract: projectModal.abstract,
            team: rawTeamArr,
            advisor: projectModal.advisor || 'Prof. Suriya Kala A. V.',
            techStack: rawTechArr,
            image: projectModal.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
            gallery: projectModal.gallery || [],
            github: projectModal.github || '',
            demo: projectModal.demo || '',
            academicYear: projectModal.academicYear || '2026-27'
        };

        await saveProject(item);
        setProjectModal(null);
    };

    // --- NPTEL SUBMIT ---
    const handleSaveNptel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nptelModal?.name || !nptelModal?.course) {
            toast.error('Name and Course are required!');
            return;
        }

        const item: NptelItem = {
            id: nptelModal.id || generateUUID(),
            name: nptelModal.name,
            course: nptelModal.course,
            cert: nptelModal.cert || 'NPTEL Elite',
            score: nptelModal.score || '85%',
            year: nptelModal.year || 'TE AI & DS',
            isFaculty: nptelModal.isFaculty ?? false,
            academicYear: nptelModal.academicYear || '2026-27'
        };

        await saveNptel(item);
        setNptelModal(null);
    };

    // --- HIGHLIGHT SUBMIT ---
    const handleSaveHighlight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!highlightModal?.title || !highlightModal?.description) {
            toast.error('Title and Description are required!');
            return;
        }

        const item: HighlightItem = {
            id: highlightModal.id || generateUUID(),
            title: highlightModal.title,
            category: highlightModal.category || 'National Level Hackathon',
            team: highlightModal.team || 'Department Team',
            location: highlightModal.location || 'National Center',
            date: highlightModal.date || '2026',
            description: highlightModal.description,
            achievement: highlightModal.achievement || '',
            image: highlightModal.image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80',
            gallery: highlightModal.gallery || [],
            academicYear: highlightModal.academicYear || '2026-27'
        };

        await saveHighlight(item);
        setHighlightModal(null);
    };

    // --- FEST SUB EVENT SUBMIT ---
    const handleSaveFestSubEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!festModal?.title || !festModal?.festId) {
            toast.error('Fest category and Sub-Event Title are required!');
            return;
        }

        const item: FestSubEvent = {
            id: festModal.id || generateUUID(),
            festId: festModal.festId || 'vectors',
            title: festModal.title,
            organizer: festModal.organizer || 'SHAIDS Committee',
            winner: festModal.winner || 'TBD',
            runnerUp: festModal.runnerUp || 'TBD',
            desc: festModal.desc || '',
            detailedInfo: festModal.detailedInfo || '',
            image: festModal.image || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80',
            eventGallery: festModal.eventGallery || [],
            academicYear: festModal.academicYear || '2026-27'
        };

        await saveFestSubEvent(item);
        setFestModal(null);
    };

    // --- TOPPER SUBMIT ---
    const handleSaveTopper = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topperModal?.name || !topperModal?.sgpa) {
            toast.error('Student Name and SGPA are required!');
            return;
        }

        const item: TopperItem = {
            id: topperModal.id || generateUUID(),
            semType: topperModal.semType || 'Even',
            yearBatch: topperModal.yearBatch || 'SE',
            rank: topperModal.rank || 'Rank 1',
            name: topperModal.name,
            sgpa: topperModal.sgpa
        };

        await saveTopper(item);
        setTopperModal(null);
    };

    // --- DOMAIN AWARD SUBMIT ---
    const handleSaveDomainAward = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domainAwardModal?.title || !domainAwardModal?.recipient) {
            toast.error('Award Title and Recipient Name are required!');
            return;
        }

        const item: DomainAwardItem = {
            id: domainAwardModal.id || generateUUID(),
            title: domainAwardModal.title,
            recipient: domainAwardModal.recipient,
            domain: domainAwardModal.domain || 'AI & Data Innovation'
        };

        await saveDomainAward(item);
        setDomainAwardModal(null);
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                    <Info size={15} /> Overview &amp; Home Gallery
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'events' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                    <Calendar size={15} /> Events ({currentYearStandardEvents.length})
                </button>
                <button
                    onClick={() => setActiveTab('fests')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'fests' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                    <Sparkles size={15} /> College Fests &amp; Sub-Events ({festSubEvents.length})
                </button>
                <button
                    onClick={() => setActiveTab('achievements')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'achievements' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                    <Award size={15} /> Achievements &amp; Projects
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'team' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                    <Users size={15} /> Student Committee ({currentYearTeam.length})
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'staff' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                    <GraduationCap size={15} /> Faculty ({staff.length})
                </button>
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'resources' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                    <FileText size={15} /> Resources ({resources.length})
                </button>
            </div>

            {/* TAB 1: OVERVIEW & HOMEPAGE SHOWCASE IMAGES */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Summary Counters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                            <div className="text-xs text-muted-foreground font-bold uppercase">Total Events</div>
                            <div className="text-3xl font-black mt-2 text-primary">{currentYearStandardEvents.length}</div>
                        </div>
                        <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                            <div className="text-xs text-muted-foreground font-bold uppercase">Student Committee</div>
                            <div className="text-3xl font-black mt-2 text-secondary">{currentYearTeam.length}</div>
                        </div>
                        <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                            <div className="text-xs text-muted-foreground font-bold uppercase">Faculty &amp; Staff</div>
                            <div className="text-3xl font-black mt-2 text-emerald-400">{staff.length}</div>
                        </div>
                        <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                            <div className="text-xs text-muted-foreground font-bold uppercase">Learning Resources</div>
                            <div className="text-3xl font-black mt-2 text-sky-400">{resources.length}</div>
                        </div>
                    </div>

                    {/* HOMEPAGE CARD PHOTOS EDITOR FORM */}
                    {localHomeConfig && (
                        <form onSubmit={handleSaveHomeConfig} className="p-6 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <ImageIcon className="text-primary" size={20} />
                                        Home Page Photo Changing Manager
                                    </h2>
                                    <p className="text-xs text-muted-foreground">Upload and change showcase card images for Events, Student Committee, Resources, and Faculty sections on the landing page.</p>
                                </div>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold gap-2">
                                    <Save size={16} /> Save Photo Changes
                                </Button>
                            </div>

                            {/* Home Page Cards Showcase Images (Photo Changing Section) */}
                            <div className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Event Card Image */}
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                                        <label className="font-bold text-white block">Events Card Banner Photo</label>
                                        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                                            {localHomeConfig.image_events ? (
                                                <Image fill src={localHomeConfig.image_events} alt="Events Showcase" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Default Image</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={localHomeConfig.image_events || ''}
                                                onChange={(e) => setLocalHomeConfig({ ...localHomeConfig, image_events: e.target.value })}
                                                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]"
                                            />
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            triggerImageCrop(e.target.files[0], 16 / 9, (url) => setLocalHomeConfig({ ...localHomeConfig, image_events: url }));
                                                        }
                                                    }}
                                                />
                                                <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                                    <Upload size={13} /> Crop &amp; Upload
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Student Team Card Image */}
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                                        <label className="font-bold text-white block">Student Committee Showcase Photo</label>
                                        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                                            {localHomeConfig.image_team ? (
                                                <Image fill src={localHomeConfig.image_team} alt="Team Showcase" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Default Image</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={localHomeConfig.image_team || ''}
                                                onChange={(e) => setLocalHomeConfig({ ...localHomeConfig, image_team: e.target.value })}
                                                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]"
                                            />
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            triggerImageCrop(e.target.files[0], 16 / 9, (url) => setLocalHomeConfig({ ...localHomeConfig, image_team: url }));
                                                        }
                                                    }}
                                                />
                                                <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                                    <Upload size={13} /> Crop &amp; Upload
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Resources Card Image */}
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                                        <label className="font-bold text-white block">Resources Showcase Photo</label>
                                        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                                            {localHomeConfig.image_resources ? (
                                                <Image fill src={localHomeConfig.image_resources} alt="Resources Showcase" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Default Image</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={localHomeConfig.image_resources || ''}
                                                onChange={(e) => setLocalHomeConfig({ ...localHomeConfig, image_resources: e.target.value })}
                                                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]"
                                            />
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            triggerImageCrop(e.target.files[0], 16 / 9, (url) => setLocalHomeConfig({ ...localHomeConfig, image_resources: url }));
                                                        }
                                                    }}
                                                />
                                                <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                                    <Upload size={13} /> Crop &amp; Upload
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Faculty / Staff Card Image */}
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                                        <label className="font-bold text-white block">Faculty / Staff Showcase Photo</label>
                                        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                                            {localHomeConfig.image_staff ? (
                                                <Image fill src={localHomeConfig.image_staff} alt="Faculty Showcase" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Default Image</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={localHomeConfig.image_staff || ''}
                                                onChange={(e) => setLocalHomeConfig({ ...localHomeConfig, image_staff: e.target.value })}
                                                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]"
                                            />
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            triggerImageCrop(e.target.files[0], 16 / 9, (url) => setLocalHomeConfig({ ...localHomeConfig, image_staff: url }));
                                                        }
                                                    }}
                                                />
                                                <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                                    <Upload size={13} /> Crop &amp; Upload
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" variant="neon" className="rounded-xl font-bold gap-2">
                                    <Save size={16} /> Save Home Changes
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* TAB 2: EVENTS MANAGER */}
            {activeTab === 'events' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Events Management</h2>
                        <Button
                            variant="neon"
                            size="sm"
                            className="rounded-xl gap-2 font-bold"
                            onClick={() => setEventModal({ category: 'Technical Event', type: 'Workshop', has_registration: true, gallery_images: [] })}
                        >
                            <Plus size={16} /> Add Event
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((evt) => {
                            const completed = isEventCompleted(evt);
                            return (
                                <div key={evt.id} className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative">
                                            {evt.image_url ? (
                                                <Image fill src={evt.image_url} alt={evt.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Poster</div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                {evt.category || evt.type}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                                    {evt.academicYear || '2026-27'}
                                                </span>
                                                {completed ? (
                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                                                        Upcoming
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-base text-white">{evt.title}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{evt.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                        <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setEventModal(evt)}>
                                            <Edit3 size={14} /> Edit
                                        </Button>
                                        <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteEvent(evt.id)}>
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 3: COLLEGE ANNUAL FESTS MANAGER & ENDLESS CAROUSEL MANAGER */}
            {activeTab === 'fests' && (
                <div className="space-y-12">
                    {/* SECTION A: FEST SUB-EVENTS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">College Annual Fests &amp; Sub-Events</h2>
                                <p className="text-xs text-muted-foreground">Manage VECTORS (Tech Fest), KURUKSHETRA (Sports Fest), and RHYTHMS (Cultural Fest) sub-events and winners.</p>
                            </div>
                            <Button
                                variant="neon"
                                size="sm"
                                className="rounded-xl gap-2 font-bold"
                                onClick={() => setFestModal({ festId: 'vectors', eventGallery: [] })}
                            >
                                <Plus size={16} /> Add Fest Sub-Event
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {festSubEvents.map((evt) => (
                                <div key={evt.id} className="p-6 rounded-[2rem] border border-white/10 bg-white/5 space-y-4 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative">
                                            {evt.image ? (
                                                <Image fill src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Banner</div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                                                {evt.festId.toUpperCase()} Fest Sub-Event
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                                {evt.academicYear || '2026-27'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{evt.title}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{evt.desc}</p>
                                        
                                        <div className="p-3 rounded-xl bg-black/40 text-xs space-y-1">
                                            <div className="text-amber-400 font-bold">👑 Winner: {evt.winner}</div>
                                            <div className="text-muted-foreground font-medium">🥈 Runner-Up: {evt.runnerUp}</div>
                                            <div className="text-cyan-400 text-[11px] pt-1">👤 Organizers: {evt.organizer}</div>
                                        </div>

                                        {evt.eventGallery && evt.eventGallery.length > 0 && (
                                            <div className="text-[10px] text-muted-foreground font-bold">
                                                📷 {evt.eventGallery.length} Event Photos Attached
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                        <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setFestModal(evt)}>
                                            <Edit3 size={14} /> Edit Sub-Event
                                        </Button>
                                        <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteFestSubEvent(evt.id)}>
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION B: FEST ENDLESS GALLERY CAROUSEL MANAGER */}
                    <div className="space-y-6 pt-8 border-t border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <ImageIcon className="text-primary" size={20} />
                                    Fest Gallery Carousel Manager
                                </h2>
                                <p className="text-xs text-muted-foreground">Manage the photos displayed in the marquee carousel for VECTORS, KURUKSHETRA, and RHYTHMS fest pages.</p>
                            </div>

                            {/* Select Fest Tab */}
                            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start md:self-auto">
                                <button
                                    onClick={() => setSelectedFestForGallery('vectors')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedFestForGallery === 'vectors' ? 'bg-cyan-500 text-black shadow' : 'text-muted-foreground hover:text-white'}`}
                                >
                                    VECTORS
                                </button>
                                <button
                                    onClick={() => setSelectedFestForGallery('kurukshetra')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedFestForGallery === 'kurukshetra' ? 'bg-emerald-500 text-black shadow' : 'text-muted-foreground hover:text-white'}`}
                                >
                                    KURUKSHETRA
                                </button>
                                <button
                                    onClick={() => setSelectedFestForGallery('rhythms')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedFestForGallery === 'rhythms' ? 'bg-pink-500 text-black shadow' : 'text-muted-foreground hover:text-white'}`}
                                >
                                    RHYTHMS
                                </button>
                            </div>
                        </div>

                        {/* Add Photo Controls */}
                        <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4">
                            <div className="text-xs font-bold text-white">Add Photo to {selectedFestForGallery.toUpperCase()} Carousel</div>
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Paste Image URL or upload via button..."
                                    value={newGalleryPhotoUrl}
                                    onChange={(e) => setNewGalleryPhotoUrl(e.target.value)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs w-full"
                                />
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    handleBatchFileUpload(e.target.files, (urls) => handleBatchAddFestGalleryPhotos(urls));
                                                }
                                            }}
                                        />
                                        <div className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                                            <Upload size={14} /> Batch Upload Photos
                                        </div>
                                    </label>
                                    <Button
                                        onClick={() => handleAddFestGalleryPhoto(newGalleryPhotoUrl)}
                                        variant="neon"
                                        size="sm"
                                        className="rounded-xl font-bold gap-1 text-xs"
                                        disabled={!newGalleryPhotoUrl}
                                    >
                                        <Plus size={14} /> Add to Carousel
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Current Gallery Grid */}
                        <div className="space-y-3">
                            <div className="text-xs font-bold text-muted-foreground">Current Photos in {selectedFestForGallery.toUpperCase()} Carousel ({(festGalleries[selectedFestForGallery] || []).length})</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                {(festGalleries[selectedFestForGallery] || []).map((imgUrl, idx) => (
                                    <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 relative group bg-black/50">
                                        <Image fill src={imgUrl} alt={`Carousel ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => handleRemoveFestGalleryPhoto(idx)}
                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                            title="Delete photo from carousel"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: ACHIEVEMENTS & PROJECTS MANAGER */}
            {activeTab === 'achievements' && (
                <div className="space-y-10">
                    {/* Section A: Best Capstone Projects */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Sparkles className="text-cyan-400" size={20} />
                                    Best Capstone Projects
                                </h2>
                                <p className="text-xs text-muted-foreground">Manage project prototypes, abstracts, tech stacks, and photo galleries for `/about/achievements/projects`.</p>
                            </div>
                            <Button variant="neon" size="sm" className="rounded-xl gap-2 font-bold" onClick={() => setProjectModal({ gallery: [] })}>
                                <Plus size={16} /> Add Capstone Project
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {projects.map((proj) => (
                                <div key={proj.id} className="p-5 rounded-3xl border border-white/10 bg-white/5 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative">
                                            {proj.image ? (
                                                <Image fill src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Banner</div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">{proj.category}</span>
                                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                                {proj.academicYear || '2026-27'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base text-white">{proj.title}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{proj.abstract}</p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                        <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setProjectModal({ ...proj, rawTeam: proj.team?.join(', '), rawTechStack: proj.techStack?.join(', ') })}>
                                            <Edit3 size={14} /> Edit
                                        </Button>
                                        <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteProject(proj.id)}>
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section B: NPTEL Achievers */}
                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Award className="text-amber-400" size={20} />
                                    NPTEL Achievers &amp; Faculty
                                </h2>
                                <p className="text-xs text-muted-foreground">Manage SWAYAM NPTEL certificates and faculty achievers for `/about/achievements/nptel`.</p>
                            </div>
                            <Button variant="neon" size="sm" className="rounded-xl gap-2 font-bold" onClick={() => setNptelModal({})}>
                                <Plus size={16} /> Add NPTEL Record
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {nptel.map((item) => (
                                <div key={item.id} className="p-5 rounded-3xl border border-white/10 bg-white/5 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">{item.cert}</span>
                                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-bold">
                                                {item.academicYear || '2026-27'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base text-white">{item.name}</h3>
                                        <p className="text-xs text-primary font-semibold">{item.course}</p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                        <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setNptelModal(item)}>
                                            <Edit3 size={14} /> Edit
                                        </Button>
                                        <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteNptel(item.id)}>
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section C: National Highlights */}
                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Trophy className="text-primary" size={20} />
                                    National &amp; Intercollegiate Highlights
                                </h2>
                                <p className="text-xs text-muted-foreground">Manage SIH Hackathon victories and IEEE paper awards for `/about/achievements/highlights`.</p>
                            </div>
                            <Button variant="neon" size="sm" className="rounded-xl gap-2 font-bold" onClick={() => setHighlightModal({ gallery: [] })}>
                                <Plus size={16} /> Add Highlight
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {highlights.map((item) => (
                                <div key={item.id} className="p-5 rounded-3xl border border-white/10 bg-white/5 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-bold uppercase">{item.category}</span>
                                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                                {item.academicYear || '2026-27'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base text-white">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                        <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setHighlightModal(item)}>
                                            <Edit3 size={14} /> Edit
                                        </Button>
                                        <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteHighlight(item.id)}>
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section D: Academic Toppers */}
                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <GraduationCap className="text-secondary" size={20} />
                                    Academic Toppers
                                </h2>
                                <p className="text-xs text-muted-foreground">Manage rank holders across SE, TE, and BE batches for Odd &amp; Even semesters on `/about/achievements`.</p>
                            </div>
                            <Button variant="neon" size="sm" className="rounded-xl gap-2 font-bold" onClick={() => setTopperModal({ semType: 'Even', yearBatch: 'SE', rank: 'Rank 1' })}>
                                <Plus size={16} /> Add Topper Record
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {toppers.map((item) => (
                                <div key={item.id} className="p-5 rounded-3xl border border-white/10 bg-white/5 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-1 rounded-lg bg-secondary/20 text-secondary text-[10px] font-bold uppercase">{item.yearBatch} ({item.semType} Sem)</span>
                                            <span className="text-xs font-bold text-muted-foreground">{item.rank}</span>
                                        </div>
                                        <h3 className="font-bold text-base text-white">{item.name}</h3>
                                        <p className="text-xs text-primary font-black">{item.sgpa}</p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                        <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setTopperModal(item)}>
                                            <Edit3 size={14} /> Edit
                                        </Button>
                                        <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteTopper(item.id)}>
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section E: Student Domain Excellence Awards */}
                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Star className="text-amber-400" size={20} />
                                    Student Domain Excellence Awards
                                </h2>
                                <p className="text-xs text-muted-foreground">Manage Domain Excellence Award recipients displayed on `/about/achievements`.</p>
                            </div>
                            <Button variant="neon" size="sm" className="rounded-xl gap-2 font-bold" onClick={() => setDomainAwardModal({})}>
                                <Plus size={16} /> Add Domain Award
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {domainAwards.map((item) => (
                                <div key={item.id} className="p-5 rounded-3xl border border-white/10 bg-white/5 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">{item.domain}</span>
                                        <h3 className="font-bold text-base text-white">{item.title}</h3>
                                        <p className="text-xs text-primary font-bold">{item.recipient}</p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                        <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setDomainAwardModal(item)}>
                                            <Edit3 size={14} /> Edit
                                        </Button>
                                        <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteDomainAward(item.id)}>
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 5: STUDENT TEAM MANAGER */}
            {activeTab === 'team' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="text-primary" size={20} />
                                Student Council Team
                            </h2>
                            <p className="text-xs text-muted-foreground">Manage student committee members, roles, designations, and social profiles displayed on `/team`.</p>
                        </div>
                        <Button
                            variant="neon"
                            size="sm"
                            className="rounded-xl gap-2 font-bold"
                            onClick={() => setTeamModal({ graduation_year: '2026' })}
                        >
                            <Plus size={16} /> Add Team Member
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {team.map((m, idx) => (
                            <div
                                key={m.id}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', idx.toString());
                                    e.currentTarget.classList.add('opacity-40', 'border-primary');
                                }}
                                onDragEnd={(e) => {
                                    e.currentTarget.classList.remove('opacity-40', 'border-primary');
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                }}
                                onDrop={async (e) => {
                                    e.preventDefault();
                                    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
                                    if (!isNaN(fromIdx) && fromIdx !== idx) {
                                        await handleReorderTeam(fromIdx, idx);
                                    }
                                }}
                                className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4 flex flex-col justify-between hover:border-white/20 transition-all relative group cursor-grab active:cursor-grabbing"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-black/60 overflow-hidden border border-white/10 shrink-0 relative shadow-inner">
                                            {m.image_url ? (
                                                <Image fill src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-base text-primary font-black bg-primary/10">{m.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="space-y-1 flex-1 min-w-0 pr-6">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">{m.category || 'Core Team'}</span>
                                                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">{m.academicYear || '2026-27'}</span>
                                                {m.graduation_year && <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-bold">Class of '{m.graduation_year.slice(-2)}</span>}
                                            </div>
                                            <h3 className="font-bold text-base text-white truncate">{m.name}</h3>
                                            <p className="text-xs text-cyan-400 font-semibold">{m.role}</p>
                                        </div>
                                        <div className="absolute top-4 right-4 text-white/30 group-hover:text-white/70 transition-colors" title="Drag to reorder">
                                            <GripVertical size={18} />
                                        </div>
                                    </div>

                                    {m.bio && <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{m.bio}</p>}

                                    {m.skills && m.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {m.skills.map((sk, sIdx) => (
                                                <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-slate-300 border border-white/10">{sk}</span>
                                            ))}
                                        </div>
                                    )}

                                    {(m.email || m.github || m.linkedin || m.instagram) && (
                                        <div className="flex items-center gap-2 pt-1 text-muted-foreground text-xs">
                                            {m.email && <span className="truncate text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5">✉ {m.email}</span>}
                                            {m.github && <span className="text-[10px] font-mono text-cyan-400">GH</span>}
                                            {m.linkedin && <span className="text-[10px] font-mono text-blue-400">IN</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-300 hover:text-white disabled:opacity-30" disabled={idx === 0} onClick={() => handleMoveTeamMember(idx, 'up')} title="Move Up">
                                            <ChevronUp size={14} />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-300 hover:text-white disabled:opacity-30" disabled={idx === team.length - 1} onClick={() => handleMoveTeamMember(idx, 'down')} title="Move Down">
                                            <ChevronDown size={14} />
                                        </Button>
                                    </div>
                                    <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setTeamModal({ ...m, rawSkills: m.skills?.join(', '), rawAchievements: m.achievements?.join(', ') })}>
                                        <Edit3 size={14} /> Edit
                                    </Button>
                                    <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteTeamMember(m.id)}>
                                        <Trash2 size={14} /> Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 6: FACULTY MANAGER */}
            {activeTab === 'staff' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <GraduationCap className="text-emerald-400" size={20} />
                                Faculty Members
                            </h2>
                            <p className="text-xs text-muted-foreground">Manage AI & DS Department faculty professors, designations, research bio, and expertise displayed on `/staff`.</p>
                        </div>
                        <Button
                            variant="neon"
                            size="sm"
                            className="rounded-xl gap-2 font-bold"
                            onClick={() => setStaffModal({ designation: 'Assistant Professor', department: 'Artificial Intelligence & Data Science' })}
                        >
                            <Plus size={16} /> Add Faculty Member
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {staff.map((st, idx) => (
                            <div
                                key={st.id}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', idx.toString());
                                    e.currentTarget.classList.add('opacity-40', 'border-emerald-400');
                                }}
                                onDragEnd={(e) => {
                                    e.currentTarget.classList.remove('opacity-40', 'border-emerald-400');
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                }}
                                onDrop={async (e) => {
                                    e.preventDefault();
                                    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
                                    if (!isNaN(fromIdx) && fromIdx !== idx) {
                                        await handleReorderStaff(fromIdx, idx);
                                    }
                                }}
                                className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4 flex flex-col justify-between hover:border-white/20 transition-all relative group cursor-grab active:cursor-grabbing"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-black/60 overflow-hidden border border-white/10 shrink-0 relative shadow-inner">
                                            {st.image_url ? (
                                                <Image fill src={st.image_url} alt={st.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-base text-emerald-400 font-black bg-emerald-500/10">{st.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="space-y-1 flex-1 min-w-0 pr-6">
                                            <h3 className="font-bold text-base text-white truncate">{st.name}</h3>
                                            <p className="text-xs text-emerald-400 font-semibold">{st.designation}</p>
                                            {st.qualification && <p className="text-[10px] text-muted-foreground font-medium">{st.qualification}</p>}
                                        </div>
                                        <div className="absolute top-4 right-4 text-white/30 group-hover:text-white/70 transition-colors" title="Drag to reorder">
                                            <GripVertical size={18} />
                                        </div>
                                    </div>

                                    {st.bio && <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{st.bio}</p>}

                                    {st.expertise && st.expertise.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {st.expertise.map((exp, eIdx) => (
                                                <span key={eIdx} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/20 font-medium">{exp}</span>
                                            ))}
                                        </div>
                                    )}

                                    {st.email && (
                                        <div className="pt-1">
                                            <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-md border border-white/5 text-muted-foreground block truncate">✉ {st.email}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-300 hover:text-white disabled:opacity-30" disabled={idx === 0} onClick={() => handleMoveStaffMember(idx, 'up')} title="Move Up">
                                            <ChevronUp size={14} />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-300 hover:text-white disabled:opacity-30" disabled={idx === staff.length - 1} onClick={() => handleMoveStaffMember(idx, 'down')} title="Move Down">
                                            <ChevronDown size={14} />
                                        </Button>
                                    </div>
                                    <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setStaffModal({ ...st, rawExpertise: st.expertise?.join(', ') })}>
                                        <Edit3 size={14} /> Edit Faculty
                                    </Button>
                                    <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteStaffMember(st.id)}>
                                        <Trash2 size={14} /> Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 7: RESOURCES MANAGER */}
            {activeTab === 'resources' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Learning Resources</h2>
                        <Button
                            variant="neon"
                            size="sm"
                            className="rounded-xl gap-2 font-bold"
                            onClick={() => setResourceModal({ category: 'Notes' })}
                        >
                            <Plus size={16} /> Add Resource
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resources.map((res) => (
                            <div key={res.id} className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-3">
                                <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                                    {res.category}
                                </span>
                                <h3 className="font-bold text-base">{res.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">{res.description}</p>
                                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                    <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs gap-1" onClick={() => setResourceModal({ ...res, rawTags: res.tags?.join(', ') })}>
                                        <Edit3 size={14} /> Edit
                                    </Button>
                                    <Button size="sm" variant="ghost" className="rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteResource(res.id)}>
                                        <Trash2 size={14} /> Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* DETAILED EVENT MODAL WITH ALL FIELDS + BANNER & MULTI-PHOTO UPLOADER */}
            {eventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                            <h3 className="text-lg font-bold">{eventModal.id ? 'Edit Event Details' : 'Add New Event'}</h3>
                            <button onClick={() => setEventModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSaveEvent} className="space-y-4 overflow-y-auto pr-2 max-h-[72vh] custom-scrollbar text-xs">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Event Title *</label>
                                <input type="text" required value={eventModal.title || ''} onChange={(e) => setEventModal({ ...eventModal, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Academic Session *</label>
                                    <select value={eventModal.academicYear || '2026-27'} onChange={(e) => setEventModal({ ...eventModal, academicYear: e.target.value as AcademicYear })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10 text-xs font-bold text-amber-300">
                                        <option value="2026-27">A.Y. 2026–27 (Current)</option>
                                        <option value="2025-26">A.Y. 2025–26 (Previous)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Main Event Category *</label>
                                    <select value={eventModal.category || 'Technical Event'} onChange={(e) => setEventModal({ ...eventModal, category: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10 text-xs">
                                        <option value="Technical Event">Technical Event</option>
                                        <option value="Non-Technical Event">Non-Technical Event</option>
                                        <option value="Industrial Visit">Industrial Visit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Event Type</label>
                                    <select value={eventModal.type || 'Workshop'} onChange={(e) => setEventModal({ ...eventModal, type: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10 text-xs">
                                        <option value="Workshop">Workshop</option>
                                        <option value="Seminar">Seminar</option>
                                        <option value="Bootcamp">Bootcamp</option>
                                        <option value="Hackathon">Hackathon</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Guest Lecture">Guest Lecture</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Start Date *</label>
                                    <input type="date" required value={eventModal.date || ''} onChange={(e) => setEventModal({ ...eventModal, date: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">End Date (Optional)</label>
                                    <input type="date" value={eventModal.end_date || ''} onChange={(e) => setEventModal({ ...eventModal, end_date: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Time</label>
                                    <input type="text" placeholder="09:00 AM - 05:00 PM" value={eventModal.time || ''} onChange={(e) => setEventModal({ ...eventModal, time: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Location *</label>
                                    <input type="text" required value={eventModal.location || ''} onChange={(e) => setEventModal({ ...eventModal, location: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Organizers / Coordinators</label>
                                    <input type="text" placeholder="SHAIDS Committee / Prof. Suriya Kala A. V." value={eventModal.organizer || ''} onChange={(e) => setEventModal({ ...eventModal, organizer: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>

                            {/* Banner Photo Upload */}
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Event Banner Poster Image</label>
                                <div className="flex items-center gap-3">
                                    <input type="text" placeholder="Poster Image URL" value={eventModal.image_url || ''} onChange={(e) => setEventModal({ ...eventModal, image_url: e.target.value })} className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    triggerImageCrop(e.target.files[0], 16 / 9, (url) => setEventModal({ ...eventModal, image_url: url }));
                                                }
                                            }}
                                        />
                                        <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                            <Upload size={14} /> Upload &amp; Crop
                                        </div>
                                    </label>
                                </div>
                                {eventModal.image_url && (
                                    <div className="mt-2 aspect-[16/9] w-36 rounded-xl overflow-hidden border border-white/10 relative">
                                        <Image fill src={eventModal.image_url} alt="Poster Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Short Description</label>
                                <textarea rows={2} value={eventModal.description || ''} onChange={(e) => setEventModal({ ...eventModal, description: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Detailed Event Agenda &amp; Overview (Long Description)</label>
                                <textarea rows={4} value={eventModal.long_description || ''} onChange={(e) => setEventModal({ ...eventModal, long_description: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Brochure PDF / Link</label>
                                    <input type="url" placeholder="https://..." value={eventModal.brochure_url || ''} onChange={(e) => setEventModal({ ...eventModal, brochure_url: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Registration Form Link</label>
                                    <input type="url" placeholder="https://forms.google.com/..." value={eventModal.registration_url || ''} onChange={(e) => setEventModal({ ...eventModal, registration_url: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={eventModal.has_registration ?? true} onChange={(e) => setEventModal({ ...eventModal, has_registration: e.target.checked })} className="rounded bg-white/5 border-white/10" />
                                    <span>Open Registration</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={eventModal.is_past ?? false} onChange={(e) => setEventModal({ ...eventModal, is_past: e.target.checked })} className="rounded bg-white/5 border-white/10" />
                                    <span>Mark as Past Event</span>
                                </label>
                            </div>

                            {/* Multiple Event Photos Gallery */}
                            <div className="space-y-2 pt-2 border-t border-white/10">
                                <label className="font-bold text-cyan-400 block">Event Gallery Photos (Batch Upload)</label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    handleBatchFileUpload(e.target.files, (newUrls) => {
                                                        const current = eventModal.gallery_images || [];
                                                        setEventModal({ ...eventModal, gallery_images: [...current, ...newUrls] });
                                                    });
                                                }
                                            }}
                                        />
                                        <div className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold flex items-center gap-1.5">
                                            <Upload size={14} /> Batch Upload Event Photos
                                        </div>
                                    </label>
                                </div>

                                {eventModal.gallery_images && eventModal.gallery_images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 pt-2">
                                        {eventModal.gallery_images.map((url, idx) => (
                                            <div key={idx} className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 relative group bg-black/50">
                                                <Image fill src={url} alt={`Event Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = (eventModal.gallery_images || []).filter((_, i) => i !== idx);
                                                        setEventModal({ ...eventModal, gallery_images: updated });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setEventModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Event</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FEST SUB-EVENT MODAL */}
            {festModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                            <h3 className="text-lg font-bold">{festModal.id ? 'Edit Fest Sub-Event' : 'Add Fest Sub-Event'}</h3>
                            <button onClick={() => setFestModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveFestSubEvent} className="space-y-4 overflow-y-auto pr-2 max-h-[72vh] custom-scrollbar text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Flagship Fest Category</label>
                                    <select value={festModal.festId || 'vectors'} onChange={(e) => setFestModal({ ...festModal, festId: e.target.value as 'vectors' | 'kurukshetra' | 'rhythms' })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10 text-xs">
                                        <option value="vectors">VECTORS (Technical Fest)</option>
                                        <option value="kurukshetra">KURUKSHETRA (Sports Fest)</option>
                                        <option value="rhythms">RHYTHMS (Cultural Fest)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Academic Session *</label>
                                    <select value={festModal.academicYear || '2026-27'} onChange={(e) => setFestModal({ ...festModal, academicYear: e.target.value as AcademicYear })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10 text-xs font-bold text-amber-300">
                                        <option value="2026-27">A.Y. 2026–27 (Current)</option>
                                        <option value="2025-26">A.Y. 2025–26 (Previous)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Banner Photo Upload */}
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Banner Image Poster</label>
                                <div className="flex items-center gap-3">
                                    <input type="text" placeholder="Poster Image URL" value={festModal.image || ''} onChange={(e) => setFestModal({ ...festModal, image: e.target.value })} className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    triggerImageCrop(e.target.files[0], 16 / 9, (url) => setFestModal({ ...festModal, image: url }));
                                                }
                                            }}
                                        />
                                        <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                            <Upload size={14} /> Upload &amp; Crop
                                        </div>
                                    </label>
                                </div>
                                {festModal.image && (
                                    <div className="mt-2 aspect-[16/9] w-36 rounded-xl overflow-hidden border border-white/10 relative">
                                        <Image fill src={festModal.image} alt="Banner Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Sub-Event Title *</label>
                                <input type="text" required value={festModal.title || ''} onChange={(e) => setFestModal({ ...festModal, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Winner</label>
                                    <input type="text" value={festModal.winner || ''} onChange={(e) => setFestModal({ ...festModal, winner: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Runner-Up</label>
                                    <input type="text" value={festModal.runnerUp || ''} onChange={(e) => setFestModal({ ...festModal, runnerUp: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Faculty / Student Organizers</label>
                                <input type="text" value={festModal.organizer || ''} onChange={(e) => setFestModal({ ...festModal, organizer: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Short Description</label>
                                <textarea rows={2} value={festModal.desc || ''} onChange={(e) => setFestModal({ ...festModal, desc: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            {/* Specific Event Multiple Photos Uploader */}
                            <div className="space-y-2 pt-2 border-t border-white/10">
                                <label className="font-bold text-cyan-400 block">Specific Event Multiple Photos Gallery</label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    handleBatchFileUpload(e.target.files, (newUrls) => {
                                                        const current = festModal.eventGallery || [];
                                                        setFestModal({ ...festModal, eventGallery: [...current, ...newUrls] });
                                                    });
                                                }
                                            }}
                                        />
                                        <div className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold flex items-center gap-1.5">
                                            <Upload size={14} /> Batch Upload Photos
                                        </div>
                                    </label>
                                </div>

                                {festModal.eventGallery && festModal.eventGallery.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 pt-2">
                                        {festModal.eventGallery.map((url, idx) => (
                                            <div key={idx} className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 relative group bg-black/50">
                                                <Image fill src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = (festModal.eventGallery || []).filter((_, i) => i !== idx);
                                                        setFestModal({ ...festModal, eventGallery: updated });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setFestModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Sub-Event</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PROJECT MODAL WITH ALL FIELDS */}
            {projectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                            <h3 className="text-lg font-bold">{projectModal.id ? 'Edit Capstone Project' : 'Add Capstone Project'}</h3>
                            <button onClick={() => setProjectModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveProject} className="space-y-4 overflow-y-auto pr-2 max-h-[72vh] custom-scrollbar text-xs">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Project Banner / Main Photo</label>
                                <div className="flex items-center gap-3">
                                    <input type="text" placeholder="Banner Image URL" value={projectModal.image || ''} onChange={(e) => setProjectModal({ ...projectModal, image: e.target.value })} className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    triggerImageCrop(e.target.files[0], 16 / 9, (url) => setProjectModal({ ...projectModal, image: url }));
                                                }
                                            }}
                                        />
                                        <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                            <Upload size={14} /> Upload &amp; Crop
                                        </div>
                                    </label>
                                </div>
                                {projectModal.image && (
                                    <div className="mt-2 aspect-[16/9] w-36 rounded-xl overflow-hidden border border-white/10 relative">
                                        <Image fill src={projectModal.image} alt="Banner Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Project Title *</label>
                                <input type="text" required value={projectModal.title || ''} onChange={(e) => setProjectModal({ ...projectModal, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Academic Session *</label>
                                    <select value={projectModal.academicYear || '2026-27'} onChange={(e) => setProjectModal({ ...projectModal, academicYear: e.target.value as AcademicYear })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10 text-xs font-bold text-amber-300">
                                        <option value="2026-27">A.Y. 2026–27 (Current)</option>
                                        <option value="2025-26">A.Y. 2025–26 (Previous)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Category</label>
                                    <input type="text" placeholder="Healthcare & Deep Learning" value={projectModal.category || ''} onChange={(e) => setProjectModal({ ...projectModal, category: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Faculty Advisor</label>
                                    <input type="text" placeholder="Prof. Suriya Kala A. V." value={projectModal.advisor || ''} onChange={(e) => setProjectModal({ ...projectModal, advisor: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Team Members (comma separated)</label>
                                <input type="text" placeholder="Tanvi Kulkarni, Rohan Deshmukh" value={projectModal.rawTeam || ''} onChange={(e) => setProjectModal({ ...projectModal, rawTeam: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Tech Stack (comma separated)</label>
                                <input type="text" placeholder="PyTorch, OpenCV, React" value={projectModal.rawTechStack || ''} onChange={(e) => setProjectModal({ ...projectModal, rawTechStack: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">GitHub Repo Link</label>
                                    <input type="url" placeholder="https://github.com/..." value={projectModal.github || ''} onChange={(e) => setProjectModal({ ...projectModal, github: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Live Demo Link</label>
                                    <input type="url" placeholder="https://..." value={projectModal.demo || ''} onChange={(e) => setProjectModal({ ...projectModal, demo: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Abstract *</label>
                                <textarea rows={3} required value={projectModal.abstract || ''} onChange={(e) => setProjectModal({ ...projectModal, abstract: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            {/* Project Multiple Photos Uploader */}
                            <div className="space-y-2 pt-2 border-t border-white/10">
                                <label className="font-bold text-cyan-400 block">Project Screenshots &amp; Prototype Multiple Photos</label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    handleBatchFileUpload(e.target.files, (newUrls) => {
                                                        const current = projectModal.gallery || [];
                                                        setProjectModal({ ...projectModal, gallery: [...current, ...newUrls] });
                                                    });
                                                }
                                            }}
                                        />
                                        <div className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold flex items-center gap-1.5">
                                            <Upload size={14} /> Batch Upload Screenshots
                                        </div>
                                    </label>
                                </div>

                                {projectModal.gallery && projectModal.gallery.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 pt-2">
                                        {projectModal.gallery.map((url, idx) => (
                                            <div key={idx} className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 relative group bg-black/50">
                                                <Image fill src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = (projectModal.gallery || []).filter((_, i) => i !== idx);
                                                        setProjectModal({ ...projectModal, gallery: updated });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setProjectModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Project</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAILED STUDENT TEAM MODAL */}
            {teamModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                            <h3 className="text-lg font-bold">{teamModal.id ? 'Edit Team Member' : 'Add Team Member'}</h3>
                            <button onClick={() => setTeamModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveTeam} className="space-y-3 text-xs overflow-y-auto pr-2 max-h-[72vh] custom-scrollbar">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Member Name *</label>
                                <input type="text" required value={teamModal.name || ''} onChange={(e) => setTeamModal({ ...teamModal, name: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Role / Designation *</label>
                                <input type="text" required placeholder="President / Vice President" value={teamModal.role || ''} onChange={(e) => setTeamModal({ ...teamModal, role: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Profile Photo</label>
                                <div className="flex items-center gap-3">
                                    <input type="text" placeholder="Photo URL" value={teamModal.image_url || ''} onChange={(e) => setTeamModal({ ...teamModal, image_url: e.target.value })} className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    triggerImageCrop(e.target.files[0], 1, (url) => setTeamModal({ ...teamModal, image_url: url }));
                                                }
                                            }}
                                        />
                                        <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                            <Upload size={14} /> Crop &amp; Upload
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Academic Session *</label>
                                    <select value={teamModal.academicYear || '2026-27'} onChange={(e) => setTeamModal({ ...teamModal, academicYear: e.target.value as AcademicYear })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10 text-xs font-bold text-amber-300">
                                        <option value="2026-27">A.Y. 2026–27 (Current)</option>
                                        <option value="2025-26">A.Y. 2025–26 (Previous)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Graduation Year</label>
                                    <input type="text" placeholder="2026" value={teamModal.graduation_year || ''} onChange={(e) => setTeamModal({ ...teamModal, graduation_year: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Email</label>
                                    <input type="email" placeholder="student@shaids.org" value={teamModal.email || ''} onChange={(e) => setTeamModal({ ...teamModal, email: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">GitHub</label>
                                    <input type="url" placeholder="GitHub URL" value={teamModal.github || ''} onChange={(e) => setTeamModal({ ...teamModal, github: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">LinkedIn</label>
                                    <input type="url" placeholder="LinkedIn URL" value={teamModal.linkedin || ''} onChange={(e) => setTeamModal({ ...teamModal, linkedin: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Instagram</label>
                                    <input type="url" placeholder="Instagram URL" value={teamModal.instagram || ''} onChange={(e) => setTeamModal({ ...teamModal, instagram: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]" />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Short Bio</label>
                                <textarea rows={2} value={teamModal.bio || ''} onChange={(e) => setTeamModal({ ...teamModal, bio: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Technical Skills (comma separated)</label>
                                <input type="text" placeholder="Python, Full-Stack, Deep Learning" value={teamModal.rawSkills || ''} onChange={(e) => setTeamModal({ ...teamModal, rawSkills: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Achievements (comma separated)</label>
                                <input type="text" placeholder="SIH Winner, Top Ranker" value={teamModal.rawAchievements || ''} onChange={(e) => setTeamModal({ ...teamModal, rawAchievements: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setTeamModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Member</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAILED FACULTY STAFF MODAL */}
            {staffModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                            <h3 className="text-lg font-bold">{staffModal.id ? 'Edit Faculty Member' : 'Add Faculty Member'}</h3>
                            <button onClick={() => setStaffModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveStaff} className="space-y-3 text-xs overflow-y-auto pr-2 max-h-[72vh] custom-scrollbar">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Faculty Name *</label>
                                <input type="text" required value={staffModal.name || ''} onChange={(e) => setStaffModal({ ...staffModal, name: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Designation *</label>
                                    <input type="text" required placeholder="Head of Department / Assistant Professor" value={staffModal.designation || ''} onChange={(e) => setStaffModal({ ...staffModal, designation: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Qualifications</label>
                                    <input type="text" placeholder="Ph.D. in Computer Science" value={staffModal.qualification || ''} onChange={(e) => setStaffModal({ ...staffModal, qualification: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Department Name</label>
                                <input type="text" value={staffModal.department || 'Artificial Intelligence & Data Science'} onChange={(e) => setStaffModal({ ...staffModal, department: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Faculty Profile Image</label>
                                <div className="flex items-center gap-3">
                                    <input type="text" placeholder="Photo URL" value={staffModal.image_url || ''} onChange={(e) => setStaffModal({ ...staffModal, image_url: e.target.value })} className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    triggerImageCrop(e.target.files[0], 1, (url) => setStaffModal({ ...staffModal, image_url: url }));
                                                }
                                            }}
                                        />
                                        <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                            <Upload size={14} /> Crop &amp; Upload
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Email Address</label>
                                <input type="email" placeholder="faculty@acpce.ac.in" value={staffModal.email || ''} onChange={(e) => setStaffModal({ ...staffModal, email: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Academic &amp; Research Bio</label>
                                <textarea rows={3} value={staffModal.bio || ''} onChange={(e) => setStaffModal({ ...staffModal, bio: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Areas of Expertise &amp; Research (comma separated)</label>
                                <input type="text" placeholder="Machine Learning, Deep Learning, Computer Vision" value={staffModal.rawExpertise || ''} onChange={(e) => setStaffModal({ ...staffModal, rawExpertise: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setStaffModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Faculty</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RESOURCE MODAL */}
            {resourceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-bold">{resourceModal.id ? 'Edit Resource' : 'Add Resource'}</h3>
                            <button onClick={() => setResourceModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveResource} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Resource Title *</label>
                                <input type="text" required value={resourceModal.title || ''} onChange={(e) => setResourceModal({ ...resourceModal, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Category</label>
                                    <select value={resourceModal.category || 'Notes'} onChange={(e) => setResourceModal({ ...resourceModal, category: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10 text-xs">
                                        <option value="Notes">Notes</option>
                                        <option value="Syllabus">Syllabus</option>
                                        <option value="Question Papers">Question Papers</option>
                                        <option value="Lab Manuals">Lab Manuals</option>
                                        <option value="Tutorial Video">Tutorial Video</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Author / Contributor</label>
                                    <input type="text" placeholder="SHAIDS Tech Team" value={resourceModal.author || ''} onChange={(e) => setResourceModal({ ...resourceModal, author: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Resource Drive / Download Link *</label>
                                <input type="url" required placeholder="https://drive.google.com/..." value={resourceModal.link || ''} onChange={(e) => setResourceModal({ ...resourceModal, link: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Tags (comma separated)</label>
                                <input type="text" placeholder="Python, ML, Semester 5" value={resourceModal.rawTags || ''} onChange={(e) => setResourceModal({ ...resourceModal, rawTags: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Description</label>
                                <textarea rows={2} value={resourceModal.description || ''} onChange={(e) => setResourceModal({ ...resourceModal, description: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setResourceModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Resource</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* NPTEL MODAL */}
            {nptelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-bold">{nptelModal.id ? 'Edit NPTEL Record' : 'Add NPTEL Record'}</h3>
                            <button onClick={() => setNptelModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveNptel} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Achiever Name *</label>
                                <input type="text" required value={nptelModal.name || ''} onChange={(e) => setNptelModal({ ...nptelModal, name: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Course Title *</label>
                                <input type="text" required value={nptelModal.course || ''} onChange={(e) => setNptelModal({ ...nptelModal, course: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Academic Session *</label>
                                    <select value={nptelModal.academicYear || '2026-27'} onChange={(e) => setNptelModal({ ...nptelModal, academicYear: e.target.value as AcademicYear })} className="w-full px-3 py-2 rounded-xl bg-[#111] border border-white/10 text-[11px] font-bold text-amber-300">
                                        <option value="2026-27">2026–27</option>
                                        <option value="2025-26">2025–26</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Certificate Badge</label>
                                    <input type="text" placeholder="NPTEL Elite" value={nptelModal.cert || ''} onChange={(e) => setNptelModal({ ...nptelModal, cert: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Score / Percentile</label>
                                    <input type="text" placeholder="94% (Top 1%)" value={nptelModal.score || ''} onChange={(e) => setNptelModal({ ...nptelModal, score: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer font-bold">
                                    <input type="checkbox" checked={nptelModal.isFaculty ?? false} onChange={(e) => setNptelModal({ ...nptelModal, isFaculty: e.target.checked })} className="rounded bg-white/5 border-white/10" />
                                    <span>Faculty NPTEL Achiever</span>
                                </label>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setNptelModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save NPTEL Record</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* HIGHLIGHT MODAL */}
            {highlightModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                            <h3 className="text-lg font-bold">{highlightModal.id ? 'Edit Highlight' : 'Add Highlight'}</h3>
                            <button onClick={() => setHighlightModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveHighlight} className="space-y-3 text-xs overflow-y-auto pr-2 max-h-[72vh] custom-scrollbar">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Accolade Title *</label>
                                <input type="text" required value={highlightModal.title || ''} onChange={(e) => setHighlightModal({ ...highlightModal, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Academic Session *</label>
                                    <select value={highlightModal.academicYear || '2026-27'} onChange={(e) => setHighlightModal({ ...highlightModal, academicYear: e.target.value as AcademicYear })} className="w-full px-3 py-2 rounded-xl bg-[#111] border border-white/10 text-[11px] font-bold text-amber-300">
                                        <option value="2026-27">2026–27</option>
                                        <option value="2025-26">2025–26</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Category</label>
                                    <input type="text" placeholder="National Level Hackathon" value={highlightModal.category || ''} onChange={(e) => setHighlightModal({ ...highlightModal, category: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Position / Outcome</label>
                                    <input type="text" placeholder="1st Winner / Participant" value={highlightModal.achievement || ''} onChange={(e) => setHighlightModal({ ...highlightModal, achievement: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Team / Awardee</label>
                                    <input type="text" value={highlightModal.team || ''} onChange={(e) => setHighlightModal({ ...highlightModal, team: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Location &amp; Date</label>
                                    <input type="text" value={highlightModal.location || ''} onChange={(e) => setHighlightModal({ ...highlightModal, location: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Description *</label>
                                <textarea rows={3} required value={highlightModal.description || ''} onChange={(e) => setHighlightModal({ ...highlightModal, description: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            {/* Banner Image */}
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Main Banner Image</label>
                                <div className="flex items-center gap-3">
                                    <input type="text" placeholder="Image URL" value={highlightModal.image || ''} onChange={(e) => setHighlightModal({ ...highlightModal, image: e.target.value })} className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    triggerImageCrop(e.target.files[0], 16 / 9, (url) => setHighlightModal({ ...highlightModal, image: url }));
                                                }
                                            }}
                                        />
                                        <div className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-1">
                                            <Upload size={14} /> Crop &amp; Upload
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Gallery Photos Batch Upload */}
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Photo Gallery (Batch Upload)</label>
                                <label className="cursor-pointer block border-2 border-dashed border-white/20 hover:border-primary/50 p-3 rounded-xl text-center bg-white/5 transition-colors mb-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const files = Array.from(e.target.files);
                                                files.forEach(f => {
                                                    handleFileUpload(f, (url) => {
                                                        setHighlightModal(prev => prev ? { ...prev, gallery: [...(prev.gallery || []), url] } : null);
                                                    });
                                                });
                                            }
                                        }}
                                    />
                                    <Upload size={16} className="mx-auto mb-1 text-primary" />
                                    <span className="text-[11px] font-bold text-white">Click to Batch Upload Gallery Photos</span>
                                </label>

                                {highlightModal.gallery && highlightModal.gallery.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 pt-2">
                                        {highlightModal.gallery.map((imgUrl, i) => (
                                            <div key={i} className="aspect-[16/9] rounded-lg overflow-hidden border border-white/10 relative group">
                                                <Image fill src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setHighlightModal({ ...highlightModal, gallery: highlightModal.gallery?.filter((_, idx) => idx !== i) })}
                                                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <Button type="button" variant="outline" onClick={() => setHighlightModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Highlight</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ACADEMIC TOPPER MODAL */}
            {topperModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-bold">{topperModal.id ? 'Edit Topper Record' : 'Add Topper Record'}</h3>
                            <button onClick={() => setTopperModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveTopper} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Student Name *</label>
                                <input type="text" required value={topperModal.name || ''} onChange={(e) => setTopperModal({ ...topperModal, name: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Semester Type *</label>
                                    <select value={topperModal.semType || 'Even'} onChange={(e) => setTopperModal({ ...topperModal, semType: e.target.value as 'Odd' | 'Even' })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10">
                                        <option value="Even">Even Semester</option>
                                        <option value="Odd">Odd Semester</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Year / Class Batch *</label>
                                    <select value={topperModal.yearBatch || 'SE'} onChange={(e) => setTopperModal({ ...topperModal, yearBatch: e.target.value as 'SE' | 'TE' | 'BE' })} className="w-full px-4 py-2 rounded-xl bg-[#111] border border-white/10">
                                        <option value="SE">SE (Second Year)</option>
                                        <option value="TE">TE (Third Year)</option>
                                        <option value="BE">BE (Final Year)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">Rank Title *</label>
                                    <input type="text" placeholder="Rank 1 / Rank 2 / Rank 3" value={topperModal.rank || 'Rank 1'} onChange={(e) => setTopperModal({ ...topperModal, rank: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground block mb-1">SGPA Score *</label>
                                    <input type="text" placeholder="9.88 SGPA" value={topperModal.sgpa || ''} onChange={(e) => setTopperModal({ ...topperModal, sgpa: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setTopperModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Topper</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DOMAIN EXCELLENCE AWARD MODAL */}
            {domainAwardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-bold">{domainAwardModal.id ? 'Edit Domain Award' : 'Add Domain Award'}</h3>
                            <button onClick={() => setDomainAwardModal(null)} className="p-2 text-muted-foreground hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveDomainAward} className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Award Title *</label>
                                <input type="text" required placeholder="Tech Visionary Award" value={domainAwardModal.title || ''} onChange={(e) => setDomainAwardModal({ ...domainAwardModal, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Recipient Name (Class) *</label>
                                <input type="text" required placeholder="Tanvi Kulkarni (TE)" value={domainAwardModal.recipient || ''} onChange={(e) => setDomainAwardModal({ ...domainAwardModal, recipient: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div>
                                <label className="font-bold text-muted-foreground block mb-1">Domain Field *</label>
                                <input type="text" required placeholder="AI & Data Innovation" value={domainAwardModal.domain || ''} onChange={(e) => setDomainAwardModal({ ...domainAwardModal, domain: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setDomainAwardModal(null)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" variant="neon" className="rounded-xl font-bold">Save Award</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* IMAGE CROPPER MODAL DIALOG */}
            {cropperState && (
                <ImageCropperModal
                    file={cropperState.file}
                    aspectRatio={cropperState.aspectRatio}
                    onCropComplete={(croppedFile) => {
                        handleFileUpload(croppedFile, cropperState.onSuccess);
                        setCropperState(null);
                    }}
                    onCancel={() => setCropperState(null)}
                />
            )}
        </div>
    );
}
