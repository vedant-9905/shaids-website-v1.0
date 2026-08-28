'use client';

import { useContent } from '@/context/content-context';
import { TeamCard } from '@/components/team/team-card';
import { AcademicYearToggle } from '@/components/academic-year-toggle';

export function TeamClient() {
    const { team, academicYear } = useContent();

    const filteredTeam = team ? team.filter(member => !member.academicYear || member.academicYear === academicYear) : [];

    return (
        <div className="container mx-auto px-4 pt-32 pb-24">
            <div className="text-center mb-10 px-4 space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 leading-[1.1]">
                    Meet the minds behind <span className="text-gradient hover:opacity-80 transition-opacity">SHAIDS</span>
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto opacity-60 text-sm md:text-base leading-relaxed">
                    Working together to build a thriving ecosystem for the next generation of AI & Data Science innovators.
                </p>

                <div className="pt-2 flex justify-center">
                    <AcademicYearToggle />
                </div>
            </div>

            {filteredTeam.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTeam.map((member) => (
                        <TeamCard
                            key={member.id}
                            id={member.id}
                            name={member.name}
                            role={member.role}
                            image={member.image_url}
                            github={member.github}
                            linkedin={member.linkedin}
                        />
                    ))}
                </div>
            ) : (
                <div className="p-20 text-center border border-dashed rounded-[2.5rem] border-white/10 text-muted-foreground italic">
                    No student committee records found for {academicYear}.
                </div>
            )}
        </div>
    );
}
