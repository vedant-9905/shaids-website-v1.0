'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent, ProjectItem } from '@/context/content-context';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { AcademicYearToggle } from '@/components/academic-year-toggle';

export default function BestProjectsPage() {
    const { projects, academicYear } = useContent();

    const filteredProjects = projects ? projects.filter(p => !p.academicYear || p.academicYear === academicYear) : [];

    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [lightboxState, setLightboxState] = useState<{ images: string[]; index: number } | null>(null);

    return (
        <div className="space-y-10 [font-size:85%]">
            <Link href="/about/achievements" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors group font-medium">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Achievements
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-500/30 uppercase tracking-[0.2em]">
                        Capstone &amp; Innovation Showcase
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Best Capstone <span className="text-gradient">Projects</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        Showcasing outstanding final-year capstones, research prototypes, and award-winning student innovations.
                    </p>
                </div>

                <div>
                    <AcademicYearToggle />
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((proj) => (
                    <div key={proj.id} className="p-6 rounded-[2.5rem] border border-white/10 bg-[#07070b]/90 backdrop-blur-xl space-y-4 flex flex-col justify-between shadow-2xl group hover:border-cyan-500/40 transition-all">
                        <div className="space-y-4">
                            <div
                                onClick={() => setLightboxState({ images: [proj.image, ...(proj.gallery || [])], index: 0 })}
                                className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 relative cursor-pointer"
                            >
                                <Image fill src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-[10px] font-black text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                                    {proj.category}
                                </span>
                            </div>

                            <h2 className="text-xl font-black text-white tracking-tight leading-snug">{proj.title}</h2>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{proj.abstract}</p>

                            <div className="flex flex-wrap gap-1.5 pt-2">
                                {proj.techStack.map((tech, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-muted-foreground border border-white/10">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <div className="text-[11px] text-muted-foreground">
                                <span className="font-bold text-white">Team: </span>{proj.team.join(', ')}
                            </div>
                            <Button onClick={() => setSelectedProject(proj)} variant="neon" className="w-full rounded-2xl h-10 text-xs font-bold gap-2">
                                View Full Details &amp; Gallery
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl overflow-y-auto custom-scrollbar space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <span className="px-3.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
                                {selectedProject.category}
                            </span>
                            <button onClick={() => setSelectedProject(null)} className="p-2 text-muted-foreground hover:text-white rounded-xl hover:bg-white/5">✕</button>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black">{selectedProject.title}</h2>
                        
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider">Project Abstract</h4>
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">{selectedProject.abstract}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
                            <div>
                                <span className="font-bold text-white block mb-1">Team Members</span>
                                <span className="text-muted-foreground">{selectedProject.team.join(', ')}</span>
                            </div>
                            <div>
                                <span className="font-bold text-white block mb-1">Faculty Advisor</span>
                                <span className="text-muted-foreground">{selectedProject.advisor}</span>
                            </div>
                        </div>

                        {/* Project Photo Gallery */}
                        {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider">Project Screenshots &amp; Prototypes</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {selectedProject.gallery.map((imgUrl, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setLightboxState({ images: selectedProject.gallery, index: i })}
                                            className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 cursor-pointer group relative"
                                        >
                                            <Image fill src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Site-Wide Image Lightbox with Zoom & Next/Prev Arrows */}
            {lightboxState && (
                <ImageLightbox
                    images={lightboxState.images}
                    currentIndex={lightboxState.index}
                    onClose={() => setLightboxState(null)}
                />
            )}
        </div>
    );
}
