'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 lg:pt-20 lg:pb-32">
            {/* Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-[100%] blur-[120px] -z-10 opacity-30 mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left pt-6 lg:pt-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                        className="font-bold tracking-tighter mb-6 lg:mb-8"
                    >
                        <span className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl text-foreground block mb-2">
                            Innovating
                        </span>
                        <span className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-fuchsia-500 to-secondary drop-shadow-[0_0_50px_rgba(124,58,237,0.3)]">
                            Intelligence
                        </span>
                    </motion.h1>

                    {/* Mobile Logo Showcase */}
                    <div className="flex lg:hidden justify-center items-center my-6">
                        <LogoMorph isMobile />
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-6 lg:mb-12 leading-relaxed"
                    >
                        The official student community of <strong className="text-foreground font-semibold">Department of Artificial Intelligence &amp; Data Science at ACPCE</strong>.
                        We are the bridge between academic theory and the cutting-edge reality of <span className="text-foreground font-semibold">AI &amp; Data Science.</span>
                    </motion.p>
                </div>

                {/* Right Content - Morphing Logos for Desktop */}
                <div className="hidden lg:flex justify-center items-center relative h-[440px] w-full perspective-1000">
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

function LogoMorph({ isMobile = false }: { isMobile?: boolean }) {
    const [currentLogo, setCurrentLogo] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentLogo((prev) => (prev + 1) % LOGOS.length);
        }, LOGOS[currentLogo].duration);

        return () => clearTimeout(timer);
    }, [currentLogo]);

    const boxSize = isMobile ? 'w-[220px] h-[220px]' : 'w-[400px] h-[400px]';
    const logoDimension = isMobile
        ? (currentLogo === 0 ? '160px' : '120px')
        : (currentLogo === 0 ? '280px' : '220px');

    return (
        <div className={`relative ${boxSize} flex items-center justify-center`}>
            {/* Dynamic Glow */}
            <div className={`absolute inset-0 rounded-full blur-[80px] lg:blur-[100px] transition-colors duration-1000 ${currentLogo === 0 ? 'bg-primary/25' : 'bg-sky-500/25'} animate-pulse`} />

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
                        className="relative drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        style={{
                            width: logoDimension,
                            height: logoDimension
                        }}
                    >
                        <Image
                            src={LOGOS[currentLogo].src}
                            alt="Logo"
                            fill
                            sizes={isMobile ? "160px" : "280px"}
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
            {/* Preload both logos to eliminate any decode stutter on morph */}
            <div className="hidden pointer-events-none" aria-hidden="true">
                <Image src="/images/shaids-logo.png" alt="" width={280} height={280} priority />
                <Image src="/images/acpce-logo-v2.png" alt="" width={220} height={220} priority />
            </div>
        </div>
    );
}
