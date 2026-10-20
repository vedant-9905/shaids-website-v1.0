import Link from 'next/link';
import { Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-black/10 dark:border-white/5 bg-zinc-50 dark:bg-[#050505] py-12 transition-colors duration-300">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                        SHAIDS <span className="text-primary text-3xl leading-none">.</span>
                    </Link>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center md:text-left">
                        Student&apos;s Hub for AI &amp; DS at ACPCE.<br />
                        Innovating the Future.
                    </p>
                    <Link
                        href="/admin"
                        className="text-xs text-zinc-500 dark:text-zinc-600 hover:text-primary transition-colors mt-1"
                    >
                        Admin Panel
                    </Link>
                </div>

                <div className="flex gap-6">
                    <Link href="https://instagram.com/shaids_acpce/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-2">
                        <Instagram size={20} />
                        <span className="hidden sm:inline text-sm font-medium">Instagram</span>
                    </Link>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="text-xs text-zinc-500 dark:text-zinc-600" suppressHydrationWarning>
                        &copy; {new Date().getFullYear()} Vedant Mahamunkar. All rights reserved.
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-600">
                        Developed for SHAIDS &mdash; Dept. of AI &amp; DS, ACPCE.
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                        <Link href="/privacy" className="text-xs text-zinc-500 dark:text-zinc-600 hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-zinc-600 dark:text-zinc-700 text-xs">·</span>
                        <Link href="/terms" className="text-xs text-zinc-500 dark:text-zinc-600 hover:text-primary transition-colors">
                            Terms of Use
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
