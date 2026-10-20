import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | SHAIDS ACPCE',
    description: 'Privacy Policy for the SHAIDS website — Student Hub for AI & Data Science at A. C. Patil College of Engineering.',
    robots: { index: false, follow: false },
};

export default function PrivacyPage() {
    const year = new Date().getFullYear();
    return (
        <article className="min-h-screen pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-3xl prose dark:prose-invert prose-sm md:prose-base text-foreground">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-foreground">Privacy Policy</h1>
                <p className="text-muted-foreground text-sm mb-8">Last updated: October {year}</p>

                <h2>1. Who We Are</h2>
                <p>
                    SHAIDS (Student Hub for Artificial Intelligence &amp; Data Science) is the official digital platform of the
                    Department of Artificial Intelligence &amp; Data Science at A. C. Patil College of Engineering (ACPCE),
                    Navi Mumbai, Maharashtra, India. This website is operated and maintained by the SHAIDS Tech Team.
                </p>

                <h2>2. Information We Display</h2>
                <p>
                    This website publicly displays the following information about students and faculty members of the AI &amp; DS
                    department:
                </p>
                <ul>
                    <li>Names, roles, and department designations</li>
                    <li>Profile photographs (uploaded by authorized administrators)</li>
                    <li>Academic achievements, NPTEL certifications, and project summaries</li>
                    <li>Professional social profile links (GitHub, LinkedIn, Instagram) — only when voluntarily provided</li>
                    <li>Contact email addresses of faculty members</li>
                </ul>
                <p>
                    All personal information displayed on this website is either publicly available, voluntarily submitted by
                    the individuals concerned, or authorized for publication by the department administration.
                </p>

                <h2>3. Information We Collect</h2>
                <p>
                    This website does <strong>not</strong> use tracking cookies, analytics cookies, or advertising networks.
                    We do not collect any personal data from public visitors.
                </p>
                <p>
                    We use <strong>Supabase</strong> (a cloud database service) to store and serve all content. Supabase may
                    log server-side request metadata (IP addresses, timestamps) as part of its standard infrastructure operation.
                    This data is governed by Supabase&apos;s own{' '}
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                </p>

                <h2>4. Admin Panel</h2>
                <p>
                    Access to the administrative dashboard at <code>/admin</code> is restricted to authorized personnel of
                    the SHAIDS department. Authentication is handled via Supabase Auth. Admin session data is stored in
                    browser <code>sessionStorage</code> only and is cleared when the browser tab is closed or after 3 minutes
                    of inactivity.
                </p>

                <h2>5. Third-Party Services</h2>
                <ul>
                    <li><strong>Supabase</strong> — Database, authentication, and file storage. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                    <li><strong>Unsplash</strong> — Stock photography. <a href="https://unsplash.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                    <li><strong>Vercel</strong> (if deployed on Vercel) — Hosting infrastructure. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                </ul>

                <h2>6. Data Removal Requests</h2>
                <p>
                    If you are a student or faculty member and wish to have your personal information removed or corrected,
                    please contact the department administration. We will process such requests within 15 working days.
                </p>

                <h2>7. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an
                    updated date. Continued use of the website constitutes acceptance of the updated policy.
                </p>

                <h2>8. Contact</h2>
                <p>
                    For any privacy-related queries, please contact the Department of AI &amp; DS at ACPCE, Navi Mumbai, or
                    reach us via our{' '}
                    <a href="https://instagram.com/shaids_acpce/" target="_blank" rel="noopener noreferrer">Instagram page</a>.
                </p>

                <hr />
                <p className="text-xs text-muted-foreground">
                    &copy; {year} Vedant Mahamunkar. Developed for SHAIDS, Department of AI &amp; DS, ACPCE, Navi Mumbai.
                </p>
            </div>
        </article>
    );
}
