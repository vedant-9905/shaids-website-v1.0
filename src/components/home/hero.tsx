'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
            {/* Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-[100%] blur-[120px] -z-10 opacity-30 mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="text-left pt-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                        className="font-bold tracking-tighter mb-8"
                    >
                        <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground block mb-2">
                            Innovating
                        </span>
                        <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-fuchsia-500 to-secondary drop-shadow-[0_0_50px_rgba(124,58,237,0.3)]">
                            Intelligence
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
                    >
                        The official student community of <strong className="text-foreground font-semibold">Department of Artificial Intelligence & Data Science at ACPCE</strong>.
                        We are the bridge between academic theory and the cutting-edge reality of <span className="text-foreground font-semibold">AI & Data Science.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-start justify-start gap-6"
                    >
                        <Link href="/events">
                            <Button size="lg" className="h-12 px-8 text-base rounded-full border border-primary/50 bg-primary/20 hover:bg-primary/30 text-foreground dark:text-purple-100 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] cursor-pointer font-bold gap-2">
                                Explore Events
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Content - Morphing Logos */}
                <div className="hidden lg:flex justify-center items-center relative h-[500px] w-full perspective-1000 translate-x-12">
                    <LogoMorph />
                </div>
            </div>
            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
}

const LOGOS = [
    { src: "/images/shaids-logo.png", duration: 5000 },
    { src: "/images/acpce-logo-v2.png", duration: 4000 }
];

function LogoMorph() {
    const [currentLogo, setCurrentLogo] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentLogo((prev) => (prev + 1) % LOGOS.length);
        }, LOGOS[currentLogo].duration);

        return () => clearTimeout(timer);
    }, [currentLogo]);

    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            {/* Dynamic Glow */}
            <div className={`absolute inset-0 rounded-full blur-[100px] transition-colors duration-1000 ${currentLogo === 0 ? 'bg-primary/20' : 'bg-sky-500/20'} animate-pulse`} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentLogo}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div
                        className="relative drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                        style={{
                            width: currentLogo === 0 ? '340px' : '260px',
                            height: currentLogo === 0 ? '340px' : '260px'
                        }}
                    >
                        <Image
                            src={LOGOS[currentLogo].src}
                            alt="Logo"
                            fill
                            sizes="(max-width: 768px) 260px, 340px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
