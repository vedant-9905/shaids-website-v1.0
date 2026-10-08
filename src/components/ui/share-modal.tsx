'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Send, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    url?: string;
}

export function ShareModal({ isOpen, onClose, title, description, url }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const canNativeShare = React.useSyncExternalStore(
        () => () => {},
        () => typeof navigator !== 'undefined' && typeof navigator.share === 'function',
        () => false
    );

    if (!isOpen) return null;

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareText = `Check out "${title}" on SHAIDS Portal: ${description || ''}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: shareText,
                    url: shareUrl,
                });
                toast.success('Shared successfully!');
                onClose();
            } catch (err) {
                console.log('Share canceled or failed', err);
            }
        }
    };

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    const handleInstagram = () => {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.info('Caption & Link copied! Open Instagram to share in Story or DM.');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-md p-6 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-2xl shadow-2xl text-white overflow-hidden"
                >
                    {/* Glowing background subtle effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                        <div className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold tracking-tight">Share Event</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-muted-foreground hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                        {title}
                    </p>

                    {/* Social Media Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {/* WhatsApp */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all hover:scale-105 group text-emerald-400"
                        >
                            <div className="p-2.5 rounded-xl bg-emerald-500/20 group-hover:scale-110 transition-transform">
                                <Send className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold">WhatsApp</span>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600/20 transition-all hover:scale-105 group text-blue-400"
                        >
                            <div className="p-2.5 rounded-xl bg-blue-600/20 group-hover:scale-110 transition-transform">
                                <Linkedin className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold">LinkedIn</span>
                        </a>

                        {/* X / Twitter */}
                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-all hover:scale-105 group text-sky-400"
                        >
                            <div className="p-2.5 rounded-xl bg-sky-500/20 group-hover:scale-110 transition-transform">
                                <Twitter className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold">X / Twitter</span>
                        </a>

                        {/* Instagram */}
                        <button
                            onClick={handleInstagram}
                            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-all hover:scale-105 group text-pink-400"
                        >
                            <div className="p-2.5 rounded-xl bg-pink-500/20 group-hover:scale-110 transition-transform">
                                <Instagram className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold">Instagram</span>
                        </button>
                    </div>

                    {/* Copy Link Input Bar */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 bg-transparent px-3 text-xs text-muted-foreground focus:outline-none overflow-hidden text-ellipsis"
                            />
                            <Button
                                onClick={handleCopy}
                                size="sm"
                                variant={copied ? "default" : "neon"}
                                className="rounded-xl px-4 h-9 text-xs font-bold gap-1.5 shrink-0"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>

                        {canNativeShare && (
                            <Button
                                onClick={handleNativeShare}
                                variant="outline"
                                className="w-full rounded-2xl h-11 border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold gap-2"
                            >
                                <Share2 className="w-4 h-4" /> Share via System Apps
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
