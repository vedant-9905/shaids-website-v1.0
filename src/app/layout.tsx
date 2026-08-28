import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SHAIDS | Student Hub for AI & Data Science - ACPCE",
    template: "%s | SHAIDS ACPCE",
  },
  description: "Official portal of the Department of Artificial Intelligence & Data Science (AI & DS) at A. C. Patil College of Engineering (ACPCE), Navi Mumbai. Hub for student research, AI projects, NPTEL achievements, and flagship fests VECTORS, KURUKSHETRA & RHYTHMS.",
  keywords: [
    "SHAIDS", "ACPCE", "AI & DS", "Artificial Intelligence", "Data Science",
    "Navi Mumbai Engineering", "A. C. Patil College of Engineering", "VECTORS Fest",
    "KURUKSHETRA Fest", "RHYTHMS Fest", "SIGMOID Magazine", "Student Research", "Machine Learning"
  ],
  authors: [{ name: "Department of AI & DS, ACPCE" }],
  openGraph: {
    title: "SHAIDS | Student Hub for AI & Data Science - ACPCE",
    description: "Explore innovation, student research, hackathons, academic excellence, and annual flagship fests at ACPCE AI & DS Department.",
    url: "https://shaids-acpce.org",
    siteName: "SHAIDS ACPCE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SHAIDS | Student Hub for AI & Data Science - ACPCE",
    description: "Official portal of the Department of Artificial Intelligence & Data Science at A. C. Patil College of Engineering.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "SHAIDS - Department of Artificial Intelligence & Data Science, ACPCE",
  "url": "https://shaids-acpce.org",
  "parentOrganization": {
    "@type": "CollegeOrUniversity",
    "name": "A. C. Patil College of Engineering",
    "url": "https://acpce.org"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Navi Mumbai",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  },
  "department": "Artificial Intelligence & Data Science"
};


import { ContentProvider } from "@/context/content-context";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ContentProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster richColors position="top-right" />
            </ContentProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
