'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ExternalLink, Github } from 'lucide-react';
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
        <div className="relative space-y-10 [font-size:85%] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link href="/about/achievements" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors group font-medium">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Achievements
                </Link>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-500/30 uppercase tracking-[0.2em]"
                    >
                        Capstone &amp; Innovation Showcase
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight"
                    >
                        Best Capstone <span className="text-gradient">Projects</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-muted-foreground max-w-2xl text-sm"
                    >
                        Showcasing outstanding final-year capstones, research prototypes, and award-winning student innovations.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    <AcademicYearToggle />
                </motion.div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((proj, idx) => (
                    <motion.div
                        key={proj.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className="p-6 rounded-[2.5rem] border border-white/10 bg-[#07070b]/90 backdrop-blur-xl space-y-4 flex flex-col justify-between shadow-2xl group hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)] transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
                        <div className="space-y-4">
                            <div
                                onClick={() => setLightboxState({ images: [proj.image, ...(proj.gallery || [])], index: 0 })}
                                className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 relative cursor-pointer group/img"
                            >
                                <Image fill src={proj.image} alt={proj.title} sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
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
                                <Sparkles size={14} /> View Full Details &amp; Gallery
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col p-6 md:p-8 rounded-[2.5rem] border border-cyan-500/30 bg-[#0a0a0f] text-white shadow-2xl overflow-y-auto space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="px-3.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
                                    {selectedProject.category}
                                </span>
                                <button onClick={() => setSelectedProject(null)} className="p-2 text-muted-foreground hover:text-white rounded-xl hover:bg-white/5 cursor-pointer">✕</button>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black">{selectedProject.title}</h2>
                            
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider">Project Abstract</h4>
                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">{selectedProject.abstract}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">Team Members</span>
                                    <span className="text-white font-semibold">{selectedProject.team.join(', ')}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">Faculty Advisor</span>
                                    <span className="text-cyan-400 font-semibold">{selectedProject.advisor}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider">Technologies Used</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.techStack.map((tech, i) => (
                                        <span key={i} className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                {selectedProject.github && (
                                    <Button variant="outline" asChild className="rounded-2xl gap-2 text-xs">
                                        <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                                            <Github size={14} /> Repository
                                        </a>
                                    </Button>
                                )}
                                {selectedProject.demo && (
                                    <Button variant="neon" asChild className="rounded-2xl gap-2 text-xs">
                                        <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink size={14} /> Live Demo
                                        </a>
                                    </Button>
                                )}
                            </div>

                            {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                                <div className="space-y-3 pt-2 border-t border-white/10">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Project Snapshots</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedProject.gallery.map((imgUrl, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setLightboxState({ images: selectedProject.gallery, index: i })}
                                                className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 relative cursor-pointer hover:border-cyan-400/50 transition-all"
                                            >
                                                <Image fill src={imgUrl} alt={`Gallery ${i}`} sizes="(max-width: 768px) 50vw, 33vw" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Lightbox */}
            {lightboxState && (
                <ImageLightbox images={lightboxState.images} initialIndex={lightboxState.index} onClose={() => setLightboxState(null)} />
            )}
        </div>
    );
}
