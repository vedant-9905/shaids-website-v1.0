'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Lock, Mail, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const performLocalAuth = () => {
        if (password.length >= 4) {
            sessionStorage.setItem('shaids_admin_session', JSON.stringify({ email, authenticated: true, role: 'admin' }));
            toast.success('Admin Session authenticated (Local Mode)');
            router.push('/admin');
        } else {
            toast.error('Password must be at least 4 characters for local demo mode');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password) {
            toast.error('Please fill in both email and password');
            setLoading(false);
            return;
        }

        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (!error && data.session) {
                    sessionStorage.setItem('shaids_admin_session', JSON.stringify({ email, authenticated: true, role: 'admin' }));
                    toast.success('Successfully logged in as Admin!');
                    router.push('/admin');
                    setLoading(false);
                    return;
                }

                // If Supabase fetch failed or network error occurred, fall back to local authentication
                if (error && (error.message.includes('fetch') || error.message.includes('Network') || error.status === 0)) {
                    console.warn('Supabase authentication unreachable. Falling back to Local Mode.');
                    performLocalAuth();
                } else {
                    toast.error(error?.message || 'Authentication failed');
                }
            } catch (err: unknown) {
                console.warn('Supabase auth network error, falling back to Local Mode:', err);
                performLocalAuth();
            }
        } else {
            performLocalAuth();
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden bg-background">
            {/* Background Glow Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 text-primary mb-4 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                        Admin <span className="text-gradient">Portal</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to manage SHAIDS website content, events, team & staff.
                    </p>
                </div>

                {!isSupabaseConfigured && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
                        <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold">Local Demo Mode Active:</span> You can sign in using any email & password (min 4 chars). To use Supabase, add `NEXT_PUBLIC_SUPABASE_URL` to `.env.local`.
                        </div>
                    </div>
                )}

                <div className="rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-8 shadow-2xl relative overflow-hidden">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@acpce.ac.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            variant="neon"
                            className="w-full rounded-2xl h-12 text-sm font-bold gap-2 mt-2 shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
