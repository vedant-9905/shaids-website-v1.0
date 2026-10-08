'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, ExternalLink, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const navLinks = [
    { name: 'About', href: '/about/overview' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'Team', href: '/team' },
    { name: 'Staff', href: '/staff' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();

    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <div className="w-full container mx-auto rounded-full glass-nav bg-white/20 dark:bg-black/30 backdrop-blur-3xl border border-black/10 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 py-3 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/40 hover:border-black/20 dark:hover:border-white/25">

                {/* Left group: Logo + Separator + Nav */}
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0" suppressHydrationWarning>
                        <div className="w-9 h-9 transition-transform group-hover:scale-110 shrink-0" suppressHydrationWarning>
                            <Image src="/images/shaids-logo.png" alt="SHAIDS Logo" width={36} height={36} priority className="object-contain" />
                        </div>
                        <div className="hidden sm:flex flex-col gap-0.5">
                            <span className="text-xl font-bold tracking-tighter text-gradient leading-none">SHAIDS</span>
                            <span className="text-[10px] font-medium text-muted-foreground tracking-wide leading-none opacity-80">
                                Student&apos;s Hub for AI &amp; DS
                            </span>
                        </div>
                    </Link>

                    {/* Separator */}
                    <div className="hidden md:block h-6 w-px bg-black/10 dark:bg-white/10 mx-1" />

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href || (link.href.startsWith('/about') && pathname.startsWith('/about'));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'relative text-sm font-medium px-3.5 py-2 rounded-full transition-colors',
                                        isActive
                                            ? 'text-primary font-bold'
                                            : 'text-muted-foreground/80 hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.span
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-[2px] left-3 right-3 h-[1.5px] bg-primary/80 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                            transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right side: Admin Button + ACPCE + Theme */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/admin" target="_blank">
                        <Button variant="ghost" className="glass h-9 px-3.5 gap-1.5 hover:bg-primary/20 text-muted-foreground hover:text-primary dark:hover:text-primary rounded-full border border-black/10 dark:border-white/10 hover:border-primary/40 font-bold text-xs transition-all">
                            <Shield size={14} className="text-primary" />
                            <span>Admin</span>
                        </Button>
                    </Link>

                    <Link href="https://acpce.ac.in" target="_blank" className="shrink-0">
                        <Button variant="ghost" className="glass h-9 px-3 gap-2 hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground dark:hover:text-white rounded-full border border-black/10 dark:border-white/10 hover:border-white/20">
                            <div className="w-5 h-5 shrink-0 flex items-center justify-center" suppressHydrationWarning>
                                <Image src="/images/acpce-logo-v2.png" alt="ACPCE" width={20} height={20} className="object-contain" />
                            </div>
                            <span className="text-xs font-medium hidden lg:inline">ACPCE</span>
                        </Button>
                    </Link>

                    <ModeToggle />
                </div>

                {/* Mobile toggle */}
                <div className="flex md:hidden items-center gap-1 sm:gap-2">
                    <ModeToggle />
                    <button
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            <motion.div
                initial={false}
                animate={isOpen ? { height: 'auto', opacity: 1, scale: 1 } : { height: 0, opacity: 0, scale: 0.97 }}
                className="md:hidden absolute top-20 left-4 right-4 rounded-2xl overflow-hidden glass bg-white/80 dark:bg-black/60 backdrop-blur-3xl border border-black/10 dark:border-white/10 shadow-2xl origin-top z-40"
            >
                <nav className="flex flex-col p-4 gap-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-base font-medium transition-colors px-4 py-3 rounded-xl',
                                pathname === link.href
                                    ? 'text-primary bg-primary/10 font-bold'
                                    : 'text-muted-foreground hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/admin"
                        target="_blank"
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-primary font-bold hover:bg-primary/10 transition-colors text-base"
                        onClick={() => setIsOpen(false)}
                    >
                        <span className="flex items-center gap-2">
                            <Shield size={16} /> Admin Panel
                        </span>
                    </Link>
                    <Link
                        href="https://acpce.ac.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Visit ACPCE <ExternalLink size={15} />
                    </Link>
                </nav>
            </motion.div>
        </header>
    );
}
