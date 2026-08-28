'use client';
import Image from 'next/image';

import React from 'react';
import { Quote, UserCheck, Shield, HeartHandshake, Crown } from 'lucide-react';

export default function LeadershipMessagesPage() {
    const messages = [
        {
            title: "Principal's Message",
            name: "Dr. Sawata R. Deore",
            role: "Principal, ACPCE (BE, ME, PhD Tech.)",
            badge: "Institutional Leadership",
            badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            icon: Shield,
            quote: "Our Main Aim is to Create, Nurture and Shape Technical Professionals with Skills to face the ever changing social, economical and technical landscape of our country. We provide high-end undergraduate Education and Research Opportunities in new Frontiers of Engineering and Technology. We provide opportunities for Students to Interact with Experts from the Industry through Guest Lectures, Industrial Visits and Vocational Training (Internships). We have excellent Faculty, State-of-the-art infrastructure and Laboratories. Spacious campus, digital library and peaceful atmosphere ensures that learning becomes a wonderful Experience.",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
        },
        {
            title: "Head of Department (HoD) Message",
            name: "Mrs. Shilpali Bansu",
            role: "Head of Department & Assistant Professor, AI & DS",
            badge: "Academic Leadership",
            badgeBg: "bg-primary/20 text-primary border-primary/30",
            icon: UserCheck,
            quote: "Welcome to the Department of Artificial Intelligence and Data Science at A. C. Patil College of Engineering. Our department is dedicated to nurturing innovative thinkers, skilled data engineers, and ethical AI professionals. Through cutting-edge laboratory training, industry collaborations, research publications, and annual publications like our departmental magazine SIGMOID, we showcase the remarkable achievements and technical excellence of our students and faculty. I invite you to explore our vibrant department and join us in shaping a smarter, data-driven future.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
        },
        {
            title: "Student Committee President's Message",
            name: "Mihir Gosavi",
            role: "President, SHAIDS Student Committee (2025–26)",
            badge: "Student President (A.Y. 2025-26)",
            badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            icon: Crown,
            quote: "Leading the SHAIDS student body for A.Y. 2025-26 has been an incredible journey. Our objective is to build an inspiring platform for technical excellence, research collaborations, hackathons, and vibrant events like Vectors, Kurukshetra, and Rhythms.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
        },
        {
            title: "Student Committee Vice President's Message",
            name: "Tanay Kotian",
            role: "Vice-President, SHAIDS Student Committee (2025–26)",
            badge: "Student Vice President (A.Y. 2025-26)",
            badgeBg: "bg-pink-500/20 text-pink-400 border-pink-500/30",
            icon: HeartHandshake,
            quote: "As Vice President, my focus was on seamless event execution, workshop organization, and fostering student welfare across all batches in AI & DS.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
        }
    ];

    return (
        <div className="space-y-8 text-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {messages.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="p-8 rounded-[2.5rem] border border-white/10 bg-[#060609]/90 backdrop-blur-xl space-y-6 relative overflow-hidden group hover:border-white/20 transition-all shadow-2xl">
                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${item.badgeBg}`}>
                                    {item.badge}
                                </span>
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground">
                                    <Icon size={20} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                    <Image fill src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">{item.name}</h3>
                                    <p className="text-xs font-semibold text-primary">{item.role}</p>
                                    <p className="text-[11px] text-muted-foreground">{item.title}</p>
                                </div>
                            </div>

                            <div className="relative pt-2 border-t border-white/5">
                                <Quote className="w-8 h-8 text-white/10 absolute -top-3 -left-2 pointer-events-none" />
                                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic pl-6 relative z-10 font-medium">
                                    &ldquo;{item.quote}&rdquo;
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
