import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { FeatureShowcase } from "@/components/home/feature-showcase";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <About />
            <FeatureShowcase />
        </div>
    );
}
