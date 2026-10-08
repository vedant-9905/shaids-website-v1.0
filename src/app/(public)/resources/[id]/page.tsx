'use client';

import React, { use } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, FileText, Wrench, ArrowLeft, Download, ExternalLink, ShieldCheck, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useContent } from '@/context/content-context';
import { toast } from 'sonner';

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { resources } = useContent();

    const resource = resources.find(r => r.id === id);

    if (!resource) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 pt-40 pb-24 text-center"
            >
                <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
                <p className="text-muted-foreground mb-8 text-sm">The resource you are looking for does not exist or has been removed.</p>
                <Button variant="neon" asChild className="rounded-2xl">
                    <Link href="/resources">Back to Resources</Link>
                </Button>
            </motion.div>
        );
    }

    const isExternal = resource.link ? (resource.link.startsWith('http://') || resource.link.startsWith('https://')) : false;

    const getTypeIcon = (category: string) => {
        const cat = (category || '').toLowerCase();
        if (cat.includes('roadmap')) return <Compass className="w-12 h-12" />;
        if (cat.includes('manual') || cat.includes('paper')) return <BookOpen className="w-12 h-12" />;
        if (cat.includes('tool')) return <Wrench className="w-12 h-12" />;
        return <FileText className="w-12 h-12" />;
    };

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Resource link copied to clipboard!');
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Ambient Spotlight */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4 pt-32 pb-24 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link href="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-amber-400 transition-colors mb-12 group font-medium">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Resource Catalog
                    </Link>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: Resource Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="rounded-[3rem] border border-white/10 bg-[#050505] p-12 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent shadow-xl" />
                            
                            <div className="flex flex-col sm:flex-row items-start gap-8">
                                <motion.div 
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    className="w-24 h-24 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner shrink-0"
                                >
                                    {getTypeIcon(resource.category)}
                                </motion.div>
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black border border-amber-500/20 uppercase tracking-widest">
                                            {resource.category || 'Resource'}
                                        </span>
                                        {isExternal && <span className="text-muted-foreground text-[10px] uppercase font-black tracking-widest opacity-40 flex items-center gap-1"><ExternalLink size={10} /> External</span>}
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                        {resource.title}
                                    </h1>
                                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                                        {resource.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="space-y-10">
                            <motion.section 
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <h2 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                                        <FileText size={18} className="text-amber-500" /> Technical Details &amp; Info
                                    </h2>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap max-w-2xl">
                                    {resource.description}
                                </p>
                                {resource.author && (
                                    <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                                        Curated by: {resource.author}
                                    </p>
                                )}
                                {resource.tags && resource.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {resource.tags.map(tag => (
                                            <motion.span 
                                                key={tag} 
                                                whileHover={{ scale: 1.05 }}
                                                className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-sky-300 cursor-default"
                                            >
                                                #{tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                )}
                            </motion.section>

                            {resource.link && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                    className="p-8 rounded-[3rem] bg-gradient-to-br from-amber-500/10 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-amber-500/30 transition-all relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Verified Resource Link</h4>
                                            <p className="text-sm text-muted-foreground">Access or download the material directly.</p>
                                        </div>
                                    </div>
                                    <Button className="rounded-2xl h-12 px-8 font-bold gap-2 shadow-lg shadow-amber-500/20 shrink-0 hover:scale-[1.03] transition-all" variant="neon" asChild>
                                        <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                            {isExternal ? <ExternalLink size={18} /> : <Download size={18} />}
                                            {isExternal ? 'Open Link' : 'Download File'}
                                        </a>
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <aside className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                            className="rounded-[3rem] border border-white/10 bg-[#050505]/40 backdrop-blur-3xl p-10 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] sticky top-32 overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                            <div className="space-y-8 text-center">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ready to start?</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Access the primary source or tool directly from our catalog.</p>
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-4">
                                    {resource.link ? (
                                        <Button className="w-full rounded-[1.5rem] h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" variant="neon" asChild>
                                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                                {isExternal ? 'Visit Source' : 'Access File'} <ExternalLink size={18} className="ml-2 opacity-50" />
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button className="w-full rounded-[1.5rem] h-14 text-lg font-bold opacity-50 cursor-not-allowed" variant="secondary" disabled>
                                            Source Under Review
                                        </Button>
                                    )}

                                    <div className="flex gap-3">
                                        <Button onClick={handleShare} variant="outline" className="w-full rounded-2xl h-11 border-white/5 bg-white/5 hover:bg-white/10 gap-2 font-bold tracking-tight">
                                            <Share2 size={16} /> Share Link
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

