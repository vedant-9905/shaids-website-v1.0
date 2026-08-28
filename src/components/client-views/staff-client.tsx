'use client';

import { useContent } from '@/context/content-context';
import { StaffCard } from '@/components/team/staff-card';

export function StaffClient() {
    const { staff } = useContent();

    return (
        <div className="container mx-auto px-4 pt-32 pb-24">
            <div className="text-center mb-16 px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 leading-[1.1]">
                    Meet our <span className="text-gradient hover:opacity-80 transition-opacity">Faculty & Staff</span>
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto opacity-60 text-sm md:text-base leading-relaxed">
                    The guiding forces and mentors who empower our students to innovate and excel in AI & Data Science.
                </p>
            </div>

            {staff && staff.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {staff.map((member) => (
                        <StaffCard
                            key={member.id}
                            id={member.id}
                            name={member.name}
                            designation={member.designation}
                            image={member.image_url}
                            email={member.email}
                        />
                    ))}
                </div>
            ) : (
                <div className="p-20 text-center border border-dashed rounded-[2.5rem] border-white/10 text-muted-foreground italic">
                    The faculty list is being updated for the new academic year. Stay tuned!
                </div>
            )}
        </div>
    );
}
