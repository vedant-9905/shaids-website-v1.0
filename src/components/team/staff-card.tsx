'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface StaffMemberProps {
    id: string;
    name: string;
    designation: string;
    image?: string;
    email?: string;
    department?: string;
}

export function StaffCard({ id, name, designation, image, email, department }: StaffMemberProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="flex flex-col rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] hover:border-white/20 p-8 items-center text-center group"
        >
            {/* Subtle top glare */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

            <div className="w-32 h-32 rounded-full mb-6 overflow-hidden relative border-2 border-sky-400/20 flex items-center justify-center bg-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                {image ? (
                    <Image src={image} alt={name} fill sizes="128px" className="object-cover" />
                ) : (
                    <span className="text-5xl opacity-40">🎓</span>
                )}
            </div>

            <h3 className="text-2xl font-bold mb-1 text-foreground">
                <Link href={`/staff/${id}`}>
                    {name}
                </Link>
            </h3>
            <p className="text-sky-400 font-semibold text-xs uppercase tracking-wider mb-2">{designation}</p>
            <p className="text-muted-foreground text-[11px] font-medium mb-6">{department || 'Artificial Intelligence & Data Science'}</p>

            <Link href={`/staff/${id}`} className="w-full mb-6">
                <Button variant="outline" className="w-full rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-xs h-10 gap-1.5 font-bold">
                    View Profile <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>

            <div className="flex gap-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                {email && (
                    <a href={`mailto:${email}`} className="text-muted-foreground hover:text-sky-400 transition-colors">
                        <Mail size={18} />
                    </a>
                )}
            </div>
        </motion.div>
    );
}
