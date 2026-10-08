'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Users, Trophy } from 'lucide-react';

const features = [
    {
        icon: <Users className="w-8 h-8 text-primary" />,
        title: "Community Driven",
        description: "Built by students, for students. We foster a collaborative environment where knowledge is shared freely."
    },
    {
        icon: <Lightbulb className="w-8 h-8 text-secondary" />,
        title: "Innovation First",
        description: "From Generative AI to Big Data, we explore the cutting edge of technology through hands-on projects."
    },
    {
        icon: <Trophy className="w-8 h-8 text-accent" />,
        title: "Excellence",
        description: "Participate in seminars, webinars, workshops, and competitions to hone your skills and showcase your talent."
    }
];

export function About() {
    return (
        <section className="pt-20 pb-32 relative overflow-hidden bg-gradient-to-b from-black/5 dark:from-black/80 to-background/50 dark:bg-black/40 backdrop-blur-3xl shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-4"
                    >
                        About <span className="text-gradient">SHAIDS</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl mx-auto"
                    >
                        SHAIDS is the vibrant heart of Department of Artificial Intelligence and Data Science at ACPCE. We bridge the gap between academic learning and industry demands.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-2 group"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />
                            <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
