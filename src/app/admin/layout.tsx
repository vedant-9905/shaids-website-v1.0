'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import Link from 'next/link';
import { Shield, LogOut, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authenticated, setAuthenticated] = useState<boolean | null>(() => pathname === '/admin/login' ? true : null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = useCallback((isAuto = false) => {
        sessionStorage.removeItem('shaids_admin_session');
        if (supabase) {
            supabase.auth.signOut().catch(() => {});
        }
        setAuthenticated(false);
        if (isAuto) {
            toast.warning('Logged out due to inactivity');
        } else {
            toast.info('Logged out successfully');
        }
        router.push('/admin/login');
    }, [router]);

    // Reset Inactivity Timer
    const resetTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            handleLogout(true);
        }, INACTIVITY_TIMEOUT_MS);
    }, [handleLogout]);

    useEffect(() => {
        if (pathname === '/admin/login' || authenticated === true) {
            return;
        }

        async function checkAuth() {
            let isUserAuthenticated = false;

            // 1. Check local session storage first (instant 0ms check)
            const localSession = sessionStorage.getItem('shaids_admin_session');
            if (localSession) {
                try {
                    const parsed = JSON.parse(localSession);
                    if (parsed && parsed.authenticated) {
                        isUserAuthenticated = true;
                    }
                } catch {
                    sessionStorage.removeItem('shaids_admin_session');
                }
            }

            // 2. If not authenticated via local session, check Supabase with a 1.5s max network timeout
            if (!isUserAuthenticated && isSupabaseConfigured && supabase) {
                try {
                    const sessionPromise = supabase.auth.getSession();
                    const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) =>
                        setTimeout(() => resolve({ data: { session: null } }), 1500)
                    );
                    const { data } = await Promise.race([sessionPromise, timeoutPromise]);
                    if (data?.session) {
                        isUserAuthenticated = true;
                    }
                } catch (err) {
                    console.warn('Supabase auth session check failed:', err);
                }
            }

            setAuthenticated(isUserAuthenticated);
            if (!isUserAuthenticated) {
                router.replace('/admin/login');
            }
        }

        checkAuth();
    }, [pathname, router, authenticated]);

    // Setup Inactivity Listeners
    useEffect(() => {
        if (authenticated && pathname !== '/admin/login') {
            resetTimer();

            const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
            const handleUserActivity = () => resetTimer();

            activityEvents.forEach(evt => window.addEventListener(evt, handleUserActivity));

            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                activityEvents.forEach(evt => window.removeEventListener(evt, handleUserActivity));
            };
        }
    }, [authenticated, pathname, resetTimer]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (authenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Checking Admin Session...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pt-24 md:pt-28">
            {/* Top Admin Sub-Header Bar (Aligned with main Navbar) */}
            <div className="w-full px-4 mb-6 z-30">
                <header className="container mx-auto rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] px-6 py-3 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="flex items-center gap-2.5 font-bold text-base md:text-lg">
                            <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                <Shield size={18} />
                            </div>
                            <span>SHAIDS <span className="text-primary">Admin Panel</span></span>
                        </Link>

                        <div className="hidden md:flex items-center gap-3 ml-2">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                                {isSupabaseConfigured ? 'Connected to Supabase DB' : 'Local Storage Mode'}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                <Clock size={12} className="text-amber-400" /> Auto logout: 3m inactivity
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5 border-white/10 bg-white/5 hover:bg-white/10" asChild>
                            <Link href="/" target="_blank">
                                <ExternalLink size={14} /> View Live Site
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleLogout(false)} className="rounded-full text-xs gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <LogOut size={14} /> Sign Out
                        </Button>
                    </div>
                </header>
            </div>

            {/* Main Admin Body */}
            <main className="flex-1 px-4 max-w-7xl w-full mx-auto">
                {children}
            </main>
        </div>
    );
}
