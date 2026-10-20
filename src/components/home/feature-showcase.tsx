'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, BookOpen, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContent } from '@/context/content-context';

export function FeatureShowcase() {
    const { homeConfig } = useContent();

    const features = [
        {
            title: "Explore Events",
            description: "Stay updated with the latest news, events, and activities. From coding competitions to expert seminars, there's something for everyone.",
            link: "/events",
            icon: <Calendar className="w-6 h-6" />,
            color: "from-pink-500 to-rose-600",
            buttonText: "Explore events",
            buttonStyle: "border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-300 hover:bg-pink-500 hover:text-white dark:hover:text-white hover:border-pink-400 hover:shadow-[0_0_35px_rgba(236,72,153,0.7)]",
            image: homeConfig?.image_events || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
            delay: 0
        },
        {
            title: "Meet the Team",
            description: "Get to know the passionate students driving SHAIDS forward. Our core committee works tirelessly to bring you the best opportunities.",
            link: "/team",
            icon: <Users className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500",
            buttonText: "Meet the team",
            buttonStyle: "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500 hover:text-white dark:hover:text-white hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.7)]",
            image: homeConfig?.image_team || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
            delay: 0.2
        },
        {
            title: "Curated Resources",
            description: "Access a treasure trove of learning materials. Start your journey with our hand-picked roadmaps, notes, and tools for AI & Data Science.",
            link: "/resources",
            icon: <BookOpen className="w-6 h-6" />,
            color: "from-emerald-500 to-green-500",
            buttonText: "Explore resources",
            buttonStyle: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white dark:hover:text-white hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.7)]",
            image: homeConfig?.image_resources || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
            delay: 0.4
        },
        {
            title: "Faculty & Staff",
            description: "Guided by wisdom, fueled by passion. Meet the mentors and faculty advisors who support and steer our vision towards excellence.",
            link: "/staff",
            icon: <UserCheck className="w-6 h-6" />,
            color: "from-orange-500 to-amber-500",
            buttonText: "Meet our faculty",
            buttonStyle: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:bg-amber-500 hover:text-white dark:hover:text-white hover:border-amber-400 hover:shadow-[0_0_35px_rgba(245,158,11,0.7)]",
            image: homeConfig?.image_staff || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80",
            delay: 0.6
        }
    ];

    return (
        <section className="pt-24 md:pt-36 pb-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-24">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className={cn(
                                "flex flex-col lg:flex-row items-center gap-12 group",
                                index % 2 === 1 ? "lg:flex-row-reverse" : ""
                            )}
                        >
                            {/* Text Content */}
                            <div className="flex-1 space-y-6">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg mb-4", feature.color)}>
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                    {feature.title}
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                                    {feature.description}
                                </p>
                                <div className="pt-4">
                                    <Link href={feature.link}>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className={cn(
                                                "relative overflow-hidden rounded-full font-bold backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group/btn cursor-pointer gap-2",
                                                feature.buttonStyle
                                            )}
                                        >
                                            {/* Shimmer sweep animation on hover */}
                                            <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:animate-[shimmer_1.2s_ease-in-out_infinite] pointer-events-none" />

                                            <span className="relative z-10 flex items-center">
                                                {feature.buttonText} <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                                            </span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="flex-1 w-full">
                                <div className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#050505]/40 backdrop-blur-3xl shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-white/20">
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />

                                    <Image
                                        fill
                                        src={feature.image}
                                        alt={feature.title}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        quality={80}
                                        loading="lazy"
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* Decorative shine effect */}
                                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent group-hover:animate-shimmer pointer-events-none" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
