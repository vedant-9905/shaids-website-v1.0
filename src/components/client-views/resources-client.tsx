'use client';

import { motion } from 'framer-motion';
import { useContent } from '@/context/content-context';
import { ResourceCard } from '@/components/resources/resource-card';
import { BookOpen } from 'lucide-react';

export function ResourcesClient() {
    const { resources } = useContent();

    return (
        <div className="relative container mx-auto px-4 pt-32 pb-24 min-h-screen overflow-hidden">
            {/* Ambient Background Spotlight */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="mb-16 text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20 mb-2"
                >
                    <BookOpen size={15} /> Knowledge Base
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
                >
                    Student <span className="text-gradient">Resources</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed"
                >
                    Curated tools, lecture notes, lab manuals, and roadmaps to help you ace your exams and accelerate your build journey in AI &amp; DS.
                </motion.p>
            </div>

            {resources && resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource, idx) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.07, ease: "easeOut" }}
                        >
                            <ResourceCard
                                id={resource.id}
                                title={resource.title}
                                description={resource.description}
                                category={resource.category}
                                link={resource.link}
                                author={resource.author}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-20 text-center border border-dashed rounded-[2.5rem] border-white/10 text-muted-foreground italic bg-white/[0.02]"
                >
                    The resource library is currently being updated. Check back soon!
                </motion.div>
            )}
        </div>
    );
}
