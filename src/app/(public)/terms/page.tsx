import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use | SHAIDS ACPCE',
    description: 'Terms of Use for the SHAIDS website — Student Hub for AI & Data Science at A. C. Patil College of Engineering.',
    robots: { index: false, follow: false },
};

export default function TermsPage() {
    const year = new Date().getFullYear();
    return (
        <main className="min-h-screen pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-3xl prose prose-invert prose-sm md:prose-base">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Terms of Use</h1>
                <p className="text-muted-foreground text-sm mb-8">Last updated: October {year}</p>

                <h2>1. Acceptance</h2>
                <p>
                    By accessing and using the SHAIDS website (<strong>shaids-acpce.org</strong>), you agree to be bound
                    by these Terms of Use. If you do not agree to these terms, please do not use this website.
                </p>

                <h2>2. About This Website</h2>
                <p>
                    SHAIDS is the official digital platform of the Department of Artificial Intelligence &amp; Data Science
                    at A. C. Patil College of Engineering (ACPCE), Navi Mumbai. It is intended for informational purposes
                    and for the benefit of students, faculty, and the public interested in the department&apos;s activities.
                </p>

                <h2>3. Intellectual Property</h2>
                <p>
                    All content on this website — including but not limited to text, design, code, graphics, logos, images,
                    and data — is the intellectual property of Vedant Mahamunkar and/or the Department of AI &amp; DS, ACPCE,
                    unless otherwise stated.
                </p>
                <p>
                    &copy; {year} Vedant Mahamunkar. All rights reserved. Developed for SHAIDS, Dept. of AI &amp; DS, ACPCE.
                </p>
                <p>
                    You may not reproduce, distribute, modify, or republish any content from this website without prior written
                    permission from the copyright holder.
                </p>

                <h2>4. Permitted Use</h2>
                <p>You may:</p>
                <ul>
                    <li>View and share links to pages on this website</li>
                    <li>Reference publicly posted event details, team profiles, and resources for personal or academic purposes</li>
                    <li>Download resources explicitly provided for download</li>
                </ul>
                <p>You may not:</p>
                <ul>
                    <li>Scrape, crawl, or harvest data from this website using automated tools</li>
                    <li>Attempt to gain unauthorized access to the admin panel or backend systems</li>
                    <li>Use content from this website for commercial purposes without written permission</li>
                    <li>Misrepresent content from this website or present it out of context</li>
                </ul>

                <h2>5. Admin Panel Access</h2>
                <p>
                    The administrative dashboard is restricted to authorized SHAIDS personnel only. Unauthorized access
                    attempts are a violation of these Terms and may constitute an offence under the Information Technology
                    Act, 2000 (India) and related laws.
                </p>

                <h2>6. Accuracy of Information</h2>
                <p>
                    While we strive to keep all information on this website accurate and up to date, we make no warranties
                    about the completeness, accuracy, or reliability of any content. Academic results, event details, and
                    team information are subject to change.
                </p>

                <h2>7. External Links</h2>
                <p>
                    This website may contain links to external websites (e.g., ACPCE, Unsplash, GitHub). We are not
                    responsible for the content or privacy practices of those external sites.
                </p>

                <h2>8. Disclaimer of Liability</h2>
                <p>
                    This website is provided on an &quot;as is&quot; basis. The department and the developer shall not be
                    liable for any damages arising from the use of or inability to use this website, including any
                    inaccuracies in content or temporary unavailability of services.
                </p>

                <h2>9. Governing Law</h2>
                <p>
                    These Terms of Use are governed by the laws of India, including the Information Technology Act, 2000
                    and its amendments. Any disputes shall be subject to the jurisdiction of courts in Navi Mumbai,
                    Maharashtra, India.
                </p>

                <h2>10. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these Terms of Use at any time. Continued use of the website after
                    changes constitutes acceptance of the updated terms.
                </p>

                <h2>11. Contact</h2>
                <p>
                    For any queries regarding these Terms, please contact the Department of AI &amp; DS at ACPCE, Navi Mumbai,
                    or reach us via our{' '}
                    <a href="https://instagram.com/shaids_acpce/" target="_blank" rel="noopener noreferrer">Instagram page</a>.
                </p>

                <hr />
                <p className="text-xs text-muted-foreground">
                    &copy; {year} Vedant Mahamunkar. Developed for SHAIDS, Department of AI &amp; DS, ACPCE, Navi Mumbai.
                </p>
            </div>
        </main>
    );
}
