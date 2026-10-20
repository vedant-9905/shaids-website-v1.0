'use client';

import { motion } from 'framer-motion';
import { useContent } from '@/context/content-context';
import { StaffCard } from '@/components/team/staff-card';
import { GraduationCap } from 'lucide-react';

export function StaffClient() {
    const { staff } = useContent();

    return (
        <div className="relative container mx-auto px-4 pt-32 pb-24 overflow-hidden">
            {/* Ambient Background Spotlight */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-primary/15 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="text-center mb-16 px-4 space-y-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 mb-2"
                >
                    <GraduationCap size={15} /> Academic Mentorship
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
                >
                    Meet our <span className="text-gradient">Faculty &amp; Staff</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed"
                >
                    The guiding forces and mentors who empower our students to innovate and excel in AI &amp; Data Science.
                </motion.p>
            </div>

            {staff && staff.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {staff.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
                        >
                            <StaffCard
                                id={member.id}
                                name={member.name}
                                designation={member.designation}
                                image={member.image_url}
                                email={member.email}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-16 md:p-20 text-center border border-dashed rounded-[2.5rem] border-primary/20 bg-white/70 dark:bg-primary/[0.03] backdrop-blur-xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-2xl mx-auto space-y-3"
                >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20">
                        <GraduationCap size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Faculty Roster Updating</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The faculty &amp; staff roster is currently being synchronized for the current academic session. Stay tuned!
                    </p>
                </motion.div>
            )}
        </div>
    );
}
