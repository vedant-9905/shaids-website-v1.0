'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, BookOpen, Cpu, Database, Brain, Globe, ShieldCheck, Building2 } from 'lucide-react';

export default function DepartmentOverviewPage() {
    const peos = [
        {
            number: 'PEO 1',
            title: 'Lifelong Learning & Technological Adaptation',
            desc: 'To engage in lifelong learning adapt with rapidly changing technologies in the field of Artificial Intelligence & Data Science.'
        },
        {
            number: 'PEO 2',
            title: 'Effective Teamwork & Ethical Responsibility',
            desc: 'To work effectively in team and exhibit ethical responsibilities.'
        },
        {
            number: 'PEO 3',
            title: 'Multidisciplinary AI Systems Implementation',
            desc: 'To enhance proficiency across multidisciplinary domains of engineering for the effective implementation of AI systems.'
        },
    ];

    const psos = [
        {
            number: 'PSO 1',
            title: 'Programming Science & Data Insights',
            desc: 'Exhibit proficiency of programming science, and security while extracting insights from the principles of Artificial Intelligence and Data science.'
        },
        {
            number: 'PSO 2',
            title: 'Engineering Practices & System Enhancement',
            desc: 'Apply professional engineering practices, development, implementation and enhancement in AI systems.'
        },
    ];

    const domains = [
        {
            title: 'Machine Learning & Neural Networks',
            icon: Brain,
            desc: 'Supervised, unsupervised, reinforcement learning algorithms, neural network design, and automated MLOps pipelines.'
        },
        {
            title: 'Big Data & Cloud Infrastructure',
            icon: Database,
            desc: 'Distributed computing architectures, high-performance data engineering, and enterprise cloud data pipelines.'
        },
        {
            title: 'Natural Language Processing & GenAI',
            icon: Cpu,
            desc: 'Transformer architectures, large language models (LLMs), semantic analysis, and conversational AI agents.'
        },
        {
            title: 'Computer Vision & Edge Computing',
            icon: Globe,
            desc: 'Real-time image classification, object detection (YOLOv8), pose estimation, and micro-controller edge deployment.'
        },
    ];

    return (
        <div className="space-y-14 text-slate-100">
            {/* Department Introduction Banner */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-[#07070f]/90 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                        <Building2 size={22} />
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-black border border-primary/30 uppercase tracking-[0.2em]">
                        About Department
                    </span>
                </div>
                
                <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                    <p>
                        The Department of Artificial Intelligence &amp; Data Science (AI&amp;DS) was established in <strong className="text-white font-semibold">2021</strong> with an initial intake of 60 students. In recognition of the growing demand for AI professionals and the department&apos;s steady academic progress, the intake was expanded to <strong className="text-amber-300 font-semibold">120 students</strong> from the Academic Year <strong className="text-white font-semibold">2024–25</strong>.
                    </p>
                    <p>
                        The department is committed to providing quality education in Artificial Intelligence, Machine Learning, Data Science, Deep Learning, Computer Vision, and emerging technologies through an industry-oriented curriculum that combines strong theoretical foundations with practical learning.
                    </p>
                    <p>
                        Supported by modern laboratories and a team of qualified, dedicated faculty members, the department fosters innovation, research, technical excellence, and holistic student development. Students actively participate in projects, internships, workshops, seminars, hackathons, coding competitions, certification programs, and research activities.
                    </p>
                </div>
            </motion.div>

            {/* Vision & Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vision */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="p-8 md:p-10 rounded-[2.5rem] border border-primary/30 bg-gradient-to-br from-primary/20 via-[#07070e] to-black space-y-5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 group-hover:scale-110 transition-transform duration-300">
                        <Target size={28} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Department Vision</h2>
                    <p className="text-slate-200 leading-relaxed text-base md:text-lg font-medium italic">
                        &ldquo;To develop professionals in Artificial Intelligence &amp; Data Science Engineering who are socially responsible to meet the needs of society and industries.&rdquo;
                    </p>
                </motion.div>

                {/* Mission */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="p-8 md:p-10 rounded-[2.5rem] border border-secondary/30 bg-gradient-to-br from-secondary/20 via-[#07070e] to-black space-y-5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                    <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30 group-hover:scale-110 transition-transform duration-300">
                        <Compass size={28} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Department Mission</h2>
                    <ul className="text-slate-200 leading-relaxed text-sm md:text-base font-medium space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                            <span>To offer a strong base knowledge through theory, hands-on lab experience, and the use of the latest technology.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                            <span>To offer a platform for engaging with professionals from the industry.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                            <span>To inculcate social awareness through co-curricular and extracurricular activities.</span>
                        </li>
                    </ul>
                </motion.div>
            </div>

            {/* Core Domains */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                >
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Core Technical Domains</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {domains.map((dom, i) => {
                        const Icon = dom.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="p-6 rounded-3xl border border-white/10 bg-white/5 space-y-3 hover:border-primary/40 hover:bg-white/10 transition-all duration-300 shadow-lg group relative overflow-hidden"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                                    <Icon size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-white leading-snug">{dom.title}</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">{dom.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* PEO & PSO Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PEOs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="p-8 md:p-10 rounded-[2.5rem] border border-white/10 bg-[#06060c]/90 backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                        <BookOpen className="text-primary" size={24} />
                        Program Educational Objectives (PEOs)
                    </h2>
                    <div className="space-y-4">
                        {peos.map((peo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-primary/30 hover:bg-white/[0.08] transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-black tracking-wider uppercase border border-primary/30">
                                        {peo.number}
                                    </span>
                                    <h4 className="font-bold text-base text-white">{peo.title}</h4>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed pl-1">{peo.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* PSOs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="p-8 md:p-10 rounded-[2.5rem] border border-white/10 bg-[#06060c]/90 backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
                    <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                        <ShieldCheck className="text-secondary" size={24} />
                        Program Specific Outcomes (PSOs)
                    </h2>
                    <div className="space-y-4">
                        {psos.map((pso, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-secondary/30 hover:bg-white/[0.08] transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-secondary/20 text-secondary text-xs font-black tracking-wider uppercase border border-secondary/30">
                                        {pso.number}
                                    </span>
                                    <h4 className="font-bold text-base text-white">{pso.title}</h4>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed pl-1">{pso.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
