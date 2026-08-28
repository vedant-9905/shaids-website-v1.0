-- ==========================================================
-- SHAIDS WEB PLATFORM - COMPLETE SUPABASE SCHEMA FROM SCRATCH
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==========================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Clean Existing Tables (Fresh Build from Scratch)
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.team CASCADE;
DROP TABLE IF EXISTS public.staff CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.nptel CASCADE;
DROP TABLE IF EXISTS public.highlights CASCADE;
DROP TABLE IF EXISTS public.fest_sub_events CASCADE;
DROP TABLE IF EXISTS public.fest_galleries CASCADE;
DROP TABLE IF EXISTS public.toppers CASCADE;
DROP TABLE IF EXISTS public.domain_awards CASCADE;
DROP TABLE IF EXISTS public.home_config CASCADE;

-- 3. Create Events Table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    date TEXT NOT NULL,
    end_date TEXT,
    time TEXT,
    location TEXT NOT NULL,
    image_url TEXT,
    type TEXT DEFAULT 'Workshop',
    category TEXT DEFAULT 'Technical Event',
    organizer TEXT DEFAULT 'SHAIDS Core Team',
    brochure_url TEXT,
    registration_url TEXT,
    has_registration BOOLEAN DEFAULT true,
    is_past BOOLEAN DEFAULT false,
    academic_year TEXT DEFAULT '2026-27',
    gallery_images TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Team Members Table
CREATE TABLE public.team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    category TEXT DEFAULT 'Core Office Bearers',
    image_url TEXT,
    github TEXT,
    linkedin TEXT,
    instagram TEXT,
    email TEXT,
    bio TEXT,
    graduation_year TEXT,
    academic_year TEXT DEFAULT '2026-27',
    skills TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Staff / Faculty Table
CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT DEFAULT 'Artificial Intelligence & Data Science',
    qualification TEXT,
    expertise TEXT[] DEFAULT '{}',
    email TEXT,
    image_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Resources Table
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    link TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author TEXT DEFAULT 'SHAIDS Technical Team',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Projects Table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    abstract TEXT NOT NULL,
    team TEXT[] DEFAULT '{}',
    advisor TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    image TEXT,
    gallery TEXT[] DEFAULT '{}',
    academic_year TEXT DEFAULT '2026-27',
    github TEXT,
    demo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create NPTEL Certifications Table
CREATE TABLE public.nptel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    course TEXT NOT NULL,
    cert TEXT NOT NULL,
    score TEXT NOT NULL,
    year TEXT NOT NULL,
    academic_year TEXT DEFAULT '2026-27',
    is_faculty BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Department Highlights Table
CREATE TABLE public.highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    team TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    achievement TEXT,
    image TEXT,
    gallery TEXT[] DEFAULT '{}',
    academic_year TEXT DEFAULT '2026-27',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create Fest Sub-Events Table
CREATE TABLE public.fest_sub_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fest_id TEXT NOT NULL,
    title TEXT NOT NULL,
    organizer TEXT NOT NULL,
    winner TEXT NOT NULL,
    runner_up TEXT NOT NULL,
    desc_text TEXT NOT NULL,
    detailed_info TEXT,
    image TEXT,
    academic_year TEXT DEFAULT '2026-27',
    event_gallery TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Create Fest Galleries Table
CREATE TABLE public.fest_galleries (
    id TEXT PRIMARY KEY,
    gallery TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Create Toppers Table
CREATE TABLE public.toppers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sem_type TEXT NOT NULL,
    year_batch TEXT NOT NULL,
    rank TEXT NOT NULL,
    name TEXT NOT NULL,
    sgpa TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Create Domain Awards Table
CREATE TABLE public.domain_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    recipient TEXT NOT NULL,
    domain TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Create Home Page Config Table
CREATE TABLE public.home_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    hero_headline TEXT DEFAULT 'Empowering Tomorrow with AI & Data Science',
    hero_subtitle TEXT DEFAULT 'Department of Artificial Intelligence & Data Science Student Council',
    announcement_text TEXT DEFAULT '🚀 Tech Symposium 2026 Registration Open Now!',
    about_text TEXT DEFAULT 'SHAIDS (Student Association of Artificial Intelligence & Data Science) is dedicated to fostering innovation, technical growth, and collaborative learning.',
    stat_members TEXT DEFAULT '250+',
    stat_events TEXT DEFAULT '18+',
    stat_workshops TEXT DEFAULT '12+',
    image_events TEXT,
    image_team TEXT,
    image_resources TEXT,
    image_staff TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ==========================================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nptel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fest_sub_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fest_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toppers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Access Events" ON public.events FOR ALL USING (true);
CREATE POLICY "Public Access Team" ON public.team FOR ALL USING (true);
CREATE POLICY "Public Access Staff" ON public.staff FOR ALL USING (true);
CREATE POLICY "Public Access Resources" ON public.resources FOR ALL USING (true);
CREATE POLICY "Public Access Projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Public Access NPTEL" ON public.nptel FOR ALL USING (true);
CREATE POLICY "Public Access Highlights" ON public.highlights FOR ALL USING (true);
CREATE POLICY "Public Access Fest Sub Events" ON public.fest_sub_events FOR ALL USING (true);
CREATE POLICY "Public Access Fest Galleries" ON public.fest_galleries FOR ALL USING (true);
CREATE POLICY "Public Access Toppers" ON public.toppers FOR ALL USING (true);
CREATE POLICY "Public Access Domain Awards" ON public.domain_awards FOR ALL USING (true);
CREATE POLICY "Public Access Home Config" ON public.home_config FOR ALL USING (true);

-- ==========================================================
-- STORAGE BUCKET CREATION & POLICIES
-- ==========================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('shaids-assets', 'shaids-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Assets Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Assets Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Assets Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Assets Bucket" ON storage.objects;

CREATE POLICY "Public Read Assets Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'shaids-assets');
CREATE POLICY "Public Insert Assets Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'shaids-assets');
CREATE POLICY "Public Update Assets Bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'shaids-assets');
CREATE POLICY "Public Delete Assets Bucket" ON storage.objects FOR DELETE USING (bucket_id = 'shaids-assets');

-- ==========================================================
-- SEED INITIAL CONFIG & FEST GALLERY KEYS
-- ==========================================================

INSERT INTO public.home_config (id, hero_headline, hero_subtitle, announcement_text, about_text, stat_members, stat_events, stat_workshops)
VALUES (
    'default',
    'Empowering Tomorrow with AI & Data Science',
    'Department of Artificial Intelligence & Data Science Student Council',
    '🚀 Tech Symposium 2026 Registration Open Now!',
    'SHAIDS (Student Association of Artificial Intelligence & Data Science) is dedicated to fostering innovation, technical growth, and collaborative learning.',
    '250+',
    '18+',
    '12+'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.fest_galleries (id, gallery) VALUES
('vectors', ARRAY[]::TEXT[]),
('kurukshetra', ARRAY[]::TEXT[]),
('rhythms', ARRAY[]::TEXT[])
ON CONFLICT (id) DO NOTHING;
