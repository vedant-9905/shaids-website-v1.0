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
            whileHover={{ y: -5 }}
            className="flex flex-col rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-white/20 p-8 group"
        >
            {/* Subtle top glare */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    {icon}
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
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
                <div className="mb-4 text-[11px] font-medium text-muted-foreground/80">
                    Shared by: <span className="text-white font-bold">{author}</span>
                </div>
            )}

            <div className="mt-auto">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 rounded-2xl h-11 text-xs font-bold"
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
