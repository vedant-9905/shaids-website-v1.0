'use client';

import { motion } from 'framer-motion';
import { Download, ExternalLink, FileText, Map, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceProps {
    id: string;
    title: string;
    description: string;
    category: string;
    link: string;
    author?: string;
}

export function ResourceCard({ id, title, description, category, link, author }: ResourceProps) {
    const isExternal = link.startsWith('http://') || link.startsWith('https://');

    let icon = <FileText size={24} className="text-primary" />;
    if (category?.toLowerCase().includes('roadmap')) {
        icon = <Map size={24} className="text-secondary" />;
    } else if (category?.toLowerCase().includes('manual') || category?.toLowerCase().includes('paper')) {
        icon = <BookOpen size={24} className="text-emerald-400" />;
    } else if (category?.toLowerCase().includes('notes')) {
        icon = <Layers size={24} className="text-sky-400" />;
    }

    return (
        <motion.div
            data-resource-id={id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            className="flex flex-col rounded-[2.5rem] border border-black/[0.08] dark:border-white/15 bg-white/90 dark:bg-[#0c0919]/80 backdrop-blur-2xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl dark:hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] p-8 group"
        >
            {/* Subtle top glare */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 to-transparent z-10" />

            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm">
                    {icon}
                </div>
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {category || 'Resource'}
                </span>
            </div>

            <h3 className="text-xl font-bold mb-2 text-foreground transition-colors">
                {title}
            </h3>

            <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                {description}
            </p>

            {author && (
                <div className="mb-4 text-[11px] font-medium text-muted-foreground">
                    Shared by: <span className="text-foreground font-bold">{author}</span>
                </div>
            )}

            <div className="mt-auto">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 rounded-2xl h-11 text-xs font-bold"
                    asChild
                >
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        {isExternal ? "Open Resource" : "Download File"}
                        {isExternal ? <ExternalLink size={14} /> : <Download size={14} />}
                    </a>
                </Button>
            </div>
        </motion.div>
    );
}
