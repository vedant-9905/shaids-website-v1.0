'use client';

import { useContent } from '@/context/content-context';
import { ResourceCard } from '@/components/resources/resource-card';

export function ResourcesClient() {
    const { resources } = useContent();

    return (
        <div className="container mx-auto px-4 pt-32 pb-24 min-h-screen">
            <div className="mb-16 text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Student <span className="text-gradient">Resources</span>
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto opacity-60 text-sm md:text-base leading-relaxed">
                    Curated tools, lecture notes, lab manuals, and roadmaps to help you ace your exams and accelerate your build journey in AI & DS.
                </p>
            </div>

            {resources && resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            id={resource.id}
                            title={resource.title}
                            description={resource.description}
                            category={resource.category}
                            link={resource.link}
                            author={resource.author}
                        />
                    ))}
                </div>
            ) : (
                <div className="p-20 text-center border border-dashed rounded-[2.5rem] border-white/10 text-muted-foreground italic">
                    The resource library is currently being updated. Check back soon!
                </div>
            )}
        </div>
    );
}
